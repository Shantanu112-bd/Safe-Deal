#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

fn setup_env() -> Env {
    let env = Env::default();
    env.mock_all_auths();
    env
}

fn safe_wallet_data(env: &Env) -> WalletData {
    WalletData {
        account_age_days: 365,
        total_transactions: 200,
        successful_payments: 190,
        failed_payments: 0,
        dispute_count: 0,
        xlm_balance: 10_000_000_000,
        usdc_balance: 5_000_000_000,
        is_known_scammer: false,
    }
}

fn risky_wallet_data(env: &Env) -> WalletData {
    WalletData {
        account_age_days: 3,
        total_transactions: 1,
        successful_payments: 0,
        failed_payments: 1,
        dispute_count: 2,
        xlm_balance: 0,
        usdc_balance: 0,
        is_known_scammer: false,
    }
}

fn scammer_wallet_data(env: &Env) -> WalletData {
    WalletData {
        account_age_days: 10,
        total_transactions: 5,
        successful_payments: 0,
        failed_payments: 5,
        dispute_count: 0,
        xlm_balance: 100,
        usdc_balance: 0,
        is_known_scammer: true,
    }
}

fn init_contract(env: &Env) -> (FraudDetectionContractClient, Address) {
    let contract_id = env.register_contract(None, FraudDetectionContract);
    let client = FraudDetectionContractClient::new(env, &contract_id);
    let admin = Address::generate(env);
    client.initialize(&admin);
    (client, admin)
}

// ============================================================
// initialize tests
// ============================================================

#[test]
fn test_initialize() {
    let env = setup_env();
    let (client, _admin) = init_contract(&env);
    // Should not panic — initialised successfully
    let _ = client;
}

#[test]
#[should_panic(expected = "Contract already initialized")]
fn test_initialize_twice() {
    let env = setup_env();
    let (client, _admin) = init_contract(&env);
    let another_admin = Address::generate(&env);
    client.initialize(&another_admin);
}

// ============================================================
// analyze_wallet tests
// ============================================================

#[test]
fn test_analyze_safe_wallet() {
    let env = setup_env();
    let (client, _admin) = init_contract(&env);
    let wallet = Address::generate(&env);
    let data = safe_wallet_data(&env);

    let rs = client.analyze_wallet(&wallet, &data);
    assert_eq!(rs.level, RiskLevel::Safe);
    assert!(rs.can_proceed);
    assert!(rs.score <= 30);
}

#[test]
fn test_analyze_risky_wallet() {
    let env = setup_env();
    let (client, _admin) = init_contract(&env);
    let wallet = Address::generate(&env);
    let data = risky_wallet_data(&env);

    let rs = client.analyze_wallet(&wallet, &data);
    // new wallet (25) + low txns (10) + disputes 2*15 (30) + failed 1*5 (5) + zero balance (15) = 85
    assert!(rs.score > 30);
    assert!(!rs.factors.is_empty());
}

#[test]
fn test_analyze_known_scammer() {
    let env = setup_env();
    let (client, _admin) = init_contract(&env);
    let wallet = Address::generate(&env);
    let data = scammer_wallet_data(&env);

    let rs = client.analyze_wallet(&wallet, &data);
    assert_eq!(rs.score, 100);
    assert_eq!(rs.level, RiskLevel::Blocked);
    assert!(!rs.can_proceed);
}

#[test]
fn test_analyze_blocked_wallet() {
    let env = setup_env();
    let (client, admin) = init_contract(&env);
    let wallet = Address::generate(&env);

    client.block_wallet(&wallet, &String::from_str(&env, "Fraud"));

    // Now analyzing should return blocked immediately
    let data = safe_wallet_data(&env);
    let rs = client.analyze_wallet(&wallet, &data);
    assert_eq!(rs.score, 100);
    assert_eq!(rs.level, RiskLevel::Blocked);
    assert!(!rs.can_proceed);
}

#[test]
fn test_analyze_whitelisted_wallet_reduces_risk() {
    let env = setup_env();
    let (client, admin) = init_contract(&env);
    let wallet = Address::generate(&env);

    client.whitelist_wallet(&wallet);

    // A somewhat risky wallet should get its score halved
    let data = WalletData {
        account_age_days: 5,
        total_transactions: 3,
        successful_payments: 2,
        failed_payments: 1,
        dispute_count: 1,
        xlm_balance: 1000,
        usdc_balance: 500,
        is_known_scammer: false,
    };

    let rs = client.analyze_wallet(&wallet, &data);
    // Without whitelist: new_wallet(25) + low_txns(10) + disputes(15) + failed(5) = 55 → Caution
    // With whitelist: 55 / 2 = 27 → Safe
    assert!(rs.score <= 30);
    assert_eq!(rs.level, RiskLevel::Safe);
}

// ============================================================
// calculate_risk_factors tests
// ============================================================

#[test]
fn test_risk_factors_safe_wallet() {
    let env = setup_env();
    let (client, _admin) = init_contract(&env);
    let data = safe_wallet_data(&env);

    let factors = client.calculate_risk_factors(&data);
    assert_eq!(factors.len(), 0);
}

#[test]
fn test_risk_factors_new_wallet() {
    let env = setup_env();
    let (client, _admin) = init_contract(&env);
    let data = WalletData {
        account_age_days: 3,
        total_transactions: 50,
        successful_payments: 50,
        failed_payments: 0,
        dispute_count: 0,
        xlm_balance: 1000,
        usdc_balance: 1000,
        is_known_scammer: false,
    };

    let factors = client.calculate_risk_factors(&data);
    // Should flag: new_wallet (25), high_velocity (50/3 = 16 per day, not > 50 so no velocity)
    assert!(factors.len() >= 1);
}

#[test]
fn test_risk_factors_known_scammer_short_circuits() {
    let env = setup_env();
    let (client, _admin) = init_contract(&env);
    let data = scammer_wallet_data(&env);

    let factors = client.calculate_risk_factors(&data);
    // Only one factor: known_scammer with 100 points
    assert_eq!(factors.len(), 1);
    assert_eq!(factors.get(0).unwrap().points, 100);
}

#[test]
fn test_risk_factors_high_velocity() {
    let env = setup_env();
    let (client, _admin) = init_contract(&env);
    let data = WalletData {
        account_age_days: 2,
        total_transactions: 200,
        successful_payments: 180,
        failed_payments: 20,
        dispute_count: 0,
        xlm_balance: 1000,
        usdc_balance: 1000,
        is_known_scammer: false,
    };

    let factors = client.calculate_risk_factors(&data);
    let has_velocity = factors.iter().any(|f| f.name == String::from_str(&env, "high_velocity"));
    assert!(has_velocity);
}

// ============================================================
// block_wallet tests
// ============================================================

#[test]
fn test_block_wallet() {
    let env = setup_env();
    let (client, admin) = init_contract(&env);
    let wallet = Address::generate(&env);

    client.block_wallet(&wallet, &String::from_str(&env, "Fraud detected"));

    assert!(client.is_blocked(&wallet));
    let rs = client.get_risk_score(&wallet);
    assert!(rs.is_some());
    assert_eq!(rs.unwrap().score, 100);
}

// ============================================================
// get_risk_score tests
// ============================================================

#[test]
fn test_get_risk_score_none() {
    let env = setup_env();
    let (client, _admin) = init_contract(&env);
    let wallet = Address::generate(&env);

    let rs = client.get_risk_score(&wallet);
    assert!(rs.is_none());
}

#[test]
fn test_get_risk_score_after_analysis() {
    let env = setup_env();
    let (client, _admin) = init_contract(&env);
    let wallet = Address::generate(&env);
    let data = safe_wallet_data(&env);

    client.analyze_wallet(&wallet, &data);

    let rs = client.get_risk_score(&wallet);
    assert!(rs.is_some());
    assert_eq!(rs.unwrap().level, RiskLevel::Safe);
}

// ============================================================
// report_scammer tests
// ============================================================

#[test]
fn test_report_scammer_single() {
    let env = setup_env();
    let (client, _admin) = init_contract(&env);
    let reporter = Address::generate(&env);
    let scammer = Address::generate(&env);
    let deal_id = String::from_str(&env, "DEAL-1");

    client.report_scammer(&reporter, &scammer, &deal_id);

    assert_eq!(client.get_report_count(&scammer), 1);
    assert!(!client.is_blocked(&scammer));
}

#[test]
fn test_report_scammer_auto_flag_at_3() {
    let env = setup_env();
    let (client, _admin) = init_contract(&env);
    let scammer = Address::generate(&env);

    for i in 0..3 {
        let reporter = Address::generate(&env);
        let deal_id_str = alloc::format!("DEAL-{}", i);
        let deal_id = String::from_str(&env, &deal_id_str);
        client.report_scammer(&reporter, &scammer, &deal_id);
    }

    assert_eq!(client.get_report_count(&scammer), 3);
    let rs = client.get_risk_score(&scammer);
    assert!(rs.is_some());
    assert_eq!(rs.clone().unwrap().level, RiskLevel::HighRisk);
    assert!(!client.is_blocked(&scammer)); // flagged, not blocked
}

#[test]
fn test_report_scammer_auto_block_at_5() {
    let env = setup_env();
    let (client, _admin) = init_contract(&env);
    let scammer = Address::generate(&env);

    for i in 0..5 {
        let reporter = Address::generate(&env);
        let deal_id_str = alloc::format!("DEAL-{}", i);
        let deal_id = String::from_str(&env, &deal_id_str);
        client.report_scammer(&reporter, &scammer, &deal_id);
    }

    assert_eq!(client.get_report_count(&scammer), 5);
    assert!(client.is_blocked(&scammer));
    let rs = client.get_risk_score(&scammer);
    assert!(rs.is_some());
    assert_eq!(rs.clone().unwrap().level, RiskLevel::Blocked);
    assert!(!rs.unwrap().can_proceed);
}

#[test]
#[should_panic(expected = "Cannot report yourself")]
fn test_report_self() {
    let env = setup_env();
    let (client, _admin) = init_contract(&env);
    let wallet = Address::generate(&env);
    let deal_id = String::from_str(&env, "DEAL-1");

    client.report_scammer(&wallet, &wallet, &deal_id);
}

// ============================================================
// whitelist_wallet tests
// ============================================================

#[test]
fn test_whitelist_wallet() {
    let env = setup_env();
    let (client, admin) = init_contract(&env);
    let wallet = Address::generate(&env);

    assert!(!client.is_whitelisted(&wallet));
    client.whitelist_wallet(&wallet);
    assert!(client.is_whitelisted(&wallet));
}

// ============================================================
// Edge case / integration tests
// ============================================================

#[test]
fn test_zero_balance_adds_risk() {
    let env = setup_env();
    let (client, _admin) = init_contract(&env);
    let wallet = Address::generate(&env);
    let data = WalletData {
        account_age_days: 365,
        total_transactions: 200,
        successful_payments: 200,
        failed_payments: 0,
        dispute_count: 0,
        xlm_balance: 0,
        usdc_balance: 0,
        is_known_scammer: false,
    };

    let rs = client.analyze_wallet(&wallet, &data);
    // Only zero balance factor → 15 points → Safe
    assert_eq!(rs.score, 15);
    assert_eq!(rs.level, RiskLevel::Safe);
}

#[test]
fn test_score_capped_at_100() {
    let env = setup_env();
    let (client, _admin) = init_contract(&env);
    let wallet = Address::generate(&env);
    let data = WalletData {
        account_age_days: 3,
        total_transactions: 0,
        successful_payments: 0,
        failed_payments: 10,
        dispute_count: 5,
        xlm_balance: 0,
        usdc_balance: 0,
        is_known_scammer: false,
    };

    let rs = client.analyze_wallet(&wallet, &data);
    // new_wallet(25) + no_txns(20) + disputes 5*15(75) + failed 10*5(50) + zero_balance(15) = 185 → capped at 100
    assert_eq!(rs.score, 100);
    assert_eq!(rs.level, RiskLevel::Blocked);
    assert!(!rs.can_proceed);
}
