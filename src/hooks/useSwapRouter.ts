import {
  ERC20_ABI,
  MAX_FEE_PER_GAS,
  MAX_PRIORITY_FEE_PER_GAS,
  TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
  V3_SWAP_ROUTER_ADDRESS,
} from "@/utils/constants";
import { fromReadableAmount } from "@/utils/conversion";
import { useEthersProvider } from "@/utils/ethersProvider";
import { CurrencyAmount, Percent, Token, TradeType } from "@uniswap/sdk-core";
import {
  AlphaRouter,
  SwapOptionsSwapRouter02,
  SwapRoute,
  SwapType,
} from "@uniswap/smart-order-router";
import { useState } from "react";
import { mainnet } from "wagmi";

export function useSwapRouter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [route, setRoute] = useState<SwapRoute | null>(null);

  const provider = useEthersProvider({ chainId: mainnet.id });

  const generateSwapRoute = async ({
    address,
    tokenIn,
    tokenOut,
    tokenInAmount,
  }: any) => {
    try {
      setLoading(true);
      setError(null);
      const route = await generateRoute({
        provider,
        address,
        tokenIn,
        tokenOut,
        tokenInAmount,
      });
      setRoute(route);
      return route;
    } catch (error) {
      console.log("route error: ", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // const executeSwapRoute = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     if (!route) throw new Error("No route generated");
  //     const res = await executeRoute(route);
  //     return res;
  //   } catch (error) {
  //     setError(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return {
    loading,
    error,
    route,
    generateSwapRoute,
    // executeSwapRoute,
  };
}

async function generateRoute({
  provider,
  address,
  tokenIn,
  tokenOut,
  tokenInAmount,
}: any) {
  const router = new AlphaRouter({
    chainId: mainnet.id,
    provider: provider,
  });

  const options: SwapOptionsSwapRouter02 = {
    recipient: address,
    slippageTolerance: new Percent(50, 10_000),
    deadline: Math.floor(Date.now() / 1000 + 1800),
    type: SwapType.SWAP_ROUTER_02,
  };

  const route = await router.route(
    CurrencyAmount.fromRawAmount(
      tokenIn,
      fromReadableAmount(tokenInAmount, tokenIn.decimals).toString()
    ),
    tokenOut,
    TradeType.EXACT_INPUT,
    options
  );

  return route;
}

// async function executeRoute(route: SwapRoute) {
//   const walletAddress = getWalletAddress();
//   const provider = getProvider();

//   if (!walletAddress || !provider) {
//     throw new Error("Cannot execute a trade without a connected wallet");
//   }

//   const tokenApproval = await getTokenTransferApproval(CurrentConfig.tokens.in);

//   // Fail if transfer approvals do not go through
//   if (tokenApproval !== TransactionState.Sent) {
//     return TransactionState.Failed;
//   }

//   const res = await sendTransaction({
//     data: route.methodParameters?.calldata,
//     to: V3_SWAP_ROUTER_ADDRESS,
//     value: route?.methodParameters?.value,
//     from: walletAddress,
//     maxFeePerGas: MAX_FEE_PER_GAS,
//     maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
//   });

//   return res;
// }

// async function getTokenTransferApproval(token: Token) {
//   const provider = getProvider();
//   const address = getWalletAddress();
//   if (!provider || !address) {
//     console.log("No Provider Found");
//     return TransactionState.Failed;
//   }

//   try {
//     const tokenContract = new ethers.Contract(
//       token.address,
//       ERC20_ABI,
//       provider
//     );

//     const transaction = await tokenContract.populateTransaction.approve(
//       V3_SWAP_ROUTER_ADDRESS,
//       fromReadableAmount(
//         TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
//         token.decimals
//       ).toString()
//     );

//     return sendTransaction({
//       ...transaction,
//       from: address,
//     });
//   } catch (e) {
//     console.error(e);
//     return TransactionState.Failed;
//   }
// }
