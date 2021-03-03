import { MichelsonMap } from "@taquito/taquito";
import BigNumber from 'bignumber.js';
import accounts from "../../scripts/sandbox/accounts";

const initialStorage = {};

initialStorage.base = () => ({
    farm: {
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
    addresses: {
        lpTokenContract: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
        rewardTokenContract: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
        rewardReserve: accounts.walter.pkh
    }
});

initialStorage.withLpTokenContract = (tokenContractAddress) => {
    let storage = initialStorage.base();
    storage.addresses.lpTokenContract = tokenContractAddress;
    return storage
}

initialStorage.withLpAndRewardContract = (lpTokenContractAddress, rewardTokenContractAddress) => {
    let storage = initialStorage.base();
    storage.addresses.lpTokenContract = lpTokenContractAddress;
    storage.addresses.rewardTokenContract = rewardTokenContractAddress;
    return storage
}

initialStorage.test = {};

initialStorage.test.claim = (farmTokenContract, delegators, rewardPerBlock, blockLevel) => {
    let storage = initialStorage.base();
    
    storage.farm.plannedRewards.rewardPerBlock = new BigNumber(rewardPerBlock);
    storage.farm.plannedRewards.totalBlocks = new BigNumber(100);

    storage.addresses.rewardTokenContract = farmTokenContract;
    delegators.forEach(delegator => {
        storage.delegators.set(delegator.address, {
            balance: new BigNumber(delegator.balance),
            stakingStart: new BigNumber(delegator.stakingStart)
        })
        storage.farmLpTokenBalance = (new BigNumber(storage.farmLpTokenBalance)).plus(new BigNumber(delegator.balance)).toFixed()
    });
    storage.farm.lastBlockUpdate = new BigNumber(blockLevel);
    
    return storage;
};

initialStorage.test.deposit = (farmTokenContract, lpTokenContract, delegators, rewardPerBlock, blockLevel) => {
    let storage = initialStorage.base();
    
    storage.farm.plannedRewards.rewardPerBlock = new BigNumber(rewardPerBlock);
    storage.farm.plannedRewards.totalBlocks = new BigNumber(100);

    storage.addresses.rewardTokenContract = farmTokenContract;
    storage.addresses.lpTokenContract = lpTokenContract;
    delegators.forEach(delegator => {
        storage.delegators.set(delegator.address, {
            balance: new BigNumber(delegator.balance),
            stakingStart: new BigNumber(delegator.stakingStart)
        })
        storage.farmLpTokenBalance = (new BigNumber(storage.farmLpTokenBalance)).plus(new BigNumber(delegator.balance)).toFixed()
    });
    storage.farm.lastBlockUpdate = new BigNumber(blockLevel);
    
    return storage;
};

initialStorage.test.withdraw = (...args) => {
    let storage = initialStorage.test.deposit(...args);

    return storage;
};

// only for testing with the mockContract
initialStorage.test.updatePool = (
        accumulatedRewardPerShare, 
        farmLpTokenBalance, 
        blockLevel, 
        rewardPerBlock, 
        totalBlocks, 
        unpaid, 
        paid
    ) => {
        
    let storage = initialStorage.base();

    storage.farm.accumulatedRewardPerShare = new BigNumber(accumulatedRewardPerShare);
    storage.farmLpTokenBalance = new BigNumber(farmLpTokenBalance);
    storage.farm.lastBlockUpdate = new BigNumber(blockLevel);

    storage.farm.plannedRewards.rewardPerBlock = new BigNumber(rewardPerBlock);
    storage.farm.plannedRewards.totalBlocks = new BigNumber(totalBlocks);

    storage.farm.claimedRewards.unpaid = new BigNumber(unpaid);
    storage.farm.claimedRewards.paid = new BigNumber(paid);
    
    // adding reward only for mockContract testing
    storage.reward = new BigNumber(0);

    return storage
};

export default initialStorage;
