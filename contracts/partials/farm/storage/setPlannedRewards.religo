let setPlannedRewards = ((rewardPerBlock, totalBlocks, storage): (nat, nat, storage)): storage => {
    {
        ...storage,
        farm: {
            ...storage.farm,
            plannedRewards: {
                rewardPerBlock: rewardPerBlock,
                totalBlocks: totalBlocks
            }
        }
    };
};
