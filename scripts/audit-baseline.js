#!/usr/bin/env node
//
// audit-baseline.js — Independent Starter Series baseline receipt.
//
// This is intentionally smaller than create-starter's audit surface. The current
// completion baseline excludes create-starter and shotkit as service evidence,
// while still guarding their public package names from scoped-name drift.

const fs = require('fs');
const path = require('path');

const BASELINE_REPOS = [
  'starter-series',
  'browser-extension-starter',
  'cloudflare-pages-starter',
  'discord-bot-starter',
  'docker-deploy-starter',
  'electron-app-starter',
  'mcp-server-starter',
  'npm-package-starter',
  'python-mcp-server-starter',
  'react-native-starter',
  'telegram-bot-starter',
  'vscode-extension-starter',
  'ProfileKit',
  'profilekit-mcp',
];

const EXTERNAL_PACKAGE_NAMES = {
  'create-starter': 'starter-series',
  shotkit: 'shotkit',
};

const REQUIRED_FILES = [
  'README.md',
  'AGENTS.md',
  'SECURITY.md',
  '.github/dependabot.yml',
  '.github/workflows/ci.yml',
];

const AGENT_ADAPTERS = [
  'CLAUDE.md',
  '.github/copilot-instructions.md',
];

const args = process.argv.slice(2);
const markdown = args.includes('--markdown');
const rootArgIndex = args.indexOf('--root');
const root = rootArgIndex === -1
  ? path.resolve(__dirname, '..', '..')
  : path.resolve(args[rootArgIndex + 1]);

function exists(repo, relpath) {
  return fs.existsSync(path.join(root, repo, relpath));
}

function readText(repo, relpath) {
  try {
    return fs.readFileSync(path.join(root, repo, relpath), 'utf8');
  } catch {
    return '';
  }
}

function readJSON(repo, relpath) {
  try {
    return JSON.parse(readText(repo, relpath));
  } catch {
    return null;
  }
}

function listWorkflows(repo) {
  const workflowDir = path.join(root, repo, '.github', 'workflows');
  try {
    return fs.readdirSync(workflowDir).filter(file => /\.ya?ml$/.test(file)).sort();
  } catch {
    return [];
  }
}

function workflowContains(repo, pattern) {
  return listWorkflows(repo).some(file => pattern.test(readText(repo, path.join('.github', 'workflows', file))));
}

function linesMatching(text, pattern) {
  return text
    .split(/\r?\n/)
    .filter(line => pattern.test(line));
}

function adapterPaths(repo) {
  const cursorRule = repo === 'starter-series'
    ? '.cursor/rules/starter-series.mdc'
    : '.cursor/rules/repo-context.mdc';
  return [...AGENT_ADAPTERS, cursorRule];
}

function auditAgentAdapters(repo, failures) {
  for (const relpath of adapterPaths(repo)) {
    const adapter = readText(repo, relpath);
    if (!adapter) {
      failures.push(`missing agent adapter: ${relpath}`);
      continue;
    }
    if (!/AGENTS\.md/.test(adapter)) {
      failures.push(`agent adapter does not defer to AGENTS.md: ${relpath}`);
    }
    if (!/thin client adapter/i.test(adapter)) {
      failures.push(`agent adapter is not labeled as a thin client adapter: ${relpath}`);
    }
    const nonEmptyLines = adapter.split(/\r?\n/).filter(line => line.trim()).length;
    if (nonEmptyLines > 12) {
      failures.push(`agent adapter is too large to be a thin pointer: ${relpath}`);
    }
  }
}

function auditExternalPackageNames(failures, notes) {
  for (const [repo, expectedName] of Object.entries(EXTERNAL_PACKAGE_NAMES)) {
    const pkg = readJSON(repo, 'package.json');
    if (!pkg) {
      failures.push(`missing external package metadata for package-name guard: ${repo}/package.json`);
      continue;
    }
    if (pkg.name !== expectedName) {
      failures.push(`external package name drift: ${repo} package.json name is ${pkg.name}, expected ${expectedName}`);
    }
    if (pkg.name?.startsWith('@')) {
      failures.push(`external package uses a scoped npm name: ${repo} -> ${pkg.name}`);
    }
  }
  notes.push('external package-name guard checks create-starter and shotkit without counting them as baseline evidence');
}

function auditRepo(repo) {
  const failures = [];
  const notes = [];
  const repoPath = path.join(root, repo);

  if (!fs.existsSync(repoPath)) {
    return { repo, status: 'fail', failures: [`missing directory: ${repoPath}`], notes };
  }

  for (const relpath of REQUIRED_FILES) {
    if (!exists(repo, relpath)) failures.push(`missing ${relpath}`);
  }

  if (repo !== 'starter-series' && !workflowContains(repo, /github\/codeql-action|name:\s*CodeQL|codeql/i)) {
    failures.push('missing CodeQL workflow or action reference');
  }

  const pkg = readJSON(repo, 'package.json');
  if (pkg?.name?.startsWith('@')) {
    failures.push(`scoped npm package name: ${pkg.name}`);
  }

  const readmes = [readText(repo, 'README.md'), readText(repo, 'README.ko.md')].join('\n');
  if (BASELINE_REPOS.includes(repo) && repo !== 'starter-series' && /npx\s+starter-series\b/.test(readmes)) {
    failures.push('README first-user path depends on the unpublished starter-series npm package');
  }

  auditAgentAdapters(repo, failures);

  if (repo === 'starter-series') {
    const orgAudit = readText(repo, '.github/workflows/org-audit.yml');
    if (/npx\s+-y\s+starter-series|audit-security/.test(orgAudit)) {
      failures.push('org-audit still depends on create-starter audit-security');
    }
    if (linesMatching(orgAudit, /^\s*REPOS=.*\b(create-starter|shotkit)\b/).length) {
      failures.push('org-audit includes external dependency repos');
    }
    auditExternalPackageNames(failures, notes);

    const publicFiles = [
      readText(repo, 'index.html'),
      readText(repo, 'locales/en.json'),
      readText(repo, 'locales/ko.json'),
    ].join('\n');
    if (/npx\s+starter-series\s+proof-report|npx\s+@starter-series\/create|proof-report/.test(publicFiles)) {
      failures.push('static site still advertises an excluded CLI/proof-report path');
    }
    if (!/gh repo create my-app --template starter-series\/docker-deploy-starter/.test(publicFiles)) {
      failures.push('static site no longer exposes the direct GitHub template first action');
    }

    const dotProfile = readText('dot-github', 'profile/README.md');
    for (const line of linesMatching(dotProfile, /(create-starter|shotkit|Icon Maker).*npx CLI/i)) {
      failures.push(`org profile presents external/pre-release tool as active npx CLI: ${line.trim()}`);
    }

    const iconReadmes = [
      ['icon-maker', 'README.md'],
      ['icon-maker', 'README.ko.md'],
      ['icon-maker', 'AGENTS.md'],
      ['icon-maker', 'skills/create-icons/SKILL.md'],
    ];
    for (const [toolRepo, relpath] of iconReadmes) {
      const text = readText(toolRepo, relpath);
      for (const line of linesMatching(text, /^\s*-\s*(CLI|명령어):\s*`npx iconkit/i)) {
        failures.push(`${toolRepo}/${relpath} presents npx iconkit as the current primary CLI: ${line.trim()}`);
      }
    }
    notes.push('static hub is exempt from CodeQL; CI runs secret, locale, HTML, and link checks');
    notes.push('public profile and pre-release icon-maker claim surfaces stay aligned with the baseline');
  }

  return { repo, status: failures.length ? 'fail' : 'pass', failures, notes };
}

function printText(results) {
  console.log('Starter Series baseline audit');
  console.log('=============================');
  console.log(`Root: ${root}`);
  console.log('');
  for (const result of results) {
    console.log(`${result.status === 'pass' ? 'PASS' : 'FAIL'} ${result.repo}`);
    for (const failure of result.failures) console.log(`  - ${failure}`);
    for (const note of result.notes) console.log(`  note: ${note}`);
  }
}

function printMarkdown(results) {
  console.log('| repo | result | notes |');
  console.log('|---|---|---|');
  for (const result of results) {
    const notes = [...result.failures, ...result.notes].join('<br>') || 'ok';
    console.log(`| ${result.repo} | ${result.status} | ${notes} |`);
  }
}

const results = BASELINE_REPOS.map(auditRepo);
if (markdown) printMarkdown(results);
else printText(results);

if (results.some(result => result.status !== 'pass')) process.exit(1);
