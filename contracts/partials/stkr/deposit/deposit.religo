/*
Specification

1) call updatePool()

2) 
if (delegator exists) {
    claim()
}

storage.delegators[delegator].balance = lpAmount
storage.delegators[delegator].rewardDebt = lpAmount * storage.accumulatedSTKRPerShare

3) transfer LP from delegator to factory

fails if sufficient amount was not approved
*/