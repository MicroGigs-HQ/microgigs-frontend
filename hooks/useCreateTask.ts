import { useEffect, useRef } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Address, parseEther } from 'viem';
import { toast } from 'react-hot-toast';
import { ABIS, CONTRACT_FUNCTIONS } from '@/lib/utils/abis';
import { useAllTasks } from './useGetAllTasks';
import { usePostedTasks } from './useGetUserPostedTasks';
import { useAssignedTasks } from './useGetUserAssignedTasks';
import { useGetUserProfile } from './useGetUserProfile';

export interface CreateTaskParams {
  title: string;
  description: string;
  category: string;
  rewardInEth: string;
  deadlineInSeconds: number;
}

/**
 * Enhanced hook that automatically handles proxy vs direct contract calls
 */
export function useCreateTask(userAddress?: Address) {
  // Determine which contract address to use
  const useProxy = process.env.NEXT_PUBLIC_USE_PROXY === 'true';
  const contractAddress = useProxy 
    ? (process.env.NEXT_PUBLIC_PROXY_ADDRESS as `0x${string}`)
    : (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`);

  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
  const { 
    isLoading: isConfirming, 
    isSuccess, 
    isError, 
    error: receiptError 
  } = useWaitForTransactionReceipt({ 
    hash,
    confirmations: 1,
  });

  // Hooks for refreshing data after successful transaction
  const { refreshAllTasks } = useAllTasks(contractAddress);
  const { refreshPostedTasks } = usePostedTasks(contractAddress, userAddress);
  const { refreshAssignedTasks } = useAssignedTasks(contractAddress, userAddress);
  const { refreshProfile } = useGetUserProfile(userAddress);

  const toastIdRef = useRef<string | undefined>(undefined);

  // Handle successful transaction
  useEffect(() => {
    if (isSuccess && hash) {
      toast.dismiss(toastIdRef.current);
      toast.success("Task created successfully!");
      
      // Refresh all relevant data
      refreshAllTasks();
      if (userAddress) {
        refreshPostedTasks();
        refreshAssignedTasks();
        refreshProfile();
      }
    }
  }, [isSuccess, hash, refreshAllTasks, refreshPostedTasks, refreshAssignedTasks, refreshProfile, userAddress]);

  // Handle transaction confirmation error
  useEffect(() => {
    if (isError && receiptError) {
      toast.dismiss(toastIdRef.current);
      console.error("Transaction receipt error:", receiptError);
      toast.error(`Task creation failed: ${receiptError.message}`);
    }
  }, [isError, receiptError]);

  // Handle write contract error
  useEffect(() => {
    if (writeError) {
      toast.dismiss(toastIdRef.current);
      console.error("Write contract error:", writeError);
      toast.error(`Transaction failed: ${writeError.message}`);
    }
  }, [writeError]);

  const createTask = async (params: CreateTaskParams) => {
    const { title, description, category, rewardInEth, deadlineInSeconds } = params;

    // Validate inputs
    if (!title?.trim()) {
      toast.error("Task title is required");
      return;
    }

    if (!description?.trim()) {
      toast.error("Task description is required");
      return;
    }

    if (!category?.trim()) {
      toast.error("Task category is required");
      return;
    }

    if (!rewardInEth || parseFloat(rewardInEth) <= 0) {
      toast.error("Valid reward amount is required");
      return;
    }

    if (!deadlineInSeconds || deadlineInSeconds <= 0) {
      toast.error("Valid deadline is required");
      return;
    }

    if (!contractAddress) {
      toast.error("Contract address not configured");
      return;
    }

    try {
      // Show loading toast
      toastIdRef.current = toast.loading("Creating task...");

      console.log(`Creating task through ${useProxy ? 'proxy' : 'direct'} contract:`, {
        address: contractAddress,
        useProxy,
        params
      });

      // Call the smart contract
      // Whether it's proxy or direct, we use the TaskFactory ABI
      // because the proxy delegates to the TaskFactory implementation
      await writeContract({
        address: contractAddress,
        abi: ABIS.TaskFactory, // Always use TaskFactory ABI for task creation
        functionName: CONTRACT_FUNCTIONS.TaskFactory.CREATE_TASK,
        args: [
          title.trim(),
          description.trim(),
          category.trim(),
          BigInt(deadlineInSeconds)
        ],
        value: parseEther(rewardInEth),
      });
    } catch (error) {
      toast.dismiss(toastIdRef.current);
      console.error("Error calling writeContract:", error);
      toast.error("Failed to initiate transaction");
    }
  };

  return {
    createTask,
    isPendingCreate: isPending,
    isConfirmingCreate: isConfirming,
    isSuccessCreate: isSuccess,
    isErrorCreate: isError || !!writeError,
    txHash: hash,
    createError: receiptError || writeError,
    contractAddress, 
    isUsingProxy: useProxy, 
  };
}