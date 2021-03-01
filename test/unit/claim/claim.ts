import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import _tokenContract, { lpToken, rewardToken } from '../../helpers/token';
import accounts from '../../../scripts/sandbox/accounts';
import BigNumber from 'bignumber.js';
import { prepareFarm } from './before';
import { TezosOperationError } from '@taquito/taquito';
import { contractErrors } from '../../../helpers/constants';

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

        describe('effects of calling %claim', () => {
            let operation;

            before(async () => {
                 // save stkr balance before calling claim
                rewardTokenBalance = await rewardTokenContract.getBalance(accounts.alice.pkh);

                operation = await farmContract.claim();
            });
        
            it('calculates accumulated STKR per share', async () => {
                const accumulatedSTKRPerShare = await farmContract.getAccumulatedSTKRPerShare()
                expect(accumulatedSTKRPerShare.toFixed()).to.equal('150000000000000000000');
            });

            it('calculates delegator reward', async () => {
                // delegator reward is also the transfer token parameter for the reward token contract
                const internalOperationResults = operation.results[0].metadata.internal_operation_results;
                const firstInternalOperationResult = internalOperationResults[0];
                const tokenTransferParameters = firstInternalOperationResult.parameters
                const delegatorReward = tokenTransferParameters.value.args[1].args[1].int;

                expect(delegatorReward).to.equal(rewardToken('30'));
            });

            it('calculates rewardDebt', async () => {
                const rewardDebt = await farmContract.getDelegatorRewardDebt(accounts.alice.pkh);
                expect(rewardDebt.toFixed()).to.equal('30000000000000000000000000000000');
            });

            it('updated unpaid property', async () => {
                const unpaidRewards = await farmContract.getUnpaidRewards();
                expect(unpaidRewards.toFixed()).to.equal('0');
            });

            it('increases paid property in claimedRewards', async () => {
                const paidRewards = await farmContract.getPaidRewards();
                expect(paidRewards.toFixed()).to.equal(rewardToken('30'));
            });
            
            it.skip('emits the token transfer operation', async () => {
                // TODO: byte to string conversion to check for matching addresses
            })

            it('increases reward balance in token contract', async () => {
                const stkrBalanceAfterClaim = await rewardTokenContract.getBalance(accounts.alice.pkh);
                const stkrBalanceCalculated = rewardTokenBalance.plus(new BigNumber(rewardToken('30')));
                expect(stkrBalanceAfterClaim.toFixed()).to.equal(stkrBalanceCalculated.toFixed())
                
            });

            describe('delegator claims after 1 block again', () => {
                
                before(async () => {
                    // save stkr balance before calling claim
                    rewardTokenBalance = await rewardTokenContract.getBalance(accounts.alice.pkh);
                    operation = await farmContract.claim();
                });

                it('calculates accumulated reward per share', async () => {
                    const accumulatedSTKRPerShare = await farmContract.getAccumulatedSTKRPerShare()
                    expect(accumulatedSTKRPerShare.toFixed()).to.equal('200000000000000000000');
                })

                it('calculates delegator reward', async () => {
                    // delegator reward is also the transfer token parameter for the reward token contract
                    const internalOperationResults = operation.results[0].metadata.internal_operation_results;
                    const firstInternalOperationResult = internalOperationResults[0];
                    const tokenTransferParameters = firstInternalOperationResult.parameters
                    const delegatorReward = tokenTransferParameters.value.args[1].args[1].int;

                    expect(delegatorReward).to.equal(rewardToken('10'));
                })

                it('updates reward debt', async () => {
                    const paidRewardsSecond = await farmContract.getDelegatorRewardDebt(accounts.alice.pkh);
                    expect(paidRewardsSecond.toFixed()).to.equal('40000000000000000000000000000000')
                });
               
                it('increases paid rewards', async () => {
                    const paidRewardsSecond = await farmContract.getPaidRewards();
                    expect(paidRewardsSecond.toFixed()).to.equal(rewardToken('40'))
                });

                it.skip('emits token transfer operation', async () => {
                    // TODO: byte to string conversion to check for matching addresses
                })

                it('increases reward balance in token contract', async () => {
                    const stkrBalanceAfterClaim = await rewardTokenContract.getBalance(accounts.alice.pkh);
                    const stkrBalanceCalculated = rewardTokenBalance.plus(new BigNumber(rewardToken('10')));
                    expect(stkrBalanceAfterClaim.toFixed()).to.equal(stkrBalanceCalculated.toFixed())
                    
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
     
            describe('effects of claiming', () => {
                let operation;
                before(async () => {
                      // save stkr balance before calling claim
                    rewardTokenBalance = await rewardTokenContract.getBalance(accounts.alice.pkh);
        
                    operation = await farmContract.claim();
                });

                it('calculates accumulated STKR per share', async () => {
                    const accumulatedSTKRPerShare = await farmContract.getAccumulatedSTKRPerShare()
                    expect(accumulatedSTKRPerShare.toFixed()).to.equal('75000000000000000000');
                });

                it('calculates delegator reward', async () => {
                    // delegator reward is also the transfer token parameter for the reward token contract
                    const internalOperationResults = operation.results[0].metadata.internal_operation_results;
                    const firstInternalOperationResult = internalOperationResults[0];
                    const tokenTransferParameters = firstInternalOperationResult.parameters
                    const delegatorReward = tokenTransferParameters.value.args[1].args[1].int;
    
                    expect(delegatorReward).to.equal(rewardToken('15'));
                })

                it('calculates rewardDebt', async () => {
                    const rewardDebt = await farmContract.getDelegatorRewardDebt(accounts.alice.pkh);
                    expect(rewardDebt.toFixed()).to.equal('15000000000000000000000000000000');
                });
               
                it('updates the unpaid property', async () => {
                    const unpaidRewards = await farmContract.getUnpaidRewards();
                    expect(unpaidRewards.toFixed()).to.equal(rewardToken('15'));
                });

                it('increases paid property in claimedRewards', async () => {
                    const paidRewards = await farmContract.getPaidRewards();
                    expect(paidRewards.toFixed()).to.equal(rewardToken('15'));
                });

           
                describe('delegator claims after 1 block again', () => {
                    before(async () => {
                        // save stkr balance before calling claim
                        rewardTokenBalance = await rewardTokenContract.getBalance(accounts.alice.pkh);

                        operation = await farmContract.claim();
                    });

                    it('calculates delegator reward', async () => {
                        // delegator reward is also the transfer token parameter for the reward token contract
                        const internalOperationResults = operation.results[0].metadata.internal_operation_results;
                        const firstInternalOperationResult = internalOperationResults[0];
                        const tokenTransferParameters = firstInternalOperationResult.parameters
                        const delegatorReward = tokenTransferParameters.value.args[1].args[1].int;
        
                        expect(delegatorReward).to.equal(rewardToken('5'));
                    });

                    it('updates reward debt', async () => {
                        const paidRewardsSecond = await farmContract.getDelegatorRewardDebt(accounts.alice.pkh);
                        expect(paidRewardsSecond.toFixed()).to.equal('20000000000000000000000000000000')
                    });

                    it('increases paid rewards', async () => {
                        const paidRewardsSecond = await farmContract.getPaidRewards();
                        expect(paidRewardsSecond.toFixed()).to.equal(rewardToken('20'))
                    });
    
                    it('increases reward balance in token contract', async () => {
                        const stkrBalanceAfterClaim = await rewardTokenContract.getBalance(accounts.alice.pkh);
                        const stkrBalanceCalculated = rewardTokenBalance.plus(new BigNumber(rewardToken('5')));
                        expect(stkrBalanceAfterClaim.toFixed()).to.equal(stkrBalanceCalculated.toFixed())                        
                    });
                 
                })
            });
        });
    });

    describe('fail cases', () => {
      
        before(async () => {
            rewardTokenContract = await _tokenContract.originate();
            const noDelegators = []
            const rewardPerBlock = rewardToken('10');
            farmContract = await prepareFarm(noDelegators, rewardPerBlock, rewardTokenContract, farmContract);
        });

        it('fails if called by address that is not staking', async () => {
            const operationPromise = farmContract.claim();

            await expect(operationPromise).to.be.eventually.rejected
                .and.be.instanceOf(TezosOperationError)
                .and.have.property('message', contractErrors.delegatorNotKnown )
        }); 
    });
});
