#include "../../../partials/farm/test/mockStorage.religo"

#include "../../../partials/farm/constants.religo"
#include "../../../partials/farm/errors.religo"
#include "../../../partials/farm/parameter.religo"

#include "../../../partials/farm/updatePool.religo"
#include "../../../partials/farm/calculateReward.religo"
#include "../../../partials/farm/helpers/transfer.religo"

type entrypointReturn = (list(operation), storage);

#include "../../../partials/farm/claim/claim.religo"
#include "../../../partials/farm/deposit/deposit.religo"
#include "../../../partials/farm/withdraw/withdraw.religo"

type updatePoolWithRewardsParameter = {
    balance: nat,
    blockLevel: nat,
};
type updateAccumulatedRewardPerShareParameter = {
    balance: nat,
    reward: nat
};
type calculateRewardParameter = address;

type receiveParameter = nat;

type updatePoolParameter = unit;

type functionToTest =
    | UpdatePoolWithRewards(updatePoolWithRewardsParameter)
    | UpdatePool(updatePoolParameter)
    | UpdateAccumulatedRewardPerShare(updateAccumulatedRewardPerShareParameter)
    | CalculateReward(calculateRewardParameter)
    | Receive(receiveParameter);

let main = ((functionToTest, storage): (functionToTest, storage)) => {
    switch (functionToTest) {
        | UpdatePoolWithRewards(updatePoolWithRewardsParameter) => {
            let storage = updatePoolWithRewards(
                updatePoolWithRewardsParameter.blockLevel, 
                updatePoolWithRewardsParameter.balance,  
                storage
            );
            ([]: list(operation), storage);
        }
        | UpdatePool(updatePoolParameter) => {
            let storage = updatePool(storage);
            ([]: list(operation), storage);
        }
        | UpdateAccumulatedRewardPerShare(updateAccumulatedRewardPerShareParameter) => {
            let storage = updateAccumulatedRewardPerShare(
                updateAccumulatedRewardPerShareParameter.reward,
                updateAccumulatedRewardPerShareParameter.balance,
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
