#include "../helpers/subtraction.religo"

let getDelegator = ((delegator, storage): (address, storage)): delegatorRecord => {
    let delegatorRecord = Big_map.find_opt(
        delegator, 
        storage.delegators
    );
    switch(delegatorRecord) {
        | Some(delegatorRecord) => delegatorRecord
        | None => (failwith(errorDelegatorNotKnown): delegatorRecord)
    };
};

let checkDelegator = ((delegator, storage): (address, storage)): bool => {
    let delegator = Big_map.find_opt(
        delegator, 
        storage.delegators
    );
    switch(delegator) {
        | Some(_delegator) => true
        | None => false
    };
};

let setDelegatorRecord = ((delegator, delegatorRecord, storage): (address, delegatorRecord, storage)): storage => {
    let delegators = Big_map.update(
        delegator,
        Some(delegatorRecord),
        storage.delegators
    );
    {
        ...storage,
        delegators: delegators
    };
};

let removeDelegator = ((delegator, storage):(address, storage)): storage => {
    let delegators = Big_map.remove(
        delegator,
        storage.delegators
    );
    {
        ...storage,
        delegators: delegators
    };
};

let updateDelegatorRecord = ((delegator, stakedBalance, storage): (address, nat, storage)): storage => {
    let delegatorRecord: delegatorRecord = {
        lpTokenBalance: stakedBalance,
        accumulatedRewardPerShareStart: storage.farm.accumulatedRewardPerShare
    };
    let storage = setDelegatorRecord(delegator, delegatorRecord, storage);
    storage;
};

let updateRewardDebt = ((delegator, storage): (address, storage)): storage => {
    let delegatorRecord = getDelegator(delegator, storage);
    let storage = updateDelegatorRecord(
        delegator, 
        delegatorRecord.lpTokenBalance, 
        storage
    );
    storage;
};

let decreaseDelegatorBalance = ((delegator, value, storage): (address, nat, storage)): storage => {
    let delegatorRecord = getDelegator(delegator, storage);
    let stakedBalance = safeBalanceSubtraction(delegatorRecord.lpTokenBalance, value);
    updateDelegatorRecord(delegator, stakedBalance, storage);
};

let increaseDelegatorBalance = ((delegator, value, storage): (address, nat, storage)): storage => {
    let delegatorRecord = getDelegator(delegator, storage);
    let stakedBalance = delegatorRecord.lpTokenBalance + value;
    updateDelegatorRecord(delegator, stakedBalance, storage);
};

let initDelegatorBalance = ((delegator, value, storage): (address, nat, storage)): storage => {
    let delegatorRecord: delegatorRecord = {
        lpTokenBalance: 0n,
        accumulatedRewardPerShareStart: 0n
    };
    let stakedBalance = delegatorRecord.lpTokenBalance + value;
    updateDelegatorRecord(delegator, stakedBalance, storage);
};
