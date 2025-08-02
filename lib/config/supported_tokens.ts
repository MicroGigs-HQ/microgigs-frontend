export const SUPPORTED_TOKENS = {
    USDC: {
        name: 'USD Coin',
        symbol: 'USDC',
        addresses: {
            // Mainnet address
            1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as `0x${string}`,
            // Base Sepolia address
            84532: "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as `0x${string}`,
        },
        decimals: 6,
        logo: "/usdc.png",
    },
    USDT: {
        name: 'Tether USD',
        symbol: 'USDT',
        addresses: {
            // Mainnet address
            1: "0xdAC17F958D2ee523a2206206994597C13D831ec7" as `0x${string}`,
            // Sepolia address
            84532: "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06" as `0x${string}`,
        },
        decimals: 6,
        logo: "/usdt.png",
    },
} as const;

export type SupportedTokenSymbol = keyof typeof SUPPORTED_TOKENS;