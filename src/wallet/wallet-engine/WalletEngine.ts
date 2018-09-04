import WalletEngineA from './WalletEngineA';
import WalletEngineB from './WalletEngineB';

export type WalletEngine = WalletEngineA | WalletEngineB;

export function setupWalletEngine(
  playerIndex: number,
): WalletEngine {
  if (playerIndex === 0) {
    return WalletEngineA.setupWalletEngine();
  } else {
    return WalletEngineB.setupWalletEngine();
  }
}
