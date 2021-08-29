// #region code
use anchor_lang::prelude::*;
use borsh::{BorshDeserialize, BorshSerialize};

#[program]
pub mod share_ride {
    use super::*;

    #[state]
    pub struct ShareRideState {
        pub authority: Pubkey,
        pub drivers: Vec<Driver>,
        pub index: i32,
    }

    impl ShareRideState {
        pub const DRIVER_SIZE: usize = 10;
        pub fn new(ctx: Context<Auth>) -> Result<Self> {
            let mut drivers = vec![];
            drivers.resize(Self::DRIVER_SIZE, Driver { address: String::from("123456789"), location: String::from("123456789"), seat: String::from("123456789")});
            Ok(Self {
                authority: *ctx.accounts.authority.key,
                drivers,
                index: 0,
            })
        }

        pub fn add_driver(&mut self, ctx: Context<Auth>, driver: Driver) -> Result<()> {
            if &self.authority != ctx.accounts.authority.key {
                return Err(ErrorCode::Unauthorized.into());
            }
            msg!("New Driver {:?}", driver);
            msg!("Existing Drivers {:?}", self.drivers);
            let num_usize: usize = self.index as usize;
            msg!("U Size {:?}", num_usize);
            self.drivers[num_usize] = driver;
            self.index += 1;
            Ok(())
        }
    }
}

#[derive(Accounts)]
pub struct Auth<'info> {
    #[account(signer)]
    authority: AccountInfo<'info>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Default, Clone, Debug)]
pub struct Driver {
    address: String,
    location: String,
    seat: String,
}

#[error]
pub enum ErrorCode {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
}