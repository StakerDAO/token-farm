import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import { TezosOperationError } from '@taquito/taquito';
import accounts from '../../../scripts/sandbox/accounts';
import { contractErrors } from '../../../helpers/constants';
import _tokenContract from '../../helpers/token';
import _taquito from '../../helpers/taquito';
import _farmContract from '../../helpers/farm';
import _initialStorage from '../../../migrations/initialStorage/farm';
import farm from '../../helpers/farm';

contract('%claim', () => {
    let farmContract;
    let initRewardPerBlock;
    let initTotalBlocks;
    const rewardPerBlock = 100;
    const totalBlocks = 10000;
    
    describe('one delegator staking', () => {
      
        beforeEach(async () => {
            initRewardPerBlock = 10;
            initTotalBlocks = 10;

            farmContract = await _farmContract.originate(
                _initialStorage.test.updatePlan(
                    initRewardPerBlock, 
                    initTotalBlocks
                )
            );
        });

        it('fails for a third party to call %updatePlan', async () => {
            await _taquito.signAs(accounts.chuck.sk, farmContract, async () => {
                const rewardPerBlock = 10000;
                const totalBlocks = 2;
                const operationPromise = farmContract.updatePlan(rewardPerBlock, totalBlocks);
                
                await expect(operationPromise).to.be.eventually.rejected
                    .and.be.instanceOf(TezosOperationError)
                    .and.have.property('message', contractErrors.senderIsNotAdmin)
            });
        });

        it('updates planned reward properties', async () => {
            await farmContract.updatePlan(rewardPerBlock, totalBlocks);

            const rewardPerBlockContract = await farmContract.getRewardPerBlock();
            expect(rewardPerBlockContract.toNumber()).to.equal(rewardPerBlock);
            
            const totalBlocksContract = await farmContract.getTotalBlocks();
            expect(totalBlocksContract.toNumber()).to.equal(totalBlocks);
        });

        it('updates farm properties', async () => {
            await farmContract.updatePlan(rewardPerBlock, totalBlocks);

            const accumulatdRewardPerShare = await farmContract.getAccumulatedRewardPerShare();
            expect(accumulatdRewardPerShare.toNumber()).to.not.equal(0);
            
            const lastBlockUpdate = await farmContract.getLastBlockUpdate();
            expect(lastBlockUpdate).to.not.equal(0);
        });

        it('updates claimedRewards', async () => {
            await farmContract.updatePlan(rewardPerBlock, totalBlocks);

            const unpaidRewards = await farmContract.getUnpaidRewards();
            expect(unpaidRewards.toNumber()).to.not.equal(0);
            
            const paidRewards = await farmContract.getPaidRewards();
            expect(paidRewards.toNumber()).to.equal(0);
        });
    });
});
