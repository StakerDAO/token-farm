[@inline]
let claim = ((storage): (storage)): entrypointReturn => {
    let storage = updatePool(storage); 

    let delegator = Tezos.sender;
    let delegatorReward = calculateReward(delegator, storage);
    // after claim reward debt for delegator needs to be updated
    let storage = updateRewardDebt(delegator, storage);

    // update paid and unpaid properties in claimedRewards
    let unpaidRewards = safeBalanceSubtraction(storage.claimedRewards.unpaid, delegatorReward);
    let storage = setUnpaidRewards(unpaidRewards, storage);
    let paidRewards = storage.claimedRewards.paid + delegatorReward;
    let storage = setPaidRewards(paidRewards, storage);

    // transfer reward token
    let tokenTransferOperation = transfer(
        storage.rewardReserve, // from
        delegator, // to
        delegatorReward, // value
        storage.rewardTokenContract // tzip7 contract's address
    );
    
    ([tokenTransferOperation], storage);
};
