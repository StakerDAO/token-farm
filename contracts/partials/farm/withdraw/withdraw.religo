#include "../helpers/subtraction.religo"

let withdraw = ((withdrawParameter, storage): (withdrawParameter, storage)): (list(operation), storage) => {
    let storage = updatePool(storage);
    
    let (rewardTokenTransferOperationList, storage) = claim(storage);
    
    let delegator = Tezos.sender;
    let delegatorRecord = getDelegator(delegator, storage);
    
    let storage = decreaseDelegatorBalance(delegator, withdrawParameter, storage);
    let farmTokenBalance = safeBalanceSubtraction(storage.farmTokenBalance, withdrawParameter); 
    let storage = setFarmTokenBalance(farmTokenBalance, storage);

    let lpTokenTransferOperation = transfer(
        Tezos.self_address, // from
        delegator, // to 
        withdrawParameter, // value
        storage.lpTokenContract
    );
   
    ([lpTokenTransferOperation, ...rewardTokenTransferOperationList]: list(operation), storage);
};
