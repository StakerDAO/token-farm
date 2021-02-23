let setFarmTokenBalance = ((farmTokenBalance, storage): (nat, storage)): storage => {
    let storage = {
        ...storage,
        farmTokenBalance: farmTokenBalance
    };
    storage;
};
