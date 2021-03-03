import accounts from "../../../scripts/sandbox/accounts";
import { lpToken, rewardToken } from '../../helpers/token';
import _taquito from '../../helpers/taquito';
import _farmContract from '../../helpers/farm';
import _initialStorage from "../../../migrations/initialStorage/farm";

export async function prepareFarm(delegators, rewardPerBlock, rewardTokenContract, lpTokenContract, farmContract){
    
    const startingBlockLevel = await _taquito.getCurrentBlockLevel();    

    farmContract = await _farmContract.originate(
        _initialStorage.test.deposit(
            rewardTokenContract.instance.address,
            lpTokenContract.instance.address,
            delegators,
            rewardPerBlock,
            startingBlockLevel
        )
    );

    // fund alice with LP tokens
    await _taquito.signAs(accounts.walter.sk, lpTokenContract, async () => {
        const transferParametersLP = {
            from: accounts.walter.pkh,
            to: accounts.alice.pkh,
            value: lpToken('800')
        };
        await lpTokenContract.transfer(transferParametersLP);
    });
   
    // give allowance to farm contract to spend on behalf of the address that owns reward tokens
    await _taquito.signAs(accounts.walter.sk, rewardTokenContract, async () => {
        const spender = farmContract.instance.address;
        const value = rewardToken('800');
        await rewardTokenContract.approve(spender, value);
    });

    return farmContract;
}