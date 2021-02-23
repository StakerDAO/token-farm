import BigNumber from "bignumber.js";

const BN21 = BigNumber.clone({ DECIMAL_PLACES: 21})
const BN9 = BigNumber.clone({ DECIMAL_PLACES: 9})

export function toFixedPointString(value: BigNumber): string{
    return new BigNumber(value).toFixed();
}

export function convert(value: BigNumber, fixedPointAccuracy: BigNumber): string {
    const multiplicationResult = fixedPointAccuracy.multipliedBy(value);
    return toFixedPointString(multiplicationResult)
    //return value * fixedPointAccuracy
};

export function convertBalance(value: number): number {
    const fixedPointAccuracy = 1_000_000_000; // TODO: find decimals of LP token 
    return value * fixedPointAccuracy
};

export function convertS(value: BigNumber): string {
    const fixedPointAccuracy = new BN9(1_000_000_000);//_000_000_000; // 10^9
    return convert(value, fixedPointAccuracy)
};

export function convertM(value: BigNumber): string {
    const fixedPointAccuracy = new BN21(1_000_000_000_000_000_000_000); // 10^21
    return convert(value, fixedPointAccuracy)
};

export function convertL(value: BigNumber): string {
    const fixedPointAccuracy = new BigNumber(1_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000); // 10^45
    return convert(value, fixedPointAccuracy)
};