import { mainnet } from "wagmi";
// ABI's

export const ERC20_ABI = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address _spender, uint256 _value) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

// This file stores web3 related constants such as addresses, token definitions, ETH currency references and ABI's

// Addresses

export const V3_SWAP_ROUTER_ADDRESS =
  "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
export const WETH_CONTRACT_ADDRESS =
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

// Currencies and Tokens

export const USDC_TOKEN = {
  chainId: 1,
  address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  decimals: 6,
  symbol: "USDC",
  name: "USD Coin",
};
export const USDT_TOKEN = {
  chainId: 1,
  address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  decimals: 6,
  symbol: "USDT",
  name: "Tether USD",
};

// Transactions

export const MAX_FEE_PER_GAS = 100000000000;
export const MAX_PRIORITY_FEE_PER_GAS = 100000000000;
export const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 10000;
