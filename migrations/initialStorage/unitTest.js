const { MichelsonMap } = require('@taquito/taquito');
import BigNumber from 'bignumber.js';

const initialStorage = {};

initialStorage.base = () =>  ({
    lastBlockUpdate: new BigNumber(0),
    accumulatedSTKRPerShare: new BigNumber(0),
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
    stkrTokenContract: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
});

initialStorage.test = {};

initialStorage.test.calculateReward = (delegator, balance, rewardDebt, accumulatedSTKRPerShare) => {
    let storage = initialStorage.base();
    storage.delegators.set(delegator, {
        balance: balance,
        rewardDebt: rewardDebt
    });
    storage.accumulatedSTKRPerShare = accumulatedSTKRPerShare;
    
    return storage;
}

initialStorage.test.updateAccumulatedSTKRperShare = (accumulatedSTKRPerShare) => {
    let storage = initialStorage.base();
    storage.accumulatedSTKRPerShare = new BigNumber(accumulatedSTKRPerShare);
    return storage;
}

export default initialStorage;
