#include "../../../partials/stkr/test/mockStorage.religo"

#include "../../../partials/stkr/constants.religo"
#include "../../../partials/stkr/errors.religo"

#include "../../../partials/stkr/updatePool.religo"
#include "../../../partials/stkr/calculateReward.religo"

type updatePoolParameter = {
    balance: nat,
    blockLevel: nat,
};
type updateAccumulatedSTKRperShareParameter = {
    balance: nat,
    reward: nat
};
type calculateRewardParameter = address;

type functionToTest =
    | UpdatePool(updatePoolParameter)
    | UpdateAccumulatedSTKRperShare(updateAccumulatedSTKRperShareParameter)
    | CalculateReward(calculateRewardParameter);

let main = ((functionToTest, storage): (functionToTest, storage)) => {
    let storage =
        switch (functionToTest) {
            | UpdatePool(updatePoolParameter) => {
                updatePoolWithBlockLevel(
                    updatePoolParameter.blockLevel, 
                    updatePoolParameter.balance,  
                    storage
                );
            }
            | UpdateAccumulatedSTKRperShare(updateAccumulatedSTKRperShareParameter) => {
                updateAccumulatedSTKRperShare(
                    updateAccumulatedSTKRperShareParameter.reward,
                    updateAccumulatedSTKRperShareParameter.balance,
                    storage
                );
            }
            | CalculateReward(address_) => {
                let reward = calculateReward((address_, storage));
                {
                    ...storage,
                    reward: reward,
                };
            }
        };
    ([]: list(operation), storage);
};
