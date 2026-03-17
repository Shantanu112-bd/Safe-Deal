/**
 * SafeDeal Contract Configuration
 * ================================
 * Contract addresses, network config, and USDC token details.
 * 
 * To deploy contracts and update these values:
 * 1. Build each contract:  cd contracts/<name> && cargo build --target wasm32-unknown-unknown --release
 * 2. Deploy to testnet:    stellar contract deploy --wasm target/wasm32-unknown-unknown/release/<name>.wasm --network testnet
 * 3. Copy the returned contract ID into .env.local
 * 4. Restart the dev server
 */

// ──────────────────────────────────────────────
// Contract IDs (from .env.local)
// ──────────────────────────────────────────────

export const CONTRACTS = {
  MERCHANT_ESCROW:      process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ID   || "",
  FRAUD_DETECTION:      process.env.NEXT_PUBLIC_FRAUD_CONTRACT_ID    || "",
  DISPUTE_RESOLUTION:   process.env.NEXT_PUBLIC_DISPUTE_CONTRACT_ID  || "",
  SELLER_VERIFICATION:  process.env.NEXT_PUBLIC_VERIFY_CONTRACT_ID   || "",
  FIAT_BRIDGE:          process.env.NEXT_PUBLIC_FIAT_CONTRACT_ID     || "",
} as const;

// ──────────────────────────────────────────────
// Network Configuration
// ──────────────────────────────────────────────

export const NETWORK = (process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet") as "testnet" | "mainnet";
export const RPC_URL = "https://soroban-testnet.stellar.org";
export const HORIZON_URL = "https://horizon-testnet.stellar.org";
export const PASSPHRASE = "Test SDF Network ; September 2015";

// ──────────────────────────────────────────────
// USDC Token Configuration (Testnet)
// ──────────────────────────────────────────────

export const USDC_ASSET_CODE = process.env.NEXT_PUBLIC_USDC_ASSET_CODE || "USDC";
export const USDC_ISSUER = process.env.NEXT_PUBLIC_USDC_ISSUER || "GBBD67IF633SHJY6CIGWSBTEU77OUNMTAOOK7N6A4AKX2HPCY5NQXWVN";

// 1 USDC = 10^7 stroops (Soroban i128 format)
export const USDC_DECIMALS = 7;
export const STROOPS_PER_USDC = 10_000_000;

// ──────────────────────────────────────────────
// Deployment Status Helper
// ──────────────────────────────────────────────

/**
 * Returns a summary of which contracts are deployed
 */
export const getDeploymentStatus = () => {
  const isDeployed = (id: string) => id.length === 56 && id.startsWith("C");
  
  return {
    escrow:       isDeployed(CONTRACTS.MERCHANT_ESCROW),
    fraud:        isDeployed(CONTRACTS.FRAUD_DETECTION),
    dispute:      isDeployed(CONTRACTS.DISPUTE_RESOLUTION),
    verification: isDeployed(CONTRACTS.SELLER_VERIFICATION),
    fiatBridge:   isDeployed(CONTRACTS.FIAT_BRIDGE),
    anyDeployed:  Object.values(CONTRACTS).some(isDeployed),
    allDeployed:  Object.values(CONTRACTS).every(isDeployed),
  };
};
