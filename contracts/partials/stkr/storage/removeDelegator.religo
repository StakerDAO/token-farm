let removeDelegator = ((delegator, storage):(address, storage)): storage => {
    let delegators = Big_map.remove(
        delegator,
        storage.delegators
    );
    {
        ...storage,
        delegators: delegators
    };
};
