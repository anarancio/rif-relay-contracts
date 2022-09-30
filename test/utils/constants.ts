import { BigNumber, constants } from 'ethers';
export const RBTC_DECIMALS = 18;
export const oneRBTC = BigNumber.from(10).pow(RBTC_DECIMALS);
export const ZERO_ADDRESS = constants.AddressZero;
export const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';