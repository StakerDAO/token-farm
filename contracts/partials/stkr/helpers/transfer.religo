let transfer = ((from_, to_, value, tokenContractAddress): (address, address, nat, address)): operation => {
    let transferParameter: transferParameter = {
        from_: from_,
        to_: to_,
        value: value
    };
    let tokenContract: option(contract(transferParameter)) = Tezos.get_entrypoint_opt("%transfer", tokenContractAddress);
    let tokenContract: contract(transferParameter) = switch (tokenContract) {
        | Some(contract) => contract
        | None => (failwith(errorNoContractFound): contract(transferParameter))
    };

    let operation = Tezos.transaction(
        transferParameter,
        0tez,
        tokenContract
    );
    operation;
};
