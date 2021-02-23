#include "../helpers/subtraction.religo"

let withdraw = ((withdrawParameter, storage): (withdrawParameter, storage)): (list(operation), storage) => {
    // claim performs updatePool()
    let (stkrTokenTransferOperationList, storage) = claim(storage);
    
    let delegatorRecord = getDelegator(Tezos.sender, storage);
    
    let storage = decreaseDelegatorBalance(Tezos.sender, withdrawParameter, storage);
    let farmTokenBalance = safeBalanceSubtraction(storage.farmTokenBalance, withdrawParameter); 
    let storage = setFarmTokenBalance(farmTokenBalance, storage);

    let lpTokenTransferOperation = transfer(Tezos.self_address, Tezos.sender, withdrawParameter, storage.lpTokenContract);
   
    ([lpTokenTransferOperation, ...stkrTokenTransferOperationList]: list(operation), storage);
};
