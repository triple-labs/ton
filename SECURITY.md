# Security Policy

The TON blockchain node software follows a continuous deployment model. Security updates are applied to the **master branch**, which runs on the mainnet. 

We recommend always running the latest version from the master branch to ensure you have all security patches and updates. For testing purposes, the **testnet branch** contains upcoming updates that will be merged to master after thorough testing.

| Branch | Status | Description |
| ------ | ------ | ----------- |
| master | :white_check_mark: Actively supported | Production-ready code running on mainnet with security updates |
| testnet | :warning: Testing | Contains new updates being tested before mainnet deployment |
| older commits | :x: Not supported | Security updates are not backported to older versions |

For production deployments, we strongly recommend staying up-to-date with the master branch.

## Security Issues Status

As of the last security audit, there are **137 security issues** identified in the repository across various categories:

- **Code Scanning Alerts (CodeQL)**: Security vulnerabilities detected through static analysis
- **Dependency Vulnerabilities**: Known CVEs in third-party libraries
- **Configuration Issues**: Security misconfigurations
- **Secret Scanning**: Potential exposed credentials or tokens

### Addressing Security Issues

We are actively working to address all identified security issues following a risk-based prioritization:

1. **Critical**: Immediate action required
2. **High**: Address within current sprint
3. **Medium**: Schedule for next sprint
4. **Low**: Tracked in backlog

For detailed information about security issue tracking and remediation:
- Review [.github/SECURITY_TRACKING.md](.github/SECURITY_TRACKING.md) for detailed tracking information
- Run `.github/scripts/security_analysis.py` for a security analysis report
- Check GitHub Security tab for active alerts

### Automated Security

- **CodeQL Analysis**: Runs automatically on push, PR, and weekly schedule
- **Dependabot**: Monitors dependencies for known vulnerabilities (configured in `.github/dependabot.yml`)
- **Secret Scanning**: Detects accidentally committed secrets

## Reporting a Vulnerability

If you discover a security vulnerability in the TON blockchain node software, please report it responsibly:

### Do NOT

- Open a public GitHub issue for security vulnerabilities
- Discuss the vulnerability publicly before it's fixed
- Exploit the vulnerability in any way

### Please DO

1. **Use GitHub Security Advisories** (preferred method):
   - Navigate to: https://github.com/triple-labs/ton/security/advisories
   - Click "New draft security advisory"
   - Fill in the details

### What to Expect

- **Acknowledgment**: Within 48 hours of report
- **Initial Assessment**: Within 5 business days
- **Updates**: Regular status updates throughout the process
- **Resolution Timeline**: Based on severity (Critical: days, High: weeks, Medium: months)
- **Disclosure**: Coordinated disclosure after fix is deployed

### Bounty Program

Information about security bounty programs will be announced when available. Check the repository for updates.

## Security Best Practices

For developers and contributors:

1. **Keep Dependencies Updated**: Regularly update to latest versions
2. **Use Security Tools**: Enable all available security scanning tools
3. **Follow Secure Coding**: Adhere to secure coding guidelines
4. **Review Security Alerts**: Regularly check and address security alerts
5. **Test Security Fixes**: Thoroughly test all security patches before deployment

For users and node operators:

1. **Stay Updated**: Always run the latest version from master branch
2. **Monitor Releases**: Watch for security-related releases
3. **Secure Configuration**: Follow security hardening guidelines
4. **Isolate Nodes**: Run nodes in secure, isolated environments
5. **Regular Audits**: Conduct regular security audits of your deployment

## Security Resources

- **Security Tab**: https://github.com/triple-labs/ton/security
- **Security Tracking**: [.github/SECURITY_TRACKING.md](.github/SECURITY_TRACKING.md)
- **CodeQL Results**: https://github.com/triple-labs/ton/security/code-scanning
- **Dependabot Alerts**: https://github.com/triple-labs/ton/security/dependabot

## Contact

- **Security Issues**: Use GitHub Security Advisories (see reporting section above)
- **General Questions**: Open a GitHub discussion
- **Community**: TON Community channels

---

**Last Updated**: February 10, 2026
