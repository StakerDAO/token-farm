let getAction = ((blockLevel, storage): (nat, storage)): updatePoolAction => {
    let poolNeedsUpdate = blockLevel != storage.farm.lastBlockUpdate;
    if(poolNeedsUpdate) {
        switch(storage.farmLpTokenBalance == 0n) {
            | true => UpdateBlock
            | false => UpdateRewards
        };
    } else {
        Skip
    };
};
