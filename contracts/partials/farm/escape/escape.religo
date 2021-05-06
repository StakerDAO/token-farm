/**
 * Emergency withdraw function called escape is an extra layer of protection
 * for delegators. Do not call this except the farm encounters a critical bug.
 */
let escape = ((escapeParameter, storage): (escapeParameter, storage)): entrypointReturn => {
    let delegator = Tezos.sender;
    let delegatorRecord = getDelegator(delegator, storage);
    // update farm's LP token balance
    let farmLpTokenBalance = safeBalanceSubtraction(storage.farmLpTokenBalance, delegatorRecord.lpTokenBalance); 
    let storage = setFarmLpTokenBalance(farmLpTokenBalance, storage);
    // remove delegator after successfully updating internal LP farm ledger
    let storage = removeDelegator(delegator, storage);

    // transfer LP token
    let lpTokenTransferOperation = transfer(
        Tezos.self_address, // from
        delegator, // to 
        delegatorRecord.lpTokenBalance, // value
#if TOKEN_FA2
        storage.tokenIds.lp, // tokenId
#endif
        storage.addresses.lpTokenContract
    );
    
    ([lpTokenTransferOperation]: list(operation), storage);
};
