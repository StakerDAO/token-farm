#include "../helpers/subtraction.religo"

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
