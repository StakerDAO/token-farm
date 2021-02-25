const { MichelsonMap } = require("@taquito/taquito");

const initialStorage = {};
import BigNumber from 'bignumber.js';

initialStorage.base = () => ({
    lastBlockUpdate: 0,
    accumulatedSTKRPerShare: 0,
    plannedRewards: {
        rewardPerBlock: 0,
        totalBlocks: 10000,
    },
    claimedRewards: {
        unpaid: 0,
        paid: 0
    },
    delegators: new MichelsonMap,
    lpTokenContract: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
    stkrTokenContract: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
    farmTokenBalance: 0
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

initialStorage.test.claim = (stkrTokenContract, delegators, rewardPerBlock, blockLevel) => {
    let storage = initialStorage.base();
    
    storage.plannedRewards.rewardPerBlock = rewardPerBlock;

    storage.stkrTokenContract = stkrTokenContract;
    delegators.forEach(delegator => {
        storage.delegators.set(delegator.address, {
            balance: delegator.balance,
            rewardDebt: delegator.rewardDebt
        })
        storage.farmTokenBalance = (new BigNumber(storage.farmTokenBalance)).plus(new BigNumber(delegator.balance)).toFixed()
    });
    storage.lastBlockUpdate = blockLevel;
    
    return storage;
}

export default initialStorage;
