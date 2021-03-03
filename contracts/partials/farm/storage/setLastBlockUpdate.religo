let setLastBlockUpdate = ((blockLevel, storage): (nat, storage)): storage => {
    {
        ...storage,
        farm: {
            ...storage.farm,
            lastBlockUpdate: blockLevel
        }
    };
};
