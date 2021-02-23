import { expect } from 'chai';
import _mockContractHelper from '../helpers/mockContract';
import _tokenContract from '../helpers/token';
import accounts from '../../scripts/sandbox/accounts';
import _stkrContract from '../helpers/stkrFarm';
import initialStorage from '../../migrations/initialStorage/stkr';

contract('%deposit', () => {
    let helper;

    it('can transfer from lp token contract to farm contract', async () => {
        
        const lpTokenContract = await _tokenContract.originate();
        
        helper = await _stkrContract.originate(initialStorage.withLpTokenContract(lpTokenContract.instance.address));
        // approve farm contract
        await lpTokenContract.approve(helper.instance.address, 10);
        // initiate deposit
        await helper.deposit(10);
        // check that farm contract retrieved
        const balance = await lpTokenContract.getBalance(helper.instance.address);

        console.log(await helper.getStorage())
        expect(balance).to.equal(10);
    });
});