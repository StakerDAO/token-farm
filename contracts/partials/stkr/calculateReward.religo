let calculateReward = ((delegator, storage): (address, storage)): nat => {
    let delegatorRecord = getDelegator(delegator, storage);
    
    let rewardProduct = storage.accumulatedSTKRPerShare * delegatorRecord.balance;
    let rewardDebt = delegatorRecord.rewardDebt;
    let userReward = safeBalanceSubtraction(rewardProduct, rewardDebt);    
    // remove precision
    let userReward = userReward / fixedPointAccuracy;
    userReward;
};
