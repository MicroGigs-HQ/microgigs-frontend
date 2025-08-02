"use client"

import {useChainId} from "wagmi";
import Image from "next/image";
import {daysFromNow, findTokenByAddress} from "@/lib/utils";

function TaskRewardDisplay({ task}: { task: any }) {
    const chainId = useChainId();

    const tokenConfig = findTokenByAddress(task.tokenAddress, chainId);

    // Calculate the display amount using the correct decimals
    const displayAmount = tokenConfig
        ? (Number(task.reward.toString()) / Math.pow(10, tokenConfig.decimals)).toFixed(6)
        : (Number(task.reward.toString()) / 1e18).toFixed(6); // fallback to 18 decimals

    // Get token symbol and logo
    const tokenSymbol = tokenConfig?.symbol || 'USDC';
    const tokenLogo = tokenConfig?.logo || '/usdc.png'; // fallback to ETH logo

    return (
        <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center gap-2">
                <Image
                    src={tokenLogo}
                    alt={tokenSymbol}
                    width={20}
                    height={20}
                    className="w-5 h-5"
                />
                <span className="text-base font-bold text-gray-900">
                    {Number(displayAmount).toFixed(3)}
                </span>
                <span className="text-sm text-gray-500">{tokenSymbol}</span>
            </div>
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-500">
                due in {daysFromNow(task.deadline)} days
            </span>
        </div>
    );
}

export default TaskRewardDisplay;