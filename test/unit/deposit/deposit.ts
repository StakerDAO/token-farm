import { expect } from 'chai';
import _tokenContract, { lpToken } from '../../helpers/token';
import _farmContract from '../../helpers/farm';
import initialStorage from '../../../migrations/initialStorage/farm';
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

    describe('new delegator makes deposit', () => {
        before(async () => {
            rewardTokenContract = await _tokenContract.originate();
            lpTokenContract = await _tokenContract.originate();
            farmContract = prepareFarm([], 10, rewardTokenContract, lpTokenContract, farmContract)
        })
    });

    describe('existing delegator makes deposit', () => {
        before(async () => {
            lpTokenContract = await _tokenContract.originate();
            farmContract = await _farmContract.originate(initialStorage.withLpTokenContract(lpTokenContract.instance.address)); 
            
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
        
            it('can transfer from lp token contract to farm contract', async () => {  
                const balance = await lpTokenContract.getBalance(farmContract.instance.address);
                expect(balance.toFixed()).to.equal(depositValue);         
            });
    
            it('can keep an internal LP balance for farm contract', async () => {
                const balanceInStorage = await farmContract.getFarmTokenBalance();
                expect(balanceInStorage.toFixed()).to.equal(depositValue);
            });
    
            it('can keep an internal LP balance for delegator', async () => {
                const delegatorBalance = await farmContract.getDelegatorBalance(accounts.alice.pkh);
                expect(String(delegatorBalance)).to.equal(depositValue);
            });
    
            it('reduces the balance of delegator in LP contract', async () => {
                const delegatorBalanceAfterDeposit = await lpTokenContract.getBalance(accounts.alice.pkh);
                const delegatorBalanceCalculated = delegatorBalance.minus(new BigNumber(depositValue));
                expect(delegatorBalanceAfterDeposit.toFixed()).equal(delegatorBalanceCalculated.toFixed())
            });
        });
    
        describe('effects of calling first time updatePool()', () => {
    
            it('sets last updated block level to current block level', async () => {
                const currentBlockLevel = await _taquito.getCurrentBlockLevel();
                const lastBlockUpdate = await farmContract.getLastBlockUpdate();
                expect(lastBlockUpdate).to.equal(currentBlockLevel);
            });
    
            it('sets staking start for first delegator', async () => {
                const delegatorRewardDebt = await farmContract.getDelegatorStakingStart(accounts.alice.pkh);
                expect(delegatorRewardDebt.toNumber()).to.equal(0);
            });
        });
    });
});
