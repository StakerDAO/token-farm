import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import _farmContract  from '../helpers/farm';
import _initialStorageFarm from '../../migrations/initialStorage/farm';
import _tokenContract from '../helpers/token';
import _taquito from '../helpers/taquito';
import _saveContractAddress from '../../helpers/saveContractAddress';
import accounts from '../../scripts/sandbox/accounts';
import { migrate as migrateDex } from '../../scripts/contracts/quipuswap';
import { TezosOperationError } from '@taquito/taquito';
import { contractErrors } from '../../helpers/constants';

contract('farm contract', () => {
    let farmContract;
    let dexTokenContract;
    let operation;
    const recipient = accounts.bob.pkh;
    
    before(async () => {
        console.log('Migrating DEX contract')
        await migrateDex();
        const dexTokenContractAddress = require('../../scripts/contracts/quipuswap/deployments/dex') || undefined;    
        // for debugging purposes
        console.log('DEX token contract address is', dexTokenContractAddress);

        // originate token-farm
        const initialStorage = _initialStorageFarm.withLpTokenContract(dexTokenContractAddress); 
        farmContract = await _farmContract.originate(initialStorage);
        dexTokenContract = await _tokenContract.at(dexTokenContractAddress);
        
        // deposit LP tokens to token-farm
        const transferParameters = {
            from: accounts.alice.pkh,
            to: farmContract.instance.address,
            value: 10
        };
        await dexTokenContract.transfer(transferParameters);
    });

    /**
     * This test integrates the token-farm with the quipuswap DEX contract.
     * The token-farm claims XTZ profits by calling the %withdrawProfit entrypoint of the DEX contract.
     */
    describe('%withdrawProfit', () => {

        it('calls %withdrawProfit on token-farm for admin', async () => {
            operation = await farmContract.withdrawProfit(recipient);
        });

        describe('effects of calling %withdrawProfit', () => {

            it('instructs token-farm to call %withdrawProfit on DEX contract', async () => {
                const internalOperationResults = operation.results[0].metadata.internal_operation_results;
                const firstInternalOperationResult = internalOperationResults[0];
        
                expect(firstInternalOperationResult.destination).to.equal(dexTokenContract.instance.address);
                expect(firstInternalOperationResult.parameters.entrypoint).to.equal('withdrawProfit');
            });
        
            it('sends XTZ reward to the recipient', async () => {
                const internalOperationResults = operation.results[0].metadata.internal_operation_results;
                const secondInternalOperationResult = internalOperationResults[1];
        
                expect(secondInternalOperationResult.amount).to.equal('5000');
                expect(secondInternalOperationResult.destination).to.equal(recipient);
            });
        });

        it('fails for an account that is not admin', async () => {
            await _taquito.signAs(accounts.chuck.sk, farmContract, async () => {
                const operationPromise = farmContract.withdrawProfit(accounts.chuck.pkh);
            
                await expect(operationPromise).to.be.eventually.rejected
                    .and.be.instanceOf(TezosOperationError)
                    .and.have.property('message', contractErrors.senderIsNotAdmin);
            });
        });
    });
});
