export function convert(value: number): number {
    const fixedPointAccuracy = 1_000_000_000_000; // 10^12
    return value * fixedPointAccuracy
};

export function convertBalance(value: number): number {
    const fixedPointAccuracy = 1_000_000_000; // TODO: find decimals of LP token 
    return value * fixedPointAccuracy
};
