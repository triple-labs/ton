# TON Blockchain Cash-Out Guide

This document explains how to withdraw TON from smart contracts and convert it to fiat currency through exchanges or bank accounts.

## Table of Contents
- [Overview](#overview)
- [Understanding TON Token Flow](#understanding-ton-token-flow)
- [Withdrawing from Contracts](#withdrawing-from-contracts)
- [Exchange Integration](#exchange-integration)
- [Bank Account Integration](#bank-account-integration)
- [Compliance Considerations](#compliance-considerations)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

Converting TON tokens from smart contracts to traditional fiat currency involves several steps:

1. **Withdraw from Contract** → Extract TON from smart contract to wallet
2. **Transfer to Exchange** → Send TON to cryptocurrency exchange
3. **Convert to Fiat** → Sell TON for USD/EUR/other currency
4. **Bank Withdrawal** → Transfer fiat to bank account

Each step has specific requirements, risks, and considerations.

## Understanding TON Token Flow

### Token Custody Locations

1. **Smart Contracts**
   - Validator stakes (elector contract)
   - DeFi protocols (DEX, lending, staking)
   - Custom application contracts
   - Multi-signature wallets

2. **Personal Wallets**
   - Simple wallet contracts
   - Multi-signature wallets
   - Hardware wallet-controlled addresses
   - Exchange deposit addresses

3. **Exchange Wallets**
   - Centralized exchange custody
   - User trading balances
   - Withdrawal addresses

### Transaction Types

- **Internal Messages:** Contract-to-contract or contract-to-wallet
- **External Messages:** User-initiated actions (signed messages)
- **Bounceable vs Non-Bounceable:** Affects handling of failed transactions

## Withdrawing from Contracts

### 1. Withdrawing Validator Stakes

**Prerequisites:**
- Validator public key
- Controlling wallet with sufficient balance for fees
- Stake must be unfrozen (election period ended)
- Access to wallet private key

**Process:**

#### Step 1: Check Stake Status

```bash
# Using lite-client
lite-client -C <global-config-file> -c "runmethod <elector-addr> participant_list"
```

Check if your validator's stake is listed and whether it's frozen or unfrozen.

#### Step 2: Recover Stake

Use the `recover-stake.fif` script (located in `crypto/smartcont`):

```bash
# Set up environment
export FIFTPATH=<source-dir>/crypto/fift/lib:<source-dir>/crypto/smartcont

# Generate recovery message
fift -s recover-stake.fif <wallet-addr> <recovery-query-file.boc>

# Send via lite-client
lite-client -C <global-config-file> -c "sendfile <recovery-query-file.boc>"
```

**Important:**
- Recovery requires payment for transaction fees (~1 TON)
- Stake + bonuses will be sent to your controlling wallet
- May take several minutes to process
- Check wallet balance to confirm receipt

#### Step 3: Verify Receipt

```bash
# Check wallet balance
lite-client -C <global-config-file> -c "getaccount <wallet-addr>"
```

**Troubleshooting:**
- If stake not received: Check if stake is still frozen
- If transaction failed: Ensure sufficient balance for fees
- If message bounced: Check elector contract address and wallet setup

### 2. Withdrawing from DeFi Protocols

**General Process:**

Most DeFi protocols provide withdrawal methods. Typical pattern:

#### Step 1: Check Balance in Contract

```bash
# Example: Query get-method to check your balance
lite-client -C <global-config> -c "runmethod <contract-addr> get_balance <your-addr>"
```

#### Step 2: Send Withdrawal Message

Create and send a message to the contract requesting withdrawal:

```bash
# Use protocol-specific script or create custom message
fift -s withdraw-from-protocol.fif <contract-addr> <amount> <query-file.boc>
lite-client -C <global-config> -c "sendfile <query-file.boc>"
```

#### Step 3: Monitor Transaction

```bash
# Wait for transaction to process
lite-client -C <global-config> -c "getaccount <your-wallet-addr>"
```

**Important Considerations:**
- Each DeFi protocol has its own withdrawal mechanism
- May have lock-up periods or withdrawal delays
- May charge withdrawal fees
- Always test with small amounts first on testnet

### 3. Withdrawing from Multi-Sig Wallets

**Requirements:**
- Sufficient signatures from authorized parties
- Knowledge of wallet configuration

**Process:**

#### Step 1: Initiate Withdrawal

First signer creates withdrawal transaction:

```bash
# Create withdrawal message
fift -s wallet-multisig-create-order.fif <multisig-addr> <dest-addr> <amount> <order-file.boc>
```

#### Step 2: Collect Signatures

Additional signers add their signatures:

```bash
# Each signer adds signature
fift -s wallet-multisig-sign.fif <multisig-addr> <order-file.boc> <signed-order.boc>
```

#### Step 3: Submit Transaction

Once sufficient signatures collected:

```bash
lite-client -C <global-config> -c "sendfile <signed-order.boc>"
```

### 4. General Wallet Withdrawals

**Simple Wallet:**

```bash
# Create transfer from wallet
fift -s wallet.fif <wallet-id> <dest-addr> <seqno> <amount> <message-file.boc>

# Send transaction
lite-client -C <global-config> -c "sendfile <message-file.boc>"
```

**Key Parameters:**
- `seqno`: Current sequence number (prevents replay attacks)
- `amount`: In nanograms (1 TON = 1,000,000,000 nanograms)
- Destination address: Exchange deposit address or intermediate wallet

## Exchange Integration

### Selecting an Exchange

**Factors to Consider:**

1. **TON Support**
   - Verify exchange supports TON deposits/withdrawals
   - Check supported networks (ensure native TON, not wrapped tokens)

2. **Reputation & Security**
   - Established exchanges with good track record
   - Security measures (2FA, withdrawal whitelist, etc.)
   - Insurance/protection funds

3. **Fees**
   - Trading fees (maker/taker)
   - Withdrawal fees (to bank)
   - Currency conversion fees

4. **Geographic Availability**
   - Licensed in your jurisdiction
   - Supports your local currency
   - Offers bank transfers in your country

5. **Liquidity**
   - Sufficient trading volume for TON
   - Tight bid-ask spreads
   - Large order book

**Major Exchanges Supporting TON:**
- Bybit
- OKX
- Gate.io
- MEXC
- Bitget
- KuCoin
- HTX (Huobi)

*Note: Always verify current support status directly with exchange*

### Exchange Deposit Process

#### Step 1: Create Exchange Account

1. Sign up on chosen exchange
2. Complete identity verification (KYC)
   - Government ID
   - Proof of address
   - Selfie/biometrics
   - May take 24-72 hours

3. Enable security features
   - Two-factor authentication (2FA)
   - Withdrawal whitelist
   - Anti-phishing code

#### Step 2: Generate Deposit Address

1. Navigate to Wallet/Deposits section
2. Select TON
3. Generate deposit address
   - **Verify it's native TON** (not TRC20 or other network)
   - Note: Some exchanges use memo/tag in addition to address

4. Save deposit address securely

**Critical Checks:**
- ✅ Correct network (TON mainnet)
- ✅ Copy full address accurately
- ✅ Include memo/tag if required
- ✅ Test with small amount first

#### Step 3: Send TON from Wallet

```bash
# From your wallet
fift -s wallet.fif <wallet-id> <exchange-deposit-addr> <seqno> <amount> <msg.boc>
lite-client -C <global-config> -c "sendfile <msg.boc>"
```

**Important:**
- Include memo/tag in message comment if required
- Send small test amount first (10-50 TON)
- Wait for confirmations before sending large amount
- Keep transaction hash for reference

#### Step 4: Wait for Confirmations

- Most exchanges require 5-10 confirmations
- Typically takes 1-5 minutes
- Can track on TON explorer (tonscan.org)
- Exchange will email when deposit credited

**If Deposit Not Showing:**
- Verify transaction on blockchain explorer
- Check correct address and network
- Confirm memo/tag included if required
- Contact exchange support with transaction hash
- May take up to 24 hours for manual review

### Converting to Fiat

#### Step 1: Place Sell Order

**Market Order:**
- Sells immediately at current market price
- Guaranteed execution
- May have price slippage on large orders

**Limit Order:**
- Set specific price
- Only executes if price reached
- No slippage but may not fill

**Recommended for large amounts:**
- Split into multiple smaller orders
- Use limit orders near current price
- Monitor order book depth
- Execute over several hours/days

#### Step 2: Monitor Order Execution

- Check order status in exchange interface
- View filled/partially filled orders
- Adjust limit orders if not filling

#### Step 3: Verify Fiat Balance

Once sold:
- TON balance decreases
- Fiat balance (USD/EUR) increases
- May be held in exchange wallet initially

### Withdrawing Fiat to Bank

#### Step 1: Add Bank Account

Most exchanges require:
- Bank name and address
- Account holder name (must match KYC)
- Account number or IBAN
- Routing/SWIFT/BIC codes
- Account type (checking/savings)

**Verification:**
- May require bank statement upload
- Small test deposits to verify account
- 24-48 hours processing time

#### Step 2: Initiate Withdrawal

1. Navigate to Withdraw section
2. Select fiat currency
3. Choose bank transfer method:
   - ACH (US) - Free, 1-3 days
   - Wire transfer - Fee ($15-50), same day
   - SEPA (EU) - Low fee, 1-2 days
   - Faster Payments (UK) - Free, instant-24hrs

4. Enter amount
5. Review fees
6. Confirm withdrawal

**Limits:**
- Daily withdrawal limits vary by verification level
- May need enhanced verification for large amounts
- Some exchanges have mandatory processing delays

#### Step 3: Wait for Transfer

**Typical Timeframes:**
- ACH: 1-3 business days
- Wire: 1-2 business days
- SEPA: 1-2 business days
- Faster Payments: Same day

**Tracking:**
- Exchange provides withdrawal ID
- May provide bank reference number
- Check bank account after expected time

## Bank Account Integration

### Business Bank Accounts

**Crypto-Friendly Banks:**

Many traditional banks restrict cryptocurrency-related transactions. Consider:

**US:**
- Customers Bank
- Cross River Bank
- First Digital Trust
- **Note:** Major crypto banks Silvergate and Signature Bank have ceased operations. Always verify current status and licensing of any financial institution.

**EU:**
- Frick Bank (Liechtenstein)
- SEBA Bank (Switzerland)
- Sygnum Bank (Switzerland)
- Bankhaus von der Heydt (Germany)

**UK:**
- ClearBank
- BCB Group
- Revolut Business

**Requirements for Business Accounts:**
- Business registration documents
- Proof of business activity
- Source of funds documentation
- Business plan
- Enhanced due diligence
- Ongoing transaction monitoring

### Direct Fiat Off-Ramps

**OTC (Over-The-Counter) Desks:**

For large amounts (>$100,000), OTC desks offer:
- Better prices (no market slippage)
- Personal service
- Flexible settlement options
- Direct bank transfers

**Major OTC Providers:**
- Genesis Trading
- Cumberland
- Circle Trade
- Kraken OTC
- B2C2

**Process:**
1. Contact OTC desk
2. Provide KYC documentation
3. Negotiate price and terms
4. Transfer TON to their address
5. Receive fiat wire transfer

**Advantages:**
- Better rates for large amounts
- Less market impact
- Professional service
- Direct bank settlement

**Disadvantages:**
- Minimum amounts (often $100k+)
- More due diligence required
- Slower process (hours/days)

### Payment Processors

**For Businesses Accepting TON:**

If running a business that accepts TON, can use payment processors:

- TON Pay (native TON solution)
- CoinGate
- NOWPayments
- BitPay (check TON support)

**Benefits:**
- Automatic conversion to fiat
- Handles customer payments
- Regular bank payouts
- Accounting integration
- Lower compliance burden

## Compliance Considerations

### Know Your Customer (KYC)

**Required Information:**
- Full legal name
- Date of birth
- Residential address
- Government-issued ID
- Proof of address (utility bill, bank statement)
- Selfie/biometric verification
- Source of funds documentation

**Enhanced Due Diligence (Large Amounts):**
- Source of wealth documentation
- Business information
- Tax returns
- Bank statements
- Explanation of transaction purpose

### Anti-Money Laundering (AML)

**Exchange Monitoring:**
- Transactions are monitored for suspicious activity
- Large or unusual transactions flagged for review
- May require additional documentation
- Accounts can be frozen during investigation

**Red Flags to Avoid:**
- Structuring transactions to avoid reporting thresholds
- Rapid movement of funds between accounts
- Mixing with known illicit sources
- Inconsistent with stated business purpose

### Tax Reporting

**Important:**
- Cryptocurrency transactions are taxable events
- Selling TON for fiat triggers capital gains tax
- Must report on tax returns
- Keep detailed records of:
  - Acquisition date and price
  - Sale date and price
  - Transaction fees
  - All transfers

**Records to Maintain:**
- Exchange transaction history
- Wallet transaction history
- Purchase receipts
- Sale receipts
- Fee payments
- Annual summaries

**Tax Professionals:**
- Consider hiring crypto tax specialist
- Use crypto tax software (Koinly, CoinTracker, etc.)
- File all required forms (8949, Schedule D, etc.)

### Regulatory Compliance

**Varies by Jurisdiction:**
- USA: FinCEN reporting, state licenses
- EU: MiCA regulations, local requirements  
- UK: FCA regulations
- Others: Check local laws

**Reporting Thresholds:**
- USA: >$10,000 triggers CTR (Currency Transaction Report)
- EU: €10,000 threshold
- Other countries have varying limits

**Legal Advice:**
- Consult with attorney familiar with crypto regulations
- Ensure compliance with all local laws
- Maintain proper documentation
- Stay informed of regulatory changes

## Security Best Practices

### Wallet Security

**Private Key Protection:**
- Never share private keys
- Store securely offline (hardware wallet, encrypted backup)
- Use multi-signature for large amounts
- Geographic distribution of backups
- Test recovery procedures

**Transaction Verification:**
- Always verify destination address
- Double-check exchange deposit addresses
- Send small test transaction first
- Verify transaction on blockchain explorer
- Save transaction hashes

### Exchange Security

**Account Protection:**
- Enable 2FA (use authenticator app, not SMS)
- Use unique, strong password
- Enable withdrawal whitelist
- Set up anti-phishing code
- Regular security reviews

**Withdrawal Safety:**
- Start with small amounts
- Use withdrawal whitelist
- Verify withdrawal addresses carefully
- Be aware of withdrawal delays/limits
- Monitor account for unauthorized access

### Avoiding Scams

**Common Scams:**
- Fake exchange websites (phishing)
- Fake support staff asking for keys
- Too-good-to-be-true offers
- Pump and dump schemes
- Fake wallet applications

**Protection:**
- Verify URLs (use bookmarks)
- Never share private keys or seed phrases
- Ignore unsolicited offers
- Use official applications only
- Verify support contact information

### Transaction Security

**Best Practices:**
- Test with small amount first
- Verify all addresses carefully
- Keep transaction records
- Monitor blockchain confirmations
- Be aware of network congestion/fees

## Troubleshooting

### Transaction Not Appearing

**Possible Causes:**
- Transaction not yet confirmed
- Insufficient gas fees
- Wrong destination address
- Wrong network selected
- Exchange maintenance

**Resolution:**
1. Check transaction on blockchain explorer
2. Verify destination address correct
3. Check number of confirmations
4. Contact exchange support if needed
5. Provide transaction hash

### Withdrawal Delayed

**Possible Reasons:**
- Exchange security review
- Large amount triggering manual review
- KYC verification incomplete
- Technical issues
- Compliance checks

**Action:**
- Check exchange notifications
- Verify account fully verified
- Contact support with details
- Be patient (may take 24-48 hours)
- Provide requested documentation

### Failed Transactions

**Common Issues:**
- Insufficient balance for fees
- Invalid destination address
- Contract execution error
- Network congestion

**Resolution:**
1. Check error message
2. Verify sufficient balance
3. Check address format
4. Try again with higher gas
5. Check contract status

### Exchange Issues

**Account Frozen:**
- Usually due to security or compliance concerns
- Contact support immediately
- Provide requested documentation
- May take several days to resolve
- Escalate if no response

**Deposit Not Credited:**
- Verify transaction confirmed on blockchain
- Check correct address and network used
- Check memo/tag included if required
- Contact support with transaction hash
- May take 24 hours for manual credit

## Missing Features in Current TON Infrastructure

### 1. Fiat On/Off Ramps

**Current State:**
- Limited direct fiat integration
- Must use centralized exchanges
- No native fiat gateway in TON ecosystem

**Needed for Production:**
- Direct fiat-to-TON on-ramps
- Integrated payment processors
- More exchange listings
- P2P fiat platforms
- Payment cards (crypto debit cards)

### 2. Banking Infrastructure

**Current State:**
- No direct bank integrations
- Requires manual exchange transfers
- Limited banking partner support

**Needed for Production:**
- Banking APIs for direct integration
- Crypto-friendly banking partnerships
- Automatic settlement systems
- Multi-currency support
- Reduced withdrawal times

### 3. Compliance Tools

**Current State:**
- Basic transaction monitoring
- Limited AML/KYC tools
- Manual compliance processes

**Needed for Production:**
- Automated AML screening
- Built-in KYC verification
- Transaction monitoring systems
- Regulatory reporting tools
- Travel rule compliance

### 4. Tax Reporting

**Current State:**
- Manual record keeping
- Third-party tax software needed
- Complex transaction tracking

**Needed for Production:**
- Automated tax reporting
- Cost basis tracking
- Multi-jurisdiction support
- Direct tax form generation
- Accountant-friendly exports

### 5. Business Integration

**Current State:**
- Limited business account support
- Manual reconciliation needed
- Basic accounting integration

**Needed for Production:**
- Accounting software integration (QuickBooks, Xero)
- ERP system connectors
- Automated reconciliation
- Multi-entity support
- Payroll integration

### 6. Insurance & Protection

**Current State:**
- Limited insurance options
- No standardized protection
- High risk for errors

**Needed for Production:**
- Deposit insurance
- Transaction insurance
- Error protection
- Custody insurance
- Professional liability coverage

## Conclusion

Successfully cashing out from TON contracts to traditional bank accounts requires:

**Technical Steps:**
1. Withdraw from smart contracts
2. Transfer to exchange
3. Convert to fiat
4. Withdraw to bank account

**Key Requirements:**
- Secure wallet and key management
- Verified exchange accounts
- Crypto-friendly bank accounts
- Proper documentation and record keeping
- Compliance with regulations

**Critical Success Factors:**
- Always test with small amounts first
- Maintain detailed records for taxes
- Use reputable, established exchanges
- Implement strong security measures
- Stay compliant with regulations
- Plan for transaction times and fees

**Risk Management:**
- Never rush large transactions
- Verify all addresses carefully
- Use multi-signature for large amounts
- Keep majority in cold storage
- Diversify across multiple exchanges
- Maintain emergency reserves

For large amounts or business operations, consider engaging professional services:
- Tax advisors familiar with cryptocurrency
- Attorneys knowledgeable in crypto regulations
- OTC desks for large transactions
- Crypto-friendly banks for business accounts

## Additional Resources

- **TON Documentation:** https://ton.org/docs
- **TON Explorer:** https://tonscan.org
- **Smart Contract Guidelines:** doc/smc-guidelines.txt
- **Wallet Setup:** LiteClient-HOWTO
- **Validator Operations:** doc/Validator-HOWTO
- **Production Requirements:** doc/PRODUCTION-REQUIREMENTS.md
- **Risk Assessment:** doc/PRODUCTION-RISKS.md
