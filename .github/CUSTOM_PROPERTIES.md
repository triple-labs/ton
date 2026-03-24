# Custom Properties Configuration

## Overview

This repository uses GitHub Organization Custom Properties to manage repository metadata for governance, compliance, and operational purposes. Custom properties provide structured metadata that can be used for:

- Repository classification and discovery
- Compliance tracking
- Automated workflows and policies
- Team assignments
- Lifecycle management

## Custom Properties Defined

The following custom properties are configured for this repository:

### 1. **project_type** (required)
- **Type**: Single Select
- **Description**: Type of project in this repository
- **Values**: `blockchain`, `validator`, `smart-contract`, `tooling`, `documentation`, `testing`
- **Default**: `blockchain`

### 2. **criticality** (required)
- **Type**: Single Select
- **Description**: Impact level of repository on network operations
- **Values**: `critical`, `high`, `medium`, `low`
- **Default**: `critical`

### 3. **compliance**
- **Type**: Multi Select
- **Description**: Compliance and security standards applicable to this repository
- **Values**: `security-audit`, `code-review-required`, `codeql-scanning`, `dependency-scanning`, `fuzz-testing`
- **Default**: `code-review-required`, `codeql-scanning`

### 4. **lifecycle_stage** (required)
- **Type**: Single Select
- **Description**: Current lifecycle stage of the project
- **Values**: `production`, `staging`, `development`, `maintenance`, `deprecated`
- **Default**: `production`

### 5. **network_type** (required)
- **Type**: Multi Select
- **Description**: Compatible TON network types
- **Values**: `mainnet`, `testnet`, `devnet`, `local`
- **Default**: `mainnet`, `testnet`

### 6. **component**
- **Type**: Multi Select
- **Description**: Main components included in this repository
- **Values**: `validator-engine`, `lite-client`, `tonlib`, `crypto`, `func-compiler`, `tolk-compiler`, `smart-contracts`, `dht`, `adnl`, `rldp`, `storage`, `emulator`
- **Default**: `validator-engine`, `lite-client`, `tonlib`, `crypto`

### 7. **team**
- **Type**: Single Select
- **Description**: Primary team responsible for maintenance
- **Values**: `core-team`, `blockchain-team`, `infrastructure-team`, `security-team`, `community`
- **Default**: `core-team`

### 8. **public_api**
- **Type**: Boolean
- **Description**: Whether this repository provides public APIs
- **Default**: `true`

### 9. **documentation_complete**
- **Type**: Boolean
- **Description**: Indicates if documentation is complete and up-to-date
- **Default**: `true`

### 10. **release_channel** (required)
- **Type**: Single Select
- **Description**: Release distribution channel
- **Values**: `stable`, `beta`, `alpha`, `nightly`
- **Default**: `stable`

## How to Use

### Setting Properties via GitHub UI

1. Navigate to your organization settings
2. Go to **Settings** → **Repository** → **Custom properties**
3. Define the properties listed in `.github/custom-properties.yml`
4. Apply the properties to repositories as needed

### Setting Properties via GitHub REST API

You can use the GitHub REST API to programmatically set custom properties.

**Note**: Replace `ORG_NAME` with your organization name and `YOUR_TOKEN` with a valid GitHub personal access token with appropriate permissions.

```bash
# Set custom properties for a repository
curl -L \
  -X PATCH \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/orgs/ORG_NAME/properties/values \
  -d '{
    "repository_names": ["ton"],
    "properties": [
      {
        "property_name": "criticality",
        "value": "critical"
      },
      {
        "property_name": "lifecycle_stage",
        "value": "production"
      }
    ]
  }'
```

### Using safe-settings

If your organization uses [safe-settings](https://github.com/github/safe-settings) for configuration-as-code, you can manage custom properties in your settings repository:

```yaml
# In your .github repo settings file
repository:
  custom_properties:
    project_type: blockchain
    criticality: critical
    compliance:
      - code-review-required
      - codeql-scanning
      - security-audit
    lifecycle_stage: production
    network_type:
      - mainnet
      - testnet
    component:
      - validator-engine
      - lite-client
      - tonlib
      - crypto
    team: core-team
    public_api: true
    documentation_complete: true
    release_channel: stable
```

## Integration with GitHub Features

Custom properties can be integrated with:

### Rulesets
Use custom properties to apply branch protection rules and policies based on repository classification.

### Search and Filtering
Search repositories by custom properties in your organization:
```
org:your-org custom_property:criticality=critical
org:your-org custom_property:lifecycle_stage=production
```

### Automation
Use custom properties in GitHub Actions workflows:
```yaml
jobs:
  deploy:
    if: github.event.repository.custom_properties.lifecycle_stage == 'production'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: ./deploy.sh
```

## Maintaining Custom Properties

### Adding New Properties
1. Update `.github/custom-properties.yml` with the new property definition
2. Create a PR for review
3. After merge, configure the property in organization settings

### Modifying Properties
1. Update the property definition in `.github/custom-properties.yml`
2. Update this documentation
3. Communicate changes to the team
4. Update organization settings

### Deprecating Properties
1. Mark the property as deprecated in documentation
2. Provide migration path to new property
3. Remove from `.github/custom-properties.yml` after migration period

## Best Practices

1. **Keep properties minimal**: Only define properties that provide clear value
2. **Use consistent naming**: Follow snake_case convention for property names
3. **Document thoroughly**: Ensure all properties have clear descriptions
4. **Review regularly**: Audit custom properties quarterly to ensure they remain relevant
5. **Enforce required properties**: Use required fields for critical metadata
6. **Coordinate with teams**: Ensure property values align with team workflows

## References

- [GitHub Documentation: Managing custom properties for repositories](https://docs.github.com/en/organizations/managing-organization-settings/managing-custom-properties-for-repositories-in-your-organization)
- [GitHub REST API: Custom Properties](https://docs.github.com/en/rest/orgs/custom-properties)
- [GitHub safe-settings](https://github.com/github/safe-settings)

## Support

For questions or issues with custom properties:
1. Check GitHub documentation
2. Contact repository administrators
3. Open an issue in this repository
