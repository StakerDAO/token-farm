import { expect } from 'chai';
import _mockContractHelper from '../helpers/mockContract';
import _tokenContract from '../helpers/token';
import _stkrContract from '../helpers/stkrFarm';
import initialStorage from '../../migrations/initialStorage/stkr';
import accounts from '../../scripts/sandbox/accounts';
import _taquito from '../helpers/taquito';
import BigNumber from 'bignumber.js';

contract('%deposit', () => {
    let stkrFarm;
    let lpTokenContract;
    let depositValue = '200000000000'; // 200 LP token with 9 decimals
    let delegatorBalance: BigNumber;

    beforeEach(async () => {
        lpTokenContract = await _tokenContract.originate();
        stkrFarm = await _stkrContract.originate(initialStorage.withLpTokenContract(lpTokenContract.instance.address)); 
        
        await lpTokenContract.approve(
            stkrFarm.instance.address, 
            depositValue
        );
    });

    it('can call %deposit', async () => {
        delegatorBalance = await lpTokenContract.getBalance(accounts.alice.pkh);

        await stkrFarm.deposit(depositValue);
    });

    describe('effects of first deposit to balances', () => {
    
        it('can transfer from lp token contract to farm contract', async () => {  
            const balance = await lpTokenContract.getBalance(stkrFarm.instance.address);
            expect(balance.toFixed()).to.equal(depositValue);         
        });

        it('can keep an internal LP balance for farm contract', async () => {
            const balanceInStorage = await stkrFarm.getFarmTokenBalance();
            expect(balanceInStorage.toFixed()).to.equal(depositValue);
        });

        it('can keep an internal LP balance for delegator', async () => {
            const delegatorBalance = await stkrFarm.getDelegatorBalance(accounts.alice.pkh);
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
            const lastBlockUpdate = await stkrFarm.getLastBlockUpdate();
            expect(lastBlockUpdate).to.equal(currentBlockLevel);
        });

        it('sets balance rewardDebt 0 for first delegator', async () => {
            const delegatorRewardDebt = await stkrFarm.getDelegatorRewardDebt(accounts.alice.pkh);
            expect(delegatorRewardDebt.toNumber()).to.equal(0);
        });
    });
});
