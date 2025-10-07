import { useState } from 'react';
import WalletConnection from './components/WalletConnection';
import WalletInfo from './components/WalletInfo';
import MessageSigner from './components/MessageSigner';
import TransactionDemo from './components/TransactionDemo';
import AdvancedFeatures from './components/AdvancedFeatures';
import { usePhantomWallet } from './hooks/usePhantomWallet';

function App() {
  const [activeTab, setActiveTab] = useState('wallet');
  const { connected } = usePhantomWallet();

  const tabs = [
    { id: 'wallet', label: 'Wallet Connection', component: WalletConnection },
    { id: 'info', label: 'Wallet Info', component: WalletInfo },
    { id: 'signing', label: 'Message Signing', component: MessageSigner },
    { id: 'transaction', label: 'Send Transaction', component: TransactionDemo },
    { id: 'advanced', label: 'Advanced Features', component: AdvancedFeatures }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || WalletConnection;

  return (
    <div style={{ 
      minHeight: '100vh',
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '2em' }}>
        <h1 style={{ 
          background: 'linear-gradient(135deg, #AB9FF2 0%, #7B68EE 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.5em'
        }}>
          Phantom Wallet SDK Example
        </h1>
        <p style={{ color: '#888', fontSize: '1.1em' }}>
          React hooks and components for Phantom wallet integration
        </p>
        {connected && (
          <div style={{ 
            display: 'inline-block',
            background: 'rgba(0, 255, 0, 0.1)',
            border: '1px solid rgba(0, 255, 0, 0.3)',
            color: '#51cf66',
            padding: '0.5em 1em',
            borderRadius: '20px',
            fontSize: '0.9em',
            marginTop: '0.5em'
          }}>
            ✅ Wallet Connected
          </div>
        )}
      </header>

      {/* Tab Navigation */}
      <nav style={{ 
        display: 'flex', 
        gap: '0.5em', 
        marginBottom: '2em',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75em 1.5em',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s',
              background: activeTab === tab.id 
                ? 'linear-gradient(135deg, #AB9FF2 0%, #7B68EE 100%)'
                : 'rgba(255, 255, 255, 0.1)',
              color: activeTab === tab.id ? 'white' : 'inherit',
              border: activeTab === tab.id 
                ? 'none' 
                : '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Active Component */}
      <main>
        <ActiveComponent />
      </main>

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        marginTop: '3em',
        padding: '2em 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#888',
        fontSize: '0.9em'
      }}>
        <p>
          Built with{' '}
          <a 
            href="https://phantom.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#AB9FF2' }}
          >
            Phantom Wallet SDK
          </a>
          {' '}and{' '}
          <a 
            href="https://react.dev/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#61dafb' }}
          >
            React
          </a>
        </p>
        <p style={{ marginTop: '0.5em' }}>
          <strong>Network:</strong> Solana Devnet (Test Network)
        </p>
        <div style={{ marginTop: '1em' }}>
          <a 
            href="https://faucet.solana.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '0.5em 1em',
              background: 'rgba(255, 165, 0, 0.2)',
              border: '1px solid rgba(255, 165, 0, 0.5)',
              color: '#ffa500',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '0.85em'
            }}
          >
            Get Devnet SOL (Free)
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
