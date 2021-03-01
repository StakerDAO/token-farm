import BigNumber from "bignumber.js";
import { mockContractStorage } from "./mockContract";
import decimals from '../../decimals-config.json';

/**
 * This is the client side implementation of the smart contract computation.
 * Calculations are done with the BigNumber library.
 */
export function computeReward(initialStorage: mockContractStorage, storage: mockContractStorage): BigNumber {
    const startBlockLevel = initialStorage.lastBlockUpdate;
    const endBlockLevel = storage.lastBlockUpdate;
    const multiplier = endBlockLevel.minus(startBlockLevel);

    const outstandingReward = multiplier.multipliedBy(initialStorage.plannedRewards.rewardPerBlock);

    const claimedRewards = (initialStorage.claimedRewards.paid).plus(initialStorage.claimedRewards.unpaid);
    const totalRewards = outstandingReward.plus(claimedRewards);
    const plannedRewards = (initialStorage.plannedRewards.rewardPerBlock).multipliedBy(initialStorage.plannedRewards.totalBlocks);
    const totalRewardsExhausted = totalRewards.isGreaterThan(plannedRewards);
    
    if (totalRewardsExhausted) {
        return plannedRewards.minus(claimedRewards)
    } else {
        return outstandingReward
    }
}

export function updateAccumulatdSTKRPerShare(initialStorage: mockContractStorage, reward: any): BigNumber {
    const previousAcc = new BigNumber(initialStorage.accumulatedSTKRPerShare);
    const rewardBN = new BigNumber(reward);
    const fixedPointAccuracy = new BigNumber(decimals.fixedPointAccuracy);
    const farmTokenBalance = new BigNumber(initialStorage.farmTokenBalance);
    const newRewardPerShare = rewardBN.multipliedBy(fixedPointAccuracy).dividedBy(farmTokenBalance).decimalPlaces(0,1) // cutting off any decimal
    
    return previousAcc.plus(newRewardPerShare)
}

