// lib/config/contracts.ts
import { Address } from 'viem';

// Contract deployment configuration
export const CONTRACT_CONFIG = {
  // Set this to true if your TaskFactory is deployed behind a proxy
  USE_PROXY: process.env.NEXT_PUBLIC_USE_PROXY === 'true',
  
  // Network configuration
  NETWORK: process.env.NEXT_PUBLIC_NETWORK || 'sepolia',
  
  // Contract addresses
  ADDRESSES: {
    // Direct contract addresses
    TASK_FACTORY: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    TASK_ESCROW: process.env.NEXT_PUBLIC_ESCROW_ADDRESS as Address,
    
    // Proxy contract address (if using proxy pattern)
    PROXY: process.env.NEXT_PUBLIC_PROXY_ADDRESS as Address,
    
    // Implementation addresses (behind proxies)
    TASK_FACTORY_IMPL: process.env.NEXT_PUBLIC_TASK_FACTORY_IMPL as Address,
    TASK_ESCROW_IMPL: process.env.NEXT_PUBLIC_TASK_ESCROW_IMPL as Address,
  },
  
  // Feature flags
  FEATURES: {
    ESCROW_ENABLED: process.env.NEXT_PUBLIC_ESCROW_ENABLED === 'true',
    NOTIFICATIONS_ENABLED: process.env.NEXT_PUBLIC_NOTIFICATIONS_ENABLED !== 'false',
    ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
  }
} as const;

// Helper function to get the correct contract address based on configuration
export function getActiveContractAddress(contractType: 'TASK_FACTORY' | 'TASK_ESCROW'): Address {
  if (CONTRACT_CONFIG.USE_PROXY) {
    // If using proxy, return the proxy address
    return CONTRACT_CONFIG.ADDRESSES.PROXY;
  } else {
    // If not using proxy, return the direct contract address
    return CONTRACT_CONFIG.ADDRESSES[contractType];
  }
}

// Helper to determine which ABI to use
export function getActiveABI(contractType: 'TASK_FACTORY' | 'TASK_ESCROW') {
  // Always use the implementation ABI, whether calling directly or through proxy
  return contractType;
}

// Validation function to ensure required addresses are configured
export function validateContractConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (CONTRACT_CONFIG.USE_PROXY) {
    if (!CONTRACT_CONFIG.ADDRESSES.PROXY) {
      errors.push('NEXT_PUBLIC_PROXY_ADDRESS is required when USE_PROXY is true');
    }
  } else {
    if (!CONTRACT_CONFIG.ADDRESSES.TASK_FACTORY) {
      errors.push('NEXT_PUBLIC_CONTRACT_ADDRESS is required when USE_PROXY is false');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Environment-specific configurations
export const NETWORK_CONFIGS = {
  sepolia: {
    chainId: 11155111,
    blockExplorer: 'https://sepolia.etherscan.io',
    rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
  },
  mainnet: {
    chainId: 1,
    blockExplorer: 'https://etherscan.io',
    rpcUrl: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
  },
  polygon: {
    chainId: 137,
    blockExplorer: 'https://polygonscan.com',
    rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL,
  }
} as const;

// Helper to get current network config
export function getCurrentNetworkConfig() {
  return NETWORK_CONFIGS[CONTRACT_CONFIG.NETWORK as keyof typeof NETWORK_CONFIGS];
}

