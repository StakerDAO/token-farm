type action = Skip | UpdateBlock | UpdateRewards;
let getAction = ((blockLevel, storage): (nat, storage)): action => {
    let poolNeedsUpdate = blockLevel != storage.lastBlockUpdate;

    if(poolNeedsUpdate) {
        switch(storage.farmTokenBalance == 0n) {
            | true => UpdateBlock
            | false => UpdateRewards
    };
    } else {
        Skip
    };
};

let computeReward = ((multiplier, storage): (nat, storage)): nat => {
    let reward = multiplier * storage.rewardPerBlock;

    let claimedRewards = storage.realizedRewards + storage.unrealizedRewards;
    let totalRewards = reward + claimedRewards;
    let plannedRewards = storage.rewardPerBlock * storage.totalBlocks;
    // following true when someone claims() or withdraws() while total rewards had been used up
    let totalRewardsExhausted = totalRewards > plannedRewards;
    let reward = switch(totalRewardsExhausted) {
        | true => abs(plannedRewards - claimedRewards)
        | false => reward
    };

    reward;
};

let updateUnrealizedRewards = ((reward, storage): (nat, storage)): storage => {
    // add reward to unrealized rewards
    let unrealizedRewards = storage.unrealizedRewards + reward;
    setUnrealizedRewards(unrealizedRewards, storage);
};

let updateAccumulatedSTKRperShare = ((reward, contractBalance, storage): (nat, nat, storage)): storage => {
    let accumulatedSTKRPerShare = storage.accumulatedSTKRPerShare + reward * fixedPointAccuracy27 / contractBalance;
    setAccumulatedSTKRperShare(accumulatedSTKRPerShare, storage);
};

let updatePoolWithRewards = ((blockLevel, farmTokenBalance, storage): (nat, nat, storage)): storage => {
    // number of blocks since last reward calculation
    let multiplier = abs(blockLevel - storage.lastBlockUpdate);
    // total rewards to be paid
    let reward = computeReward(multiplier, storage);
    // save total rewards
    let storage = updateUnrealizedRewards(reward, storage);
    // recalculate STKR per share
    let storage = updateAccumulatedSTKRperShare(reward, farmTokenBalance, storage);

    setLastBlockUpdate(blockLevel, storage);
};

let updatePool = (storage: storage): storage => {
    let blockLevel = Tezos.level;
    let action = getAction(blockLevel, storage);
    switch(action) {
        | Skip => storage; // no getBalance needed, skip
        | UpdateBlock => setLastBlockUpdate(blockLevel, storage)
        | UpdateRewards => {
            updatePoolWithRewards(blockLevel, storage.farmTokenBalance, storage);
        }
    };
};
