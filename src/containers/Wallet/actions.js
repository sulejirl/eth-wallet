import {CREATE_WALLET} from './constants';

export function createWallet(data) {
  return {
    type: CREATE_WALLET,
    data
  }
};
