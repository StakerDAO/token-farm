import accounts from "../../../scripts/sandbox/accounts";
import { rewardToken } from '../../helpers/token';
import _taquito from '../../helpers/taquito';
import _stkrContract from '../../helpers/stkrFarm';
import _initialStorage from "../../../migrations/initialStorage/farm";

export async function prepareFarm(delegators, rewardPerBlock, stkrTokenContract, farmContract){
    
    const startingBlockLevel = await _taquito.getCurrentBlockLevel();    

    farmContract = await _stkrContract.originate(
        _initialStorage.test.claim(
            stkrTokenContract.instance.address,
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
    await stkrTokenContract.transfer(transferParameters);
    return farmContract;
}