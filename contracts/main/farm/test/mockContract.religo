#include "../../../partials/farm/test/mockStorage.religo"

#include "../../../partials/farm/constants.religo"
#include "../../../partials/farm/errors.religo"
#include "../../../partials/farm/parameter.religo"

#include "../../../partials/farm/updatePool.religo"
#include "../../../partials/farm/calculateReward.religo"
#include "../../../partials/farm/helpers/transfer.religo"

type entrypointReturn = (list(operation), storage);

type updatePoolParameter = unit;

type functionToTest =
    | UpdatePool(updatePoolParameter)
    | U(unit);

let main = ((functionToTest, storage): (functionToTest, storage)) => {
    switch (functionToTest) {
        | UpdatePool(updatePoolParameter) => {
            let storage = updatePool(storage);
            ([]: list(operation), storage);
        }
        | U(parameter) => ([]: list(operation), storage)
    };
};
