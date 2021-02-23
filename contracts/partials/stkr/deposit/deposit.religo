let deposit = ((depositParameter, storage): (depositParameter, storage)): (list(operation), storage) => {
    let isDelegatorKnown = checkDelegator(Tezos.sender, storage);
    let (stkrTokenTransferOperationList, storage) = switch(isDelegatorKnown) {
        | true => claim(storage)
        // no stkr token transfer, only update pool
        | false => ([]: list(operation), updatePool(storage))
    };
   
    let storage = increaseDelegatorBalance(Tezos.sender, depositParameter, storage);

    let lpTokenTransferOperation = transfer(
        Tezos.sender, // from
        Tezos.self_address, // to
        depositParameter, // value
        storage.lpTokenContract // tzip7 contract's address
    );

    ([lpTokenTransferOperation, ...stkrTokenTransferOperationList], storage);
}
