let setUnrealizedRewards = ((unrealizedRewards, storage): (nat, storage)): storage => {
     {
        ...storage,
        unrealizedRewards: unrealizedRewards
    };
};
