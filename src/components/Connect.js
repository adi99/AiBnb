import React from 'react';
import '@particle-network/connectkit/dist/index.css';
import { ConnectButton, ModalProvider } from '@particle-network/connectkit';
import { EntryPosition } from '@particle-network/wallet';
import { AvalancheTestnet, EthereumGoerli } from '@particle-network/chains';
import { evmWallets } from '@particle-network/connectors';

// Connect component
const Connect = () => {
  return (
    <ModalProvider
      options={{
        projectId: "75944eff-a7a9-44d7-b7c2-0008a83d7e0a",
        clientKey: "cQQw5H8n3bZikh3KFl1790Y2ekKuNJ4EKdk2LNCX",
        appId: "024a2255-1c35-484d-bc55-01afa64a90c4",
        chains: [AvalancheTestnet, EthereumGoerli],
        wallet: {
          visible: true,
          themeType: 'dark',
          customStyle: {},
          entryPosition: EntryPosition.BR,
        },
        promptSettingConfig: {
          promptPaymentPasswordSettingWhenSign: 1,
          promptMasterPasswordSettingWhenLogin: 1,
        },
      }}
      theme="light"
      language="en"
      walletSort={['Particle Auth', 'Wallet']}
    >
      <div className="min-h-screen">
        <ConnectButton />
      </div>
    </ModalProvider>
  );
};

// Export the Connect component
export default Connect ;
