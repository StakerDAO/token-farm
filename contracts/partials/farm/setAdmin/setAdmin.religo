let setAdmin = ((setAdminParameter, storage): (setAdminParameter, storage)): entrypointReturn => {
    // permission check for calling this function
    failIfNotAdmin(storage);

    let storage = setAdminProperty(setAdminParameter, storage);

    ([]:list(operation), storage);
};
