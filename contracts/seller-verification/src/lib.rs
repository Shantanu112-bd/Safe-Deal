#![no_std]
#[cfg(test)]
extern crate alloc;

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String, Vec};

// ──────────────────────────────────────────────
// Enums
// ──────────────────────────────────────────────

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum VerificationStatus {
    Unverified,
    Pending,
    Verified,
    Rejected,
    Suspended,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum TrustBadge {
    NewSeller,       // < 5 completed deals
    RisingStar,      // 5-19 completed deals
    TrustedSeller,   // 20-49 completed deals
    TopSeller,       // 50-99 completed deals
    EliteSeller,     // 100+ completed deals
}

// ──────────────────────────────────────────────
// Structs
// ──────────────────────────────────────────────

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SellerProfile {
    pub seller: Address,
    pub business_name: String,
    pub business_type: String,
    pub platform: String,           // WhatsApp, Instagram, Telegram
    pub status: VerificationStatus,
    pub badge: TrustBadge,
    pub completed_deals: u32,
    pub total_volume: i128,
    pub avg_rating: u32,            // 0-500 (0.0 to 5.0 scaled by 100)
    pub total_ratings: u32,
    pub disputes_won: u32,
    pub disputes_lost: u32,
    pub registered_at: u64,
    pub verified_at: Option<u64>,
    pub metadata_uri: Option<String>,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Review {
    pub reviewer: Address,
    pub seller: Address,
    pub deal_id: String,
    pub rating: u32,       // 100-500 (1.0-5.0)
    pub comment: String,
    pub timestamp: u64,
}

// ──────────────────────────────────────────────
// Storage keys
// ──────────────────────────────────────────────

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Profile(Address),       // seller  → SellerProfile
    Reviews(Address),       // seller  → Vec<Review>
    DealReviewed(String),   // deal_id → bool (prevent duplicate reviews)
    AllSellers,             // Vec<Address>
}

// ──────────────────────────────────────────────
// Contract
// ──────────────────────────────────────────────

#[contract]
pub struct SellerVerificationContract;

#[contractimpl]
impl SellerVerificationContract {
    // ────────────── Initialization ──────────────

    /// Initialize the contract
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Contract already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        let sellers: Vec<Address> = Vec::new(&env);
        env.storage().instance().set(&DataKey::AllSellers, &sellers);
    }

    // ────────────── Seller registration ──────────────

    /// Register a new seller profile
    pub fn register_seller(
        env: Env,
        seller: Address,
        business_name: String,
        business_type: String,
        platform: String,
    ) {
        seller.require_auth();

        if env.storage().instance().has(&DataKey::Profile(seller.clone())) {
            panic!("Seller already registered");
        }

        let profile = SellerProfile {
            seller: seller.clone(),
            business_name,
            business_type,
            platform,
            status: VerificationStatus::Pending,
            badge: TrustBadge::NewSeller,
            completed_deals: 0,
            total_volume: 0,
            avg_rating: 0,
            total_ratings: 0,
            disputes_won: 0,
            disputes_lost: 0,
            registered_at: env.ledger().timestamp(),
            verified_at: None,
            metadata_uri: None,
        };

        env.storage()
            .instance()
            .set(&DataKey::Profile(seller.clone()), &profile);

        // Initialize empty reviews
        let reviews: Vec<Review> = Vec::new(&env);
        env.storage()
            .instance()
            .set(&DataKey::Reviews(seller.clone()), &reviews);

        // Add to all-sellers index
        let mut sellers: Vec<Address> = env
            .storage()
            .instance()
            .get(&DataKey::AllSellers)
            .unwrap_or(Vec::new(&env));
        sellers.push_back(seller.clone());
        env.storage()
            .instance()
            .set(&DataKey::AllSellers, &sellers);

        env.events().publish(
            (symbol_short!("Seller"), symbol_short!("register")),
            seller,
        );
    }

    // ────────────── Verification ──────────────

    /// Admin verifies a seller
    pub fn verify_seller(env: Env, seller: Address) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic!("Contract not initialized"));
        admin.require_auth();

        let mut profile: SellerProfile = env
            .storage()
            .instance()
            .get(&DataKey::Profile(seller.clone()))
            .unwrap_or_else(|| panic!("Seller not found"));

        if profile.status == VerificationStatus::Verified {
            panic!("Seller already verified");
        }

        profile.status = VerificationStatus::Verified;
        profile.verified_at = Some(env.ledger().timestamp());

        env.storage()
            .instance()
            .set(&DataKey::Profile(seller.clone()), &profile);

        env.events().publish(
            (symbol_short!("Seller"), symbol_short!("verified")),
            seller,
        );
    }

    /// Admin rejects a seller verification
    pub fn reject_seller(env: Env, seller: Address) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic!("Contract not initialized"));
        admin.require_auth();

        let mut profile: SellerProfile = env
            .storage()
            .instance()
            .get(&DataKey::Profile(seller.clone()))
            .unwrap_or_else(|| panic!("Seller not found"));

        profile.status = VerificationStatus::Rejected;

        env.storage()
            .instance()
            .set(&DataKey::Profile(seller.clone()), &profile);

        env.events().publish(
            (symbol_short!("Seller"), symbol_short!("rejected")),
            seller,
        );
    }

    /// Admin suspends a seller
    pub fn suspend_seller(env: Env, seller: Address) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic!("Contract not initialized"));
        admin.require_auth();

        let mut profile: SellerProfile = env
            .storage()
            .instance()
            .get(&DataKey::Profile(seller.clone()))
            .unwrap_or_else(|| panic!("Seller not found"));

        profile.status = VerificationStatus::Suspended;

        env.storage()
            .instance()
            .set(&DataKey::Profile(seller.clone()), &profile);

        env.events().publish(
            (symbol_short!("Seller"), symbol_short!("suspend")),
            seller,
        );
    }

    // ────────────── Deal tracking ──────────────

    /// Record a completed deal for a seller (updates stats + badge)
    pub fn record_completed_deal(env: Env, seller: Address, deal_amount: i128) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic!("Contract not initialized"));
        admin.require_auth();

        let mut profile: SellerProfile = env
            .storage()
            .instance()
            .get(&DataKey::Profile(seller.clone()))
            .unwrap_or_else(|| panic!("Seller not found"));

        profile.completed_deals += 1;
        profile.total_volume += deal_amount;

        // Update badge based on completed deals
        profile.badge = Self::calculate_badge(profile.completed_deals);

        env.storage()
            .instance()
            .set(&DataKey::Profile(seller.clone()), &profile);

        env.events().publish(
            (symbol_short!("Seller"), symbol_short!("deal")),
            seller,
        );
    }

    /// Record dispute outcome for a seller
    pub fn record_dispute_result(env: Env, seller: Address, seller_won: bool) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic!("Contract not initialized"));
        admin.require_auth();

        let mut profile: SellerProfile = env
            .storage()
            .instance()
            .get(&DataKey::Profile(seller.clone()))
            .unwrap_or_else(|| panic!("Seller not found"));

        if seller_won {
            profile.disputes_won += 1;
        } else {
            profile.disputes_lost += 1;
        }

        env.storage()
            .instance()
            .set(&DataKey::Profile(seller.clone()), &profile);
    }

    // ────────────── Reviews ──────────────

    /// Submit a review for a seller (buyer only, once per deal)
    pub fn submit_review(
        env: Env,
        reviewer: Address,
        seller: Address,
        deal_id: String,
        rating: u32,
        comment: String,
    ) {
        reviewer.require_auth();

        if reviewer == seller {
            panic!("Cannot review yourself");
        }
        if rating < 100 || rating > 500 {
            panic!("Rating must be between 100 and 500");
        }

        // Prevent duplicate reviews per deal
        if env.storage().instance().has(&DataKey::DealReviewed(deal_id.clone())) {
            panic!("Deal already reviewed");
        }

        // Ensure seller exists
        let mut profile: SellerProfile = env
            .storage()
            .instance()
            .get(&DataKey::Profile(seller.clone()))
            .unwrap_or_else(|| panic!("Seller not found"));

        let review = Review {
            reviewer: reviewer.clone(),
            seller: seller.clone(),
            deal_id: deal_id.clone(),
            rating,
            comment,
            timestamp: env.ledger().timestamp(),
        };

        // Store review
        let mut reviews: Vec<Review> = env
            .storage()
            .instance()
            .get(&DataKey::Reviews(seller.clone()))
            .unwrap_or(Vec::new(&env));
        reviews.push_back(review);
        env.storage()
            .instance()
            .set(&DataKey::Reviews(seller.clone()), &reviews);

        // Mark deal as reviewed
        env.storage()
            .instance()
            .set(&DataKey::DealReviewed(deal_id), &true);

        // Recalculate average rating
        // avg = ((old_avg * old_count) + new_rating) / new_count
        let old_total_score = profile.avg_rating as u64 * profile.total_ratings as u64;
        profile.total_ratings += 1;
        let new_avg = (old_total_score + rating as u64) / profile.total_ratings as u64;
        profile.avg_rating = new_avg as u32;

        env.storage()
            .instance()
            .set(&DataKey::Profile(seller.clone()), &profile);

        env.events().publish(
            (symbol_short!("Seller"), symbol_short!("review")),
            seller,
        );
    }

    // ────────────── Queries ──────────────

    /// Get seller profile
    pub fn get_profile(env: Env, seller: Address) -> SellerProfile {
        env.storage()
            .instance()
            .get(&DataKey::Profile(seller))
            .unwrap_or_else(|| panic!("Seller not found"))
    }

    /// Check if seller is verified
    pub fn is_verified(env: Env, seller: Address) -> bool {
        match env.storage().instance().get::<_, SellerProfile>(&DataKey::Profile(seller)) {
            Some(profile) => profile.status == VerificationStatus::Verified,
            None => false,
        }
    }

    /// Get seller's trust badge
    pub fn get_badge(env: Env, seller: Address) -> TrustBadge {
        let profile: SellerProfile = env
            .storage()
            .instance()
            .get(&DataKey::Profile(seller))
            .unwrap_or_else(|| panic!("Seller not found"));
        profile.badge
    }

    /// Get all reviews for a seller
    pub fn get_reviews(env: Env, seller: Address) -> Vec<Review> {
        env.storage()
            .instance()
            .get(&DataKey::Reviews(seller))
            .unwrap_or(Vec::new(&env))
    }

    /// Get all registered sellers
    pub fn get_all_sellers(env: Env) -> Vec<Address> {
        env.storage()
            .instance()
            .get(&DataKey::AllSellers)
            .unwrap_or(Vec::new(&env))
    }

    /// Update seller metadata URI (seller only)
    pub fn update_metadata(env: Env, seller: Address, uri: String) {
        seller.require_auth();

        let mut profile: SellerProfile = env
            .storage()
            .instance()
            .get(&DataKey::Profile(seller.clone()))
            .unwrap_or_else(|| panic!("Seller not found"));

        profile.metadata_uri = Some(uri);

        env.storage()
            .instance()
            .set(&DataKey::Profile(seller), &profile);
    }

    // ────────────── Helpers ──────────────

    /// Calculate badge based on completed deals
    fn calculate_badge(completed_deals: u32) -> TrustBadge {
        if completed_deals >= 100 {
            TrustBadge::EliteSeller
        } else if completed_deals >= 50 {
            TrustBadge::TopSeller
        } else if completed_deals >= 20 {
            TrustBadge::TrustedSeller
        } else if completed_deals >= 5 {
            TrustBadge::RisingStar
        } else {
            TrustBadge::NewSeller
        }
    }
}

mod test;
