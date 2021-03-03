import { MichelsonMap } from "@taquito/taquito";
import BigNumber from 'bignumber.js';
import accounts from "../../scripts/sandbox/accounts";

const initialStorage = {};

initialStorage.base = () =>  ({
    lastBlockUpdate: new BigNumber(0),
    accumulatedRewardPerShare: new BigNumber(0),
    plannedRewards: {
        rewardPerBlock: new BigNumber(0),
        totalBlocks: new BigNumber(0),
    },
    claimedRewards: {
        unpaid: new BigNumber(0),
        paid: new BigNumber(0)
    },
    delegators: new MichelsonMap,
    reward: new BigNumber(0), // this is only for the mock contract
    lpTokenContract: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
    farmTokenBalance: new BigNumber(0),
    rewardTokenContract: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
    rewardReserve: accounts.walter.pkh
});

initialStorage.test = {};

initialStorage.test.calculateReward = (delegator, balance, accumulatedRewardPerShareStart, accumulatedRewardPerShare) => {
    let storage = initialStorage.base();
    storage.delegators.set(delegator, {
        balance: balance,
        stakingStart: accumulatedRewardPerShareStart
    });
    storage.accumulatedRewardPerShare = accumulatedRewardPerShare;
    
    return storage;
}

initialStorage.test.updateAccumulatedRewardPerShare = (accumulatedRewardPerShare) => {
    let storage = initialStorage.base();
    storage.accumulatedRewardPerShare = new BigNumber(accumulatedRewardPerShare);
    return storage;
}

export default initialStorage;
