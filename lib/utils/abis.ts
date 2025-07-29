// lib/utils/abis.ts
import TaskFactoryABI from '@/lib/abis/TaskFactory.json';
import TaskEscrowABI from '@/lib/abis/TaskEscrow.json';
import ProxyABI from '@/lib/abis/ABI.json';

// Export all ABIs with proper typing
export const ABIS = {
  TaskFactory: TaskFactoryABI,
  TaskEscrow: TaskEscrowABI,
  Proxy: ProxyABI, // This is the proxy contract ABI for upgradeable contracts
} as const;

// Type helpers for better type safety
export type ABIName = keyof typeof ABIS;
export type ContractABI = typeof ABIS[ABIName];

// Helper function to get ABI by name
export const getABI = (name: ABIName): ContractABI => {
  return ABIS[name];
};

// Contract addresses (move these to environment variables)
export const CONTRACT_ADDRESSES = {
  // The proxy contract address - this is what you interact with
  PROXY_CONTRACT: process.env.NEXT_PUBLIC_PROXY_ADDRESS as `0x${string}`,
  // The TaskFactory implementation address (behind the proxy)
  TASK_FACTORY: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
  // TaskEscrow contract (if separate)
  TASK_ESCROW: process.env.NEXT_PUBLIC_ESCROW_ADDRESS as `0x${string}`,
} as const;

// Helper to get contract address by name
export const getContractAddress = (name: keyof typeof CONTRACT_ADDRESSES) => {
  return CONTRACT_ADDRESSES[name];
};

// Contract function names for type safety
export const CONTRACT_FUNCTIONS = {
  TaskFactory: {
    CREATE_TASK: 'createTask',
    GET_ALL_TASKS: 'getAllTasks',
    GET_TASKS_BY_CATEGORY: 'getTasksByCategory',
    GET_USER_POSTED_TASKS: 'getUserPostedTasks',
    GET_USER_ASSIGNED_TASKS: 'getUserAssignedTasks',
    GET_USER_PROFILE: 'getUserProfile',
    APPLY_FOR_TASK: 'applyForTask',
    TASK_COMPLETED: 'taskCompleted',
  },
  TaskEscrow: {
    // Add TaskEscrow function names here when you need them
    RELEASE_PAYMENT: 'releasePayment',
    REFUND: 'refund',
    // ... other escrow functions
  },
  Proxy: {
    // Proxy contracts typically don't have direct function calls
    // They delegate to implementation contracts
    // But you might need these for admin functions:
    UPGRADE_TO: 'upgradeTo',
    CHANGE_ADMIN: 'changeAdmin',
  },
} as const;

// Event names for listening to contract events
export const CONTRACT_EVENTS = {
  TaskFactory: {
    TASK_CREATED: 'TaskCreated',
    TRANSACTION_RECORDED: 'TransactionRecorded',
  },
  TaskEscrow: {
    // Add TaskEscrow event names here
    PAYMENT_RELEASED: 'PaymentReleased',
    REFUND_PROCESSED: 'RefundProcessed',
  },
  Proxy: {
    ADMIN_CHANGED: 'AdminChanged',
    UPGRADED: 'Upgraded',
  },
} as const;

// Helper function to determine if you're interacting with a proxy
export const isProxyContract = (address: `0x${string}`) => {
  return address === CONTRACT_ADDRESSES.PROXY_CONTRACT;
};

// Helper to get the correct ABI for a contract address
export const getABIForAddress = (address: `0x${string}`) => {
  if (address === CONTRACT_ADDRESSES.TASK_FACTORY) return ABIS.TaskFactory;
  if (address === CONTRACT_ADDRESSES.TASK_ESCROW) return ABIS.TaskEscrow;
  if (address === CONTRACT_ADDRESSES.PROXY_CONTRACT) return ABIS.Proxy;
  
  // Default to TaskFactory if unknown (you might want to throw an error instead)
  return ABIS.TaskFactory;
};