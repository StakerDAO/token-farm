let withdrawProfit = ((withdrawProfitParameter, storage): (withdrawProfitParameter, storage)): entrypointReturn => {
    // permission check for calling this function
    failIfNotAdmin(storage);
    
    let dexLpTokenContract: option(contract(withdrawProfitParameter)) = Tezos.get_entrypoint_opt(
        "%withdrawProfit", 
        storage.addresses.lpTokenContract
    );
    let dexLpTokenContract: contract(withdrawProfitParameter) = switch (dexLpTokenContract) {
        | Some(contract) => contract
        | None => (failwith(errorNoContractFound): contract(withdrawProfitParameter))
    };

    let withdrawProfitOperation = Tezos.transaction(
        withdrawProfitParameter,
        0tez,
        dexLpTokenContract
    );
    
    ([withdrawProfitOperation]: list(operation), storage);
};
