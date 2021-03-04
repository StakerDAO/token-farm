let isAdmin = (storage: storage): bool => {
    Tezos.sender == storage.addresses.admin;
};

let failIfNotAdmin = (storage: storage): unit => {
    let isAdmin = isAdmin(storage);
    switch(isAdmin) {
        | true => unit
        | false => (failwith(errorSenderIsNotAdmin): unit)
    };
};
