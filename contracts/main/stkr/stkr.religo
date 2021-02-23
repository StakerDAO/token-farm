#include "../../partials/stkr/storage/storage.religo"
#include "../../partials/stkr/constants.religo"
#include "../../partials/stkr/updatePool.religo"
#include "../../partials/stkr/errors.religo"
#include "../../partials/stkr/parameter.religo"

#include "../../partials/stkr/calculateReward.religo"

#include "../../partials/stkr/helpers/transfer.religo"

#include "../../partials/stkr/claim/claim.religo"
#include "../../partials/stkr/deposit/deposit.religo"
#include "../../partials/stkr/withdraw/withdraw.religo"

let main = ((parameter,storage): (parameter, storage)) => {
    switch(parameter) {
        | Deposit(parameter) => deposit(parameter, storage);
        | Claim(parameter) =>  claim(storage);
        | Withdraw(parameter) =>  withdraw(parameter, storage);
    }
};
