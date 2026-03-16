/**
 * SafeDeal contract addresses on Stellar Testnet
 */
export const CONTRACTS = {
  MERCHANT_ESCROW: process.env.NEXT_PUBLIC_MERCHANT_ESCROW_ID || "CCBA...",
  FRAUD_DETECTION: process.env.NEXT_PUBLIC_FRAUD_DETECTION_ID || "CAE5...",
  DISPUTE_RESOLUTION: process.env.NEXT_PUBLIC_DISPUTE_RESOLUTION_ID || "CBPQ...",
  SELLER_VERIFICATION: process.env.NEXT_PUBLIC_SELLER_VERIFICATION_ID || "CBMY...",
  FIAT_BRIDGE: process.env.NEXT_PUBLIC_FIAT_BRIDGE_ID || "CATT...",
};

export const NETWORK = "TESTNET";
export const RPC_URL = "https://soroban-testnet.stellar.org";
export const PASSPHRASE = "Test SDF Network ; September 2015";
