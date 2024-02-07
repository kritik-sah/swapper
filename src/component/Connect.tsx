"use client";

import { createModal } from "@rabby-wallet/rabbykit";
import { useEffect, useRef } from "react";
import { FaWallet } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { BaseError } from "viem";
import { useAccount, useConfig, useConnect, useDisconnect } from "wagmi";
import { supportChains } from "../../wagmi";

export function Connect() {
  const { connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  const rabbyKitRef = useRef<ReturnType<typeof createModal>>();
  const config = useConfig();

  useEffect(() => {
    if (!rabbyKitRef.current) {
      rabbyKitRef.current = createModal({
        showWalletConnect: true,
        chains: supportChains,
        wagmi: config,
        appName: "swap-erc20",
        projectId: "3da856ca831bd6a9c4cb221dcfb14f4b",
        customButtons: [],
      });
    }
  }, [config]);

  return (
    <div>
      <div>
        {isConnected ? (
          <button
            className="px-4 py-2 bg-midnight hover:bg-midnight/70 flex items-center justify-center uppercase text-sm gap-2 rounded-xl"
            onClick={() => disconnect()}
          >
            Disconnect <HiOutlineLogout />
          </button>
        ) : (
          <button
            onClick={() => {
              rabbyKitRef.current?.setTheme("dark");
              rabbyKitRef.current?.open();
            }}
            className="px-4 py-2 bg-midnight hover:bg-midnight/70 flex items-center justify-center uppercase text-sm gap-2 rounded-xl"
          >
            <FaWallet /> connect
          </button>
        )}
      </div>

      {/* {error && <div>{(error as BaseError).shortMessage}</div>} */}
    </div>
  );
}
