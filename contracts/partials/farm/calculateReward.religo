let calculateReward = ((delegator, storage): (address, storage)): nat => {
    let delegatorRecord = getDelegator(delegator, storage);
    
    let reward = storage.accumulatedRewardPerShare * delegatorRecord.balance;
    let rewardDebt = delegatorRecord.rewardDebt;
    let delegatorReward = safeBalanceSubtraction(reward, rewardDebt);    
    // remove precision
    let delegatorReward = delegatorReward / fixedPointAccuracy;
    delegatorReward;
};
