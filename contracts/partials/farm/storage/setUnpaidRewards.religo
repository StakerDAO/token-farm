let setUnpaidRewards = ((unpaidRewards, storage): (nat, storage)): storage => {
     {
        ...storage,
        farm: {
            ...storage.farm,
            claimedRewards: {
                ...storage.farm.claimedRewards,
                unpaid: unpaidRewards
            }
        } 
    };
};
