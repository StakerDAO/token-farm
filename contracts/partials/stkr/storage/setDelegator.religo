#include "../errors.religo"

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
