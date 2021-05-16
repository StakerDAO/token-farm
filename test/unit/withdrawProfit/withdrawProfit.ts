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

/**
 * More tests with %withdrawProfit can be found in ../../integration/withdrawProfit.ts
 * It has a tight dependency on the DEX token contract and is therefore not tested here.
 */
contract('%withdrawProfit', () => {
    let farmContract;
    
    describe('smart contract invocation with options', () => {

        it('fails if transaction carries XTZ', async () => {
            farmContract =  await _farmContract.originate(
                _initialStorage.base()
            );
            const options = { amount: 1 }; // send TEZ with the transaction

            const operationPromise = farmContract.withdrawProfit(accounts.alice.pkh, options);

            await expect(operationPromise).to.be.eventually.rejected
                .and.be.instanceOf(TezosOperationError)
                .and.have.property('message', contractErrors.inboundTezNotAllowed);
        });
    });
});
