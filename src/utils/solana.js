import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Solana network configurations
export const NETWORKS = {
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com',
  mainnet: 'https://api.mainnet-beta.solana.com'
};

// Create connection to Solana network
export const createConnection = (network = 'devnet') => {
  return new Connection(NETWORKS[network], 'confirmed');
};

// Format SOL amount for display
export const formatSOL = (lamports, decimals = 4) => {
  if (lamports === null || lamports === undefined) return 'Loading...';
  const sol = lamports / LAMPORTS_PER_SOL;
  return `${sol.toFixed(decimals)} SOL`;
};

// Format public key for display (shortened)
export const formatPublicKey = (publicKey, length = 4) => {
  if (!publicKey) return '';
  const keyStr = publicKey.toString();
  return `${keyStr.slice(0, length)}...${keyStr.slice(-length)}`;
};

// Validate Solana address
export const isValidSolanaAddress = (address) => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

// Convert SOL to lamports
export const solToLamports = (sol) => {
  return Math.floor(parseFloat(sol) * LAMPORTS_PER_SOL);
};

// Convert lamports to SOL
export const lamportsToSOL = (lamports) => {
  return lamports / LAMPORTS_PER_SOL;
};

// Get explorer URL for transaction
export const getExplorerUrl = (signature, network = 'devnet') => {
  const cluster = network === 'mainnet' ? '' : `?cluster=${network}`;
  return `https://explorer.solana.com/tx/${signature}${cluster}`;
};

// Get explorer URL for address
export const getAddressExplorerUrl = (address, network = 'devnet') => {
  const cluster = network === 'mainnet' ? '' : `?cluster=${network}`;
  return `https://explorer.solana.com/address/${address}${cluster}`;
};

// Common Solana addresses
export const COMMON_ADDRESSES = {
  SYSTEM_PROGRAM: '11111111111111111111111111111112',
  TOKEN_PROGRAM: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  ASSOCIATED_TOKEN_PROGRAM: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  RENT_SYSVAR: 'SysvarRent111111111111111111111111111111111',
  CLOCK_SYSVAR: 'SysvarC1ock11111111111111111111111111111111'
};

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Wallet not connected',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  INVALID_ADDRESS: 'Invalid Solana address',
  TRANSACTION_FAILED: 'Transaction failed',
  NETWORK_ERROR: 'Network error occurred',
  USER_REJECTED: 'User rejected the request'
};

// Transaction status checker
export const waitForTransaction = async (connection, signature, timeout = 60000) => {
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    try {
      const status = await connection.getSignatureStatus(signature);
      
      if (status.value?.confirmationStatus === 'confirmed' || 
          status.value?.confirmationStatus === 'finalized') {
        return status.value;
      }
      
      if (status.value?.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(status.value.err)}`);
      }
      
      // Wait 1 second before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      if (error.message.includes('Transaction failed')) {
        throw error;
      }
      // Continue waiting for other errors
    }
  }
  
  throw new Error('Transaction confirmation timeout');
};

// Get account info with error handling
export const getAccountInfo = async (connection, publicKey) => {
  try {
    const accountInfo = await connection.getAccountInfo(new PublicKey(publicKey));
    return accountInfo;
  } catch (error) {
    console.error('Error fetching account info:', error);
    return null;
  }
};

// Get balance with error handling
export const getBalance = async (connection, publicKey) => {
  try {
    const balance = await connection.getBalance(new PublicKey(publicKey));
    return balance;
  } catch (error) {
    console.error('Error fetching balance:', error);
    return null;
  }
};
