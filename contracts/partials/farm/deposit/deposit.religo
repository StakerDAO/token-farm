let deposit = ((depositParameter, storage): (depositParameter, storage)): entrypointReturn => {
    let storage = updatePool(storage);
    
    let delegator = Tezos.sender;
    
    // call claim() for existing delegator
    let isDelegatorKnown = checkDelegator(delegator, storage);
    let (rewardTokenTransferOperationList, storage) = switch(isDelegatorKnown) {
        | true => claim(storage)
        | false => ([]: list(operation), storage)
    };
    
    // save new deposit and accumulatedRewardPerShareStart
    let storage = switch (isDelegatorKnown) {
        | true => increaseDelegatorBalance(delegator, depositParameter, storage);
        | false => initDelegatorBalance(delegator, depositParameter, storage);
    };

    // save new deposit in farm's balance
    let farmLpTokenBalance = storage.farmLpTokenBalance + depositParameter;
    let storage = setFarmLpTokenBalance(farmLpTokenBalance, storage);

    // transfer LP tokens
    let lpTokenTransferOperation = transfer(
        delegator, // from
        Tezos.self_address, // to
        depositParameter, // value
#if TOKEN_FA2
        storage.tokenIds.lp, // tokenId
#endif
        storage.addresses.lpTokenContract // tzip7 contract's address
    );

    ([lpTokenTransferOperation, ...rewardTokenTransferOperationList], storage);
};
