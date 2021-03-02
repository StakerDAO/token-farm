#include "../../partials/farm/storage/storage.religo"
#include "../../partials/farm/constants.religo"
#include "../../partials/farm/updatePool.religo"
#include "../../partials/farm/errors.religo"
#include "../../partials/farm/parameter.religo"

#include "../../partials/farm/calculateReward.religo"

#include "../../partials/farm/helpers/transfer.religo"

type entrypointReturn = (list(operation), storage);

#include "../../partials/farm/claim/claim.religo"
#include "../../partials/farm/deposit/deposit.religo"
#include "../../partials/farm/withdraw/withdraw.religo"


let main = ((parameter,storage): (parameter, storage)): entrypointReturn => {
    switch(parameter) {
        | Deposit(parameter) => deposit(parameter, storage);
        | Claim(parameter) => claim(storage);
        | Withdraw(parameter) =>  withdraw(parameter, storage);
    };
};
