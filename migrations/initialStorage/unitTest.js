const { MichelsonMap } = require("@taquito/taquito");

const initialStorage = {};

import BigNumber from 'bignumber.js';
const e18 = '1000000000000000000';

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

initialStorage.test.updatePool = (
        accumulatedSTKRPerShare, 
        farmTokenBalance, 
        blockLevel, 
        rewardPerBlock, 
        totalBlocks, 
        unpaid, 
        paid
    ) => {
    let storage = initialStorage.base();
    
    storage.accumulatedSTKRPerShare = new BigNumber(accumulatedSTKRPerShare);
    storage.farmTokenBalance = new BigNumber(farmTokenBalance);
    storage.lastBlockUpdate = new BigNumber(blockLevel);

    storage.plannedRewards.rewardPerBlock = new BigNumber(rewardPerBlock);
    storage.plannedRewards.totalBlocks = new BigNumber(totalBlocks);

    storage.claimedRewards.unpaid = new BigNumber(unpaid);
    storage.claimedRewards.paid = new BigNumber(paid);

    return storage
}

initialStorage.test.requestBalance = (tokenContractAddress) => {
    let storage = initialStorage.base();
    storage.lpTokenContract = tokenContractAddress;
    return storage;
}


export default initialStorage;