let setAccumulatedRewardPerShare = ((accumulatedRewardPerShare, storage): (nat, storage)): storage => {
    {
        ...storage,
        farm: {
            ...storage.farm,
            accumulatedRewardPerShare: accumulatedRewardPerShare
        }
    };
};
