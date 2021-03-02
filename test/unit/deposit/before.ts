import accounts from "../../../scripts/sandbox/accounts";
import { rewardToken } from '../../helpers/token';
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

    // fund farm contract with reward token
    const transferParameters = {
        from: accounts.alice.pkh,
        to: farmContract.instance.address,
        value: rewardToken('800')
    };
    await rewardTokenContract.transfer(transferParameters);
    return farmContract;
}