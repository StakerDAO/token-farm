import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import _tokenContract, { lpToken } from '../../helpers/token';
import _farmContract from '../../helpers/farm';
import _initialFarmStorage from '../../../migrations/initialStorage/farm';
import accounts from '../../../scripts/sandbox/accounts';
import _taquito from '../../helpers/taquito';
import BigNumber from 'bignumber.js';
import { prepareFarm } from './before';
import { TezosOperationError } from '@taquito/taquito';
import { contractErrors } from '../../../helpers/constants';

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
            farmContract = await prepareFarm([], 10, rewardTokenContract, lpTokenContract, farmContract);
            
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
                const accumulatedRewardPerShareStart = await farmContract.getDelegatorStakingStart(accounts.alice.pkh);
                expect(accumulatedRewardPerShareStart.toNumber()).to.equal(0);
            });
        });
    });

    describe('smart contract invocation with options', () => {

        it('fails if transaction carries XTZ', async () => {
            const farmContract =  await _farmContract.originate(
                _initialFarmStorage.base()
            );
            const options = { amount: 1 }; // send TEZ with the transaction
            
            const operationPromise = farmContract.deposit(1, options);

            await expect(operationPromise).to.be.eventually.rejected
                .and.be.instanceOf(TezosOperationError)
                .and.have.property('message', contractErrors.inboundTezNotAllowed);
        });
    });
});
