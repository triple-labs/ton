#!/usr/bin/env python3
"""
Security Issue Analysis Tool

This script helps analyze and categorize security issues in the TON repository.
It provides utilities for:
- Listing and categorizing security alerts
- Generating reports
- Tracking remediation progress
"""

import json
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path


class SecurityAnalyzer:
    """Analyzes security issues and generates reports."""

    def __init__(self, repo_path: str = "."):
        self.repo_path = Path(repo_path)
        self.issues = []
        self.stats = defaultdict(int)

    def analyze_codeql_results(self, results_file: str = None):
        """
        Analyze CodeQL results if available.
        
        Args:
            results_file: Path to CodeQL SARIF results file
        """
        if results_file and Path(results_file).exists():
            with open(results_file, 'r') as f:
                data = json.load(f)
                # Parse SARIF format
                for run in data.get('runs', []):
                    for result in run.get('results', []):
                        issue = {
                            'type': 'codeql',
                            'severity': result.get('level', 'unknown'),
                            'rule': result.get('ruleId', 'unknown'),
                            'message': result.get('message', {}).get('text', ''),
                            'locations': result.get('locations', [])
                        }
                        self.issues.append(issue)
                        self.stats[f"codeql_{issue['severity']}"] += 1
        else:
            print("Note: CodeQL results file not found. Run CodeQL analysis to generate it.")

    def analyze_dependencies(self):
        """
        Analyze dependencies for known vulnerabilities.
        Checks Python dependencies in pyproject.toml/uv.lock.
        """
        # Check Python dependencies
        pyproject = self.repo_path / "pyproject.toml"
        if pyproject.exists():
            print(f"Found Python project: {pyproject}")
            print("Note: Run 'pip-audit' or 'safety check' to scan for vulnerabilities")
            self.stats['dependency_files'] += 1

        # Check for other dependency files
        dep_files = [
            'requirements.txt',
            'package.json',
            'package-lock.json',
            'pom.xml',
            'build.gradle',
            'Cargo.toml'
        ]
        
        for dep_file in dep_files:
            file_path = self.repo_path / dep_file
            if file_path.exists():
                print(f"Found dependency file: {dep_file}")
                self.stats['dependency_files'] += 1

    def generate_report(self, output_file: str = None):
        """
        Generate a security report.
        
        Args:
            output_file: Path to output report file (default: stdout)
        """
        report = []
        report.append("=" * 80)
        report.append("SECURITY ANALYSIS REPORT")
        report.append("=" * 80)
        report.append(f"Generated: {datetime.now().isoformat()}")
        report.append(f"Repository: {self.repo_path.absolute()}")
        report.append("")
        
        report.append("STATISTICS")
        report.append("-" * 80)
        report.append(f"Total Issues: {len(self.issues)}")
        
        if self.issues:
            report.append("\nBy Type:")
            type_counts = defaultdict(int)
            for issue in self.issues:
                type_counts[issue['type']] += 1
            
            for issue_type, count in sorted(type_counts.items()):
                report.append(f"  {issue_type}: {count}")
            
            report.append("\nBy Severity:")
            severity_counts = defaultdict(int)
            for issue in self.issues:
                severity_counts[issue.get('severity', 'unknown')] += 1
            
            for severity, count in sorted(severity_counts.items()):
                report.append(f"  {severity}: {count}")
        else:
            report.append("No issues loaded. Run analysis commands to populate data.")
        
        report.append("")
        report.append("RECOMMENDATIONS")
        report.append("-" * 80)
        
        recommendations = [
            "1. Review all security alerts in GitHub Security tab",
            "2. Enable Dependabot for automatic dependency updates",
            "3. Run CodeQL analysis regularly (configured in .github/workflows/codeql.yml)",
            "4. Use 'pip-audit' to scan Python dependencies for vulnerabilities",
            "5. Keep all dependencies up to date",
            "6. Review and triage alerts using .github/SECURITY_TRACKING.md",
            "7. Set up security dashboards and monitoring",
            "8. Implement security testing in CI/CD pipeline"
        ]
        
        for rec in recommendations:
            report.append(rec)
        
        report.append("")
        report.append("NEXT STEPS")
        report.append("-" * 80)
        report.append("1. Access security alerts: https://github.com/triple-labs/ton/security")
        report.append("2. Review CodeQL alerts: https://github.com/triple-labs/ton/security/code-scanning")
        report.append("3. Review Dependabot alerts: https://github.com/triple-labs/ton/security/dependabot")
        report.append("4. Follow remediation guidelines in .github/SECURITY_TRACKING.md")
        report.append("")
        report.append("=" * 80)
        
        report_text = "\n".join(report)
        
        if output_file:
            with open(output_file, 'w') as f:
                f.write(report_text)
            print(f"Report written to: {output_file}")
        else:
            print(report_text)

    def check_security_configurations(self):
        """Check if security tools are properly configured."""
        configs = {
            'CodeQL': self.repo_path / '.github' / 'workflows' / 'codeql.yml',
            'Dependabot': self.repo_path / '.github' / 'dependabot.yml',
            'Security Policy': self.repo_path / 'SECURITY.md',
            'Security Tracking': self.repo_path / '.github' / 'SECURITY_TRACKING.md'
        }
        
        print("\nSECURITY CONFIGURATION STATUS")
        print("-" * 80)
        
        for name, path in configs.items():
            status = "✓ Configured" if path.exists() else "✗ Not Found"
            print(f"{name:20} {status}")
        
        print("")


def main():
    """Main entry point for the security analysis tool."""
    print("TON Security Analysis Tool")
    print("=" * 80)
    
    analyzer = SecurityAnalyzer()
    
    # Check configurations
    analyzer.check_security_configurations()
    
    # Analyze dependencies
    print("\nANALYZING DEPENDENCIES")
    print("-" * 80)
    analyzer.analyze_dependencies()
    
    # Try to analyze CodeQL results if available
    codeql_results = Path("codeql-results.sarif")
    if codeql_results.exists():
        print("\nANALYZING CODEQL RESULTS")
        print("-" * 80)
        analyzer.analyze_codeql_results(str(codeql_results))
    
    # Generate report
    print("")
    analyzer.generate_report()
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
