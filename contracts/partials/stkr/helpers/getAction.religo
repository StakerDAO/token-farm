let getAction = ((blockLevel, storage): (nat, storage)): updatePoolAction => {
    let poolNeedsUpdate = blockLevel != storage.lastBlockUpdate;
    if(poolNeedsUpdate) {
        switch(storage.farmTokenBalance == 0n) {
            | true => UpdateBlock
            | false => UpdateRewards
        };
    } else {
        Skip
    };
};
