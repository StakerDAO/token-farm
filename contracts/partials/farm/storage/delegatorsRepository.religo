#include "../helpers/subtraction.religo"

let getDelegatorRecord = ((delegator, storage): (address, storage)): delegatorRecord => {
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
        | Some(delegator) => true
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
    let delegatorRecord = getDelegatorRecord(delegator, storage);
    let delegatorRecord = {
        ...delegatorRecord,
        lpTokenBalance: stakedBalance,
        accumulatedRewardPerShareStart: storage.farm.accumulatedRewardPerShare
    };
    setDelegatorRecord(delegator, delegatorRecord, storage);
};

let updateRewardDebt = ((delegator, storage): (address, storage)): storage => {
    let delegatorRecord = getDelegatorRecord(delegator, storage);
    let storage = updateDelegatorRecord(
        delegator, 
        delegatorRecord.lpTokenBalance, 
        storage
    );
    storage;
};

let decreaseDelegatorBalance = ((delegator, stakedBalance, storage): (address, nat, storage)): storage => {
    let delegatorRecord = getDelegatorRecord(delegator, storage);
    let stakedBalance = safeBalanceSubtraction(delegatorRecord.lpTokenBalance, stakedBalance);
    updateDelegatorRecord(delegator, stakedBalance, storage);
};

let increaseDelegatorBalance = ((delegator, stakedBalance, storage): (address, nat, storage)): storage => {
    let delegatorRecord = getDelegatorRecord(delegator, storage);
    let stakedBalance = delegatorRecord.lpTokenBalance + stakedBalance;
    updateDelegatorRecord(delegator, stakedBalance, storage);
};

let initDelegatorBalance = ((delegator, stakedBalance, storage): (address, nat, storage)): storage => {
    let delegatorRecord: delegatorRecord = {
        lpTokenBalance: 0n,
        accumulatedRewardPerShareStart: 0n
    };
    let storage = setDelegatorRecord(delegator, delegatorRecord, storage);

    increaseDelegatorBalance(delegator, stakedBalance, storage);
};
