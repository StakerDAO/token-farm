#include "../helpers/subtraction.religo"

let withdraw = ((withdrawParameter, storage): (withdrawParameter, storage)): entrypointReturn => {
    let storage = updatePool(storage);
    
    let (rewardTokenTransferOperationList, storage) = claim(storage);
    
    let delegator = Tezos.sender;
    let delegatorRecord = getDelegator(delegator, storage);
    
    let storage = decreaseDelegatorBalance(delegator, withdrawParameter, storage);
    let farmLpTokenBalance = safeBalanceSubtraction(storage.farmLpTokenBalance, withdrawParameter); 
    let storage = setFarmLpTokenBalance(farmLpTokenBalance, storage);

    let lpTokenTransferOperation = transfer(
        Tezos.self_address, // from
        delegator, // to 
        withdrawParameter, // value
        storage.addresses.lpTokenContract
    );
   
    ([lpTokenTransferOperation, ...rewardTokenTransferOperationList]: list(operation), storage);
};
