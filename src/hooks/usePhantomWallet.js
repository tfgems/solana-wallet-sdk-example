import { useState, useEffect, useCallback } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Custom hook for Phantom wallet functionality
export const usePhantomWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  // Solana connection (devnet for testing)
  const connection = new Connection('https://api.devnet.solana.com');

  // Check if Phantom is installed
  const isPhantomInstalled = useCallback(() => {
    return typeof window !== 'undefined' && 
           (window.phantom?.solana?.isPhantom || window.solana?.isPhantom);
  }, []);

  // Get Phantom provider
  const getProvider = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    if (window.phantom?.solana?.isPhantom) {
      return window.phantom.solana;
    }
    
    if (window.solana?.isPhantom) {
      return window.solana;
    }
    
    return null;
  }, []);

  // Initialize wallet connection
  useEffect(() => {
    const provider = getProvider();
    if (provider) {
      setWallet(provider);
      
      // Check if already connected
      if (provider.isConnected && provider.publicKey) {
        setConnected(true);
        setPublicKey(provider.publicKey);
        fetchBalance(provider.publicKey);
      }

      // Listen for account changes
      provider.on('accountChanged', (publicKey) => {
        if (publicKey) {
          setPublicKey(publicKey);
          setConnected(true);
          fetchBalance(publicKey);
        } else {
          setPublicKey(null);
          setConnected(false);
          setBalance(null);
        }
      });

      // Listen for disconnect
      provider.on('disconnect', () => {
        setConnected(false);
        setPublicKey(null);
        setBalance(null);
      });
    }

    return () => {
      // Cleanup listeners
      if (provider) {
        provider.removeAllListeners('accountChanged');
        provider.removeAllListeners('disconnect');
      }
    };
  }, [getProvider]);

  // Fetch wallet balance
  const fetchBalance = useCallback(async (pubKey) => {
    try {
      if (!pubKey) return;
      const balance = await connection.getBalance(new PublicKey(pubKey.toString()));
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError('Failed to fetch balance');
    }
  }, [connection]);

  // Connect wallet
  const connect = useCallback(async () => {
    if (!wallet) {
      setError('Phantom wallet not found. Please install Phantom.');
      return;
    }

    try {
      setConnecting(true);
      setError(null);
      
      const response = await wallet.connect();
      setConnected(true);
      setPublicKey(response.publicKey);
      await fetchBalance(response.publicKey);
      
      console.log('Connected to wallet:', response.publicKey.toString());
    } catch (err) {
      console.error('Connection failed:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  }, [wallet, fetchBalance]);

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    if (!wallet) return;

    try {
      await wallet.disconnect();
      setConnected(false);
      setPublicKey(null);
      setBalance(null);
      setError(null);
      console.log('Wallet disconnected');
    } catch (err) {
      console.error('Disconnect failed:', err);
      setError('Failed to disconnect wallet');
    }
  }, [wallet]);

  // Sign message
  const signMessage = useCallback(async (message) => {
    if (!wallet || !connected) {
      throw new Error('Wallet not connected');
    }

    try {
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await wallet.signMessage(encodedMessage, 'utf8');
      return signedMessage;
    } catch (err) {
      console.error('Message signing failed:', err);
      throw new Error('Failed to sign message');
    }
  }, [wallet, connected]);

  // Refresh balance
  const refreshBalance = useCallback(() => {
    if (publicKey) {
      fetchBalance(publicKey);
    }
  }, [publicKey, fetchBalance]);

  return {
    // State
    wallet,
    connected,
    connecting,
    publicKey,
    balance,
    error,
    isPhantomInstalled: isPhantomInstalled(),
    
    // Actions
    connect,
    disconnect,
    signMessage,
    refreshBalance,
    
    // Utils
    connection
  };
};
