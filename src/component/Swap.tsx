"use client";
import { ERC20_ABI, USDC_TOKEN, USDT_TOKEN } from "@/utils/constants";
import React, { useCallback, useEffect, useState } from "react";
import { HiOutlineSwitchVertical } from "react-icons/hi";
import { mainnet, useAccount, useContractWrite, usePublicClient } from "wagmi";
import SwapForm from "./SwapForm";

import { useEthersProvider } from "@/utils/ethersProvider";
import { useEthersSigner } from "@/utils/ethersSigner";
import {
  BalancerSDK,
  SwapInfo,
  SwapType,
  parseFixed,
} from "@balancer-labs/sdk";
import { BigNumber } from "ethers";

const BALANCER_VAULT = "0xBA12222222228d8Ba445958a75a0704d566BF2C8";

const balancer = new BalancerSDK({
  network: mainnet.id, // Mainnet
  rpcUrl: mainnet.rpcUrls.default.http[0], // rpc endpoint
});

const Swap = () => {
  const { address } = useAccount();
  const [swapTokens, setSwapTokens] = useState([USDT_TOKEN, USDC_TOKEN]);
  const [tokenAmountIn, setTokenAmountIn] = useState(0);
  const [tokenInApproved, setTokenInApproved] = useState(false);
  const [tokenSwapInfo, setTokenSwapInfo] = useState<SwapInfo | null>(null);
  const signer = useEthersSigner();
  const { swaps } = balancer; // Swaps module is abstracting SOR

  const { write: approveToken } = useContractWrite({
    address: swapTokens[0].address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "approve",
    onSuccess() {
      setTokenInApproved(true);
    },
  });

  const handleTokenInterchange = () => {
    setTokenAmountIn(0);
    setTokenSwapInfo(null);
    setSwapTokens((prev: any) => [prev[1], prev[0]]);
  };

  const handleSwapButtonClick = async () => {
    if (tokenInApproved) {
      await executeSwap();
      setTokenInApproved(false);
    } else {
      approveToken({
        args: [BALANCER_VAULT, tokenAmountIn * 10 ** swapTokens[0].decimals],
      });
      setTokenInApproved(true);
    }
  };

  const approveAllowance = useCallback(async () => {}, []);

  const fetchSwapRoutes = useCallback(async () => {
    //Step 1. Pool data fetching
    await swaps.fetchPools();

    //Step 2. Route proposal
    const swapInfo = await swaps.findRouteGivenIn({
      tokenIn: swapTokens[0].address, // address of tokenIn
      tokenOut: swapTokens[1].address, // address of tokenOut
      amount: parseFixed(String(tokenAmountIn), swapTokens[0].decimals), // BigNumber with a swap amount
      gasPrice: parseFixed("1", 9), // BigNumber current gas price
      maxPools: 4, // number of pool included in path, above 4 is usually a high gas price
    });
    console.log("swapInfo", swapInfo);
    setTokenSwapInfo(swapInfo);
  }, [tokenAmountIn, swapTokens]);

  const executeSwap = useCallback(async () => {
    //Step 3. Transaction encoding
    const tx = await swaps?.buildSwap({
      userAddress: address!, // user address
      swapInfo: tokenSwapInfo!, // result from the previous step
      kind: SwapType.SwapExactIn, // or SwapExactOut
      deadline: String(Math.ceil(Date.now() / 1000) + 60), // BigNumber block timestamp
      maxSlippage: 10, // [bps], eg: 1 == 0.01%, 100 == 1%
    });

    return await signer?.sendTransaction({
      to: tx.to,
      data: tx.data,
      value: tx.value,
    });
  }, []);

  useEffect(() => {
    if (tokenAmountIn) {
      fetchSwapRoutes();
    }
  }, [tokenAmountIn, swapTokens]);

  return (
    <div className="flex flex-col gap-1">
      <SwapForm
        primary={true}
        token={swapTokens[0].address}
        address={address}
        onChange={setTokenAmountIn}
      />
      <div className="relative">
        <button
          onClick={handleTokenInterchange}
          className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-midnight border-[6px] border-dark hover:text-white/80 flex items-center justify-center"
        >
          <HiOutlineSwitchVertical className="text-lg" />
        </button>
      </div>
      <SwapForm
        token={swapTokens[1].address}
        address={address}
        swapValue={Number(tokenSwapInfo?.swaps[0]?.returnAmount)}
      />
      <div className="py-4 text-center">
        {tokenSwapInfo ? (
          <p>{`1 ${swapTokens[1].symbol} = ${Number(
            tokenSwapInfo?.marketSp
          ).toFixed(4)} ${swapTokens[0].symbol}`}</p>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <button
        onClick={handleSwapButtonClick}
        className="w-full py-4 rounded-xl uppercase bg-highlight hover:bg-highlight/90 text-dark font-bold disabled:bg-highlight/30"
        disabled={!tokenAmountIn}
      >
        {tokenInApproved ? "Swap token" : `Approve ${swapTokens[0].symbol} `}
      </button>
    </div>
  );
};

export default Swap;
