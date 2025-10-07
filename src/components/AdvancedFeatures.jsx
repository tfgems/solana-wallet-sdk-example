import { useState } from 'react';
import { usePhantomWallet } from '../hooks/usePhantomWallet';
import { 
  SystemProgram, 
  Transaction, 
  PublicKey,
  LAMPORTS_PER_SOL 
} from '@solana/web3.js';

const AdvancedFeatures = () => {
  const { connected, publicKey, wallet, connection } = usePhantomWallet();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const clearResults = () => {
    setResult(null);
    setError(null);
  };

  // Sign and verify message
  const handleSignAndVerify = async () => {
    if (!connected || !wallet) return;

    try {
      setLoading(true);
      clearResults();

      const message = `Verification message from ${publicKey.toString()} at ${new Date().toISOString()}`;
      const encodedMessage = new TextEncoder().encode(message);
      
      const signedMessage = await wallet.signMessage(encodedMessage, 'utf8');
      
      setResult({
        type: 'signature',
        message,
        signature: signedMessage,
        timestamp: new Date().toISOString()
      });

    } catch (err) {
      setError(err.message || 'Failed to sign message');
    } finally {
      setLoading(false);
    }
  };

  // Create and sign transaction (without sending)
  const handleCreateTransaction = async () => {
    if (!connected || !publicKey) return;

    try {
      setLoading(true);
      clearResults();

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();

      // Create a simple transfer transaction (to self)
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: publicKey
      });

      // Add a small transfer to self (1 lamport)
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: publicKey,
          lamports: 1
        })
      );

      // Sign the transaction
      const signedTx = await wallet.signTransaction(transaction);
      
      setResult({
        type: 'transaction',
        transaction: signedTx,
        instructions: transaction.instructions.length,
        fee: await transaction.getEstimatedFee(connection)
      });

    } catch (err) {
      setError(err.message || 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  // Sign multiple transactions
  const handleSignMultiple = async () => {
    if (!connected || !publicKey) return;

    try {
      setLoading(true);
      clearResults();

      const { blockhash } = await connection.getLatestBlockhash();
      const transactions = [];

      // Create 3 simple transactions
      for (let i = 0; i < 3; i++) {
        const tx = new Transaction({
          recentBlockhash: blockhash,
          feePayer: publicKey
        });

        tx.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: publicKey,
            lamports: i + 1
          })
        );

        transactions.push(tx);
      }

      // Sign all transactions
      const signedTransactions = await wallet.signAllTransactions(transactions);
      
      setResult({
        type: 'multiple',
        count: signedTransactions.length,
        transactions: signedTransactions
      });

    } catch (err) {
      setError(err.message || 'Failed to sign multiple transactions');
    } finally {
      setLoading(false);
    }
  };

  // Check wallet capabilities
  const handleCheckCapabilities = async () => {
    if (!connected || !wallet) return;

    try {
      setLoading(true);
      clearResults();

      const capabilities = {
        isPhantom: wallet.isPhantom || false,
        isConnected: wallet.isConnected || false,
        publicKey: publicKey?.toString() || null,
        methods: {
          connect: typeof wallet.connect === 'function',
          disconnect: typeof wallet.disconnect === 'function',
          signMessage: typeof wallet.signMessage === 'function',
          signTransaction: typeof wallet.signTransaction === 'function',
          signAllTransactions: typeof wallet.signAllTransactions === 'function',
          request: typeof wallet.request === 'function'
        },
        events: {
          accountChanged: wallet.listenerCount ? wallet.listenerCount('accountChanged') > 0 : false,
          disconnect: wallet.listenerCount ? wallet.listenerCount('disconnect') > 0 : false
        }
      };

      setResult({
        type: 'capabilities',
        capabilities
      });

    } catch (err) {
      setError(err.message || 'Failed to check capabilities');
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="card">
        <h2>Advanced Features</h2>
        <p>Please connect your wallet to access advanced features.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Advanced Phantom Features</h2>
      <p>Explore advanced wallet capabilities and transaction signing.</p>

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="button-group">
        <button 
          onClick={handleSignAndVerify}
          disabled={loading}
          className="phantom-button"
        >
          {loading ? 'Signing...' : 'Sign & Verify Message'}
        </button>

        <button 
          onClick={handleCreateTransaction}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Transaction'}
        </button>

        <button 
          onClick={handleSignMultiple}
          disabled={loading}
        >
          {loading ? 'Signing...' : 'Sign Multiple Transactions'}
        </button>

        <button 
          onClick={handleCheckCapabilities}
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Check Capabilities'}
        </button>

        {result && (
          <button onClick={clearResults}>
            Clear Results
          </button>
        )}
      </div>

      {result && (
        <div className="success" style={{ marginTop: '1em' }}>
          <h3>✅ Operation Successful!</h3>
          
          {result.type === 'signature' && (
            <div>
              <h4>Message Signature</h4>
              <p><strong>Message:</strong> "{result.message}"</p>
              <p><strong>Timestamp:</strong> {result.timestamp}</p>
              <div style={{ marginTop: '0.5em' }}>
                <strong>Signature Data:</strong>
                <code style={{ 
                  display: 'block',
                  wordBreak: 'break-all',
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '0.5em',
                  borderRadius: '4px',
                  fontSize: '0.8em',
                  marginTop: '0.25em'
                }}>
                  {result.signature.signature ? 
                    Array.from(result.signature.signature).map(b => b.toString(16).padStart(2, '0')).join('') :
                    'No signature data'
                  }
                </code>
              </div>
            </div>
          )}

          {result.type === 'transaction' && (
            <div>
              <h4>Transaction Created</h4>
              <p><strong>Instructions:</strong> {result.instructions}</p>
              <p><strong>Estimated Fee:</strong> {result.fee ? `${result.fee / LAMPORTS_PER_SOL} SOL` : 'Unknown'}</p>
              <p><strong>Status:</strong> Signed but not sent</p>
              <div style={{ 
                background: 'rgba(255, 165, 0, 0.1)',
                border: '1px solid rgba(255, 165, 0, 0.3)',
                padding: '0.5em',
                borderRadius: '4px',
                fontSize: '0.9em',
                marginTop: '0.5em'
              }}>
                <strong>Note:</strong> Transaction was signed but not broadcasted to the network.
              </div>
            </div>
          )}

          {result.type === 'multiple' && (
            <div>
              <h4>Multiple Transactions Signed</h4>
              <p><strong>Count:</strong> {result.count} transactions</p>
              <p><strong>Status:</strong> All signed successfully</p>
              <div style={{ marginTop: '0.5em' }}>
                {result.transactions.map((tx, index) => (
                  <div key={index} style={{ 
                    background: 'rgba(0, 0, 0, 0.2)',
                    padding: '0.5em',
                    borderRadius: '4px',
                    marginBottom: '0.25em',
                    fontSize: '0.85em'
                  }}>
                    <strong>Transaction {index + 1}:</strong> {tx.instructions.length} instruction(s)
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.type === 'capabilities' && (
            <div>
              <h4>Wallet Capabilities</h4>
              <div style={{ fontSize: '0.9em' }}>
                <p><strong>Is Phantom:</strong> {result.capabilities.isPhantom ? '✅' : '❌'}</p>
                <p><strong>Connected:</strong> {result.capabilities.isConnected ? '✅' : '❌'}</p>
                
                <div style={{ marginTop: '0.75em' }}>
                  <strong>Available Methods:</strong>
                  <ul style={{ margin: '0.25em 0', paddingLeft: '1.5em' }}>
                    {Object.entries(result.capabilities.methods).map(([method, available]) => (
                      <li key={method}>
                        {method}: {available ? '✅' : '❌'}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: '0.75em' }}>
                  <strong>Event Listeners:</strong>
                  <ul style={{ margin: '0.25em 0', paddingLeft: '1.5em' }}>
                    {Object.entries(result.capabilities.events).map(([event, active]) => (
                      <li key={event}>
                        {event}: {active ? '✅ Active' : '❌ Inactive'}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedFeatures;
