type action = Skip | UpdateRewards;
let getAction = ((factoryBalance): (nat)): action => {
    switch(factoryBalance == 0n) {
        | true => Skip
        | false => UpdateRewards
    };
};

let computeReward = ((multiplier, storage): (nat, storage)): nat => {
    let reward = multiplier * storage.rewardPerBlock;

    let totalRewards = reward + storage.realizedRewards + storage.unrealizedRewards;
    let plannedRewards = storage.rewardPerBlock * storage.totalBlocks;
    // following true when someone claims() or withdraws() while total rewards had been used up
    let totalRewardsExhausted = totalRewards > plannedRewards;
    let reward = switch(totalRewardsExhausted) {
        | true => abs(plannedRewards - storage.realizedRewards - storage.unrealizedRewards)
        | false => reward
    };

    reward;
};

let updateUnrealizedRewards = ((reward, storage): (nat, storage)): storage => {
    // add reward to unrealized rewards
    let unrealizedRewards = storage.unrealizedRewards + reward;
    setUnrealizedRewards(unrealizedRewards, storage);
};

let updateAccumulatedSTKRperShare = ((reward, factoryBalance, storage): (nat, nat, storage)): storage => {
    let accumulatedSTKRPerShare = storage.accumulatedSTKRPerShare + reward * fixedPointAccuracy / factoryBalance;
    setAccumulatedSTKRperShare(accumulatedSTKRPerShare, storage);
};

let updatePoolWithBlockLevel = ((blockLevel, factoryBalance, storage): (nat, nat, storage)): storage => {
    let action = getAction(factoryBalance);
    switch(action) {
        | Skip => setLastBlockUpdate(blockLevel, storage)
        | UpdateRewards => {
            // number of blocks since last reward calculation
            let multiplier = abs(blockLevel - storage.lastBlockUpdate);
            // total rewards to be paid
            let reward = computeReward(multiplier, storage);
            // save total rewards
            let storage = updateUnrealizedRewards(reward, storage);
            // recalculate STKR per share
            let storage = updateAccumulatedSTKRperShare(reward, factoryBalance, storage);

            setLastBlockUpdate(blockLevel, storage);
        }
    };
};

let updatePool = (storage: storage): storage => {
    storage;
    // TODO: move to ligo@next with next rolling release
    // let blockLevel = Tezos.level;
    // let needsUpdate = blockLevel != storage.lastBlockUpdate;
    // switch(needsUpdate) {
    //     | true => {
    //         // fetch balance from LP token contract
    //         // updatePoolWithblockLevel(blockLevel, balance, storage);
    //     }
    //     | false => storage; // no getBalance needed, skip
    // };
};
