import Web3 from 'web3';
import {sha3} from 'web3-utils';

export default class ChannelWallet {

  get address() {
    return this.account.address;
  }

  get privateKey() {
    return this.account.privateKey;
  }

  account: any; // todo: figure out how to do types with web3

  id: string;
  constructor(privateKey?: string, id?: string) {
    const web3 = new Web3('');
    if (privateKey) {
      this.account = web3.eth.accounts.privateKeyToAccount(privateKey);
    } else {
      this.account = web3.eth.accounts.create();
    }
    if (id) {
      this.id = id;
    }
  }


  sign(state: string): string {
    const localWeb3 = new Web3('');
    const account:any = localWeb3.eth.accounts.privateKeyToAccount(this.account.privateKey);
    const hash = sha3(state);
    return account.sign(hash).signature;
  }

  recover(data: string, signature: string) {
    const web3 = new Web3('');
    return web3.eth.accounts.recover(data, signature);
  }
}
