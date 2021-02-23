let calculateReward = ((delegator, storage): (address, storage)): nat => {
    let record = getDelegator(delegator, storage);
    
    let userReward = storage.accumulatedSTKRPerShare * record.balance - record.rewardDebt;
    // int to nat
    let userReward = abs(userReward);
    let userReward = userReward / fixedPointAccuracy27;
    userReward;
};
