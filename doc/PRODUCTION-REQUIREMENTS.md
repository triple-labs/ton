# TON Blockchain Production Requirements

This document outlines the comprehensive requirements for deploying and operating TON blockchain infrastructure in production environments.

## Table of Contents
- [Overview](#overview)
- [Hardware Requirements](#hardware-requirements)
- [Network Requirements](#network-requirements)
- [Software Requirements](#software-requirements)
- [Security Requirements](#security-requirements)
- [Operational Requirements](#operational-requirements)
- [Monitoring Requirements](#monitoring-requirements)
- [Compliance Requirements](#compliance-requirements)

## Overview

TON blockchain infrastructure can be deployed in several configurations:
1. **Full Node** - Maintains complete blockchain state, serves queries
2. **Validator Node** - Participates in consensus, validates blocks (requires significant stake)
3. **Lite Client** - Lightweight access to blockchain data
4. **Smart Contract Services** - Applications interacting with TON blockchain

This document primarily focuses on production requirements for Full Nodes and Validator Nodes, which represent the most demanding deployment scenarios.

## Hardware Requirements

### Minimum Requirements (Full Node)

**Not recommended for production validators**

- **CPU:** 8 cores @ 2.0 GHz or higher
- **RAM:** 128 GB
- **Storage:** 
  - 4 TB HDD for blockchain data
  - 256 GB SSD for state/cache
- **Network:** 100 Mbit/s sustained bandwidth

### Recommended Requirements (Production Full Node)

- **CPU:** Dual processor, 8+ cores each @ 2.5+ GHz (16+ cores total)
  - Intel Xeon Gold 6000 series or equivalent
  - AMD EPYC 7002 series or equivalent
- **RAM:** 256 GB DDR4 ECC
- **Storage:**
  - 8 TB+ enterprise HDD (RAID 10) for blockchain data
  - 512 GB+ enterprise NVMe SSD (RAID 1) for state/cache
  - Consider dedicated SSD for OS and logs
- **Network:** 1 Gbit/s sustained bandwidth
- **Power:** Redundant power supplies with UPS backup

### Recommended Requirements (Production Validator)

**Critical: Validators require the highest reliability**

- **CPU:** Dual processor, 12+ cores each @ 3.0+ GHz (24+ cores total)
  - Latest generation Intel Xeon or AMD EPYC
  - High single-thread performance important
- **RAM:** 512 GB DDR4 ECC
- **Storage:**
  - 12 TB+ enterprise HDD (RAID 10) for blockchain data
  - 1 TB+ enterprise NVMe SSD (RAID 1) for state/cache
  - Separate SSDs for OS, logs, and backups
- **Network:** 
  - 1+ Gbit/s sustained bandwidth
  - Multiple network interfaces for redundancy
  - Low latency (<50ms to other validators)
- **Power:** Redundant power supplies, dual UPS, backup generator
- **Cooling:** Redundant cooling systems

### Storage Growth Considerations

- **Current blockchain size:** ~2-3 TB (as of 2024)
- **Growth rate:** ~100-200 GB per month
- **Plan for:** 2-3 years of growth = 8-12 TB minimum
- **Monitoring:** Set alerts when storage reaches 70% capacity
- **Archival:** Implement archival strategy for old data

### Scalability Considerations

- Plan for 2-3x current capacity to handle:
  - Network growth
  - Increased transaction volumes
  - Additional shardchains
  - Peak load scenarios

## Network Requirements

### Bandwidth

**Minimum:**
- **Full Node:** 100 Mbit/s sustained
- **Validator:** 1 Gbit/s sustained

**Recommended:**
- **Full Node:** 1 Gbit/s sustained, burst to 10 Gbit/s
- **Validator:** 10 Gbit/s sustained

**Considerations:**
- 95th percentile billing recommended
- Plan for 2-3x average usage for peaks
- Monitor bandwidth usage continuously

### Latency

- **Target:** <50ms to major validator nodes
- **Maximum acceptable:** <100ms
- **Impact:** Higher latency reduces validation efficiency

**Geographic considerations:**
- Deploy near major validator concentrations
- Consider multi-region deployment for redundancy
- Use CDN/proxy for public-facing services

### Connectivity

**Requirements:**
- Multiple upstream providers (BGP preferred)
- Automatic failover between providers
- DDoS protection service (Cloudflare, Arbor, etc.)
- Direct peering with major networks (optional but beneficial)

**Ports:**
- Configure firewalls to allow required ports
- See FullNode-HOWTO and Validator-HOWTO for specific ports
- Implement rate limiting to prevent abuse

### IP Addresses

- **Static IP addresses required**
- **IPv4 required, IPv6 recommended**
- For validators: Keep IP addresses confidential
- Use separate IPs for:
  - Validator consensus
  - Public RPC/API (if offered)
  - Management/monitoring

## Software Requirements

### Operating System

**Supported:**
- Ubuntu 20.04 LTS (minimum)
- Ubuntu 22.04 LTS (recommended)
- Ubuntu 24.04 LTS (recommended)
- macOS 11+ (testing/development only)
- Windows Server (limited support)

**Not recommended for production:**
- macOS (use Linux for production)
- Windows (use Linux for production)
- Unsupported Linux distributions

**OS Configuration:**
- 64-bit architecture required (x86-64 or aarch64)
- Kernel 5.4+ recommended
- Enable all security updates
- Configure automatic security patching
- Disable unnecessary services
- Harden system according to CIS benchmarks

### System Dependencies

**Build requirements:**
```bash
build-essential
git
cmake (3.16+)
ninja-build
zlib1g-dev
libsecp256k1-dev
libmicrohttpd-dev
libsodium-dev
clang-16 (or later)
```

**Runtime requirements:**
- All build dependencies
- OpenSSL 1.1.1+
- System libraries (installed via apt/package manager)

### TON Software

**Version:**
- **Always use latest stable from master branch**
- Never use outdated versions in production
- Subscribe to security announcements
- Test updates on testnet first

**Components:**
- `validator-engine` - Core node software
- `validator-engine-console` - Management interface
- `lite-client` - Query tool
- Supporting scripts and tools

**Build from source:**
```bash
# Clone repository
git clone https://github.com/ton-blockchain/ton.git
cd ton

# Build
cp assembly/native/build-ubuntu-shared.sh .
chmod +x build-ubuntu-shared.sh
./build-ubuntu-shared.sh
```

**Updates:**
- Check for updates weekly
- Test on testnet before mainnet
- Plan maintenance windows for updates
- Keep rollback capability

### Additional Software

**Required:**
- **Time synchronization:** ntpd or chrony (critical for consensus)
- **Process supervisor:** systemd or supervisord
- **Log management:** rsyslog or journald

**Recommended:**
- **Configuration management:** Ansible, Puppet, or Chef
- **Monitoring agent:** Prometheus node_exporter, Datadog agent, etc.
- **Backup tools:** Restic, Duplicity, or commercial solution
- **Security tools:** fail2ban, OSSEC, or commercial SIEM

## Security Requirements

### Access Control

**SSH Access:**
- Disable password authentication
- Use SSH keys only (4096-bit RSA or ED25519)
- Implement SSH bastion/jump hosts
- Require 2FA for all SSH access
- Restrict SSH to specific IP ranges
- Change default SSH port
- Use SSH certificates where possible

**System Access:**
- Minimal user accounts
- No root login
- Sudo with logging
- Unique accounts per person (no shared accounts)
- Regular access reviews
- Immediate revocation for departed staff

### Firewall Configuration

**Inbound rules:**
- Allow only required ports (validator, monitoring)
- Restrict management ports to known IPs
- Implement rate limiting
- Log all denied connections

**Outbound rules:**
- Allow only necessary connections
- Block unnecessary protocols
- Monitor for unusual outbound traffic

**Recommended tools:**
- iptables/nftables (host-level)
- Cloud provider security groups
- Hardware firewall (datacenter)

### Encryption

**Data at rest:**
- Encrypt all storage volumes (LUKS, dm-crypt)
- Encrypt backups
- Secure key management for encryption keys
- Use hardware encryption where available

**Data in transit:**
- TLS 1.3 for all network services
- Encrypt backup transfers
- Use VPN for management access
- Encrypt inter-node communication where possible

**Key storage:**
- Hardware Security Module (HSM) for validator keys
- Encrypted key storage for all private keys
- Separate keys for different purposes
- Regular key rotation for operational keys (not validator keys during term)

### Security Monitoring

**Required:**
- Intrusion Detection System (IDS)
- Log aggregation and analysis
- File integrity monitoring
- Security event alerting
- Regular vulnerability scanning
- Penetration testing (annual minimum)

### Security Updates

**Critical:**
- Enable automatic security updates for OS
- Manual updates for TON software (test first)
- Emergency patching procedure (documented)
- Update within 24 hours for critical vulnerabilities

## Operational Requirements

### Personnel

**Minimum team (Validator):**
- 2-3 engineers with blockchain expertise
- 24/7 on-call rotation
- Backup personnel for each role
- Regular training and knowledge sharing

**Skills required:**
- Linux system administration
- Networking and security
- Blockchain/cryptocurrency knowledge
- TON-specific expertise
- Incident response
- Programming (for automation)

### Documentation

**Required:**
- System architecture diagrams
- Network topology
- Configuration documentation
- Operational runbooks
- Incident response procedures
- Disaster recovery plan
- Key management procedures
- Access control procedures

**Maintenance:**
- Keep documentation current
- Review quarterly
- Version control for all docs
- Accessible to all team members

### Change Management

**Process:**
1. Document proposed change
2. Risk assessment
3. Test in non-production
4. Peer review
5. Schedule maintenance window
6. Implement change
7. Verify success
8. Update documentation

**Emergency changes:**
- Streamlined approval process
- Post-implementation review
- Document lessons learned

### Incident Response

**Required:**
- Documented incident response plan
- Clear escalation paths
- Communication procedures
- Post-incident reviews
- Regular drills/testing

**Response times:**
- **Critical (validator down):** <15 minutes
- **High (degraded performance):** <1 hour
- **Medium:** <4 hours
- **Low:** <24 hours

### Backup and Recovery

**Backup strategy:**
- **Frequency:** Daily incremental, weekly full
- **Retention:** 30 days minimum
- **Location:** Off-site, geographically diverse
- **Encryption:** All backups encrypted
- **Testing:** Monthly restore tests

**What to backup:**
- Validator/wallet private keys (critical)
- Node configuration files
- Blockchain state (optional, can resync)
- Monitoring configuration
- Documentation

**Recovery procedures:**
- Documented step-by-step procedures
- Regular testing (quarterly)
- Recovery Time Objective (RTO): <4 hours
- Recovery Point Objective (RPO): <24 hours

### Disaster Recovery

**Plan includes:**
- Alternative datacenter/cloud region
- Backup hardware (hot standby for validators)
- Network failover procedures
- Key recovery procedures
- Communication plan
- Regular DR drills (annual minimum)

## Monitoring Requirements

### System Metrics

**Required monitoring:**
- CPU usage (per core)
- Memory usage
- Disk I/O and space
- Network bandwidth and packets
- System load
- Process status
- Log errors

**Thresholds:**
- Alert at 70% sustained usage
- Critical at 90% usage

### Node Metrics

**Required monitoring:**
- Node sync status
- Current block height
- Peer count
- Consensus participation
- Block validation rate
- Transaction processing rate
- Memory pool size
- Node uptime

**Validator-specific:**
- Validator status (active/inactive)
- Blocks signed
- Missed blocks
- Stake status
- Election participation
- Rewards earned

### Application Metrics

- Smart contract interaction rate
- API response times (if applicable)
- Error rates
- Transaction success/failure rates

### Alerting

**Required alerts:**
- Node down/unreachable
- Sync stopped
- High resource usage
- Disk space low
- Security events
- Backup failures
- Certificate expiration

**Alert channels:**
- PagerDuty or equivalent
- Email
- SMS
- Slack/Teams
- Multiple escalation levels

### Monitoring Tools

**Recommended:**
- **Metrics:** Prometheus + Grafana
- **Logs:** ELK Stack or Loki
- **APM:** Datadog, New Relic, or similar
- **Uptime:** UptimeRobot, Pingdom
- **Custom:** TON-specific monitoring tools

## Compliance Requirements

### Know Your Customer (KYC) / Anti-Money Laundering (AML)

**Applicability:**
- Required if offering services to end users
- Required if operating as money service business
- May be required for validators (jurisdiction-dependent)

**Requirements vary by jurisdiction:**
- Customer identification
- Transaction monitoring
- Suspicious activity reporting
- Record keeping

### Data Protection

**GDPR (EU), CCPA (California), similar laws:**
- Data minimization
- User privacy rights
- Data breach notification
- Privacy policy

### Financial Regulations

**Varies by jurisdiction:**
- Money transmitter licenses
- Securities regulations (if applicable)
- Tax reporting requirements
- Consumer protection laws

### Record Keeping

**Required records:**
- System logs (6-12 months minimum)
- Transaction records (5-7 years varies by jurisdiction)
- Financial records (7+ years)
- Access logs
- Incident reports

**Retention:**
- Follow local regulations
- Secure storage
- Encrypted backups
- Retrieval procedures

### Audit Requirements

**Recommended:**
- Annual security audit
- SOC 2 compliance (if offering services)
- Financial audit (if required)
- Internal audits (quarterly)

## Cost Considerations

### Capital Expenditure (CapEx)

**Full Node:**
- Hardware: $10,000 - $30,000
- Network equipment: $2,000 - $5,000
- Datacenter setup: $5,000 - $20,000

**Validator:**
- Hardware: $30,000 - $100,000+
- Network equipment: $5,000 - $20,000
- Datacenter setup: $10,000 - $50,000
- HSM: $5,000 - $50,000

### Operational Expenditure (OpEx)

**Annual costs:**
- Datacenter/colocation: $12,000 - $60,000
- Bandwidth: $6,000 - $50,000
- Personnel: $200,000 - $500,000+ (for team)
- Software licenses: $5,000 - $50,000
- Monitoring/security tools: $10,000 - $50,000
- Insurance: Variable

**Validator-specific:**
- Stake capital: 100,001+ TON (locked)
- Opportunity cost of locked capital
- Transaction fees for operations

### Break-Even Analysis

**Considerations:**
- Validator rewards vary with stake size
- Network conditions affect rewards
- Price volatility impacts USD value
- Operational costs are ongoing
- Stake lock periods affect liquidity

## Getting Started Checklist

### Phase 1: Planning (4-8 weeks)
- [ ] Determine deployment type (Full Node vs Validator)
- [ ] Assess internal capabilities and gaps
- [ ] Calculate total cost of ownership
- [ ] Obtain necessary approvals and budget
- [ ] Research compliance requirements
- [ ] Assemble team or hire consultants

### Phase 2: Infrastructure Setup (4-8 weeks)
- [ ] Procure hardware
- [ ] Set up datacenter/colocation
- [ ] Configure network and security
- [ ] Install and harden operating systems
- [ ] Set up monitoring and alerting
- [ ] Configure backups
- [ ] Document everything

### Phase 3: Software Deployment (2-4 weeks)
- [ ] Build TON software from source
- [ ] Deploy to testnet first
- [ ] Configure node settings
- [ ] Set up management tools
- [ ] Test all procedures
- [ ] Conduct security review

### Phase 4: Testing (4-8 weeks)
- [ ] Run on testnet minimum 4 weeks
- [ ] Test all operational procedures
- [ ] Verify monitoring and alerting
- [ ] Conduct disaster recovery drill
- [ ] Test backup and restore
- [ ] Load testing (if applicable)
- [ ] Security testing
- [ ] Team training

### Phase 5: Production Deployment
- [ ] Final security review
- [ ] Deploy to mainnet
- [ ] Gradual rollout (if applicable)
- [ ] 24/7 monitoring during initial period
- [ ] Post-deployment review

### Phase 6: Ongoing Operations
- [ ] Weekly security updates
- [ ] Monthly operational reviews
- [ ] Quarterly DR drills
- [ ] Annual security audit
- [ ] Continuous improvement

## Conclusion

Running production TON blockchain infrastructure requires significant investment in:
- High-quality hardware and infrastructure
- Professional operations team with 24/7 coverage
- Comprehensive monitoring and security
- Proper compliance and governance
- Significant capital (for validators)

**Key Success Factors:**
1. Don't skip the testnet phase
2. Invest in quality infrastructure
3. Implement comprehensive monitoring
4. Maintain detailed documentation
5. Keep software updated
6. Follow security best practices
7. Plan for scale and growth

**When to Outsource:**
Consider using managed validator services or infrastructure providers if:
- Limited technical expertise
- Insufficient capital for full infrastructure
- Cannot provide 24/7 operations
- Compliance requirements are complex
- Want to minimize operational overhead

## Additional Resources

- **TON Documentation:** https://ton.org/docs
- **Validator HOWTO:** doc/Validator-HOWTO
- **Full Node HOWTO:** doc/FullNode-HOWTO  
- **Smart Contract Guidelines:** doc/smc-guidelines.txt
- **Security Policy:** SECURITY.md
- **TON Community:** https://t.me/tondev_eng
- **Risk Assessment:** doc/PRODUCTION-RISKS.md
- **Cash-Out Guide:** doc/CASHOUT-GUIDE.md
