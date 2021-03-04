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

contract('%claim', () => {
    let farmContract;
    
    describe('one delegator staking', () => {
      
        beforeEach(async () => {
            farmContract = await _farmContract.originate(
                _initialStorage.base()
            );
        });

        it('fails for a third party to %setAdmin', async () => {
            await _taquito.signAs(accounts.chuck.sk, farmContract, async () => {
                const operationPromise = farmContract.setAdmin(accounts.chuck.pkh);
                
                await expect(operationPromise).to.be.eventually.rejected
                    .and.be.instanceOf(TezosOperationError)
                    .and.have.property('message', contractErrors.senderIsNotAdmin)
            });
        });

        it('sets new admin', async () => {
            await farmContract.setAdmin(accounts.trent.pkh);

            const admin = await farmContract.getAdmin();
            expect(admin).to.equal(accounts.trent.pkh);
        });
    });
});
