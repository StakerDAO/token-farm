/**
 * Emergency withdraw function called escape is an extra layer of protection
 * for delegators. Do not call this except the farm encounters a critical bug.
 */
let escape = ((escapeParameter, storage): (escapeParameter, storage)): entrypointReturn => {
    let delegator = Tezos.sender;
    let delegatorRecord = getDelegator(delegator, storage);
    
    let farmLpTokenBalance = safeBalanceSubtraction(storage.farmLpTokenBalance, delegatorRecord.balance); 
    let storage = setFarmLpTokenBalance(farmLpTokenBalance, storage);
    
    let lpTokenTransferOperation = transfer(
        Tezos.self_address, // from
        delegator, // to 
        delegatorRecord.balance, // value
        storage.addresses.lpTokenContract
    );
    
    let storage = removeDelegator(delegator, storage);
    ([lpTokenTransferOperation]: list(operation), storage);
};
