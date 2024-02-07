"use client";
import React, { ChangeEvent, useState } from "react";
import { useBalance } from "wagmi";

interface SwapFormProps {
  primary?: boolean;
  token: any;
  address?: `0x${string}`;
  onChange?: React.Dispatch<React.SetStateAction<number>>;
  swapValue?: number;
}

const SwapForm: React.FC<SwapFormProps> = ({
  primary,
  token,
  address,
  onChange,
  swapValue,
}) => {
  const balance = useBalance({
    address: address,
    token: token,
  });

  const [amount, setAmount] = useState("");

  const handlePercenClick = (percent: number) => {
    console.log(balance);
    const wei = (percent / 100) * Number(balance?.data?.value);
    const amount = String(wei / 10 ** balance?.data?.decimals!);
    setAmount(amount);
    onChange !== undefined && onChange(Number(amount));
  };

  const handleFormInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Check if the input is a valid number using regex
    if (/^\d*\.?\d*$/.test(inputValue)) {
      setAmount(inputValue);
      onChange !== undefined && onChange(Number(inputValue));
    }
  };

  return (
    <div className="w-full max-w-md bg-midnight rounded-xl p-4">
      <label className="w-full">
        <div className="flex items-start justify-between w-full">
          <p className="text-lg text-highlight font-semibold">
            {balance?.data?.symbol}
          </p>
          <div className="text-right">
            <p className="text-sm text-white/50">Balance</p>
            <p>{Number(balance?.data?.formatted).toFixed(4)}</p>
          </div>
        </div>
        <input
          className="ring-0 outline-0 bg-transparent caret-highlight text-4xl"
          type="text"
          placeholder="0.1..."
          disabled={!primary}
          value={
            swapValue ? swapValue / 10 ** balance?.data?.decimals! : amount
          }
          onChange={handleFormInputChange}
        />
      </label>
      {primary ? (
        <div className="flex items-center justify-start gap-2 pt-3 pb-2">
          <button
            onClick={handlePercenClick.bind(null, 25)}
            className="px-2 bg-ui-white text-ui-dark rounded"
          >
            25%
          </button>
          <button
            onClick={handlePercenClick.bind(null, 50)}
            className="px-2 bg-ui-white text-ui-dark rounded"
          >
            50%
          </button>
          <button
            onClick={handlePercenClick.bind(null, 75)}
            className="px-2 bg-ui-white text-ui-dark rounded"
          >
            75%
          </button>
          <button
            onClick={handlePercenClick.bind(null, 100)}
            className="px-2 bg-ui-white text-ui-dark rounded"
          >
            MAX
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default SwapForm;
