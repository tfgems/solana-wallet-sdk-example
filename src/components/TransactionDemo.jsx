import { useState } from 'react';
import { usePhantomWallet } from '../hooks/usePhantomWallet';
import { 
  Transaction, 
  SystemProgram, 
  PublicKey, 
  LAMPORTS_PER_SOL 
} from '@solana/web3.js';

const TransactionDemo = () => {
  const { connected, publicKey, connection, wallet, refreshBalance } = usePhantomWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('0.01');
  const [sending, setSending] = useState(false);
  const [txSignature, setTxSignature] = useState(null);
  const [error, setError] = useState(null);

  const handleSendTransaction = async () => {
    if (!recipient.trim()) {
      setError('Please enter a recipient address');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setSending(true);
      setError(null);
      setTxSignature(null);

      // Validate recipient address
      let recipientPubkey;
      try {
        recipientPubkey = new PublicKey(recipient);
      } catch (err) {
        throw new Error('Invalid recipient address');
      }

      // Get latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();

      // Create transaction
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: publicKey
      });

      // Add transfer instruction
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientPubkey,
        lamports: parseFloat(amount) * LAMPORTS_PER_SOL
      });

      transaction.add(transferInstruction);

      // Sign and send transaction
      const signedTransaction = await wallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      // Confirm transaction
      await connection.confirmTransaction(signature);
      
      setTxSignature(signature);
      console.log('Transaction successful:', signature);
      
      // Refresh balance after successful transaction
      setTimeout(() => {
        refreshBalance();
      }, 2000);

    } catch (err) {
      console.error('Transaction failed:', err);
      setError(err.message || 'Transaction failed');
    } finally {
      setSending(false);
    }
  };

  const clearTransaction = () => {
    setTxSignature(null);
    setError(null);
    setRecipient('');
    setAmount('0.01');
  };

  if (!connected) {
    return (
      <div className="card">
        <h2>Send Transaction</h2>
        <p>Please connect your wallet first to send transactions.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Send SOL Transaction</h2>
      <p>Send SOL to another address on Devnet (test network).</p>

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!txSignature && (
        <div>
          <div style={{ marginBottom: '1em' }}>
            <label htmlFor="recipient" style={{ display: 'block', marginBottom: '0.5em' }}>
              <strong>Recipient Address:</strong>
            </label>
            <input
              id="recipient"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter Solana address (e.g., 11111111111111111111111111111112)"
              style={{
                width: '100%',
                padding: '0.5em',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'inherit',
                fontFamily: 'monospace',
                fontSize: '0.9em'
              }}
            />
          </div>

          <div style={{ marginBottom: '1em' }}>
            <label htmlFor="amount" style={{ display: 'block', marginBottom: '0.5em' }}>
              <strong>Amount (SOL):</strong>
            </label>
            <input
              id="amount"
              type="number"
              step="0.001"
              min="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.01"
              style={{
                width: '100%',
                padding: '0.5em',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'inherit',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ 
            background: 'rgba(255, 165, 0, 0.1)',
            border: '1px solid rgba(255, 165, 0, 0.3)',
            padding: '0.75em',
            borderRadius: '4px',
            marginBottom: '1em',
            fontSize: '0.9em'
          }}>
            <strong>⚠️ Important:</strong> This is on Devnet (test network). 
            You can get free Devnet SOL from{' '}
            <a 
              href="https://faucet.solana.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#ffa500' }}
            >
              Solana Faucet
            </a>
          </div>

          <button 
            onClick={handleSendTransaction}
            disabled={sending || !recipient.trim() || !amount}
            className="phantom-button"
          >
            {sending ? 'Sending Transaction...' : 'Send Transaction'}
          </button>
        </div>
      )}

      {txSignature && (
        <div className="success">
          <h3>✅ Transaction Successful!</h3>
          
          <div style={{ marginTop: '1em' }}>
            <p><strong>Transaction Signature:</strong></p>
            <code style={{ 
              display: 'block',
              wordBreak: 'break-all', 
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '0.5em',
              borderRadius: '4px',
              marginBottom: '1em',
              fontSize: '0.85em'
            }}>
              {txSignature}
            </code>

            <p><strong>Amount Sent:</strong> {amount} SOL</p>
            <p><strong>Recipient:</strong> {recipient}</p>

            <div style={{ marginTop: '1em' }}>
              <a 
                href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '0.5em 1em',
                  background: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  marginRight: '0.5em'
                }}
              >
                View on Solana Explorer
              </a>

              <button onClick={clearTransaction}>
                Send Another Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionDemo;
