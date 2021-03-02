let setAccumulatedRewardPerShare = ((accumulatedRewardPerShare, storage): (nat, storage)): storage => {
    {
        ...storage,
        accumulatedRewardPerShare: accumulatedRewardPerShare
    };
};
