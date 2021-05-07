import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import { TezosOperationError } from '@taquito/taquito';
import accounts from '../../../scripts/sandbox/accounts';
import { prepareFarm } from './before';
import { contractErrors } from '../../../helpers/constants';
import _tokenContractFA12, { lpToken, rewardToken } from '../../helpers/token';
import _tokenContractFA2, { tokenId } from '../../helpers/tokenFA2';
import _taquito from '../../helpers/taquito';
import _farmContract from '../../helpers/farm';
import _initialStorage from '../../../migrations/initialStorage/farm';
import tokenStandard from '../../helpers/tokenStandard';

contract('%claim', () => {
    let farmContract;
    let rewardTokenContract;
    
    describe('one delegator staking', () => {
      
        before(async () => {
            switch (tokenStandard) {
                case "FA12":
                    rewardTokenContract = await _tokenContractFA12.originate('Reward');
                    break;
                case "FA2":
                    rewardTokenContract = await _tokenContractFA2.originate('Reward');
                    break;
            }
            
            const delegatorAlice = {
                address: accounts.alice.pkh,
                lpTokenBalance: lpToken('200'),
                accumulatedRewardPerShareStart: 0
            };
    
            const delegators = [delegatorAlice];
            const rewardPerBlock = rewardToken('10');
            farmContract = await prepareFarm(delegators, rewardPerBlock, rewardTokenContract, farmContract);
        });

        describe('effects of calling %claim', () => {
            let operation;

            before(async () => {
                operation = await farmContract.claim();
            });
        
            it('calculates accumulated reward per share', async () => {
                const accumulatedRewardPerShare = await farmContract.getAccumulatedRewardPerShare()
                expect(accumulatedRewardPerShare.toFixed()).to.equal('150000000000000000');
            });

            it('calculates delegator reward', async () => {
                // delegator reward is also the transfer token parameter for the reward token contract
                const internalOperationResults = operation.results[0].metadata.internal_operation_results;
                const firstInternalOperationResult = internalOperationResults[0];
                const tokenTransferParameters = firstInternalOperationResult.parameters
                let delegatorReward;
                switch (tokenStandard) {
                    case "FA12":
                        delegatorReward = tokenTransferParameters.value.args[1].args[1].int;
                        break;
                    case "FA2":
                        delegatorReward = tokenTransferParameters.value[0].args[1][0].args[1].args[1].int
                        break;
                }

                expect(delegatorReward).to.equal(rewardToken('30'));
            });

            it('updates delegator staking start property', async () => {
                const accumulatedRewardPerShare = await farmContract.getAccumulatedRewardPerShare();
                const accumulatedRewardPerShareStart = await farmContract.getDelegatorStakingStart(accounts.alice.pkh);
                expect(accumulatedRewardPerShareStart.toFixed()).to.equal(accumulatedRewardPerShare.toFixed());
            });

            it('updated unpaid property', async () => {
                const unpaidRewards = await farmContract.getUnpaidRewards();
                expect(unpaidRewards.toFixed()).to.equal('0');
            });

            it('increases paid property in claimedRewards', async () => {
                const paidRewards = await farmContract.getPaidRewards();
                expect(paidRewards.toFixed()).to.equal(rewardToken('30'));
            });
            
            it('emits the token transfer operation', async () => {
                const internalOperationResults = operation.results[0].metadata.internal_operation_results;
                const firstInternalOperationResult = internalOperationResults[0];
                expect(firstInternalOperationResult).to.deep.contain({
                    destination: rewardTokenContract.instance.address 
                });
            });

            describe('delegator claims after 1 block again', () => {
                
                before(async () => {
                    operation = await farmContract.claim();
                });

                it('calculates accumulated reward per share', async () => {
                    const accumulatedRewardPerShare = await farmContract.getAccumulatedRewardPerShare()
                    expect(accumulatedRewardPerShare.toFixed()).to.equal('200000000000000000');
                })

                it('calculates delegator reward', async () => {
                    // delegator reward is also the transfer token parameter for the reward token contract
                    const internalOperationResults = operation.results[0].metadata.internal_operation_results;
                    const firstInternalOperationResult = internalOperationResults[0];
                    const tokenTransferParameters = firstInternalOperationResult.parameters
                    let delegatorReward;
                    switch (tokenStandard) {
                        case "FA12":
                            delegatorReward = tokenTransferParameters.value.args[1].args[1].int;
                            break;
                        case "FA2":
                            delegatorReward = tokenTransferParameters.value[0].args[1][0].args[1].args[1].int
                            break;
                    }

                    expect(delegatorReward).to.equal(rewardToken('10'));
                })

                it('updates delegator staking start property', async () => {
                    const accumulatedRewardPerShare = await farmContract.getAccumulatedRewardPerShare();
                    const accumulatedRewardPerShareStart = await farmContract.getDelegatorStakingStart(accounts.alice.pkh);
                    expect(accumulatedRewardPerShareStart.toFixed()).to.equal(accumulatedRewardPerShare.toFixed());
                });
               
                it('increases paid rewards', async () => {
                    const paidRewardsSecond = await farmContract.getPaidRewards();
                    expect(paidRewardsSecond.toFixed()).to.equal(rewardToken('40'))
                });

                it('emits token transfer operation', async () => {
                    const internalOperationResults = operation.results[0].metadata.internal_operation_results;
                    const firstInternalOperationResult = internalOperationResults[0];
                    expect(firstInternalOperationResult).to.deep.contain({
                        destination: rewardTokenContract.instance.address 
                    });
                });
            });
        });

        describe('two delegators staking', () => {
      
            before(async () => {
                switch (tokenStandard) {
                    case "FA12":
                        rewardTokenContract = await _tokenContractFA12.originate('Reward');
                        break;
                    case "FA2":
                        rewardTokenContract = await _tokenContractFA2.originate('Reward');
                        break;
                }
            
                const delegatorAlice = {
                    address: accounts.alice.pkh,
                    lpTokenBalance: lpToken('200'),
                    accumulatedRewardPerShareStart: 0
                };

                const delegatorBob = {
                    address: accounts.bob.pkh,
                    lpTokenBalance: lpToken('200'),
                    accumulatedRewardPerShareStart: 0
                };
        
                const delegators = [delegatorAlice, delegatorBob];
                const rewardPerBlock = rewardToken('10');
                farmContract = await prepareFarm(delegators, rewardPerBlock, rewardTokenContract, farmContract);
            });
     
            describe('effects of claiming', () => {
                let operation;

                before(async () => {
                    operation = await farmContract.claim();
                });

                it('calculates accumulated reward per share', async () => {
                    const accumulatedRewardPerShare = await farmContract.getAccumulatedRewardPerShare()
                    expect(accumulatedRewardPerShare.toFixed()).to.equal('75000000000000000');
                });

                it('calculates delegator reward', async () => {
                    // delegator reward is also the transfer token parameter for the reward token contract
                    const internalOperationResults = operation.results[0].metadata.internal_operation_results;
                    const firstInternalOperationResult = internalOperationResults[0];
                    const tokenTransferParameters = firstInternalOperationResult.parameters
                    let delegatorReward;
                    switch (tokenStandard) {
                        case "FA12":
                            delegatorReward = tokenTransferParameters.value.args[1].args[1].int;
                            break;
                        case "FA2":
                            delegatorReward = tokenTransferParameters.value[0].args[1][0].args[1].args[1].int
                            break;
                    }
    
                    expect(delegatorReward).to.equal(rewardToken('15'));
                })

                it('updated delegator staking start property', async () => {
                    const accumulatedRewardPerShare = await farmContract.getAccumulatedRewardPerShare();
                    const accumulatedRewardPerShareStart = await farmContract.getDelegatorStakingStart(accounts.alice.pkh);
                    expect(accumulatedRewardPerShareStart.toFixed()).to.equal(accumulatedRewardPerShare.toFixed());
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
                        operation = await farmContract.claim();
                    });

                    it('calculates delegator reward', async () => {
                        // delegator reward is also the transfer token parameter for the reward token contract
                        const internalOperationResults = operation.results[0].metadata.internal_operation_results;
                        const firstInternalOperationResult = internalOperationResults[0];
                        const tokenTransferParameters = firstInternalOperationResult.parameters
                        let delegatorReward;
                        switch (tokenStandard) {
                            case "FA12":
                                delegatorReward = tokenTransferParameters.value.args[1].args[1].int;
                                break;
                            case "FA2":
                                delegatorReward = tokenTransferParameters.value[0].args[1][0].args[1].args[1].int
                                break;
                        }
        
                        expect(delegatorReward).to.equal(rewardToken('5'));
                    });

                    it('updates delegator staking start property', async () => {
                        const accumulatedRewardPerShare = await farmContract.getAccumulatedRewardPerShare();
                        const accumulatedRewardPerShareStart = await farmContract.getDelegatorStakingStart(accounts.alice.pkh);
                        expect(accumulatedRewardPerShareStart.toFixed()).to.equal(accumulatedRewardPerShare.toFixed());
                    });

                    it('increases paid rewards', async () => {
                        const paidRewardsSecond = await farmContract.getPaidRewards();
                        expect(paidRewardsSecond.toFixed()).to.equal(rewardToken('20'))
                    });
                });
            });
        });
    });

    describe('fail cases', () => {

        describe('delegator not known', () => {

            before(async () => {
                const noDelegators = []
                const rewardPerBlock = rewardToken('10');
                const startingBlockLevel = await _taquito.getCurrentBlockLevel();    

                const initialStorage =  _initialStorage.test.claim(
                    accounts.alice.pkh,
                    noDelegators,
                    rewardPerBlock,
                    startingBlockLevel
                );

                if (tokenStandard == "FA2") {
                    initialStorage.tokenIds = {
                        lp: tokenId,
                        reward: tokenId
                    };
                }
                
                farmContract = await _farmContract.originate(initialStorage);
            });
    
            it('fails if called by an address that is not staking', async () => {
                const operationPromise = farmContract.claim();
    
                await expect(operationPromise).to.be.eventually.rejected
                    .and.be.instanceOf(TezosOperationError)
                    .and.have.property('message', contractErrors.delegatorNotKnown )
            }); 
        });
       
        describe('token contract broken', () => {

            before(async () => {
                const startingBlockLevel = await _taquito.getCurrentBlockLevel();    
                // the token contract does not follow the TZIP-7 or TZIP-12 standard
                const rewardTokenContract = accounts.alice.pkh;

                const delegatorAlice = {
                    address: accounts.alice.pkh,
                    lpTokenBalance: lpToken('200'),
                    accumulatedRewardPerShareStart: 0
                };
                const rewardPerBlock = rewardToken('10');

                const initialStorage =  _initialStorage.test.claim(
                    rewardTokenContract,
                    [delegatorAlice],
                    rewardPerBlock,
                    startingBlockLevel
                );
                if (tokenStandard == "FA2") {
                    initialStorage.tokenIds = {
                        lp: tokenId,
                        reward: tokenId
                    };
                }
                farmContract = await _farmContract.originate(initialStorage);
            });

            it('fails if called by an address that is not staking', async () => {
                const operationPromise = farmContract.claim();
    
                await expect(operationPromise).to.be.eventually.rejected
                    .and.be.instanceOf(TezosOperationError)
                    .and.have.property('message', contractErrors.noContractFound )
            }); 
        });
    });
});
