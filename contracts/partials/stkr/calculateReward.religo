let calculateReward = ((delegator, storage): (address, storage)): nat => {
    let delegatorRecord = getDelegator(delegator, storage);
    
    let a = storage.accumulatedSTKRPerShare * delegatorRecord.balance;
    let b = delegatorRecord.rewardDebt;
    let userReward = safeBalanceSubtraction(a, b);    
    // remove precision
    let userReward = userReward / fixedPointAccuracy; // 30/12 = 18
    userReward;
};
