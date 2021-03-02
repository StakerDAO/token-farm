let setAccumulatedSTKRperShare = ((accumulatedSTKRperShare, storage): (nat, storage)): storage => {
    {
        ...storage,
        accumulatedSTKRPerShare: accumulatedSTKRperShare
    };
};
