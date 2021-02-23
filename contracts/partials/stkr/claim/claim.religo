[@inline]
let claim = (storage: storage): (list(operation), storage) => {
    let storage = updatePool(storage);
    let userReward = calculateReward(Tezos.sender, storage);

    let storage = {
        ...storage,
        unrealizedRewards: abs(storage.unrealizedRewards - userReward),
        realizedRewards: storage.realizedRewards + userReward
    };

    let tokenTransferOperation = transfer(
        Tezos.self_address, // from
        Tezos.sender, // to
        userReward, // value
        storage.stkrTokenContract // tzip7 contract's address
    );
 
    ([tokenTransferOperation], storage);
};
