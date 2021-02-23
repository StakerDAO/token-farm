let setPaidRewards = ((paidRewards, storage): (nat, storage)): storage => {
     {
        ...storage,
        realizedRewards: paidRewards
    };
};
