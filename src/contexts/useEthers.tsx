import { BrowserProvider, JsonRpcSigner } from "ethers";
import React, { createContext, useEffect, useState } from "react";

interface IEthersContext {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  walletRequired: boolean;
  connectWallet: () => void;
}

export const EthersContext = createContext<IEthersContext>({
  provider: null,
  signer: null,
  walletRequired: false,
  connectWallet: () => {},
});

export const EthersContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [walletRequired, setWalletRequired] = useState<boolean>(false);

  useEffect(() => {
    if (provider) {
      (async () => {
        setSigner(await provider.getSigner());
      })();
    }
  }, [provider]);

  const connectWallet = () => {
    if (window.ethereum == null) {
      console.log("MetaMask not installed; using read-only defaults");
      setWalletRequired(true);
    } else {
      console.log("setEthers");
      setProvider(new BrowserProvider(window.ethereum));
      setWalletRequired(false);
    }
  };

  return (
    <EthersContext.Provider
      value={{ provider, signer, walletRequired, connectWallet }}
    >
      {children}
    </EthersContext.Provider>
  );
};
