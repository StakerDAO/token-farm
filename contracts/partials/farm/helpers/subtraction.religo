#include "../errors.religo"

let failForNegativeBalanceDifference = ((a, b): (nat, nat)): unit => {
    let positiveDifference = a >= b;
    switch (positiveDifference) {
        | true => unit
        | false => (failwith(errorNotEnoughBalance): unit)
    }
};

/**
 * ABS is necessary for type casting to nat after a substraction in Ligo.
 * This is error prone if the result of the substraction is negative,
 * hence these helper functions.
 */
let safeBalanceSubtraction = ((a, b): (nat, nat)): nat => {
    failForNegativeBalanceDifference(a, b);
    abs(a - b);
};