let isAdmin = (storage: storage): bool => {
    Tezos.sender == storage.addresses.admin;
};

let failIfNotAdmin = (storage: storage): unit => {
    let isAdmin = isAdmin(storage);
    switch (isAdmin) {
        | true => unit
        | false => (failwith(errorSenderIsNotAdmin): unit)
    };
};

/**
 * Checks whether the smart contract invoking transaction carries any Tez.
 */
let isInboundTez = (unit: unit): bool => {
    Tezos.amount > 0mutez;
};

let failIfInboundTez = (unit: unit): unit => {
    let isInboundTez = isInboundTez(unit);
    switch (isInboundTez) {
        | true => (failwith(errorInboundTezNotAllowed): unit)
        | false => unit
    };
};
