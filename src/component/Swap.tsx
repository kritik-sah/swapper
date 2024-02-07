"use client";
import { useSwapRouter } from "@/hooks/useSwapRouter";
import { USDC_TOKEN, USDT_TOKEN } from "@/utils/constants";
import { SwapRoute } from "@uniswap/smart-order-router";
import React, { useCallback, useEffect, useState } from "react";
import { HiOutlineSwitchVertical } from "react-icons/hi";
import { useAccount } from "wagmi";
import SwapForm from "./SwapForm";

const Swap = () => {
  const { address } = useAccount();
  const [swapTokens, setSwapTokens] = useState([USDT_TOKEN, USDC_TOKEN]);
  const [tokenAmountIn, setTokenAmountIn] = useState(0);
  const [route, setRoute] = useState<SwapRoute | null>(null);

  const { generateSwapRoute } = useSwapRouter();

  const handleTokenInterchange = () => {
    setSwapTokens((prev: any) => [prev[1], prev[0]]);
  };

  const handleSwapButtonClick = async () => {};

  const onCreateRoute = useCallback(async () => {
    const routeParams = {
      address,
      tokenIn: swapTokens[0],
      tokenOut: swapTokens[1],
      tokenInAmount: tokenAmountIn,
    };
    console.log("routeParams", routeParams);
    const swapRoute = await generateSwapRoute(routeParams);
    console.log("swapRoute", swapRoute);
    swapRoute && setRoute(swapRoute);
  }, [address, swapTokens, tokenAmountIn]);

  useEffect(() => {
    onCreateRoute();
  }, [tokenAmountIn]);

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
        swapValue={tokenAmountIn}
      />
      <div className="py-4 text-center">
        <p>1 USDT = 1 USDC</p>
      </div>
      <button
        onClick={handleSwapButtonClick}
        className="w-full py-4 rounded-xl uppercase bg-highlight hover:bg-highlight/90 text-dark font-bold disabled:bg-highlight/30"
      >
        Swap
      </button>
    </div>
  );
};

export default Swap;
