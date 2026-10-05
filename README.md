# XDOL Ethereum — production audit snapshot

This repository preserves the verified production source without changes to contract logic, comments, dependencies or line endings. **Audit preparation snapshot; unresolved items below must be validated before formal submission.**

## Deployment and compiler

| Field | Value |
|---|---|
| Contract | XDOLToken |
| Network | Ethereum Mainnet |
| Chain ID | 1 |
| Deployment address | `0xA4842662637e7C8A0210247D89244B0E45d3f777` |
| Explorer / source | https://etherscan.io/address/0xA4842662637e7C8A0210247D89244B0E45d3f777#code |
| Compiler | `v0.8.30+commit.73712a01` |
| Solidity pragma of XDOLToken | `0.8.30` |
| Optimizer | enabled, 200 runs |
| EVM target | Etherscan: default; compiler default resolves to Prague |
| Constructor | no arguments; initial supply minted to deployment sender |
| License shown by Etherscan | MIT; source has no SPDX header; preserved unchanged |

## Evidence and limits

`contracts/XDOLToken.sol` is the entire flattened source extracted from Etherscan, including its embedded OpenZeppelin dependencies. Do not replace those dependencies with a current package version or add an SPDX header to the audit source.

`evidence/etherscan-source.json` retains the decoded source payload. `manifest.json` records provenance and SHA-256. Creation and runtime bytecode displayed by Etherscan are saved alongside the ABI. An independent `eth_getCode` request to https://ethereum-rpc.publicnode.com returned runtime bytecode exactly matching Etherscan on 2026-10-05. A subsequent recorded-block check confirmed chain ID 1 and identical runtime bytecode at Ethereum block **26,128,088**, hash `0x9c8e4190d2380406b3e60d25cfb48ead739c5fe6248a4bd7663e831cbe901aa3`. Endpoint, capture time, block and comparison are recorded in `evidence/rpc-block-check.json`.

Compilation with the exact compiler and optimizer reproduces the executable creation and runtime bytecode. **Full bytecode differs in the trailing Solidity CBOR metadata.** Original compiler input path/content representation and metadata settings have not been recovered conclusively. `evidence/build-check.json` records this explicitly. Source correspondence is confirmed against the explorer payload; full-bytecode reproducibility is NOT claimed. Do not redeploy this repository.

## Build and verification

Prerequisite: Node.js 18+ and the official `soljson-v0.8.30+commit.73712a01.js` compiler from https://github.com/ethereum/solc-bin/tree/gh-pages/bin (or https://binaries.soliditylang.org/bin/).

Save the compiler outside the repository, then run:

```sh
node scripts/build.cjs /absolute/path/to/soljson-v0.8.30+commit.73712a01.js
```

The script checks compiler version and source hash, compiles with Standard JSON, rejects executable bytecode mismatches, and reports full-bytecode matching separately. Outputs are in `build/` (ignored). No wallet, private key, deployment, or paid service is needed.

To independently check deployment, call Ethereum RPC `eth_chainId`, `eth_blockNumber`, and `eth_getCode` at that recorded block. Compare returned code byte-for-byte with `evidence/runtime-bytecode.hex`. Record endpoint, chain ID, block number/hash and timestamp. To reproduce Etherscan verification, use the original Standard JSON input once recovered, compiler above, optimizer above, and no constructor arguments. The generated `build/standard-input.json` is a candidate build input; it must not be represented as the original verified input while metadata differs.

## Audit scope — Hacken

In scope: the complete flattened `contracts/XDOLToken.sol`, including embedded dependencies, constructor, ERC-20 transfers, approvals, allowances, supply and decimals. Scope is this Ethereum deployment only. Bridges, other networks, pools, website, backing/reserves, custody and legal representations are outside this code scope unless separately agreed.

Observed source behavior: ERC-20 named `x-DOL-x`, symbol `XDOL`, six decimals, initial supply 500,000,000 tokens; constructor mints to `msg.sender`. These are source observations, not assertions about current distribution or reserves.

Audit branch: `audit/ethereum-production-2026-10-05`. Use the **full 40-character commit SHA**, not branch HEAD, as the immutable audit reference. A branch can move; its name is not an immutable reference. Obtain the commit with `git rev-parse HEAD` after checking out the branch. Published coordinates are recorded in the separate handoff file, outside the commit to avoid a self-referential SHA.

### Completed preparation checks

- Public repository: https://github.com/xdolofficial/xdol-ethereum-audit.
- Initial audit snapshot commit: `deb457c11dd1704c9aa62ee2ba071553ca3c80d9`; retained unchanged in Git history. This documentation update has a separate commit; use its full SHA from the audit branch for the updated scope.
- Ethereum chain ID, recorded block/hash and exact deployed bytecode comparison confirmed (see `evidence/rpc-block-check.json`).
- Private reporting address confirmed by the project owner: `contact@xdol.com.br`.
- Classic GitHub branch protection created for `audit/ethereum-production-2026-10-05` on 2026-10-05. Force pushes and deletions are disallowed; administrator bypass is disabled. Normal fast-forward updates remain possible; always scope an audit to a full commit SHA.

### Required validation before submission

- `[PENDING: recover original verification Standard JSON / metadata settings and reproduce complete bytecode, or obtain Hacken's explicit acceptance of executable-only reproduction]`.


No audit has been performed by this preparation. Findings and remediation belong in later commits/branches and require a separately agreed audit scope.
