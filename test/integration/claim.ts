import { expect } from 'chai';
import _mockContractHelper from '../helpers/mockContract';
import _tokenContract from '../helpers/token';
import accounts from '../../scripts/sandbox/accounts';
import _stkrContract from '../helpers/stkrFarm';
import initialStorage from '../../migrations/initialStorage/stkr';

contract('%claim', () => {
    let helper;

    it('can transfer stkr from farm to user', async () => {
        
        const lpTokenContract = await _tokenContract.originate();
        const stkrTokenContract = await _tokenContract.originate()
        
        helper = await _stkrContract.originate(
            initialStorage.test.claim(
                stkrTokenContract.instance.address,
                lpTokenContract.instance.address
            )
        );
        // approve farm contract
        await lpTokenContract.approve(helper.instance.address, 100);
        const transferParameters = {
            from: accounts.alice.pkh,
            to: helper.instance.address,
            value: 100000
        }
        await stkrTokenContract.transfer(transferParameters);
        //initiate deposit
        await helper.deposit(100);
        await helper.claim();
        console.log(await helper.getStorage())
        console.log("unrealized", await helper.getUnrealizedRewards())
        console.log("realized", await helper.getRealizedRewards())
    });
});