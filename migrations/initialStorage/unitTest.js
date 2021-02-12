const { MichelsonMap } = require("@taquito/taquito");

const initialStorage = {};

initialStorage.base = {
    lastBlockUpdate: 0,
    accumulatedSTKRPerShare: 0,
    rewardPerBlock: 0,
    totalBlocks: 0,
    unrealizedRewards: 0,
    realizedRewards: 0,
    delegators: new MichelsonMap,
    reward: 0, // this is only for the mock contract
};

initialStorage.test = {};

initialStorage.test.calculateReward = (delegator, balance, rewardDebt, accumulatedSTKRPerShare) => {
    let storage = initialStorage.base;
    storage.delegators.set(delegator, {
        balance: balance,
        rewardDebt: rewardDebt
    });
    storage.accumulatedSTKRPerShare = accumulatedSTKRPerShare;
    return storage;
}

initialStorage.test.updateAccumulatedSTKRperShare = (accumulatedSTKRPerShare) => {
    let storage = initialStorage.base;
    storage.accumulatedSTKRPerShare = accumulatedSTKRPerShare;
    return storage;
}

initialStorage.test.updatePool = () => {
    // TODO expose all properties except delegators and rewards
    return initialStorage.base
}

module.exports = initialStorage;