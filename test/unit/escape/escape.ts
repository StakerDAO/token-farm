import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import accounts from '../../../scripts/sandbox/accounts';
import _tokenContractFA12, { lpToken, rewardToken } from '../../helpers/token';
import _tokenContractFA2 from '../../helpers/tokenFA2';
import tokenStandard from '../../helpers/tokenStandard';
import _taquito from '../../helpers/taquito';
import _farmContract from '../../helpers/farm';
import _initialStorage from '../../../migrations/initialStorage/farm';
import { prepareFarm } from '../escape/before';
import { TezosOperationError } from '@taquito/taquito';
import { contractErrors } from '../../../helpers/constants';

contract('%escape', () => {
    let farmContract;
    let operation;
    let lpTokenContract;
    
    describe('one delegator staking', () => {
      
        before(async () => {
            
            switch (tokenStandard) {
                case "FA12":
                    lpTokenContract = await _tokenContractFA12.originate('LP');
                    break;
                case "FA2":
                    lpTokenContract = await _tokenContractFA2.originate('LP');
                    break;
            }

            const delegatorAlice = {
                address: accounts.alice.pkh,
                lpTokenBalance: lpToken('200'),
                accumulatedRewardPerShareStart: 100000
            };
            const rewardPerBlock = rewardToken(20);
            farmContract = await prepareFarm([delegatorAlice], rewardPerBlock, lpTokenContract, farmContract);
        });

        before(async () => {
            operation = await farmContract.escape();
        });

        it("reduces farm token balance by delegator's total balance", async () => {
            const farmLpTokenBalance = await farmContract.getFarmLpTokenBalance();
            expect(farmLpTokenBalance.toNumber()).to.equal(0);
        });

        it('remove delegator from storage', async () => {
            const delegatorRecord = await farmContract.getDelegatorRecord(accounts.alice.pkh);
            expect(delegatorRecord).to.be.undefined;
        });

        it('emits token operation to LP token contract', async () => {
            const internalOperationResults = operation.results[0].metadata.internal_operation_results;
            const firstInternalOperationResult = internalOperationResults[0];
            let tokenAmount;
            switch (tokenStandard) {
                case "FA12":
                    tokenAmount = firstInternalOperationResult.parameters.value.args[1].args[1].int
                    break;
                case "FA2":
                    tokenAmount = firstInternalOperationResult.parameters.value[0].args[1][0].args[1].args[1].int
                    break;
            }

            expect(tokenAmount).to.equal(lpToken('200'));
            expect(firstInternalOperationResult).to.deep.contain({
                destination: lpTokenContract.instance.address,
            });
        });

        it('fails for account that has not staked', async () => {
            await _taquito.signAs(accounts.chuck.sk, farmContract, async () => {
                const operationPromise = farmContract.escape();
            
                await expect(operationPromise).to.be.eventually.rejected
                    .and.be.instanceOf(TezosOperationError)
                    .and.have.property('message', contractErrors.delegatorNotKnown);
            });
        });
    });
});
