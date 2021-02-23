const { MichelsonMap } = require("@taquito/taquito");

const initialStorage = {};

initialStorage.base = {
    lastBlockUpdate: 0,
    accumulatedSTKRPerShare: 0,
    rewardPerBlock: 10,
    totalBlocks: 10000,
    unrealizedRewards: 0,
    realizedRewards: 0,
    delegators: new MichelsonMap,
    lpTokenContract: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
    stkrTokenContract: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
    farmTokenBalance: 0
};

initialStorage.withLpTokenContract = (tokenContractAddress) => {
    let storage = initialStorage.base;
    storage.lpTokenContract = tokenContractAddress;
    return storage
}

initialStorage.test = {};

initialStorage.test.claim = (stkrTokenContract, lpTokenContact) => {
    let storage = initialStorage.withLpTokenContract(lpTokenContact);
    storage.stkrTokenContract = stkrTokenContract;
    return storage;
}

module.exports = initialStorage;
