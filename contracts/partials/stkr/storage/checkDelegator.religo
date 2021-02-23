let checkDelegator = ((delegator, storage): (address, storage)): bool => {
    let delegator = Big_map.find_opt(
        delegator, 
        storage.delegators
    );
    switch(delegator) {
        | Some(delegator) => true
        | None => false
    };
};
