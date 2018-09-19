import VM from 'ethereumjs-vm';
import Tx from 'ethereumjs-tx';
import {sign } from 'ethjs-signer';
import BN  from 'bn.js';
import abi from 'ethjs-abi';
// Based on https://github.com/ethereumjs/ethereumjs-vm/issues/128
export default function runMethod(contractByteCode, methodName, inputs) {
  return new Promise((resolve, reject) => {
    const vm = new VM({
      enableHomestead: true,
      activatePrecompiles: true,
    });

    const contractInterface = typeof contractByteCode.interface === 'string' ? JSON.parse(contractByteCode.interface) : contractByteCode.interface;
    const methodObject = contractInterface.filter(item => item.name === methodName ? 1 : 0)[0];

    const address = '0x0F6af8F8D7AAD198a7607C96fb74Ffa02C5eD86B';
    const privateKey = '0xecbcd9838f7f2afa6e809df8d7cdae69aa5dfc14d563ee98e97effd3f6a652f2';
    const genesisData = { "0F6af8F8D7AAD198a7607C96fb74Ffa02C5eD86B": "1606938044258990275541962092341162602522202993782792835301376" };

    vm.stateManager.generateGenesis(genesisData, ()=>{
      try {
        const tx = new Tx(sign({
            from: address,
            value: 0,
            gas: new BN('99999999999'),
            gasPrice: new BN('1'),
            nonce: new BN(0),
            data: contractByteCode.bytecode,
          }, privateKey));

        vm.runTx({ tx, skipBalance: true, skipNonce: true }, (contractError, contractTx) => {

          if (contractError) { reject(contractError); return; }

          try {
            const tx2 = new Tx(sign({
                to: `0x${contractTx.createdAddress.toString('hex')}`,
                value: 0,
                gas: new BN('9999999999'),
                gasPrice: new BN('1'),
                nonce: new BN(1),
                data: abi.encodeMethod(methodObject, inputs),
              }, privateKey));

            vm.runTx({ tx: tx2, skipBalance: true, skipNonce: true }, (callError, callTx) => {

              if (callError) { reject(callError); return; }

              try {
                const outputBytecode = `0x${callTx.vm.return.toString('hex')}`;

                const result = abi.decodeMethod(methodObject, outputBytecode);

                resolve(result);
              } catch (bytecodeError) { reject(bytecodeError); return; }
            });
          } catch (error) { reject(error); return; }
        });
      } catch (error) { reject(error); return; }
    });
  });
}