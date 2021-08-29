use anchor_lang::prelude::*;
use anchor_spl::token::{self, SetAuthority, TokenAccount, Transfer};
use spl_token::instruction::AuthorityType;

#[program]
pub mod share_ride_escrow {
    use super::*;

    pub fn initialize_escrow(
        ctx: Context<InitializeEscrow>,
        passenger_amount: u64
    ) -> ProgramResult {
        ctx.accounts.escrow_account.passenger_key = *ctx.accounts.passenger.key;
        ctx.accounts
            .escrow_account
            .passenger_deposit_token_account = *ctx
            .accounts
            .passenger_deposit_token_account
            .to_account_info()
            .key;
        ctx.accounts.escrow_account.passenger_amount = passenger_amount;
        ctx.accounts.escrow_account.driver_key = *ctx.accounts.driver.key;

        let (pda, _bump_seed) = Pubkey::find_program_address(&[b"escrow"], ctx.program_id);
        token::set_authority(ctx.accounts.into(), AuthorityType::AccountOwner, Some(pda))?;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(passenger_amount: u64)]
pub struct InitializeEscrow<'info> {
    #[account(signer)]
    pub passenger: AccountInfo<'info>,
    pub driver: AccountInfo<'info>,
    #[account(
        mut,
        constraint = passenger_deposit_token_account.amount >= passenger_amount
    )]
    pub passenger_deposit_token_account: CpiAccount<'info, TokenAccount>,
    #[account(init)]
    pub escrow_account: ProgramAccount<'info, EscrowAccount>,
    pub token_program: AccountInfo<'info>,
}


#[account]
pub struct EscrowAccount {
    pub passenger_key: Pubkey,
    pub passenger_deposit_token_account: Pubkey,
    pub passenger_amount: u64,
    pub driver_key: Pubkey,
}

impl<'info> From<&mut InitializeEscrow<'info>>
    for CpiContext<'_, '_, '_, 'info, SetAuthority<'info>>
{
    fn from(accounts: &mut InitializeEscrow<'info>) -> Self {
        let cpi_accounts = SetAuthority {
            account_or_mint: accounts
                .passenger_deposit_token_account
                .to_account_info()
                .clone(),
            current_authority: accounts.passenger.clone(),
        };
        let cpi_program = accounts.token_program.clone();
        CpiContext::new(cpi_program, cpi_accounts)
    }
}