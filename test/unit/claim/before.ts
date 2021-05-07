import { rewardToken } from '../../helpers/token';
import _taquito from '../../helpers/taquito';
import _farmContract from '../../helpers/farm';
import _initialStorage from "../../../migrations/initialStorage/farm";
import accounts from '../../../scripts/sandbox/accounts';
import tokenStandard from '../../helpers/tokenStandard';
import { tokenId } from '../../helpers/tokenFA2';

export async function prepareFarm(delegators, rewardPerBlock, rewardTokenContract, farmContract){
    
    const startingBlockLevel = await _taquito.getCurrentBlockLevel();    

    const initialStorage =  _initialStorage.test.claim(
        rewardTokenContract.instance.address,
        delegators,
        rewardPerBlock,
        startingBlockLevel
    );

    if (tokenStandard == "FA2") {
        initialStorage.tokenIds = {
            lp: tokenId,
            reward: tokenId
        };
    }

    farmContract = await _farmContract.originate(initialStorage);
    
    // give allowance to farm contract to spend on behalf of the address that owns reward tokens
    await _taquito.signAs(accounts.walter.sk, rewardTokenContract, async () => {
        const owner = accounts.walter.pkh;
        const spender = farmContract.instance.address;
        const value = rewardToken('800');

        switch (tokenStandard) {
            case "FA12": 
                await rewardTokenContract.approve(spender, value);
                break;
            case "FA2":
                await rewardTokenContract.add_operator(owner, spender);
                break;
        }
    });

    return farmContract;
}