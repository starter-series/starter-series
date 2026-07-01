#!/usr/bin/env node
//
// sync-versions.js — Report version drift across starter-series repos.
//
// Usage:
//   node scripts/sync-versions.js        # current completion baseline
//   node scripts/sync-versions.js --all  # every local product/tool repo
//
// Checks:
//   1. Shared devDependencies (jest, eslint, etc.) across package.json files
//   2. engines.node field consistency
//   3. Node.js version in GitHub Actions workflow files (setup-node)
//   4. Node.js version in Dockerfiles (FROM node:XX)
//
// Report-only: auto-fix was removed because blind majority alignment breaks
// starters with externally-driven constraints (e.g., electron-app-starter
// tracks the Node version bundled by Electron). Per-repo drift should be
// handled by Dependabot; use INTENTIONAL_DIVERGENCES below to annotate
// cross-repo cases that must stay different on purpose.

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

// Script lives inside the umbrella repo at scripts/sync-versions.js.
// ROOT points to the parent dir that holds all starter repos as siblings.
const ROOT = path.resolve(__dirname, '..', '..');

const INCLUDE_ALL = process.argv.includes('--all');

// Directories to always skip during discovery
const ALWAYS_SKIP_DIRS = new Set(['.git', '.idea', '.claude', 'node_modules', 'scripts',
  'dot-github', 'landing-page', 'starter-series']);

// The current service-completion cycle excludes these repos from baseline drift.
// They can still be audited with `--all`.
const NON_BASELINE_DIRS = new Set([
  'create-starter',
  'icon-maker',
  'rulemeter',
  'shotkit',
]);

// Intentional divergences — starters whose value legitimately differs from
// the rest of the series. Listed here so they are reported as "ok (intentional)"
// instead of being flagged as drift.
//
// Format: { 'starter-name': 'reason shown in report' }
const INTENTIONAL_DIVERGENCES = {
  devDependencies: {
    '@types/node': {
      'mcp-server-starter': 'Template targets Node 22 APIs, so Node 22 types are intentional',
    },
    jest: {
      'react-native-starter': 'jest-expo 52 keeps this template on Jest 29',
    },
  },
  engines: {
    'electron-app-starter': 'Electron bundles its own Node — engines.node follows Electron',
    'ProfileKit': 'Production service currently caps Node below 25 while CI runs inside that range',
    'profilekit-mcp': 'Published MCP package still supports Node 20 clients',
  },
  workflowNode: {
    'electron-app-starter': 'Electron bundles its own Node — CI Node must match Electron',
    'ProfileKit': 'CI uses Node 24 while the service engine allows >=22 <25',
  },
  dockerNode: {
    'discord-bot-starter': 'Docker image follows its deploy runtime while package engines allow >=22',
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parse a semver-range string to a comparable tuple. Strips ^, ~, >=, etc. */
function bareVersion(v) {
  return v.replace(/^[\^~>=<]*/, '');
}

/** Compare two semver strings. Returns >0 if a>b, <0 if a<b, 0 if equal. */
function semverCompare(a, b) {
  const pa = bareVersion(a).split('.').map(Number);
  const pb = bareVersion(b).split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const diff = (pa[i] || 0) - (pb[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/** Read and parse a JSON file. Returns null on failure. */
function readJSON(filepath) {
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch {
    return null;
  }
}

/** Read a text file. Returns null on failure. */
function readText(filepath) {
  try {
    return fs.readFileSync(filepath, 'utf8');
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// 1. Discover starters
// ---------------------------------------------------------------------------

function discoverStarters() {
  return fs.readdirSync(ROOT)
    .filter(name => {
      if (ALWAYS_SKIP_DIRS.has(name)) return false;
      if (!INCLUDE_ALL && NON_BASELINE_DIRS.has(name)) return false;
      if (name.startsWith('.') || name.startsWith('_')) return false;
      const stat = fs.statSync(path.join(ROOT, name));
      return stat.isDirectory();
    })
    .sort();
}

// ---------------------------------------------------------------------------
// 2. Collect devDependencies
// ---------------------------------------------------------------------------

/**
 * Returns Map<packageName, Map<starterName, versionString>>
 * Only includes packages that appear in 2+ starters.
 */
function collectDevDeps(starters) {
  /** @type {Map<string, Map<string, string>>} */
  const depMap = new Map();

  for (const starter of starters) {
    const pkg = readJSON(path.join(ROOT, starter, 'package.json'));
    if (!pkg || !pkg.devDependencies) continue;

    for (const [dep, ver] of Object.entries(pkg.devDependencies)) {
      if (!depMap.has(dep)) depMap.set(dep, new Map());
      depMap.get(dep).set(starter, ver);
    }
  }

  // Keep only shared (2+ starters)
  for (const [dep, map] of depMap) {
    if (map.size < 2) depMap.delete(dep);
  }

  return depMap;
}

// ---------------------------------------------------------------------------
// 3. Detect dependency mismatches
// ---------------------------------------------------------------------------

function detectDepMismatches(depMap) {
  const mismatches = []; // { dep, versions: Map<starter, ver>, highest }
  const depIgnore = INTENTIONAL_DIVERGENCES.devDependencies;

  for (const [dep, starterVersions] of depMap) {
    const ignored = depIgnore[dep] || {};
    const checkableVersions = new Map([...starterVersions].filter(([starter]) => !ignored[starter]));
    const uniqueVersions = new Set(checkableVersions.values());
    if (uniqueVersions.size <= 1) continue; // all aligned

    let highest = null;
    for (const ver of uniqueVersions) {
      if (!highest || semverCompare(ver, highest) > 0) highest = ver;
    }
    mismatches.push({ dep, versions: starterVersions, highest });
  }

  return mismatches;
}

// ---------------------------------------------------------------------------
// 4. Collect engines.node
// ---------------------------------------------------------------------------

function collectEngines(starters) {
  /** @type {Map<string, string>} */
  const engines = new Map();
  for (const starter of starters) {
    const pkg = readJSON(path.join(ROOT, starter, 'package.json'));
    if (!pkg) continue;
    const nodeEngine = pkg.engines && pkg.engines.node;
    if (nodeEngine) engines.set(starter, nodeEngine);
  }
  return engines;
}

// ---------------------------------------------------------------------------
// 5. Collect Node.js versions from GitHub Actions workflows
// ---------------------------------------------------------------------------

function collectWorkflowNodeVersions(starters) {
  const results = []; // { starter, file, version }

  for (const starter of starters) {
    const wfDir = path.join(ROOT, starter, '.github', 'workflows');
    if (!fs.existsSync(wfDir)) continue;

    for (const file of fs.readdirSync(wfDir)) {
      if (!file.endsWith('.yml') && !file.endsWith('.yaml')) continue;
      const content = readText(path.join(wfDir, file));
      if (!content) continue;

      const re = /node-version:\s*['"]?(\d[\d.x]*)/g;
      let m;
      while ((m = re.exec(content)) !== null) {
        results.push({ starter, file, version: m[1] });
      }
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// 6. Collect Node.js versions from Dockerfiles
// ---------------------------------------------------------------------------

function collectDockerfileNodeVersions(starters) {
  const results = []; // { starter, version }

  for (const starter of starters) {
    const dockerfilePath = path.join(ROOT, starter, 'Dockerfile');
    const content = readText(dockerfilePath);
    if (!content) continue;

    const re = /FROM\s+node:(\d[\d.]*)/gi;
    let m;
    while ((m = re.exec(content)) !== null) {
      results.push({ starter, version: m[1] });
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// 7. Reporting
// ---------------------------------------------------------------------------

function padRight(str, len) {
  str = String(str);
  return str + ' '.repeat(Math.max(0, len - str.length));
}

function printTable(headers, rows) {
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map(r => String(r[i]).length))
  );
  const sep = widths.map(w => '-'.repeat(w + 2)).join('+');

  console.log(headers.map((h, i) => ' ' + padRight(h, widths[i]) + ' ').join('|'));
  console.log(sep);
  for (const row of rows) {
    console.log(row.map((c, i) => ' ' + padRight(c, widths[i]) + ' ').join('|'));
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log('starter-series version sync');
  console.log('===========================\n');

  const starters = discoverStarters();
  const startersWithPkg = starters.filter(s =>
    fs.existsSync(path.join(ROOT, s, 'package.json'))
  );

  console.log(`Found ${starters.length} starters (${startersWithPkg.length} with package.json)\n`);

  let hasUnintendedDrift = false;

  // --- devDependencies ---
  const depMap = collectDevDeps(startersWithPkg);
  const depMismatches = detectDepMismatches(depMap);

  if (depMismatches.length > 0) {
    hasUnintendedDrift = true;
    console.log('DEPENDENCY MISMATCHES');
    console.log('---------------------');
    console.log('(Per-repo dep freshness is Dependabot\'s job — this surfaces cross-repo drift)');

    for (const { dep, versions, highest } of depMismatches) {
      console.log(`\n  ${dep}  (highest: ${highest})`);
      const ignored = INTENTIONAL_DIVERGENCES.devDependencies[dep] || {};
      const rows = [];
      for (const [starter, ver] of versions) {
        const status = ignored[starter]
          ? `[intentional] ${ignored[starter]}`
          : ver === highest ? '' : '<-- behind';
        rows.push([starter, ver, status]);
      }
      printTable(['Starter', 'Version', 'Status'], rows);
    }
    console.log();
  } else {
    console.log('Shared devDependencies: all aligned\n');
  }

  // --- engines.node ---
  const engines = collectEngines(startersWithPkg);
  const engineIgnore = INTENTIONAL_DIVERGENCES.engines;
  const engineCheckable = new Map([...engines].filter(([s]) => !engineIgnore[s]));
  const uniqueCheckableEngines = new Set(engineCheckable.values());

  if (uniqueCheckableEngines.size > 1) {
    hasUnintendedDrift = true;
    console.log('ENGINES.NODE MISMATCHES');
    console.log('-----------------------');
    const rows = [];
    for (const [starter, eng] of engines) {
      const note = engineIgnore[starter] ? `[intentional] ${engineIgnore[starter]}` : '';
      rows.push([starter, eng, note]);
    }
    printTable(['Starter', 'engines.node', 'Note'], rows);
    console.log();
  } else {
    const engineVal = uniqueCheckableEngines.size === 1 ? [...uniqueCheckableEngines][0] : '(none)';
    const ignoredCount = Object.keys(engineIgnore).filter(s => engines.has(s)).length;
    const note = ignoredCount > 0 ? ` (+${ignoredCount} intentional divergence${ignoredCount > 1 ? 's' : ''})` : '';
    console.log(`engines.node: aligned (${engineVal})${note}\n`);
  }

  // --- GitHub Actions node-version ---
  const wfVersions = collectWorkflowNodeVersions(starters);
  const wfIgnore = INTENTIONAL_DIVERGENCES.workflowNode;
  const wfCheckable = wfVersions.filter(e => !wfIgnore[e.starter]);
  const uniqueCheckableWf = new Set(wfCheckable.map(e => e.version));

  if (uniqueCheckableWf.size > 1) {
    hasUnintendedDrift = true;
    console.log('GITHUB ACTIONS NODE VERSION MISMATCHES');
    console.log('--------------------------------------');
    const rows = wfVersions.map(e => [
      e.starter,
      e.file,
      e.version,
      wfIgnore[e.starter] ? '[intentional]' : '',
    ]);
    printTable(['Starter', 'Workflow', 'node-version', 'Note'], rows);
    console.log();
  } else {
    const wfVer = uniqueCheckableWf.size === 1 ? [...uniqueCheckableWf][0] : '(none)';
    const ignoredCount = new Set(wfVersions.filter(e => wfIgnore[e.starter]).map(e => e.starter)).size;
    const note = ignoredCount > 0 ? ` (+${ignoredCount} intentional divergence${ignoredCount > 1 ? 's' : ''})` : '';
    console.log(`GitHub Actions node-version: aligned (${wfVer})${note}\n`);
  }

  // --- Dockerfile node versions ---
  const dockerVersions = collectDockerfileNodeVersions(starters);
  const dockerIgnore = INTENTIONAL_DIVERGENCES.dockerNode;
  const dockerCheckable = dockerVersions.filter(e => !dockerIgnore[e.starter]);
  const uniqueCheckableDocker = new Set(dockerCheckable.map(e => e.version));

  if (uniqueCheckableDocker.size > 1) {
    hasUnintendedDrift = true;
    console.log('DOCKERFILE NODE VERSION MISMATCHES');
    console.log('----------------------------------');
    const rows = dockerVersions.map(e => [
      e.starter,
      e.version,
      dockerIgnore[e.starter] ? '[intentional]' : '',
    ]);
    printTable(['Starter', 'FROM node:XX', 'Note'], rows);
    console.log();
  } else if (dockerVersions.length > 0) {
    const dVer = [...uniqueCheckableDocker][0];
    console.log(`Dockerfile node versions: aligned (${dVer})\n`);
  }

  // --- Summary ---
  console.log('=== SUMMARY ===');
  console.log(`  Starters scanned:          ${starters.length}`);
  console.log(`  package.json files:        ${startersWithPkg.length}`);
  console.log(`  Shared devDeps checked:    ${depMap.size}`);
  console.log(`  Dependency mismatches:     ${depMismatches.length}`);
  console.log(`  Workflow files checked:    ${wfVersions.length}`);
  console.log(`  Dockerfiles checked:       ${dockerVersions.length}`);
  console.log();

  if (hasUnintendedDrift) {
    console.log('Unintended drift detected. Options:');
    console.log('  - For per-repo dep freshness: ensure Dependabot is configured');
    console.log('  - For cross-repo alignment: open PRs manually with context');
    console.log('  - If the divergence is intentional: add it to INTENTIONAL_DIVERGENCES');
    process.exit(1);
  } else {
    console.log('All versions are in sync (or intentionally diverged).');
  }
}

main();
