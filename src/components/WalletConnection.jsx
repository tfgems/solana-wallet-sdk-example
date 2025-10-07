import { useState } from 'react';
import { usePhantomWallet } from '../hooks/usePhantomWallet';

const WalletConnection = () => {
  const {
    connected,
    connecting,
    publicKey,
    balance,
    error,
    isPhantomInstalled,
    connect,
    disconnect,
    refreshBalance
  } = usePhantomWallet();

  const [showDetails, setShowDetails] = useState(false);

  const formatPublicKey = (key) => {
    if (!key) return '';
    const keyStr = key.toString();
    return `${keyStr.slice(0, 4)}...${keyStr.slice(-4)}`;
  };

  const formatBalance = (bal) => {
    if (bal === null) return 'Loading...';
    return `${bal.toFixed(4)} SOL`;
  };

  if (!isPhantomInstalled) {
    return (
      <div className="card">
        <h2>Phantom Wallet Required</h2>
        <p>Please install the Phantom wallet extension to continue.</p>
        <a 
          href="https://phantom.app/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="phantom-button"
          style={{ 
            display: 'inline-block', 
            textDecoration: 'none',
            padding: '12px 24px',
            borderRadius: '8px'
          }}
        >
          Install Phantom Wallet
        </a>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Phantom Wallet Connection</h2>
      
      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!connected ? (
        <div>
          <p>Connect your Phantom wallet to get started.</p>
          <button 
            onClick={connect}
            disabled={connecting}
            className="phantom-button"
          >
            {connecting ? 'Connecting...' : 'Connect Phantom Wallet'}
          </button>
        </div>
      ) : (
        <div>
          <div className="wallet-info">
            <h3>✅ Wallet Connected</h3>
            <p><strong>Address:</strong> {formatPublicKey(publicKey)}</p>
            <p><strong>Balance:</strong> {formatBalance(balance)}</p>
            
            <div className="button-group">
              <button 
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </button>
              
              <button onClick={refreshBalance}>
                Refresh Balance
              </button>
              
              <button 
                onClick={disconnect}
                className="disconnect-button"
              >
                Disconnect
              </button>
            </div>

            {showDetails && (
              <div style={{ 
                marginTop: '1em', 
                padding: '1em', 
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                fontSize: '0.9em'
              }}>
                <h4>Full Details</h4>
                <p><strong>Full Address:</strong></p>
                <code style={{ 
                  wordBreak: 'break-all', 
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '0.5em',
                  borderRadius: '4px',
                  display: 'block'
                }}>
                  {publicKey?.toString()}
                </code>
                <p><strong>Network:</strong> Devnet</p>
                <p><strong>Balance (Lamports):</strong> {balance ? (balance * 1000000000).toFixed(0) : 'Loading...'}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;
