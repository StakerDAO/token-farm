import { expect } from 'chai';
import _tokenContract, { lpToken } from '../../helpers/token';
import _farmContract from '../../helpers/farm';
import accounts from '../../../scripts/sandbox/accounts';
import _taquito from '../../helpers/taquito';
import BigNumber from 'bignumber.js';
import { prepareFarm } from './before';

contract('%deposit', () => {
    let farmContract;
    let rewardTokenContract;
    let lpTokenContract;
    const depositValue = lpToken(200);
    let delegatorBalance: BigNumber;

    describe('existing delegator makes deposit', () => {

        before(async () => {
            rewardTokenContract = await _tokenContract.originate('Reward');
            lpTokenContract = await _tokenContract.originate('LP');
            farmContract = await prepareFarm([], 10, rewardTokenContract, lpTokenContract, farmContract)
            
            // delegator approves farm contract to do the transfer
            await lpTokenContract.approve(
                farmContract.instance.address, 
                depositValue
            );
        });
    
        describe('effects of first deposit to balances', () => {
    
            before(async () => {
                delegatorBalance = await lpTokenContract.getBalance(accounts.alice.pkh);
    
                await farmContract.deposit(depositValue);
            });
           
            it('can keep an internal LP balance for farm contract', async () => {
                const balanceInStorage = await farmContract.getFarmLpTokenBalance();
                expect(balanceInStorage.toFixed()).to.equal(depositValue);
            });
    
            it('can keep an internal LP balance for delegator', async () => {
                const delegatorBalance = await farmContract.getDelegatorBalance(accounts.alice.pkh);
                expect(delegatorBalance.toFixed()).to.equal(depositValue);
            });
        });
    
        describe('effects of calling first time updatePool()', () => {
    
            it('sets last updated block level to current block level', async () => {
                const currentBlockLevel = await _taquito.getCurrentBlockLevel();
                const lastBlockUpdate = await farmContract.getLastBlockUpdate();
                expect(lastBlockUpdate).to.equal(currentBlockLevel);
            });
    
            it('sets staking start for first delegator', async () => {
                const startAccumulatedRewardPerShare = await farmContract.getDelegatorStakingStart(accounts.alice.pkh);
                expect(startAccumulatedRewardPerShare.toNumber()).to.equal(0);
            });
        });
    });
});
