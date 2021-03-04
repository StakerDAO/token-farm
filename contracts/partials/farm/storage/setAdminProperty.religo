let setAdminProperty = ((admin, storage): (address, storage)): storage => {
    {
        ...storage,
        addresses: {
            ...storage.addresses,
            admin: admin
        }
    };
};
