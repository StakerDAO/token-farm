# Dependencies

- Docker - used to run a local Tezos node together with the LIGO compiler (If you're on linux, follow the post-installation steps as well)
- Node.js `v12` - Javascript runtime environment that we'll use for testing and deployment
- LIGO `0.11.0` - High level programming language for the Tezos blockchain
- truffle@tezos - Testing framework, originally built for Ethereum that now includes support for Tezos.
- ganache-cli@tezos - Part of the Truffle suite of blockchain development tools. It creates isolated sandboxes using Flextesa to automate reproducible tests with faster networks.

# Getting started

> Make sure to use `node v12`.

```
yarn
yarn run fix-ligo-version 0.11.0
yarn run sandbox:start
yarn run test
```

# Token farm

⚠️ Architecture diagram can be found [here](https://viewer.diagrams.net/?highlight=0000ff&edit=_blank&layers=1&nav=1#R7Vxtk5s4Ev41rko%2BjAtJvH6cTDKbrZvcpjK5y2a%2FXGmMbLOLwQU4HufXn2RLBiHZxoN4mb1zKjVGSIC7n%2B5%2BuiUxQXer518yvF5%2BSkMST6AVPk%2FQ%2BwmEwAeA%2FmEtu0OL51mHhkUWhbxT2fAY%2FSS8UXTbRCHJpY5FmsZFtJYbZ2mSkFkhteEsS7dyt3kay3dd4wVRGh5nOFZbv0VhsTy0%2BtAr2z%2BSaLEUdwZucDizwqIz%2FyX5EofpttKEPkzQXZamxeHb6vmOxEx4Qi6Hcfcnzh4fLCNJ0WQA%2FDX8186df0S%2FPTwui6%2F4j49BcuNA%2FnDFTvxiElIB8MM0K5bpIk1w%2FKFsfZelmyQk7LKAHpV9HtJ0zRv%2FJEWx49rEmyKlTctiFfOzJAlvmW7o4SzGeR7NDo33UVx2KbLd79WD7%2FTAmlo%2BFA3vGcis49GuevSZZNGKFCTjjaqwuPzydJPNyBkJQS6hAmcLUpzpiLjimfwqt%2BDK%2BIWk9HmyHe2QkRgX0Q8ZYJjjdHHsdxz6OY3oQ0OL25SPOKC4RQFoW%2FI1Do%2FKh5WIoF8qz1E27XFyBWZsNAxmOCAsGRCecwkPz1FxBBL9fhjm8KNyEDvYtYYLAg3hYneCFmpWeFfpsGYgyE%2BDya2DyQI1L3JhgBc4NYwdHsEo4rgJ%2FsDxhstBQWCJL6a%2F7TIqyOMa71W1pZFJxtKc%2Bpm7NE6Zd0jShOEzxPnyCM%2B8yNK%2Fjv4engPED5IV5PmsBvlZ6AFJcr7PJbkt4wq0uBNZVmIKtJzTWpeM%2B1q5IkWu97dgSpvcmN773VNGvy3Yt4fP%2B7j7F0nMCX4CUYiJP58dBV4548588jQ3I3jkyIi1VLkDQTeqcgd1v2pM7rZG7vRYK%2FqMbHEWdiN%2Bh%2FihrRO%2FD5%2BQ65oRv%2Bu5kvzdYHD5u4MGsBqjuRS%2FXh6LABxFjLEFJeYACLzzIabe35P7yyFGGQ1sRzu6L3bkKbYN304YNXeKDCf5nGRvNjnlpcygmRJJPH%2BrheMDfqK5lAQhHEeLhJFmCgVGbd8xK4xosnLLT6yiMDygleTRT%2Fy0vx4DEdcRvbjzbuK818LqnKko5n7MuPhNJtWkRucGKNADJCtWxJ%2BXEmLRJZ3Pc9KJMoVbGorqToEfyN4iCNyGfNeaQkFyv1c5rpbwDpU0GWfBreKCKFZUjHcl3MQ4zVMAtL193tBUyrVligrb2eezdBVh9BBOqSOofHz5gh1as5pHhGSd5pGq4Ta0aj6fw5mW1Ybuk%2BsYolXQr0VVR0OrbKjSqs5YFWhXF7DM1gU6pFVBQ%2Bdmnn%2B104%2BaduypySkbGJGXE4mqCS8HoOWZ9HI9%2BC1nWMMqbel79VxnhtV1BTWQS1h%2Bz%2FVTIDh1aYeApwh4vc5S%2BrtGbIqOSVO0XG%2F0xue1Mj7D1e6mxe6ywH002Q6K3Y0joZguG0sk9BULRG%2F31KlYhhnejtn%2BRH3BhP1B4BoNhcdK99TRXbYHYw0UxR6KLSbpvcP%2BaYvW%2Bw8bkSZFpf3wMVTMbsD6dcXUzlg%2F8gf1j70VUxuXNJBxX%2Feyqqsns5wAXai6nu%2FfzcSe3Y7Ztq%2BveVdR2ybrFo4B2A38Sgim3tay0fkaHD34ny%2FB2So53iRrTL34iIOybZIUw%2BOaKVExA2PnyM6wZXIwtYBfK5NTxvmCZUINDLwHizReNnpRAPGQDENgnZuHMwYltQQf400yWxL6qNacUioqGDxbsuskzMSjHxQfIT1kaxRG6yEck3V623dtHb9uSdtPVub5XRA9bcsXNeJS4ofVBljf%2Fv0fEIYbtP5m25%2Fcm6GJwVW8QF4vVHqJmgWbcxtakdk9xW3tzdWwLaa78%2F0zHBaxDGWfjc1OVtFpZJ6Z5gaWL1vnTUvz7D5%2BC4hVtDejtjSL2MjVJi4iprdooShw%2FIu%2FXLeW1oChp8ngIK6thf8ZRz6LaooE4EJCe1ObzL56gOec719fV%2BicoUdNB%2Fc1BwFVf43qy5TY0qQJX6bEqmhjXqYETWZgtmvVMrAxeXBtUAJa3fQ1Q%2FiiIlwTcnS52NbNDKENas7GqtvnwW0q9nl1lc46caOTZTplADCblWnhBccErw53fJgh7F6v4L0acs61kFMGwB4gp%2B5NoAEkzoeLQSZzCKhX%2FE66%2BiiizVmEV5Rzcur09a2kAxYaPEcIWjncvhcdlFXTlELi5JxIzR8755clGJ4OaeiTu9mWp%2FhUx6ntcXCb8f9rnb0D5fsEATrr6%2Bv9xXM1S2rUSAGa0SZTjkkYrqYM9Yb6eZKxtVWvJKMRSxlMZDTIs2o1qZYxRmSxdX0j%2BQrdhSBbXcy6xKzUSElCusXJjCk6nU%2FK2uOJDXR%2FR43TFDYI5AJD2xRWbD6fBtLHrd1kWt%2Br2h0CxPRUlSHGOFr9DRhIoNsi2SsBQVARbkhiiptsj8HXJ%2BKbuqtCukKwIPBVGaPOZKymOAsq4de4xVqVrj24dNUAgUO8Lozjt59d1IqEoeb1AT1L2FEkfH%2F75dMEunjFRJY85ev9j%2Bdb2sWO9u3vX%2F%2B4of%2FFCXrz4zlFM1Q8hSx%2BWcz89Q3Nw7VOubL6pVdBqM6KfsyoFFlObZ2s72l0qlvNCTvTqZrZ4%2FDPTV5UidQa79LNK90zV5P48NOBYkHv6365iV1bKwKALgB4vgbKdldvN7HVZPDx6z%2B%2B0Jb727uvv335Tr89%2FPrPDxNmTTUfxTr%2B30exeoBX06uuNtari7LVzRuKRsbxDrOT8r9YrbKbTiGMbPGu6stGv3RXoMlEmcWyArnM0jLp7qGMosZ7rjFrsaHRPsKvMR2pL%2FpxB4%2FyjprrxWRB3cVLg4kmypuMLyaUIAcOGkoE96powe4ocmhn3YbdyVmbxYaXZlXURaX6zZ3nX%2ByijQ8Xg9Lp9aVNY1IPIUj7kCo54Huq38xxtprAO%2FYL0gLHX%2FbZTD7gFIDJCWXvYmiCvmyQLd%2B9JHg%2FlEd0t8JJLeeUEzp4xparsscqfoLpdGo0ZDVOTTX6VMzspIp8KIes44RgByGLHpavHT7op3x5M%2FrwXw%3D%3D)

## Storage

```
type delegator = address
type delegatorRecord = {
    balance: nat,
    stakingStart: nat,
};

type claimedRewards = {
    unpaid: nat,
    paid: nat,
};

type plannedRewards = {
    totalBlocks: nat,
    rewardPerBlock: nat,
};

type farm = {
    lastBlockUpdate: nat,
    accumulatedRewardPerShare: nat,
    claimedRewards: claimedRewards,
    plannedRewards: plannedRewards
};

type addresses = {
    lpTokenContract: address,
    rewardTokenContract: address,
    rewardReserve: address
};

type storage = {
    farm: farm,
    delegators: big_map(delegator, delegatorRecord),
    farmLpTokenBalance: nat,
    addresses: addresses
};
```

- #### `claimedRewards: claimedRewards`

    Keeps track of pool rewards that have been paid or are pending to be paid out

    - `unpaid` 
    - `paid`

- #### `plannedRewards: plannedRewards`

    Configuration object set at origination, specifying how much of the reward token
    should be paid out every block. And how many blocks of lifetime the farm has.

    The overall amount of the reward token distributed is calculated as `totalBlocks * rewardPerBlock`.

    - `totalBlocks`
    - `rewardPerBlock`

- #### `delegators: big_map(delegator, delegatorRecord)`

    (big) Map of delegator addresses and their staking balances & reward debts.


    ##### - `key: delegator (address)`
    ##### - `value: delegatorRecord`
    - `balance`
        
        Represents the total staked balance (of the staking token) of the current delegator.

    - `stakingStart`

        Represents the accumulatedRewardPerShare at the time the delegator started staking (joined the staking pool), or has claimed the reward payout the last time.

- #### `lastBlockUpdate: nat`

    Keeps track of the last time the pool state was updated. This is used to prevent
    duplicate pool state updates in the same block. Invariant of the system achieved thanks to the
    `lastBlockUpdate` is that the delegation rewards start accumulating only in the `n+1` block after depositing.

    E.g. if you deposit in `block 0`, you're only eligible for rewards from `block 1`

- #### `accumulatedRewardPerShare: nat`

    Keeps track of how many reward token each liquidity pool share (staked LP token) is worth. This number is recalculated at every pool update.

- #### `lpTokenContract: address`
    Address of the token being staked, originally an LP token from a DEX.

- #### `farmLpTokenBalance: nat`
    Balance of the `lpTokenContract` tokens for the current farm contract. This standalone "ledger" entry exists to
    avoid exploits with operations that may introduce issues & overhead due to Tezos' message passing architecture ([BFS](https://forum.tezosagora.org/t/smart-contract-vulnerabilities-due-to-tezos-message-passing-architecture/2045)), specifically when calling `tokenContract%getBalance`.

- #### `rewardTokenContract: address`

    Address of the reward token contract.
- #### `rewardReserve: address`

    Address of the account that holds the reward tokens to be paid out. This account gives an allowance to the farm contract through the `approve` method of the `FA1.2 contract`.



## Entrypoints

#### `%deposit(nat)`

This entrypoint serves as an gateway to the farm. Users can deposit a certain amount of stakeable LP tokens to begin
accumulating staking rewards, which can be claimed at a later point in time through manual interaction with the contract.

##### Parameters

- `nat`

    A single value representing the amount of stakeable tokens being deposited. The user depositing
    must create an appropriate allowance by calling `%approve` on the underlying token contract beforehand. The farm itself will
    transfer the specified amount to its own KT1 address.

    This mechanism is important to maintain the `farmTokenBalance` in the storage.


#### `%claim()`

This entrypoint calculates the earned reward tokens for the user invoking it and pays it out.

##### Parameters

- `unit`

#### `withdraw(nat)`

This entrypoint unstakes the number of LP tokens the delegator specifies and pays out earned reward tokens.
##### Parameters

- `nat`
    Number of staked LP tokens the user wants to withdraw.


## Farm pool & state updates

Each farm instance has its own pool, that keeps track of vital data such as `accumulatedRewardPerShare`. Each
pool can be updated only once per block - this is ensured by keeping track of `lastBlockUpdate`.

Entrypoints `%deposit`, `%claim`, `%withdraw` all call an `updatePool()` function, causing the
pool to update with every first operation that 'arrives' to the farm in each block.

If there are no tokens delegated to the farm, which means if `farmLpTokenBalance = 0n` then pool updates are skipped. Resulting
in no rewards being distributed, and only the `lastBlockUpdate` being increased. If this behavior was not part of the implementation, then rewards would be lost for blocks when no-one is delegating to the farm.

#### Pool update formulas

##### - `reward`

If the calculated reward from the formula below exceeds the `plannedRewards`, then a `rewardRemainder` is returned instead.
> Calculation of `plannedRewards` and `rewardRemainder` can be found in `updatePool.religo`

`(Tezos.level - lastBlockUpdate) * rewardPerBlock`

##### - `accumulatedRewardPerShare`

`accumulatedRewardPerShare + reward / farmTokenBalance`

##### Reward calculation per delegator

`delegatorReward = (accumulatedRewardPerShareEnd - accumulatedRewardPerShareStart) * delegatorBalance`

> `accumulatedRewardPerShareEnd = current accumulatedRewardPerShare` 
> 
> `accumulatedRewardPerShareStart = stakingStart`