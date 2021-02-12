#include "./storage/getDelegator.religo"

let calculateReward = ((delegator, storage): (address, storage)): nat => {
    let record = getDelegator(delegator, storage);
    
    let reward = storage.accumulatedSTKRPerShare * record.balance - record.rewardDebt * fixedPointAccuracy;
    // int to nat
    abs(reward);
};
