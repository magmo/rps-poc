import Web3 from 'web3';
import {sha3} from 'web3-utils';
import { Channel, } from 'fmg-core';

export default class ChannelWallet {

  get address() {
    return this.account.address;
  }

  get privateKey() {
    return this.account.privateKey;
  }

  get channelId(): string {
    if (this.channel) {
      return this.channel.id;
    } else {
      throw new Error("Channel must be opened");
    }
  }

  account: any; // todo: figure out how to do types with web3
  id: string;
  channel: Channel | null;

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

  openChannel(channel: Channel): Channel {
    if (this.channel) {
      throw new Error("Only one open channel is supported");
    }
    this.channel = channel;
    return channel;
  }

  closeChannel() {
    this.channel = null;
  }

  sign(state: string): string {
    const localWeb3 = new Web3('');
    const account:any = localWeb3.eth.accounts.privateKeyToAccount(this.account.privateKey);
    const hash = sha3(state);
    return account.sign(hash).signature;
  }

  recover(data: string, signature: string) {
    const web3 = new Web3('');
    const hash = sha3(data);
    return web3.eth.accounts.recover(hash, signature);
  }
}
