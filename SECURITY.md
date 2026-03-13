# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT open a public issue.**
2. Email **heznpc@gmail.com** or use [GitHub Security Advisories](../../security/advisories/new).
3. Include steps to reproduce, impact assessment, and suggested fix if possible.

We will respond within 48 hours and work with you to resolve the issue.

## Security Features

This repository includes automated security checks in CI:

- **Secret leak detection** — [gitleaks](https://github.com/gitleaks/gitleaks) scans every commit for leaked credentials
- **Large file check** — Prevents accidental commits of large binary files
