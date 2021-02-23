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
    let delegatorRecord: delegatorRecord = {
        balance: stakedBalance,
        rewardDebt: stakedBalance * storage.accumulatedSTKRPerShare
    };
    let storage = setDelegatorRecord(delegator, delegatorRecord, storage);
    storage;
};

let decreaseDelegatorBalance = ((delegator, value, storage): (address, nat, storage)): storage => {
    let delegatorRecord = getDelegator(delegator, storage);
    let stakedBalance = safeBalanceSubtraction(delegatorRecord.balance, value);
    updateDelegatorRecord(delegator, stakedBalance, storage);
};

let increaseDelegatorBalance = ((delegator, value, storage): (address, nat, storage)): storage => {
    let delegatorRecord = getDelegator(delegator, storage);
    let stakedBalance = delegatorRecord.balance + value;
    updateDelegatorRecord(delegator, stakedBalance, storage);
};
