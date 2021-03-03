let setPaidRewards = ((paidRewards, storage): (nat, storage)): storage => {
     {
        ...storage,
        farm: {
            ...storage.farm,
            claimedRewards: {
                ...storage.farm.claimedRewards,
                paid: paidRewards
            }
        }
    };
};
