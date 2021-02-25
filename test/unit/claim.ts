import { expect } from 'chai';
import _mockContractHelper from '../helpers/mockContract';
import _tokenContract, { lpToken, rewardToken } from '../helpers/token';
import accounts from '../../scripts/sandbox/accounts';
import _stkrContract from '../helpers/stkrFarm';
import BigNumber from 'bignumber.js';
import _taquito from '../helpers/taquito';
import { prepareFarm } from './before';

contract('%claim', () => {
    let farmContract;
    let rewardTokenContract;
    let rewardTokenBalance;
    describe('one delegator staking', () => {
      
        before(async () => {
            rewardTokenContract = await _tokenContract.originate();
        
            const delegatorAlice = {
                address: accounts.alice.pkh,
                balance: lpToken('200'),
                rewardDebt: 0
            };
    
            const delegators = [delegatorAlice];
            const rewardPerBlock = rewardToken('10');
            farmContract = await prepareFarm(delegators, rewardPerBlock, rewardTokenContract, farmContract);
        });

        it('can call %claim entrypoint', async () => {
            // save stkr balance before calling claim
            rewardTokenBalance = await rewardTokenContract.getBalance(accounts.alice.pkh);

            await farmContract.claim();
        })

        describe('effects of claiming', () => {
           
            it('increases paid property in claimedRewards', async () => {
                const paidRewards = await farmContract.getPaidRewards();
                expect(paidRewards.toFixed()).to.equal(rewardToken('30'));
            });

            it('unpaid property is 0', async () => {
                const unpaidRewards = await farmContract.getUnpaidRewards();
                expect(unpaidRewards.toFixed()).to.equal('0');
            });

            it('calculates accumulated STKR per share', async () => {
                const accumulatedSTKRPerShare = await farmContract.getAccumulatedSTKRPerShare()
                expect(accumulatedSTKRPerShare.toFixed()).to.equal('150000000000000000000');
            })

            it('calculates rewardDebt', async () => {
                const rewardDebt = await farmContract.getDelegatorRewardDebt(accounts.alice.pkh);
                expect(rewardDebt.toFixed()).to.equal('30000000000000000000000000000000');
            });

            describe('delegator claims after 1 block again', () => {
                it('calls claim', async () => {
                    // save stkr balance before calling claim
                    rewardTokenBalance = await rewardTokenContract.getBalance(accounts.alice.pkh);
                    await farmContract.claim();
                });

                it('increases reward balance in token contract', async () => {
                    const stkrBalanceAfterClaim = await rewardTokenContract.getBalance(accounts.alice.pkh);
                    const stkrBalanceCalculated = rewardTokenBalance.plus(new BigNumber(rewardToken('10')));
                    expect(stkrBalanceAfterClaim.toFixed()).to.equal(stkrBalanceCalculated.toFixed())
                    
                });

                it('increases paid rewards', async () => {
                    const paidRewardsSecond = await farmContract.getPaidRewards();
                    expect(paidRewardsSecond.toFixed()).to.equal(rewardToken('40'))
                });

                it('updated reward debt', async () => {
                    const paidRewardsSecond = await farmContract.getDelegatorRewardDebt(accounts.alice.pkh);
                    expect(paidRewardsSecond.toFixed()).to.equal('40000000000000000000000000000000')
                });
            })
        });

        describe('two delegators staking', () => {
      
            before(async () => {
                rewardTokenContract = await _tokenContract.originate();
            
                const delegatorAlice = {
                    address: accounts.alice.pkh,
                    balance: lpToken('200'),
                    rewardDebt: 0
                };

                const delegatorBob = {
                    address: accounts.alice.pkh,
                    balance: lpToken('200'),
                    rewardDebt: 0
                };
        
                const delegators = [delegatorAlice, delegatorBob];
                const rewardPerBlock = rewardToken('10');
                farmContract = await prepareFarm(delegators, rewardPerBlock, rewardTokenContract, farmContract);
            });
    
            it('one delegator can call %claim entrypoint', async () => {
                // save stkr balance before calling claim
                rewardTokenBalance = await rewardTokenContract.getBalance(accounts.alice.pkh);
    
                await farmContract.claim();
            })
    
            describe('effects of claiming', () => {
               
                it('increases paid property in claimedRewards', async () => {
                    const paidRewards = await farmContract.getPaidRewards();
                    expect(paidRewards.toFixed()).to.equal(rewardToken('15'));
                });
    
                it('increases unpaid property', async () => {
                    const unpaidRewards = await farmContract.getUnpaidRewards();
                    expect(unpaidRewards.toFixed()).to.equal(rewardToken('15'));
                });
    
                it('calculates accumulated STKR per share', async () => {
                    const accumulatedSTKRPerShare = await farmContract.getAccumulatedSTKRPerShare()
                    expect(accumulatedSTKRPerShare.toFixed()).to.equal('75000000000000000000');
                })
    
                it('calculates rewardDebt', async () => {
                    const rewardDebt = await farmContract.getDelegatorRewardDebt(accounts.alice.pkh);
                    expect(rewardDebt.toFixed()).to.equal('15000000000000000000000000000000');
                });
    
                describe('delegator claims after 1 block again', () => {
                    it('calls claim', async () => {
                        // save stkr balance before calling claim
                        rewardTokenBalance = await rewardTokenContract.getBalance(accounts.alice.pkh);
                        await farmContract.claim();
                    });
    
                    it('increases reward balance in token contract', async () => {
                        const stkrBalanceAfterClaim = await rewardTokenContract.getBalance(accounts.alice.pkh);
                        const stkrBalanceCalculated = rewardTokenBalance.plus(new BigNumber(rewardToken('5')));
                        expect(stkrBalanceAfterClaim.toFixed()).to.equal(stkrBalanceCalculated.toFixed())
                        
                    });
    
                    it('increases paid rewards', async () => {
                        const paidRewardsSecond = await farmContract.getPaidRewards();
                        expect(paidRewardsSecond.toFixed()).to.equal(rewardToken('20'))
                    });
    
                    it('updated reward debt', async () => {
                        const paidRewardsSecond = await farmContract.getDelegatorRewardDebt(accounts.alice.pkh);
                        expect(paidRewardsSecond.toFixed()).to.equal('20000000000000000000000000000000')
                    });
                })
            });
        });
    });   
});
