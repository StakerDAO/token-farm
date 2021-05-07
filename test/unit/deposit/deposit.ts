import { expect } from 'chai';
import _tokenContractFA12, { lpToken } from '../../helpers/token';
import _tokenContractFA2 from '../../helpers/tokenFA2';
import _farmContract from '../../helpers/farm';
import accounts from '../../../scripts/sandbox/accounts';
import _taquito from '../../helpers/taquito';
import BigNumber from 'bignumber.js';
import { prepareFarm } from './before';
import tokenStandard from '../../helpers/tokenStandard';

contract('%deposit', () => {
    let farmContract;
    let rewardTokenContract;
    let lpTokenContract;
    const depositValue = lpToken(200);
    let delegatorBalance: BigNumber;

    describe('existing delegator makes deposit', () => {

        before(async () => {
            switch (tokenStandard) {
                case "FA12":
                    rewardTokenContract = await _tokenContractFA12.originate('Reward');
                    lpTokenContract = await _tokenContractFA12.originate('LP');
                    break;
                case "FA2":
                    rewardTokenContract = await _tokenContractFA2.originate('Reward');
                    lpTokenContract = await _tokenContractFA2.originate('LP');
                    break;
            }
          
            farmContract = await prepareFarm([], 10, rewardTokenContract, lpTokenContract, farmContract);
            
            // delegator approves farm contract to do the transfer
            switch (tokenStandard) {
                case "FA12":   
                    await lpTokenContract.approve(
                        farmContract.instance.address, 
                        depositValue
                    );
                    break;
                case "FA2":
                    await lpTokenContract.add_operator(
                        accounts.alice.pkh, 
                        farmContract.instance.address
                    );
                    break;
            }
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
                const accumulatedRewardPerShareStart = await farmContract.getDelegatorStakingStart(accounts.alice.pkh);
                expect(accumulatedRewardPerShareStart.toNumber()).to.equal(0);
            });
        });
    });
});
