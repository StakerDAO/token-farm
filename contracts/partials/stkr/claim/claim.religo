/*
Specification

1) call updatePool()

2) call calculateReward()

3) compute rewardDebt = balance * accumulatedSTKRperShare

4) transfer STKR from factory to user

5) decrease storage.unrealizedRewards by userReward from 2)

6) increase storage.realizedRewards by userReward from 2)
*/