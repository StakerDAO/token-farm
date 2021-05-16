import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import _tokenContract, { lpToken, rewardToken } from '../../helpers/token';
import accounts from '../../../scripts/sandbox/accounts';
import { prepareFarm } from './before';
import { TezosOperationError } from '@taquito/taquito';
import { contractErrors } from '../../../helpers/constants';
import _taquito from '../../helpers/taquito';
import _farmContract from '../../helpers/farm';
import _initialStorage from '../../../migrations/initialStorage/farm';

contract('%withdraw', () => {
    let farmContract;
    let rewardTokenContract;
    let lpTokenContract;
    const withdrawAmount = lpToken(10);
    const balances: any = {};
    let operation;
    
    describe('account that calls has balance and withdraws', () => {
      
        before(async () => {
            rewardTokenContract = await _tokenContract.originate('Reward');
            lpTokenContract = await _tokenContract.originate('LP');
        
            const delegatorAlice = {
                address: accounts.alice.pkh,
                lpTokenBalance: lpToken('200'),
                accumulatedRewardPerShareStart: 0
            };
    
            const delegators = [delegatorAlice];
            const rewardPerBlock = rewardToken('20');

            farmContract = await prepareFarm(delegators, rewardPerBlock, rewardTokenContract, lpTokenContract, farmContract);
        });

        it('fails if withdraw amount is greater than balance', async () => {
            const operationPromise = farmContract.withdraw(lpToken('201'));

            await expect(operationPromise).to.be.eventually.rejected
                .and.be.instanceOf(TezosOperationError)
                .and.have.property('message', contractErrors.notEnoughStakedTokenBalance);
        });

        describe('success cases', () => {

            before(async () => {
                balances.delegatorBefore = await farmContract.getDelegatorBalance(accounts.alice.pkh);
                balances.farmBefore = await farmContract.getFarmLpTokenBalance();
                operation = await farmContract.withdraw(withdrawAmount);
            });
    
            it('decreases delegator balance in farm', async () => {
                balances.delegatorAfter = await farmContract.getDelegatorBalance(accounts.alice.pkh);
                const calculated = balances.delegatorBefore.minus(withdrawAmount);
                expect(balances.delegatorAfter.toFixed()).to.equal(calculated.toFixed());
            });
    
            it('decreases farm balance tracked in farm', async () => {
                balances.farmAfter = await farmContract.getFarmLpTokenBalance();
                const calculated = balances.farmBefore.minus(withdrawAmount);
                expect(balances.farmAfter.toFixed()).to.equal(calculated.toFixed());
            });
    
            it('emits token operation to LP token contract', async () => {
                const internalOperationResults = operation.results[0].metadata.internal_operation_results;
                const firstInternalOperationResult = internalOperationResults[0];
                
                expect(firstInternalOperationResult).to.deep.contain({
                    destination: lpTokenContract.instance.address,
                });
                expect(firstInternalOperationResult.parameters.value.args[1].args[1].int).to.equal(withdrawAmount);
            });
    
            it('emits token operation to reward token contract', async () => {
                const internalOperationResults = operation.results[0].metadata.internal_operation_results;
                const secondInternalOperationResult = internalOperationResults[1];
                
                expect(secondInternalOperationResult).to.deep.contain({
                    destination: rewardTokenContract.instance.address,
                });
                expect(secondInternalOperationResult.parameters.value.args[1].args[1].int).to.equal(rewardToken('20'));
            });
        });
    }); 

    describe('account that calls has no balance and withdraws', () => { 

        before(async () => {
            const startingBlockLevel = await _taquito.getCurrentBlockLevel();    

            farmContract = await _farmContract.originate(
                _initialStorage.test.withdraw(
                    accounts.lock.pkh,
                    accounts.lock.pkh,
                    [], // delegators
                    rewardToken('10'), // rewardPerBlock
                    startingBlockLevel + 3, // in order to skip updatePool().
                )
            );
        });

        it('fails for account that has not staked', async () => {
            const operationPromise = farmContract.withdraw(withdrawAmount);
        
            await expect(operationPromise).to.be.eventually.rejected
                .and.be.instanceOf(TezosOperationError)
                .and.have.property('message', contractErrors.delegatorNotKnown);
        });
    });

    describe('smart contract invocation with options', () => {

        it('fails if transaction carries XTZ', async () => {
            farmContract =  await _farmContract.originate(
                _initialStorage.base()
            );
            const options = { amount: 1 }; // send TEZ with the transaction

            const operationPromise = farmContract.withdraw(1, options);

            await expect(operationPromise).to.be.eventually.rejected
                .and.be.instanceOf(TezosOperationError)
                .and.have.property('message', contractErrors.inboundTezNotAllowed);
        });
    });
});
