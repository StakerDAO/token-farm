import accounts from "../../../scripts/sandbox/accounts";
import { lpToken, rewardToken } from '../../helpers/token';
import _taquito from '../../helpers/taquito';
import _farmContract from '../../helpers/farm';
import _initialStorage from "../../../migrations/initialStorage/farm";
import tokenStandard from '../../helpers/tokenStandard';
import { tokenId } from "../../helpers/tokenFA2";

export async function prepareFarm(delegators, rewardPerBlock, lpTokenContract, farmContract){
    
    const initialStorage =  _initialStorage.test.deposit(
        accounts.alice.pkh,
        lpTokenContract.instance.address,
        delegators,
        rewardPerBlock,
        0 // starting block level
    );

    if (tokenStandard == "FA2") {
        initialStorage.tokenIds = {
            lp: tokenId,
            reward: tokenId
        };
    }

    farmContract = await _farmContract.originate(initialStorage);

    // fund alice with LP tokens
    await _taquito.signAs(accounts.walter.sk, lpTokenContract, async () => {
        const transferParametersLP = {
            from: accounts.walter.pkh,
            to: farmContract.instance.address,
            value: lpToken('200')
        };
        await lpTokenContract.transfer(transferParametersLP);
    });

    return farmContract;
}