"use client";

import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/PopOver";

export function NetworkSwitcher() {
  const { connector, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  if (!isConnected) {
    return null;
  }

  return (
    <div>
      <Popover>
        <PopoverTrigger>
          {chain?.unsupported ? (
            <span className="bg-red-600 w-full px-4 py-2 rounded-xl">
              Wrong Network
            </span>
          ) : (
            <span className="px-4 py-2 border border-white/30 rounded-xl ">
              {chain?.name ? chain?.name : chain?.id}
            </span>
          )}
        </PopoverTrigger>
        <PopoverContent>
          {switchNetwork && (
            <div className="flex flex-col gap-1">
              {chains.map((x) =>
                x.id === chain?.id ? null : (
                  <button
                    key={x.id}
                    className="px-4 py-2 rounded-xl font-semibold bg-midnight border border-white/10 hover:bg-midnight/80"
                    onClick={() => switchNetwork(x.id)}
                  >
                    {x.name}
                    {isLoading && x.id === pendingChainId && " (switching)"}
                  </button>
                )
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>

      <div>{error?.message}</div>
    </div>
  );
}
