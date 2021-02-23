#include "../../../partials/stkr/test/mockStorage.religo"

#include "../../../partials/stkr/constants.religo"
#include "../../../partials/stkr/errors.religo"
#include "../../../partials/stkr/parameter.religo"

#include "../../../partials/stkr/updatePool.religo"
#include "../../../partials/stkr/calculateReward.religo"
#include "../../../partials/stkr/helpers/transfer.religo"

#include "../../../partials/stkr/claim/claim.religo"
#include "../../../partials/stkr/deposit/deposit.religo"
#include "../../../partials/stkr/withdraw/withdraw.religo"

type updatePoolParameter = {
    balance: nat,
    blockLevel: nat,
};
type updateAccumulatedSTKRperShareParameter = {
    balance: nat,
    reward: nat
};
type calculateRewardParameter = address;

type requestBalanceParameter = address;

type receiveParameter = nat;

type functionToTest =
    | UpdatePoolWithRewards(updatePoolParameter)
    | UpdateAccumulatedSTKRperShare(updateAccumulatedSTKRperShareParameter)
    | CalculateReward(calculateRewardParameter)
    //| RequestBalance(requestBalanceParameter)
    | Receive(receiveParameter);

let main = ((functionToTest, storage): (functionToTest, storage)) => {
    switch (functionToTest) {
        | UpdatePoolWithRewards(updatePoolParameter) => {
            let storage = updatePoolWithRewards(
                updatePoolParameter.blockLevel, 
                updatePoolParameter.balance,  
                storage
            );
            ([]: list(operation), storage);
        }
        | UpdateAccumulatedSTKRperShare(updateAccumulatedSTKRperShareParameter) => {
            let storage = updateAccumulatedSTKRperShare(
                updateAccumulatedSTKRperShareParameter.reward,
                updateAccumulatedSTKRperShareParameter.balance,
                storage
            );
            ([]: list(operation), storage);
        }
        | CalculateReward(address_) => {
            let reward = calculateReward((address_, storage));
            ([]:list(operation), {
                ...storage,
                reward: reward,
            });
        }
        // | RequestBalance(address_) => {
        //     let operation = requestBalanceOperation((address_, storage));
        //     (
        //         [operation],
        //         storage
        //     )
        // }
        | Receive(value) => {
            if(Tezos.sender != storage.lpTokenContract){
                failwith("NoPermission")
            };
            ([]:list(operation),
            {
                ...storage,
                reward: value
            })
        }
    };
};
