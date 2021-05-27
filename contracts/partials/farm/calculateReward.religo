let calculateReward = ((delegator, storage): (address, storage)): nat => {
    let delegatorRecord = getDelegatorRecord(delegator, storage);
    
    let accRewardPerShareStart = delegatorRecord.accumulatedRewardPerShareStart;
    let accRewardPerShareEnd = storage.farm.accumulatedRewardPerShare;
    let accumulatedRewardPerShare = safeBalanceSubtraction(accRewardPerShareEnd, accRewardPerShareStart);
    let delegatorReward = accumulatedRewardPerShare * delegatorRecord.lpTokenBalance;
    // remove precision
    let delegatorReward = delegatorReward / fixedPointAccuracy;
    delegatorReward;
};
