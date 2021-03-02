#include "deposit/parameter.religo"
#include "claim/parameter.religo"
#include "withdraw/parameter.religo"

type parameter = 
    | Deposit(depositParameter)
    | Claim(claimParameter)
    | Withdraw(withdrawParameter);
