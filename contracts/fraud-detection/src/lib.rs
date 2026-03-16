#![no_std]
extern crate alloc;

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, String, Vec,
};

// ──────────────────────────────────────────────
// Enums
// ──────────────────────────────────────────────

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum RiskLevel {
    Safe,      // 0-30
    Caution,   // 31-60
    HighRisk,  // 61-85
    Blocked,   // 86-100
}

// ──────────────────────────────────────────────
// Structs
// ──────────────────────────────────────────────

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct WalletData {
    pub account_age_days: u64,
    pub total_transactions: u32,
    pub successful_payments: u32,
    pub failed_payments: u32,
    pub dispute_count: u32,
    pub xlm_balance: i128,
    pub usdc_balance: i128,
    pub is_known_scammer: bool,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RiskFactor {
    pub name: String,
    pub points: u32,
    pub description: String,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RiskScore {
    pub score: u32,
    pub level: RiskLevel,
    pub factors: Vec<String>,
    pub recommendation: String,
    pub can_proceed: bool,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ScamReport {
    pub reporter: Address,
    pub scammer: Address,
    pub deal_id: String,
    pub timestamp: u64,
}

// ──────────────────────────────────────────────
// Storage keys
// ──────────────────────────────────────────────

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    RiskScore(Address),
    Blocked(Address),
    Whitelisted(Address),
    Reports(Address),
    ReportCount(Address),
}

// ──────────────────────────────────────────────
// Contract
// ──────────────────────────────────────────────

#[contract]
pub struct FraudDetectionContract;

#[contractimpl]
impl FraudDetectionContract {
    // ────────────── Initialization ──────────────

    /// Initialise the contract and set the admin address
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Contract already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    // ────────────── Core analysis ──────────────

    /// Analyse a wallet and persist the resulting risk score
    pub fn analyze_wallet(env: Env, wallet: Address, horizon_data: WalletData) -> RiskScore {
        // Check if wallet is permanently blocked
        if env.storage().instance().has(&DataKey::Blocked(wallet.clone())) {
            let factors = Vec::from_array(
                &env,
                [String::from_str(&env, "Wallet is permanently blocked")],
            );
            let rs = RiskScore {
                score: 100,
                level: RiskLevel::Blocked,
                factors,
                recommendation: String::from_str(&env, "Transaction denied"),
                can_proceed: false,
            };
            env.storage()
                .instance()
                .set(&DataKey::RiskScore(wallet), &rs);
            return rs;
        }

        // Check if whitelisted – give safe baseline
        let is_whitelisted = env
            .storage()
            .instance()
            .has(&DataKey::Whitelisted(wallet.clone()));

        // Calculate risk factors
        let risk_factors = Self::calculate_risk_factors(env.clone(), horizon_data);

        // Sum points
        let mut total: u32 = 0;
        let mut factor_names: Vec<String> = Vec::new(&env);
        for rf in risk_factors.iter() {
            total += rf.points;
            factor_names.push_back(rf.name.clone());
        }

        // Cap at 100
        if total > 100 {
            total = 100;
        }

        // Apply whitelist discount (halve score, min 0)
        if is_whitelisted && total > 0 {
            total /= 2;
        }

        // Determine level
        let level = if total <= 30 {
            RiskLevel::Safe
        } else if total <= 60 {
            RiskLevel::Caution
        } else if total <= 85 {
            RiskLevel::HighRisk
        } else {
            RiskLevel::Blocked
        };

        let recommendation = match level {
            RiskLevel::Safe => String::from_str(&env, "Transaction approved"),
            RiskLevel::Caution => {
                String::from_str(&env, "Proceed with caution - enhanced monitoring")
            }
            RiskLevel::HighRisk => {
                String::from_str(&env, "Manual review required before proceeding")
            }
            RiskLevel::Blocked => String::from_str(&env, "Transaction denied - blocked wallet"),
        };

        let can_proceed = total <= 85;

        let rs = RiskScore {
            score: total,
            level,
            factors: factor_names,
            recommendation,
            can_proceed,
        };

        // Cache the score
        env.storage()
            .instance()
            .set(&DataKey::RiskScore(wallet.clone()), &rs);

        env.events().publish(
            (symbol_short!("Fraud"), symbol_short!("analyzed")),
            wallet,
        );

        rs
    }

    /// Return individual risk factors with their point contributions
    pub fn calculate_risk_factors(env: Env, wallet_data: WalletData) -> Vec<RiskFactor> {
        let mut factors: Vec<RiskFactor> = Vec::new(&env);

        // ── Known scam list → instant block ──
        if wallet_data.is_known_scammer {
            factors.push_back(RiskFactor {
                name: String::from_str(&env, "known_scammer"),
                points: 100,
                description: String::from_str(&env, "Wallet is on the known scammer list"),
            });
            return factors; // no need to check further
        }

        // ── Wallet age ──
        if wallet_data.account_age_days < 7 {
            factors.push_back(RiskFactor {
                name: String::from_str(&env, "new_wallet"),
                points: 25,
                description: String::from_str(&env, "Wallet is less than 7 days old"),
            });
        } else if wallet_data.account_age_days < 30 {
            factors.push_back(RiskFactor {
                name: String::from_str(&env, "young_wallet"),
                points: 15,
                description: String::from_str(&env, "Wallet is less than 30 days old"),
            });
        } else if wallet_data.account_age_days < 90 {
            factors.push_back(RiskFactor {
                name: String::from_str(&env, "moderate_wallet"),
                points: 5,
                description: String::from_str(&env, "Wallet is less than 90 days old"),
            });
        }

        // ── Transaction count ──
        if wallet_data.total_transactions == 0 {
            factors.push_back(RiskFactor {
                name: String::from_str(&env, "no_transactions"),
                points: 20,
                description: String::from_str(&env, "Wallet has zero transaction history"),
            });
        } else if wallet_data.total_transactions < 5 {
            factors.push_back(RiskFactor {
                name: String::from_str(&env, "low_transactions"),
                points: 10,
                description: String::from_str(&env, "Wallet has very few transactions"),
            });
        }

        // ── Previous disputes ──
        if wallet_data.dispute_count > 0 {
            let dispute_points = wallet_data.dispute_count * 15;
            let desc_str = alloc::format!(
                "{} previous disputes detected (+{} points)",
                wallet_data.dispute_count, dispute_points
            );
            factors.push_back(RiskFactor {
                name: String::from_str(&env, "disputes"),
                points: dispute_points,
                description: String::from_str(&env, &desc_str),
            });
        }

        // ── Failed payments history ──
        if wallet_data.failed_payments > 0 {
            let fail_points = wallet_data.failed_payments * 5;
            let desc_str = alloc::format!(
                "{} failed payments in history (+{} points)",
                wallet_data.failed_payments, fail_points
            );
            factors.push_back(RiskFactor {
                name: String::from_str(&env, "failed_payments"),
                points: fail_points,
                description: String::from_str(&env, &desc_str),
            });
        }

        // ── Transaction velocity (too many txns relative to age) ──
        if wallet_data.account_age_days > 0 && wallet_data.total_transactions > 0 {
            let txns_per_day =
                wallet_data.total_transactions as u64 / wallet_data.account_age_days;
            if txns_per_day > 50 {
                factors.push_back(RiskFactor {
                    name: String::from_str(&env, "high_velocity"),
                    points: 20,
                    description: String::from_str(
                        &env,
                        "Unusually high transaction velocity detected",
                    ),
                });
            }
        }

        // ── Zero balance history ──
        if wallet_data.xlm_balance <= 0 && wallet_data.usdc_balance <= 0 {
            factors.push_back(RiskFactor {
                name: String::from_str(&env, "zero_balance"),
                points: 15,
                description: String::from_str(
                    &env,
                    "Wallet holds zero balance – suspicious pattern",
                ),
            });
        }

        factors
    }

    // ────────────── Blocklist management ──────────────

    /// Permanently block a wallet – admin only
    pub fn block_wallet(env: Env, wallet: Address, reason: String) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic!("Contract not initialized"));
        admin.require_auth();

        env.storage()
            .instance()
            .set(&DataKey::Blocked(wallet.clone()), &reason);

        // Also update cached risk score to Blocked
        let factors = Vec::from_array(
            &env,
            [String::from_str(&env, "Permanently blocked by admin")],
        );
        let rs = RiskScore {
            score: 100,
            level: RiskLevel::Blocked,
            factors,
            recommendation: String::from_str(&env, "Transaction denied"),
            can_proceed: false,
        };
        env.storage()
            .instance()
            .set(&DataKey::RiskScore(wallet.clone()), &rs);

        env.events().publish(
            (symbol_short!("Fraud"), symbol_short!("blocked")),
            wallet,
        );
    }

    // ────────────── Score retrieval ──────────────

    /// Return the cached risk score or None
    pub fn get_risk_score(env: Env, wallet: Address) -> Option<RiskScore> {
        env.storage()
            .instance()
            .get(&DataKey::RiskScore(wallet))
    }

    // ────────────── Scam reporting ──────────────

    /// Report a scammer. Auto-flag at 3 reports, auto-block at 5.
    pub fn report_scammer(env: Env, reporter: Address, scammer: Address, deal_id: String) {
        reporter.require_auth();

        if reporter == scammer {
            panic!("Cannot report yourself");
        }

        let report = ScamReport {
            reporter: reporter.clone(),
            scammer: scammer.clone(),
            deal_id,
            timestamp: env.ledger().timestamp(),
        };

        // Persist report list
        let mut reports: Vec<ScamReport> = env
            .storage()
            .instance()
            .get(&DataKey::Reports(scammer.clone()))
            .unwrap_or(Vec::new(&env));
        reports.push_back(report);
        env.storage()
            .instance()
            .set(&DataKey::Reports(scammer.clone()), &reports);

        // Increment report counter
        let count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::ReportCount(scammer.clone()))
            .unwrap_or(0);
        let new_count = count + 1;
        env.storage()
            .instance()
            .set(&DataKey::ReportCount(scammer.clone()), &new_count);

        // Auto-block at 5
        if new_count >= 5 {
            env.storage().instance().set(
                &DataKey::Blocked(scammer.clone()),
                &String::from_str(&env, "Auto-blocked: 5+ scam reports"),
            );
            let factors = Vec::from_array(
                &env,
                [String::from_str(&env, "Auto-blocked after 5 scam reports")],
            );
            let rs = RiskScore {
                score: 100,
                level: RiskLevel::Blocked,
                factors,
                recommendation: String::from_str(&env, "Transaction denied"),
                can_proceed: false,
            };
            env.storage()
                .instance()
                .set(&DataKey::RiskScore(scammer.clone()), &rs);

            env.events().publish(
                (symbol_short!("Fraud"), symbol_short!("autoblock")),
                scammer,
            );
        } else if new_count >= 3 {
            // Auto-flag at 3 – set a high-risk score
            let factors = Vec::from_array(
                &env,
                [String::from_str(&env, "Auto-flagged after 3 scam reports")],
            );
            let rs = RiskScore {
                score: 75,
                level: RiskLevel::HighRisk,
                factors,
                recommendation: String::from_str(&env, "Manual review required"),
                can_proceed: true,
            };
            env.storage()
                .instance()
                .set(&DataKey::RiskScore(scammer.clone()), &rs);

            env.events().publish(
                (symbol_short!("Fraud"), symbol_short!("flagged")),
                scammer,
            );
        } else {
            env.events().publish(
                (symbol_short!("Fraud"), symbol_short!("reported")),
                scammer,
            );
        }
    }

    // ────────────── Whitelist management ──────────────

    /// Whitelist a wallet (admin only) — reduces risk automatically
    pub fn whitelist_wallet(env: Env, wallet: Address) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic!("Contract not initialized"));
        admin.require_auth();

        env.storage()
            .instance()
            .set(&DataKey::Whitelisted(wallet.clone()), &true);

        env.events().publish(
            (symbol_short!("Fraud"), symbol_short!("whitelist")),
            wallet,
        );
    }

    /// Check if a wallet is whitelisted
    pub fn is_whitelisted(env: Env, wallet: Address) -> bool {
        env.storage()
            .instance()
            .has(&DataKey::Whitelisted(wallet))
    }

    /// Check if a wallet is blocked
    pub fn is_blocked(env: Env, wallet: Address) -> bool {
        env.storage()
            .instance()
            .has(&DataKey::Blocked(wallet))
    }

    /// Get the report count for a wallet
    pub fn get_report_count(env: Env, wallet: Address) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::ReportCount(wallet))
            .unwrap_or(0)
    }
}

mod test;
