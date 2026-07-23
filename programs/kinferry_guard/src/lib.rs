use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("HZiw1u9BoKkdhppnN22HJzXUQJDca2yMeDY8wqywSdEs");

const WINDOW_SECONDS: i64 = 30 * 24 * 60 * 60;

#[program]
pub mod kinferry_guard {
    use super::*;

    pub fn initialize_policy(ctx: Context<InitializePolicy>, per_transfer_cap: u64, rolling_cap: u64) -> Result<()> {
        require!(per_transfer_cap > 0 && rolling_cap >= per_transfer_cap, GuardError::InvalidPolicy);
        let policy = &mut ctx.accounts.policy;
        policy.owner = ctx.accounts.owner.key();
        policy.per_transfer_cap = per_transfer_cap;
        policy.rolling_cap = rolling_cap;
        policy.rolling_spent = 0;
        policy.window_started_at = Clock::get()?.unix_timestamp;
        policy.bump = ctx.bumps.policy;
        Ok(())
    }

    pub fn add_recipient(ctx: Context<AddRecipient>) -> Result<()> {
        let allowlist = &mut ctx.accounts.allowlist;
        allowlist.owner = ctx.accounts.owner.key();
        allowlist.recipient = ctx.accounts.recipient.key();
        allowlist.verified = true;
        allowlist.bump = ctx.bumps.allowlist;
        Ok(())
    }

    pub fn execute_transfer(ctx: Context<ExecuteTransfer>, lamports: u64) -> Result<()> {
        require!(ctx.accounts.allowlist.verified, GuardError::RecipientNotVerified);
        require_keys_eq!(ctx.accounts.allowlist.recipient, ctx.accounts.recipient.key(), GuardError::RecipientNotAllowlisted);
        let now = Clock::get()?.unix_timestamp;
        let policy = &mut ctx.accounts.policy;
        if now - policy.window_started_at >= WINDOW_SECONDS {
            policy.window_started_at = now;
            policy.rolling_spent = 0;
        }
        require!(lamports <= policy.per_transfer_cap, GuardError::PerTransferCapExceeded);
        let next_total = policy.rolling_spent.checked_add(lamports).ok_or(GuardError::MathOverflow)?;
        require!(next_total <= policy.rolling_cap, GuardError::RollingCapExceeded);
        policy.rolling_spent = next_total;
        transfer(CpiContext::new(ctx.accounts.system_program.to_account_info(), Transfer { from: ctx.accounts.owner.to_account_info(), to: ctx.accounts.recipient.to_account_info() }), lamports)?;
        emit!(TransferAuthorized { owner: ctx.accounts.owner.key(), recipient: ctx.accounts.recipient.key(), lamports, rolling_spent: next_total });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePolicy<'info> {
    #[account(init, payer=owner, space=8+Policy::INIT_SPACE, seeds=[b"policy", owner.key().as_ref()], bump)]
    pub policy: Account<'info, Policy>,
    #[account(mut)] pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddRecipient<'info> {
    #[account(seeds=[b"policy", owner.key().as_ref()], bump=policy.bump, has_one=owner)] pub policy: Account<'info, Policy>,
    #[account(init, payer=owner, space=8+RecipientAllowlist::INIT_SPACE, seeds=[b"recipient", owner.key().as_ref(), recipient.key().as_ref()], bump)]
    pub allowlist: Account<'info, RecipientAllowlist>,
    #[account(mut)] pub owner: Signer<'info>,
    /// CHECK: Stored as the recipient identity and validated by address.
    pub recipient: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteTransfer<'info> {
    #[account(mut, seeds=[b"policy", owner.key().as_ref()], bump=policy.bump, has_one=owner)] pub policy: Account<'info, Policy>,
    #[account(seeds=[b"recipient", owner.key().as_ref(), recipient.key().as_ref()], bump=allowlist.bump, has_one=owner)] pub allowlist: Account<'info, RecipientAllowlist>,
    #[account(mut)] pub owner: Signer<'info>,
    /// CHECK: Address is independently matched against the allowlist PDA.
    #[account(mut)] pub recipient: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Policy { pub owner: Pubkey, pub per_transfer_cap: u64, pub rolling_cap: u64, pub rolling_spent: u64, pub window_started_at: i64, pub bump: u8 }

#[account]
#[derive(InitSpace)]
pub struct RecipientAllowlist { pub owner: Pubkey, pub recipient: Pubkey, pub verified: bool, pub bump: u8 }

#[event]
pub struct TransferAuthorized { pub owner: Pubkey, pub recipient: Pubkey, pub lamports: u64, pub rolling_spent: u64 }

#[error_code]
pub enum GuardError {
    #[msg("The spending policy is invalid.")] InvalidPolicy,
    #[msg("The recipient has not completed verification.")] RecipientNotVerified,
    #[msg("The recipient is not on the owner's allowlist.")] RecipientNotAllowlisted,
    #[msg("The transfer exceeds the per-transfer cap.")] PerTransferCapExceeded,
    #[msg("The transfer exceeds the rolling cap.")] RollingCapExceeded,
    #[msg("Arithmetic overflow while updating spend.")] MathOverflow,
}
