import { expect } from 'chai';
import _tokenContract from '../../helpers/token';
import _mockContract from '../../helpers/mockContract';
import _taquito from '../../helpers/taquito';
import _initialStorage from '../../../migrations/initialStorage/farm';
import { computeReward, updateAccumulatedRewardPerShare } from '../../helpers/updatePool';
import { mockContractStorage } from '../../helpers/types';

/**
 * updatePool(storage) => storage is exposed through the mockContract for unit testing.
 * The strategy is to updatePool(initialStorage) => storage
 */
contract('updatePool()', () => {
    
    describe('getAction', () => {

        it('gets the "skip" action when called in the same block', async () => {
            const currentBlockLevel = await _taquito.getCurrentBlockLevel();
            const blockLevelAtCall = currentBlockLevel + 2;
            const initialStorage = _initialStorage.test.updatePool(
                0, // accumulatedRewardPerShare 
                10,// farmLpTokenBalance
                blockLevelAtCall ,// blockLevel
                10, //rewardPerBlock 
                10, //totalBlocks 
                0, // unpaid 
                0 // paid
            );
            
            const storage = await _mockContract.updatePool(initialStorage);
            
            // does not update last block update storage property
            expect(storage.farm.lastBlockUpdate.toFixed()).to.equal(initialStorage.farm.lastBlockUpdate.toFixed());
            // does not calculate rewards
            expect(storage.farm.claimedRewards.unpaid.toFixed()).to.equal(initialStorage.farm.claimedRewards.unpaid.toFixed());
        });

        it('gets the "updateBlock" action when farm token balance is 0', async () => {
            const currentBlockLevel = await _taquito.getCurrentBlockLevel();
            const initialStorage = _initialStorage.test.updatePool(
                0, // accumulatedRewardPerShare 
                0,// farmLpTokenBalance
                currentBlockLevel, // blockLevel
                10, //rewardPerBlock 
                10, //totalBlocks 
                0, // unpaid 
                0 // paid
            )
            const storage = await _mockContract.updatePool(initialStorage);
            
            // takes 1 block to originate and 1 to perform call
            const blockLevelAfterCall = initialStorage.farm.lastBlockUpdate.plus(2);
            expect(storage.farm.lastBlockUpdate.toFixed()).to.equal(blockLevelAfterCall.toFixed());
            // does not calculate rewards
            expect(storage.farm.claimedRewards.unpaid.toFixed()).to.equal(initialStorage.farm.claimedRewards.unpaid.toFixed());
        });

        describe('updates pool with rewards', () => {
            let initialStorage;
            let storage: mockContractStorage;

            before(async () => {
                const currentBlockLevel = await _taquito.getCurrentBlockLevel();
                initialStorage = _initialStorage.test.updatePool(
                    0, // accumulatedRewardPerShare 
                    10,// farmLpTokenBalance
                    currentBlockLevel, // blockLevel
                    10, //rewardPerBlock 
                    10, //totalBlocks 
                    0, // unpaid 
                    0 // paid
                );
            });

            it('gets the "updateRewards" action', async () => {
                storage = await _mockContract.updatePool(initialStorage);
                
                // takes 1 block to originate and 1 to perform call
                const blockLevelAfterCall = initialStorage.farm.lastBlockUpdate.plus(2); 
                expect(storage.farm.lastBlockUpdate.toNumber()).to.equal(blockLevelAfterCall.toNumber());
                // does calculate rewards
                expect(storage.farm.claimedRewards.unpaid.toNumber()).to.not.equal(initialStorage.farm.claimedRewards.unpaid.toNumber());
            });
    
            describe('effects of updatePoolWithRewards()', () => {
                let reward;

                it('increases unpaid rewards', async () => {
                    reward = computeReward(initialStorage, storage);
                    const unpaidReward = reward;

                    expect(storage.farm.claimedRewards.unpaid.toFixed()).to.equal(unpaidReward.toFixed());
                });

                it('does not increase paid rewards', async () => {
                    expect(storage.farm.claimedRewards.paid.toNumber()).to.equal(0);
                });

                it('calculated accumulatedRewardPerShare', async () => {
                    reward = computeReward(initialStorage, storage);
                    const calculatedAccumulatedRewardPerShare = updateAccumulatedRewardPerShare(initialStorage, reward)
                    const accumulatdRewardPerShare = storage.farm.accumulatedRewardPerShare;

                    expect(accumulatdRewardPerShare.toFixed()).to.equal(calculatedAccumulatedRewardPerShare.toFixed());
                });
            });
        });
    });

    describe('updatePool() -> updatePoolWithRewards() when planned rewards are exhausted', () => {
        let initialStorage;
        let storage: mockContractStorage;
        let reward;

        before(async () => {
            const currentBlockLevel = await _taquito.getCurrentBlockLevel();
            initialStorage = _initialStorage.test.updatePool(
                0, // accumulatedRewardPerShare 
                10,// farmLpTokenBalance
                currentBlockLevel, // blockLevel
                10, //rewardPerBlock 
                5, //totalBlocks 
                30, // unpaid 
                10 // paid
            );
        });

        it('does not pay more rewards than planned', async () => {
            storage = await _mockContract.updatePool(initialStorage);
            reward = computeReward(initialStorage, storage);

            const plannedRewards = initialStorage.farm.claimedRewards.paid.plus(initialStorage.farm.claimedRewards.unpaid);
            const calculatedTotalClaimedRewards = reward.plus(plannedRewards);
            const contractClaimedRewards = storage.farm.claimedRewards.paid.plus(storage.farm.claimedRewards.unpaid);
            expect(contractClaimedRewards.toFixed()).to.equal(calculatedTotalClaimedRewards.toFixed());
        });
    });
});
