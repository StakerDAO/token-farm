const { MichelsonMap } = require("@taquito/taquito");

const initialStorage = {};

import BigNumber from 'bignumber.js';
const e18 = '1000000000000000000';

initialStorage.base = {
    lastBlockUpdate: 0,
    accumulatedSTKRPerShare: 0,
    plannedRewards: {
        rewardPerBlock: (new BigNumber(10).multipliedBy(e18)).toFixed(),
        totalBlocks: 0,
    },
    claimedRewards: {
        unpaid: 0,
        paid: 0
    },
    delegators: new MichelsonMap,
    reward: 0, // this is only for the mock contract
    lpTokenContract: "KT1VMWpGrBGehdRFCE2MAPTZNnDTg48jV7h8",
    farmTokenBalance: 0,
    stkrTokenContract: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
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

initialStorage.test.requestBalance = (tokenContractAddress) => {
    let storage = initialStorage.base;
    storage.lpTokenContract = tokenContractAddress;
    return storage;
}

export default initialStorage;