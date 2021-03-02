#include "helpers/getAction.religo"

let computeReward = ((multiplier, storage): (nat, storage)): nat => {
    // new reward since the last time updatePoolWithRewards was called
    let outstandingReward = multiplier * storage.plannedRewards.rewardPerBlock;

    /**
     * This check is necessary in case updatePoolWithRewards was not called for a long time
     * and the outstandingReward grew to such a big number that it exceeds the planned rewards.
     * In that case only the differece between planned and claimed rewards is paid out to empty
     * the account.
     */
    let claimedRewards = storage.claimedRewards.paid + storage.claimedRewards.unpaid;
    let totalRewards = outstandingReward + claimedRewards;
    let plannedRewards = storage.plannedRewards.rewardPerBlock * storage.plannedRewards.totalBlocks;
    let totalRewardsExhausted = totalRewards > plannedRewards;
    let reward = switch(totalRewardsExhausted) {
        | true => abs(plannedRewards - claimedRewards)
        | false => outstandingReward
    };

    reward;
};

/**
 * This function adds the new reward to the claimed rewards and keeps track of it as yet unpaid.
 */
let updateUnpaidRewards = ((reward, storage): (nat, storage)): storage => {
    // add reward to unpaid rewards
    let unpaidRewards = storage.claimedRewards.unpaid + reward;
    setUnpaidRewards(unpaidRewards, storage);
};

let updateAccumulatedRewardPerShare = ((reward, contractBalance, storage): (nat, nat, storage)): storage => {
    let accumulatedRewardPerShare = storage.accumulatedRewardPerShare + reward * fixedPointAccuracy / contractBalance;
    setAccumulatedRewardPerShare(accumulatedRewardPerShare, storage);
};

let updatePoolWithRewards = ((blockLevel, farmTokenBalance, storage): (nat, nat, storage)): storage => {
    // number of blocks since last reward calculation
    let multiplier = abs(blockLevel - storage.lastBlockUpdate);
    // total rewards to be paid
    let reward = computeReward(multiplier, storage);
    // save unpaid reward
    let storage = updateUnpaidRewards(reward, storage);
    // recalculate reward per share and save it
    let storage = updateAccumulatedRewardPerShare(reward, farmTokenBalance, storage);
    
    setLastBlockUpdate(blockLevel, storage);
};

/**
 * This function is called at first at every interaction with the contract: %claim, %deposit and %withdraw.
 */
let updatePool = (storage: storage): storage => {
    let blockLevel = Tezos.level;

    let action = getAction(blockLevel, storage);
    
    switch(action) {
        /**
         * Skip when update pool was already called in the same block.
         */
        | Skip =>  storage;
        /**
         * Update only block level in case no LP token was delegated to the farm.
         */
        | UpdateBlock => setLastBlockUpdate(blockLevel, storage);
        /**
         * Update block level, rewards and accumulated reward per share.
         */
        | UpdateRewards => updatePoolWithRewards(blockLevel, storage.farmTokenBalance, storage);
    };    
};
