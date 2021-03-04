#include "deposit/parameter.religo"
#include "claim/parameter.religo"
#include "withdraw/parameter.religo"
#include "updatePlan/parameter.religo"
#include "setAdmin/parameter.religo"
#include "escape/parameter.religo"

type parameter = 
    | Deposit(depositParameter)
    | Claim(claimParameter)
    | Withdraw(withdrawParameter)
    | UpdatePlan(updatePlanParameter)
    | SetAdmin(setAdminParameter)
    | Escape(escapeParameter);
