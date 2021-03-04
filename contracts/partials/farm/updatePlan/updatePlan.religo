let updatePlan = ((updatePlanParameter, storage): (updatePlanParameter, storage)): entrypointReturn => {
    // permission check for calling this function
    failIfNotAdmin(storage);
    
    /**
     * UpdatePool is necessary in case a "dry" farm gets "rehydrated".
     * Otherwise the reward scheme extension would be retroactive and unpredicatable.
     */
    let storage = updatePool(storage);

    let storage = setPlannedRewards(
        updatePlanParameter.rewardPerBlock,
        updatePlanParameter.totalBlocks,
        storage
    );
    ([]: list(operation), storage);
};
