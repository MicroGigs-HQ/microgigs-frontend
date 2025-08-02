import { useEffect, useRef, useState } from 'react';
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useAccount,
  http,
  usePublicClient
} from 'wagmi';
import {Address, parseUnits, erc20Abi} from 'viem';
import { toast } from 'react-hot-toast';
import { ABIS, CONTRACT_FUNCTIONS } from '@/lib/utils/abis';
import { useAllTasks } from './useGetAllTasks';
import { usePostedTasks } from './useGetUserPostedTasks';
import { useAssignedTasks } from './useGetUserAssignedTasks';
import { useGetUserProfile } from './useGetUserProfile';
import {SUPPORTED_TOKENS, SupportedTokenSymbol} from "@/lib/config/supported_tokens";

export interface CreateTaskParams {
  title: string;
  description: string;
  category: string;
  rewardAmount: string; // Raw amount (e.g., "100")
  tokenSymbol: SupportedTokenSymbol; // e.g., "USDC", "CNGN"
  deadlineInSeconds: number;
}

/**
 * Enhanced hook that handles ERC20 token-based task creation through proxy contract
 * Includes automatic token approval handling
 */
export function useCreateTask(userAddress?: Address) {
  // Determine which contract address to use
  const useProxy = true;
  const contractAddress = useProxy
      ? (process.env.NEXT_PUBLIC_PROXY_ADDRESS as `0x${string}`)
      : (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`);

  // State for managing approval and creation flow
  const [currentStep, setCurrentStep] = useState<'idle' | 'approving' | 'creating'>('idle');
  const [pendingTaskParams, setPendingTaskParams] = useState<CreateTaskParams | null>(null);

  const { chain } = useAccount();
  const chainId = chain?.id ? chain.id : 84532;
  const publicClient = usePublicClient();

  // Approval transaction
  const {
    data: approvalHash,
    writeContract: writeApproval,
    isPending: isApprovePending,
    error: approvalWriteError
  } = useWriteContract();

  const {
    isLoading: isApprovalConfirming,
    isSuccess: isApprovalSuccess,
    isError: isApprovalError,
    error: approvalReceiptError
  } = useWaitForTransactionReceipt({
    hash: approvalHash,
    confirmations: 1,
  });

  // Task creation transaction
  const {
    data: createHash,
    writeContract: writeCreateTask,
    isPending: isCreatePending,
    error: createWriteError
  } = useWriteContract();

  const {
    isLoading: isCreateConfirming,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
    error: createReceiptError
  } = useWaitForTransactionReceipt({
    hash: createHash,
    confirmations: 1,
  });

  // Hooks for refreshing data after successful transaction
  const { refreshAllTasks } = useAllTasks(contractAddress);
  const { refreshPostedTasks } = usePostedTasks(contractAddress, userAddress);
  const { refreshAssignedTasks } = useAssignedTasks(contractAddress, userAddress);
  const { refreshProfile } = useGetUserProfile(userAddress);

  const toastIdRef = useRef<string | undefined>(undefined);

  // Handle successful approval - proceed to task creation
  useEffect(() => {
    if (isApprovalSuccess && approvalHash && currentStep === 'approving' && pendingTaskParams) {
      toast.dismiss(toastIdRef.current);
      toast.success("Token approval successful! Creating task...");
      setCurrentStep('creating');

      // Proceed with task creation
      executeTaskCreation(pendingTaskParams);
    }
  }, [isApprovalSuccess, approvalHash, currentStep, pendingTaskParams]);

  // Handle successful task creation
  useEffect(() => {
    if (isCreateSuccess && createHash && currentStep === 'creating') {
      toast.dismiss(toastIdRef.current);
      toast.success("Task created successfully!");

      // Reset state
      setCurrentStep('idle');
      setPendingTaskParams(null);

      // Refresh all relevant data
      refreshAllTasks();
      if (userAddress) {
        refreshPostedTasks();
        refreshAssignedTasks();
        refreshProfile();
      }
    }
  }, [isCreateSuccess, createHash, currentStep, refreshAllTasks, refreshPostedTasks, refreshAssignedTasks, refreshProfile, userAddress]);

  // Handle approval errors
  useEffect(() => {
    if ((isApprovalError && approvalReceiptError) || approvalWriteError) {
      toast.dismiss(toastIdRef.current);
      const error = approvalReceiptError || approvalWriteError;
      console.error("Approval error:", error);
      toast.error(`Token approval failed: ${error?.message}`);
      setCurrentStep('idle');
      setPendingTaskParams(null);
    }
  }, [isApprovalError, approvalReceiptError, approvalWriteError]);

  // Handle task creation errors
  useEffect(() => {
    if ((isCreateError && createReceiptError) || createWriteError) {
      toast.dismiss(toastIdRef.current);
      const error = createReceiptError || createWriteError;
      console.error("Task creation error:", error);
      toast.error(`Task creation failed: ${error?.message}`);
      setCurrentStep('idle');
      setPendingTaskParams(null);
    }
  }, [isCreateError, createReceiptError, createWriteError]);

  // Function to check current allowance
  const checkAllowance = (tokenAddress: Address, userAddress: Address) => {
    return useReadContract({
      address: tokenAddress,
      abi: [
        {
          name: 'allowance',
          type: 'function',
          stateMutability: 'view',
          inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' }
          ],
          outputs: [{ name: '', type: 'uint256' }]
        }
      ],
      functionName: 'allowance',
      args: [userAddress, contractAddress],
    });
  };

  const executeApproval = async (tokenAddress: Address, amount: bigint) => {
    try {
      toastIdRef.current = toast.loading("Approving token spending...");

      await writeApproval({
        address: tokenAddress,
        abi: [
          {
            name: 'approve',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'spender', type: 'address' },
              { name: 'amount', type: 'uint256' }
            ],
            outputs: [{ name: '', type: 'bool' }]
          }
        ],
        functionName: 'approve',
        args: [contractAddress, amount],
      });
    } catch (error) {
      toast.dismiss(toastIdRef.current);
      console.error("Error calling approval:", error);
      toast.error("Failed to initiate token approval");
      setCurrentStep('idle');
      setPendingTaskParams(null);
    }
  };

  // Function to execute task creation (after approval)
  const executeTaskCreation = async (params: CreateTaskParams) => {
    const { title, description, category, rewardAmount, tokenSymbol, deadlineInSeconds } = params;
    const selectedToken = SUPPORTED_TOKENS[tokenSymbol];
    const tokenAddress = selectedToken.addresses[chainId];
    const rewardInTokenUnits = parseUnits(rewardAmount, selectedToken.decimals);

    try {
      toastIdRef.current = toast.loading("Creating task...");

      console.log(`Creating task through ${useProxy ? 'proxy' : 'direct'} contract:`, {
        address: contractAddress,
        useProxy,
        tokenAddress: tokenAddress,
        tokenSymbol,
        rewardAmount,
        rewardInTokenUnits: rewardInTokenUnits.toString(),
        params
      });

      await writeCreateTask({
        address: contractAddress,
        abi: ABIS.TaskFactory,
        functionName: CONTRACT_FUNCTIONS.TaskFactory.CREATE_TASK,
        args: [
          title.trim(),
          description.trim(),
          category.trim(),
          tokenAddress,
          BigInt(deadlineInSeconds),
          rewardInTokenUnits,
        ],
      });
    } catch (error) {
      toast.dismiss(toastIdRef.current);
      console.error("Error calling writeContract:", error);
      toast.error("Failed to initiate task creation");
      setCurrentStep('idle');
      setPendingTaskParams(null);
    }
  };

  const createTask = async (params: CreateTaskParams) => {
    const { title, description, category, rewardAmount, tokenSymbol, deadlineInSeconds } = params;

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

    if (!rewardAmount || parseFloat(rewardAmount) <= 0) {
      toast.error("Valid reward amount is required");
      return;
    }

    if (!tokenSymbol || !SUPPORTED_TOKENS[tokenSymbol]) {
      toast.error("Please select a valid payment token");
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

    if (!userAddress) {
      toast.error("Please connect your wallet");
      return;
    }

    const selectedToken = SUPPORTED_TOKENS[tokenSymbol];
    const tokenAddress = selectedToken.addresses[chainId];

    console.log(`token Address: ${tokenAddress}`);

    if (!tokenAddress) {
      toast.error(`${tokenSymbol} token address not configured`);
      return;
    }

    const rewardInTokenUnits = parseUnits(rewardAmount, selectedToken.decimals);

    const balance = await publicClient.readContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [userAddress]
    });

    console.log("balanceOf:", balance);
    console.log("deadline", deadlineInSeconds);
    console.log("rewardInTokenUnits", rewardInTokenUnits);

    if (balance < rewardInTokenUnits) {
      toast.error("Insufficient balance");
      return;
    }

    try {
      // Store params for later use after approval
      setPendingTaskParams(params);
      setCurrentStep('approving');

      // Execute approval first
      await executeApproval(tokenAddress, rewardInTokenUnits);

    } catch (error) {
      console.error("Error in createTask flow:", error);
      toast.error("Failed to start task creation process");
      setCurrentStep('idle');
      setPendingTaskParams(null);
    }
  };

  // Helper function to get token info
  const getTokenInfo = (symbol: SupportedTokenSymbol) => {
    return SUPPORTED_TOKENS[symbol];
  };

  // Helper function to get all supported tokens
  const getSupportedTokens = () => {
    return Object.entries(SUPPORTED_TOKENS).map(([symbol, token]) => ({
      // symbol: symbol as SupportedTokenSymbol,
      ...token,
    }));
  };

  return {
    createTask,
    // Combined states for easier consumption
    isPendingCreate: isApprovePending || isCreatePending,
    isConfirmingCreate: isApprovalConfirming || isCreateConfirming,
    isSuccessCreate: isCreateSuccess,
    isErrorCreate: isApprovalError || isCreateError || !!approvalWriteError || !!createWriteError,

    // Detailed states for granular control
    currentStep,
    isApproving: currentStep === 'approving',
    isCreating: currentStep === 'creating',

    // Approval specific states
    isPendingApproval: isApprovePending,
    isConfirmingApproval: isApprovalConfirming,
    isSuccessApproval: isApprovalSuccess,
    isErrorApproval: isApprovalError || !!approvalWriteError,
    approvalTxHash: approvalHash,

    // Creation specific states
    isPendingTaskCreation: isCreatePending,
    isConfirmingTaskCreation: isCreateConfirming,
    isSuccessTaskCreation: isCreateSuccess,
    isErrorTaskCreation: isCreateError || !!createWriteError,
    createTxHash: createHash,

    // Errors
    approvalError: approvalReceiptError || approvalWriteError,
    createError: createReceiptError || createWriteError,

    // Contract info
    contractAddress,
    isUsingProxy: useProxy,

    // Helper functions
    getTokenInfo,
    getSupportedTokens,
    SUPPORTED_TOKENS,
    checkAllowance,
  };
}