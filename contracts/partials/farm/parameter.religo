#include "deposit/parameter.religo"
#include "claim/parameter.religo"
#include "withdraw/parameter.religo"
#include "updatePlan/parameter.religo"

type parameter = 
    | Deposit(depositParameter)
    | Claim(claimParameter)
    | Withdraw(withdrawParameter)
    | UpdatePlan(updatePlanParameter);
