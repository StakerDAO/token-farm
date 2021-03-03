import { rewardToken } from '../../helpers/token';
import _taquito from '../../helpers/taquito';
import _farmContract from '../../helpers/farm';
import _initialStorage from "../../../migrations/initialStorage/farm";
import accounts from '../../../scripts/sandbox/accounts';

export async function prepareFarm(delegators, rewardPerBlock, rewardTokenContract, farmContract){
    
    const startingBlockLevel = await _taquito.getCurrentBlockLevel();    

    farmContract = await _farmContract.originate(
        _initialStorage.test.claim(
            rewardTokenContract.instance.address,
            delegators,
            rewardPerBlock,
            startingBlockLevel
        )
    );
    
    // give allowance to farm contract to spend on behalf of the address that owns reward tokens
    await _taquito.signAs(accounts.walter.sk, rewardTokenContract, async () => {
        const spender = farmContract.instance.address;
        const value = rewardToken('800');
        await rewardTokenContract.approve(spender, value);
    });

    return farmContract;
}