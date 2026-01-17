import { createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { MONAD_CHAIN, WALLET_CONNECT_PROJECT_ID } from './index';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [MONAD_CHAIN],
  [publicProvider()]
);

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: WALLET_CONNECT_PROJECT_ID,
        showQrModal: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

export { chains };
