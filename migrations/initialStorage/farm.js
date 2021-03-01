const { MichelsonMap } = require("@taquito/taquito");
import BigNumber from 'bignumber.js';

const initialStorage = {};

initialStorage.base = () => ({
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
    lpTokenContract: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
    farmTokenBalance: new BigNumber(0),
    stkrTokenContract: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
});

initialStorage.withLpTokenContract = (tokenContractAddress) => {
    let storage = initialStorage.base();
    storage.lpTokenContract = tokenContractAddress;
    return storage
}

initialStorage.withLpAndStkrContract = (lpTokenContractAddress, stkrTokenContractAddress) => {
    let storage = initialStorage.base();
    storage.lpTokenContract = lpTokenContractAddress;
    storage.stkrTokenContract = stkrTokenContractAddress;
    return storage
}

initialStorage.test = {};

initialStorage.test.claim = (farmTokenContract, delegators, rewardPerBlock, blockLevel) => {
    let storage = initialStorage.base();
    
    storage.plannedRewards.rewardPerBlock = new BigNumber(rewardPerBlock);
    storage.plannedRewards.totalBlocks = new BigNumber(100);

    storage.stkrTokenContract = farmTokenContract;
    delegators.forEach(delegator => {
        storage.delegators.set(delegator.address, {
            balance: new BigNumber(delegator.balance),
            rewardDebt: new BigNumber(delegator.rewardDebt)
        })
        storage.farmTokenBalance = (new BigNumber(storage.farmTokenBalance)).plus(new BigNumber(delegator.balance)).toFixed()
    });
    storage.lastBlockUpdate = new BigNumber(blockLevel);
    
    return storage;
};

initialStorage.test.deposit = (farmTokenContract, lpTokenContract, delegators, rewardPerBlock, blockLevel) => {
    let storage = initialStorage.base();
    
    storage.plannedRewards.rewardPerBlock = new BigNumber(rewardPerBlock);
    storage.plannedRewards.totalBlocks = new BigNumber(100);

    storage.stkrTokenContract = farmTokenContract;
    storage.lpTokenContract = lpTokenContract;
    delegators.forEach(delegator => {
        storage.delegators.set(delegator.address, {
            balance: new BigNumber(delegator.balance),
            rewardDebt: new BigNumber(delegator.rewardDebt)
        })
        storage.farmTokenBalance = (new BigNumber(storage.farmTokenBalance)).plus(new BigNumber(delegator.balance)).toFixed()
    });
    storage.lastBlockUpdate = new BigNumber(blockLevel);
    
    return storage;
};

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
    
    // adding reward only for mockContract testing
    storage.reward = new BigNumber(0);

    return storage
};

export default initialStorage;
