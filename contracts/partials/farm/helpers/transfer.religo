#if TOKEN_FA2
/**
 * This adapter is used to interact with TZIP-12 (FA2) token contracts.
 */
let transfer = ((from_, to_, value, tokenId, tokenContractAddress): (address, address, nat, nat, address)): operation => {
    let transferContents: transferContents = {
        to_: to_,
        token_id: tokenId,
        amount: value
    };
    
    let transfer = {
        from_: from_,
        txs: [transferContents]
    };

    let transferParameter: transferParameter = [transfer];

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
#else
/**
 * This adapter is used to interact with TZIP-7 (FA1.2) token contracts.
 */
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
#endif
