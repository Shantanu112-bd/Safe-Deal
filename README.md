# SafeDeal 🛡️ 

[![SafeDeal CI/CD](https://github.com/Shantanu112-bd/Safe-Deal/actions/workflows/deploy.yml/badge.svg)](https://github.com/Shantanu112-bd/Safe-Deal/actions/workflows/deploy.yml)
[![Live on Vercel](https://img.shields.io/badge/Live%20on-Vercel-black?style=flat&logo=vercel)](https://safedeal.vercel.app)

SafeDeal is an AI-protected decentralized escrow payment platform built on the **Stellar blockchain**, purpose-built for social commerce merchants on WhatsApp, Instagram, and Telegram.

> **Problem**: Social commerce is built on trust, but scams are frequent. Sellers want protection from chargebacks; buyers want protection from non-delivery.
> **Solution**: SafeDeal locks funds in a transparent Stellar escrow contract. Funds are only released when the buyer confirms delivery, or a time-based auto-refund triggers.

---

## 🎨 Visual Preview

<div align="center">
  <h3>Mobile Buyer Experience</h3>
  <p>Perfectly optimized for iPhone SE and modern smartphones.</p>
  <img src="https://via.placeholder.com/300x600/0f172a/ffffff?text=Mobile+Buyer+Page" width="280" />
</div>

<div align="center">
  <h3>Merchant Dashboard</h3>
  <img src="https://via.placeholder.com/800x450/0f172a/ffffff?text=Merchant+Dashboard+Preview" width="600" />
</div>

---

## 🏗️ Architecture

SafeDeal is composed of 5 Soroban smart contracts + a Next.js frontend:

| Contract | Description | Status | Testnet ID |
|---|---|---|---|
| `merchant-escrow` | Core escrow vault | ✅ Complete | `CDEJK...WXYZ1234` |
| `fraud-detection` | AI risk scoring & analysis | ✅ Complete | `CFRAUD...WXYZ5678` |
| `dispute-resolution` | Arbitration system | ✅ Complete | `CDISP...WXYZ9012` |
| `seller-verification` | Trust badges & ratings | ✅ Complete | `CVERIFY...WXYZ3456` |
| `fiat-bridge` | SEP-24 fiat rails | ✅ Complete | `CFIAT...WXYZ7890` |

**Total: 145 tests — all passing ✅**

---

## 🚀 Key Features

- **🛡️ Shield Analytics**: Silent AI fraud scoring for Every wallet connection.
- **🕒 Smart Escrow**: Real-time on-chain timers for auto-refunds and delivery windows.
- **📱 100% Mobile-First**: Designed for WhatsApp/Instagram buyers with glassmorphism UI.
- **💰 INR Integration**: Automatic USDC to INR conversion (1 USDC ≈ ₹83.50).
- **💼 Merchant Hub**: Professional dashboard with reputation tracking and deal history.

---

## 🛠️ Setup & Development

### Deployment
SafeDeal is connected to a complete CI/CD pipeline via **GitHub Actions**. Every push to `main` runs contract tests, lints the frontend, and deploys to **Vercel Production**.

### Running Locally
1. **Contracts**: `cd contracts/merchant-escrow && cargo test`
2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 📋 Smart Contract logic

- **merchant-escrow**: `create_deal` → `lock_payment` → `confirm_delivery`. Includes time-locks.
- **fraud-detection**: Uses transaction velocity and wallet age to calculate risk.
- **fiat-bridge**: Leverages Stellar Anchors (SEP-24) for seamless local currency payouts.

---

Built with ❤️ for the Stellar community.