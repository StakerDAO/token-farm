let setUnpaidRewards = ((unpaidRewards, storage): (nat, storage)): storage => {
     {
        ...storage,
        claimedRewards: {
            ...storage.claimedRewards,
            unpaid: unpaidRewards
        }
    };
};
