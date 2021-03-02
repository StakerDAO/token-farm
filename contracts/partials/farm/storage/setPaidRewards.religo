let setPaidRewards = ((paidRewards, storage): (nat, storage)): storage => {
     {
        ...storage,
        claimedRewards: {
            ...storage.claimedRewards,
            paid: paidRewards
        }
    };
};
