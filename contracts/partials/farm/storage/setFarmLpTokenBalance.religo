let setFarmLpTokenBalance = ((farmLpTokenBalance, storage): (nat, storage)): storage => {
    {
        ...storage,
        farmLpTokenBalance: farmLpTokenBalance
    };
};
