import { MichelsonMap } from "@taquito/taquito";
import BigNumber from 'bignumber.js';
import accounts from "../../scripts/sandbox/accounts";

const initialStorage = {};

initialStorage.base = () => ({
    pool: {
        lastBlockUpdate: new BigNumber(0),
        accumulatedRewardPerShare: new BigNumber(0),
        plannedRewards: {
            rewardPerBlock: new BigNumber(0),
            totalBlocks: new BigNumber(0),
        },
        claimedRewards: {
            unpaid: new BigNumber(0),
            paid: new BigNumber(0)
        }
    },
    delegators: new MichelsonMap,
    farmLpTokenBalance: new BigNumber(0),
    address: {
        admin: accounts.alice.pkh,
        lpTokenContract: accounts.alice.pkh,
        rewardTokenContract: accounts.alice.pkh,
        rewardReserve: accounts.walter.pkh
    },
    reward: new BigNumber(0), // this is only for the mock contract
});

initialStorage.test = {};

initialStorage.test.calculateReward = (delegator, balance, accumulatedRewardPerShareStart, accumulatedRewardPerShare) => {
    let storage = initialStorage.base();
    storage.delegators.set(delegator, {
        balance: balance,
        stakingStart: accumulatedRewardPerShareStart
    });
    storage.pool.accumulatedRewardPerShare = accumulatedRewardPerShare;
    
    return storage;
}

initialStorage.test.updateAccumulatedRewardPerShare = (accumulatedRewardPerShare) => {
    let storage = initialStorage.base();
    storage.pool.accumulatedRewardPerShare = new BigNumber(accumulatedRewardPerShare);
    return storage;
}

export default initialStorage;
