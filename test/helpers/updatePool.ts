import BigNumber from "bignumber.js";
import decimals from '../../decimals-config.json';
import { mockContractStorage } from "./types";

/**
 * This is the client side implementation of the smart contract computation.
 * Calculations are done with the BigNumber library.
 */
export function computeReward(initialStorage: mockContractStorage, storage: mockContractStorage): BigNumber {
    const startBlockLevel = initialStorage.farm.lastBlockUpdate;
    const endBlockLevel = storage.farm.lastBlockUpdate;
    const multiplier = endBlockLevel.minus(startBlockLevel);

    const outstandingReward = multiplier.multipliedBy(initialStorage.farm.plannedRewards.rewardPerBlock);

    const claimedRewards = (initialStorage.farm.claimedRewards.paid).plus(initialStorage.farm.claimedRewards.unpaid);
    const totalRewards = outstandingReward.plus(claimedRewards);
    const plannedRewards = (initialStorage.farm.plannedRewards.rewardPerBlock).multipliedBy(initialStorage.farm.plannedRewards.totalBlocks);
    const totalRewardsExhausted = totalRewards.isGreaterThan(plannedRewards);
    
    if (totalRewardsExhausted) {
        return plannedRewards.minus(claimedRewards)
    } else {
        return outstandingReward
    }
}

export function updateAccumulatedRewardPerShare(initialStorage: mockContractStorage, reward: any): BigNumber {
    const previousAcc = new BigNumber(initialStorage.farm.accumulatedRewardPerShare);
    const rewardBN = new BigNumber(reward);
    const fixedPointAccuracy = new BigNumber(decimals.fixedPointAccuracy);
    const farmLpTokenBalance = new BigNumber(initialStorage.farmLpTokenBalance);
    const newRewardPerShare = rewardBN.multipliedBy(fixedPointAccuracy).dividedBy(farmLpTokenBalance).decimalPlaces(0,1) // cutting off any decimal
    
    return previousAcc.plus(newRewardPerShare)
}

