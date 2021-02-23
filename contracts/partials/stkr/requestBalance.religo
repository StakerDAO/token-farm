let requestBalanceOperation = ((ownerAddress, storage): (address, storage)): operation => {
    let tzip7Contract: option(contract(getBalanceParameter)) = Tezos.get_entrypoint_opt("%getBalance", storage.lpTokenContract);
    let tzip7Contract: contract(getBalanceParameter) = switch (tzip7Contract) {
        | Some(contract) => contract
        | None => (failwith(errorNoContractFound): contract(getBalanceParameter))
    };

    let callbackEntrypoint: option(contract(getBalanceResponse)) = Tezos.get_entrypoint_opt("%receive", Tezos.self_address);
    let callbackEntrypoint: contract(getBalanceResponse) = switch (callbackEntrypoint) {
        | Some(contract) => contract
        | None => (failwith(errorNoContractFound): contract(getBalanceResponse))
    };

    let request: getBalanceParameter = {
        owner: ownerAddress,
        callback: callbackEntrypoint,
    };
    let operation = Tezos.transaction(
        request,
        0mutez,
        tzip7Contract
    );
    operation;
};
