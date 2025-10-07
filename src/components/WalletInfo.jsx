import { useState, useEffect } from 'react';
import { usePhantomWallet } from '../hooks/usePhantomWallet';
import { 
  formatSOL, 
  formatPublicKey, 
  getAddressExplorerUrl,
  getAccountInfo 
} from '../utils/solana';

const WalletInfo = () => {
  const { connected, publicKey, balance, connection } = usePhantomWallet();
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (connected && publicKey) {
      fetchAccountInfo();
    }
  }, [connected, publicKey]);

  const fetchAccountInfo = async () => {
    if (!publicKey || !connection) return;
    
    setLoading(true);
    try {
      const info = await getAccountInfo(connection, publicKey);
      setAccountInfo(info);
    } catch (error) {
      console.error('Error fetching account info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="card">
        <h2>Wallet Information</h2>
        <p>Please connect your wallet to view detailed information.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Wallet Information</h2>
      
      <div style={{ display: 'grid', gap: '1em' }}>
        {/* Basic Info */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '1em',
          borderRadius: '8px'
        }}>
          <h3 style={{ margin: '0 0 0.5em 0' }}>Basic Information</h3>
          
          <div style={{ display: 'grid', gap: '0.5em', fontSize: '0.9em' }}>
            <div>
              <strong>Address (Short):</strong> {formatPublicKey(publicKey, 8)}
            </div>
            
            <div>
              <strong>Balance:</strong> {formatSOL(balance * 1000000000)}
            </div>
            
            <div>
              <strong>Network:</strong> Devnet
            </div>
          </div>
        </div>

        {/* Full Address */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '1em',
          borderRadius: '8px'
        }}>
          <h3 style={{ margin: '0 0 0.5em 0' }}>Full Address</h3>
          <code style={{ 
            display: 'block',
            wordBreak: 'break-all',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '0.5em',
            borderRadius: '4px',
            fontSize: '0.8em',
            lineHeight: '1.4'
          }}>
            {publicKey?.toString()}
          </code>
          
          <div style={{ marginTop: '0.5em' }}>
            <a 
              href={getAddressExplorerUrl(publicKey?.toString())}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '0.4em 0.8em',
                background: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '0.8em'
              }}
            >
              View on Explorer
            </a>
          </div>
        </div>

        {/* Account Details */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '1em',
          borderRadius: '8px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '0.5em'
          }}>
            <h3 style={{ margin: 0 }}>Account Details</h3>
            <button 
              onClick={fetchAccountInfo}
              disabled={loading}
              style={{
                padding: '0.3em 0.6em',
                fontSize: '0.8em',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {loading ? (
            <p style={{ color: '#888' }}>Loading account information...</p>
          ) : accountInfo ? (
            <div style={{ display: 'grid', gap: '0.5em', fontSize: '0.9em' }}>
              <div>
                <strong>Owner:</strong>{' '}
                <code style={{ fontSize: '0.8em' }}>
                  {accountInfo.owner.toString()}
                </code>
              </div>
              
              <div>
                <strong>Lamports:</strong> {accountInfo.lamports.toLocaleString()}
              </div>
              
              <div>
                <strong>Data Length:</strong> {accountInfo.data.length} bytes
              </div>
              
              <div>
                <strong>Executable:</strong> {accountInfo.executable ? 'Yes' : 'No'}
              </div>
              
              <div>
                <strong>Rent Epoch:</strong> {accountInfo.rentEpoch}
              </div>
            </div>
          ) : (
            <p style={{ color: '#888' }}>No account information available</p>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '1em',
          borderRadius: '8px'
        }}>
          <h3 style={{ margin: '0 0 0.5em 0' }}>Quick Actions</h3>
          
          <div style={{ display: 'flex', gap: '0.5em', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigator.clipboard.writeText(publicKey?.toString())}
              style={{
                padding: '0.5em 1em',
                background: 'rgba(0, 255, 0, 0.2)',
                border: '1px solid rgba(0, 255, 0, 0.4)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.85em'
              }}
            >
              Copy Address
            </button>
            
            <a 
              href="https://faucet.solana.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '0.5em 1em',
                background: 'rgba(255, 165, 0, 0.2)',
                border: '1px solid rgba(255, 165, 0, 0.4)',
                color: 'inherit',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '0.85em'
              }}
            >
              Get Devnet SOL
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletInfo;
