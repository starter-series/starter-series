#!/usr/bin/env node
//
// sync-versions.js — Detect and fix version drift across starter-series repos.
//
// Usage:
//   node scripts/sync-versions.js            Report mismatches only
//   node scripts/sync-versions.js --fix      Update all to highest version found
//
// Checks:
//   1. Shared devDependencies (jest, eslint, etc.) across package.json files
//   2. engines.node field consistency
//   3. Node.js version in GitHub Actions workflow files (setup-node)
//   4. Node.js version in Dockerfiles (FROM node:XX)

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, '..');
const FIX = process.argv.includes('--fix');

// Starters that have a package.json (auto-detected below)
// Directories to always skip
const SKIP_DIRS = new Set(['.git', '.idea', '.claude', 'node_modules', 'scripts',
  'dot-github', 'landing-page', 'starter-series']);

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

/** Preserve the original range prefix (^, ~, >=, etc.) while swapping the version digits. */
function applyPrefix(original, newBare) {
  const prefix = original.match(/^[\^~>=<]*/)[0];
  return prefix + newBare;
}

/** Read and parse a JSON file. Returns null on failure. */
function readJSON(filepath) {
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch {
    return null;
  }
}

/** Write a JSON file preserving 2-space indent + trailing newline. */
function writeJSON(filepath, data) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2) + '\n');
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
      if (SKIP_DIRS.has(name)) return false;
      if (name.startsWith('.')) return false;
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

  for (const [dep, starterVersions] of depMap) {
    const uniqueVersions = new Set(starterVersions.values());
    if (uniqueVersions.size <= 1) continue; // all aligned

    // Determine highest
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

      // Match: node-version: 20  or  node-version: '20'  or  node-version: "20.x"
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

    // Match: FROM node:20-alpine  or  FROM node:22  etc.
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
// 8. Fix mode
// ---------------------------------------------------------------------------

function fixDepMismatches(mismatches) {
  let fixCount = 0;

  // Group fixes by starter so we only read/write each package.json once
  /** @type {Map<string, Map<string, string>>} */
  const fixes = new Map(); // starter -> { dep: newVersion }

  for (const { dep, versions, highest } of mismatches) {
    for (const [starter, ver] of versions) {
      if (ver === highest) continue;
      if (!fixes.has(starter)) fixes.set(starter, new Map());
      fixes.get(starter).set(dep, highest);
    }
  }

  for (const [starter, depFixes] of fixes) {
    const pkgPath = path.join(ROOT, starter, 'package.json');
    const pkg = readJSON(pkgPath);
    if (!pkg) continue;

    for (const [dep, newVer] of depFixes) {
      if (pkg.devDependencies && pkg.devDependencies[dep]) {
        const oldVer = pkg.devDependencies[dep];
        pkg.devDependencies[dep] = applyPrefix(oldVer, bareVersion(newVer));
        fixCount++;
      }
    }

    writeJSON(pkgPath, pkg);
  }

  return fixCount;
}

function fixWorkflowNodeVersions(entries, targetVersion) {
  const filesFixed = new Set();

  for (const { starter, file, version } of entries) {
    if (version === targetVersion) continue;
    const filepath = path.join(ROOT, starter, '.github', 'workflows', file);
    let content = readText(filepath);
    if (!content) continue;

    // Replace the specific node-version value
    content = content.replace(
      new RegExp(`(node-version:\\s*['"]?)${version.replace('.', '\\.')}`, 'g'),
      `$1${targetVersion}`
    );

    fs.writeFileSync(filepath, content);
    filesFixed.add(`${starter}/.github/workflows/${file}`);
  }

  return filesFixed.size;
}

function fixDockerfileNodeVersions(entries, targetVersion) {
  let fixCount = 0;

  for (const { starter, version } of entries) {
    if (version === targetVersion) continue;
    const filepath = path.join(ROOT, starter, 'Dockerfile');
    let content = readText(filepath);
    if (!content) continue;

    content = content.replace(
      new RegExp(`(FROM\\s+node:)${version.replace('.', '\\.')}`, 'gi'),
      `$1${targetVersion}`
    );

    fs.writeFileSync(filepath, content);
    fixCount++;
  }

  return fixCount;
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

  let hasIssues = false;

  // --- devDependencies ---
  const depMap = collectDevDeps(startersWithPkg);
  const depMismatches = detectDepMismatches(depMap);

  if (depMismatches.length > 0) {
    hasIssues = true;
    console.log('DEPENDENCY MISMATCHES');
    console.log('---------------------');

    for (const { dep, versions, highest } of depMismatches) {
      console.log(`\n  ${dep}  (highest: ${highest})`);
      const rows = [];
      for (const [starter, ver] of versions) {
        const status = ver === highest ? '' : '<-- behind';
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
  const uniqueEngines = new Set(engines.values());

  if (uniqueEngines.size > 1) {
    hasIssues = true;
    console.log('ENGINES.NODE MISMATCHES');
    console.log('-----------------------');
    const rows = [];
    for (const [starter, eng] of engines) {
      rows.push([starter, eng]);
    }
    printTable(['Starter', 'engines.node'], rows);
    console.log();
  } else {
    const engineVal = uniqueEngines.size === 1 ? [...uniqueEngines][0] : '(none)';
    console.log(`engines.node: all aligned (${engineVal})\n`);
  }

  // --- GitHub Actions node-version ---
  const wfVersions = collectWorkflowNodeVersions(starters);
  const uniqueWfVersions = new Set(wfVersions.map(e => e.version));

  if (uniqueWfVersions.size > 1) {
    hasIssues = true;
    console.log('GITHUB ACTIONS NODE VERSION MISMATCHES');
    console.log('--------------------------------------');
    const rows = wfVersions.map(e => [e.starter, e.file, e.version]);
    printTable(['Starter', 'Workflow', 'node-version'], rows);

    // Determine majority version
    const versionCounts = {};
    for (const v of wfVersions) {
      versionCounts[v.version] = (versionCounts[v.version] || 0) + 1;
    }
    const majority = Object.entries(versionCounts).sort((a, b) => b[1] - a[1])[0][0];
    console.log(`\n  Majority version: ${majority} (${versionCounts[majority]}/${wfVersions.length} files)`);
    console.log();
  } else {
    const wfVer = uniqueWfVersions.size === 1 ? [...uniqueWfVersions][0] : '(none)';
    console.log(`GitHub Actions node-version: all aligned (${wfVer})\n`);
  }

  // --- Dockerfile node versions ---
  const dockerVersions = collectDockerfileNodeVersions(starters);
  const uniqueDockerVersions = new Set(dockerVersions.map(e => e.version));

  if (uniqueDockerVersions.size > 1) {
    hasIssues = true;
    console.log('DOCKERFILE NODE VERSION MISMATCHES');
    console.log('----------------------------------');
    const rows = dockerVersions.map(e => [e.starter, e.version]);
    printTable(['Starter', 'FROM node:XX'], rows);
    console.log();
  } else if (dockerVersions.length > 0) {
    const dVer = [...uniqueDockerVersions][0];
    console.log(`Dockerfile node versions: all aligned (${dVer})\n`);
  }

  // --- Summary ---
  console.log('=== SUMMARY ===');
  console.log(`  Starters scanned:          ${starters.length}`);
  console.log(`  package.json files:        ${startersWithPkg.length}`);
  console.log(`  Shared devDeps checked:    ${depMap.size}`);
  console.log(`  Dependency mismatches:     ${depMismatches.length}`);
  console.log(`  Workflow files checked:    ${wfVersions.length}`);
  console.log(`  Workflow version groups:   ${uniqueWfVersions.size}`);
  console.log(`  Dockerfiles checked:       ${dockerVersions.length}`);
  console.log(`  Dockerfile version groups: ${uniqueDockerVersions.size}`);
  console.log();

  // --- Fix ---
  if (FIX && hasIssues) {
    console.log('FIXING...\n');

    if (depMismatches.length > 0) {
      const count = fixDepMismatches(depMismatches);
      console.log(`  Updated ${count} dependency versions in package.json files`);
    }

    if (uniqueWfVersions.size > 1) {
      const majority = (() => {
        const counts = {};
        for (const v of wfVersions) counts[v.version] = (counts[v.version] || 0) + 1;
        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      })();
      const count = fixWorkflowNodeVersions(wfVersions, majority);
      console.log(`  Updated node-version in ${count} workflow files (target: ${majority})`);
    }

    if (uniqueDockerVersions.size > 1) {
      const majority = (() => {
        const counts = {};
        for (const v of dockerVersions) counts[v.version] = (counts[v.version] || 0) + 1;
        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      })();
      const count = fixDockerfileNodeVersions(dockerVersions, majority);
      console.log(`  Updated FROM node:XX in ${count} Dockerfiles (target: ${majority})`);
    }

    console.log('\nDone. Review changes with git diff, then run without --fix to verify.');
  } else if (FIX && !hasIssues) {
    console.log('Nothing to fix -- all versions are aligned.');
  } else if (hasIssues) {
    console.log('Run with --fix to auto-align versions to the highest/majority value.');
  } else {
    console.log('All versions are in sync.');
  }

  // Exit 1 if there are mismatches (useful for CI)
  if (hasIssues && !FIX) process.exit(1);
}

main();
