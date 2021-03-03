import accounts from "../../../scripts/sandbox/accounts";
import { rewardToken } from '../../helpers/token';
import _taquito from '../../helpers/taquito';
import _farmContract from '../../helpers/farm';
import _initialStorage from "../../../migrations/initialStorage/farm";

export async function prepareFarm(delegators, rewardPerBlock, rewardTokenContract, lpTokenContract, farmContract){
    
    const startingBlockLevel = await _taquito.getCurrentBlockLevel();    
    const initialStorage = _initialStorage.test.withdraw(
        rewardTokenContract.instance.address,
        lpTokenContract.instance.address,
        delegators,
        rewardPerBlock,
        startingBlockLevel + 3, // in order to updatePool() with only one block reward
    );
    farmContract = await _farmContract.originate(initialStorage);

    // give allowance to farm contract to spend on behalf of the address that owns reward tokens
    await _taquito.signAs(accounts.walter.sk, rewardTokenContract, async () => {
        const spender = farmContract.instance.address;
        const value = rewardToken('800');
        await rewardTokenContract.approve(spender, value);
    });

    // fund farm contract with LP token
    const transferParametersLP = {
        from: accounts.alice.pkh,
        to: farmContract.instance.address,
        value: initialStorage.farmTokenBalance
    };
    await lpTokenContract.transfer(transferParametersLP);
    
    return farmContract;
}