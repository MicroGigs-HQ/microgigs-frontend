import { useEffect } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Address } from 'viem';
import { ABIS, CONTRACT_ADDRESSES, CONTRACT_EVENTS, getABIForAddress } from '@/lib/utils/abis';

export interface UseProxyContractOptions {
  // The proxy contract address
  proxyAddress?: Address;
  // The ABI of the implementation contract (what the proxy delegates to)
  implementationABI: 'TaskFactory' | 'TaskEscrow';
  // Whether to watch for events
  watchEvents?: boolean;
}

/**
 * Hook for interacting with proxy contracts
 * This handles the complexity of calling implementation functions through a proxy
 */
export function useProxyContract(options: UseProxyContractOptions) {
  const { 
    proxyAddress = CONTRACT_ADDRESSES.PROXY_CONTRACT,
    implementationABI,
    watchEvents = false 
  } = options;

  // For reading data through the proxy
  const useProxyRead = (functionName: string, args?: any[]) => {
    return useReadContract({
      address: proxyAddress,
      abi: ABIS[implementationABI], // Use implementation ABI
      functionName,
      args,
      query: {
        enabled: !!proxyAddress,
      }
    });
  };

  // For writing data through the proxy
  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, isError, error: receiptError } = useWaitForTransactionReceipt({ hash });

  const writeToProxy = async (functionName: string, args: any[], value?: bigint) => {
    if (!proxyAddress) {
      throw new Error('Proxy address not configured');
    }

    await writeContract({
      address: proxyAddress,
      abi: ABIS[implementationABI], // Use implementation ABI
      functionName,
      args,
      value,
    });
  };

  // Helper function to check if contract is actually a proxy
  const { data: isProxy } = useReadContract({
    address: proxyAddress,
    abi: ABIS.Proxy,
    functionName: 'implementation', // This would exist on EIP-1967 proxies
    query: {
      enabled: !!proxyAddress,
    }
  });

  return {
    // Read functions
    useProxyRead,
    
    // Write functions
    writeToProxy,
    isPending,
    isConfirming,
    isSuccess,
    isError: isError || !!writeError,
    txHash: hash,
    error: receiptError || writeError,
    
    // Proxy info
    proxyAddress,
    isProxy: !!isProxy,
  };
}

// Specialized hook for TaskFactory through proxy
export function useTaskFactoryProxy(proxyAddress?: Address) {
  const proxyContract = useProxyContract({
    proxyAddress,
    implementationABI: 'TaskFactory',
    watchEvents: true,
  });

  // Read all tasks through proxy
  const allTasks = proxyContract.useProxyRead('getAllTasks');
  
  // Read user profile through proxy
  const useUserProfile = (userAddress?: Address) => {
    return proxyContract.useProxyRead('getUserProfile', userAddress ? [userAddress] : undefined);
  };

  // Create task through proxy
  const createTaskThroughProxy = async (
    title: string,
    description: string,
    category: string,
    deadline: bigint,
    value: bigint
  ) => {
    await proxyContract.writeToProxy(
      'createTask',
      [title, description, category, deadline],
      value
    );
  };

  return {
    ...proxyContract,
    // Specific functions
    allTasks: allTasks.data,
    useUserProfile,
    createTaskThroughProxy,
    // Loading states
    isLoadingTasks: allTasks.isLoading,
  };
}

