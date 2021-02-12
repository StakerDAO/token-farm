let setLastBlockUpdate = ((blockLevel, storage): (nat, storage)): storage => {
    {
        ...storage,
        lastBlockUpdate: blockLevel
    };
};
