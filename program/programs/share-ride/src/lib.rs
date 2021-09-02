// #region code
use anchor_lang::prelude::*;
use borsh::{BorshDeserialize, BorshSerialize};

#[program]
pub mod share_ride {
    use super::*;

    #[state]
    pub struct ShareRideState {
        pub authority: Pubkey,
        pub drivers: Vec<Archive>,
        pub rides: Vec<Archive>,
        pub index_drivers: i32,
        pub index_rides: i32,
    }

    impl ShareRideState {
        pub const DRIVER_SIZE: usize = 10;
        pub fn new(ctx: Context<Auth>) -> Result<Self> {
            let mut drivers = vec![];
            drivers.resize(Self::DRIVER_SIZE, Archive { 
                archive: String::from("___________________________________________"), 
            });
            let mut rides = vec![];
            rides.resize(Self::DRIVER_SIZE, Archive { 
                archive: String::from("___________________________________________"), 
            });
            Ok(Self {
                authority: *ctx.accounts.authority.key,
                drivers,
                rides,
                index_drivers: 0,
                index_rides: 0,
            })
        }

        pub fn add_driver(&mut self, _ctx: Context<Auth>, driver: Archive) -> Result<()> {
            msg!("New Driver {:?}", driver);
            msg!("Existing Drivers {:?}", self.drivers);
            let num_usize: usize = self.index_drivers as usize;
            msg!("U Size {:?}", num_usize);
            self.drivers[num_usize] = driver;
            self.index_drivers += 1;
            if self.index_drivers > 9 {
                self.index_drivers = 0;
            }
            Ok(())
        }


        pub fn add_ride(&mut self, _ctx: Context<Auth>, driver: Archive) -> Result<()> {
            msg!("New Driver {:?}", driver);
            msg!("Existing Rides {:?}", self.rides);
            let num_usize: usize = self.index_rides as usize;
            msg!("U Size {:?}", num_usize);
            self.rides[num_usize] = driver;
            self.index_rides += 1;
            if self.index_rides > 9 {
                self.index_rides = 0;
            }
            Ok(())
        }

        pub fn remove_ride(&mut self, _ctx: Context<Auth>, archive: Archive) -> Result<()> {
            let dummy = Archive { 
                archive: String::from("___________________________________________"), 
            };
            msg!("Dummy {:?}", dummy);
            for i in 0..10 {
                let num_usize: usize = i as usize;
                if self.rides[num_usize].archive == archive.archive {
                    self.rides[num_usize] = dummy.clone();
                }
            }
            Ok(())
        }

        pub fn remove_driver(&mut self, _ctx: Context<Auth>, archive: Archive) -> Result<()> {
            let dummy = Archive { 
                archive: String::from("___________________________________________"), 
            };
            msg!("Dummy {:?}", dummy);
            for i in 0..10 {
                let num_usize: usize = i as usize;
                if self.drivers[num_usize].archive == archive.archive {
                    self.drivers[num_usize] = dummy.clone();
                }
            }
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
pub struct Archive {
    archive: String,
}

#[error]
pub enum ErrorCode {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
}