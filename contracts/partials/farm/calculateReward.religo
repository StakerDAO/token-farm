let calculateReward = ((delegator, storage): (address, storage)): nat => {
    let delegatorRecord = getDelegator(delegator, storage);
    
    let accRewardPerShareStart = delegatorRecord.stakingStart;
    let accRewardPerShareEnd = storage.farm.accumulatedRewardPerShare;
    let accumulatedRewardPerShare = safeBalanceSubtraction(accRewardPerShareEnd, accRewardPerShareStart);
    let delegatorReward = accumulatedRewardPerShare * delegatorRecord.balance;
    // remove precision
    let delegatorReward = delegatorReward / fixedPointAccuracy;
    delegatorReward;
};
