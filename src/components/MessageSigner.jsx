import { useState } from 'react';
import { usePhantomWallet } from '../hooks/usePhantomWallet';

const MessageSigner = () => {
  const { connected, signMessage } = usePhantomWallet();
  const [message, setMessage] = useState('Hello from Phantom Wallet SDK!');
  const [signature, setSignature] = useState(null);
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState(null);

  const handleSignMessage = async () => {
    if (!message.trim()) {
      setError('Please enter a message to sign');
      return;
    }

    try {
      setSigning(true);
      setError(null);
      setSignature(null);

      const result = await signMessage(message);
      setSignature(result);
      console.log('Message signed:', result);
    } catch (err) {
      console.error('Signing failed:', err);
      setError(err.message || 'Failed to sign message');
    } finally {
      setSigning(false);
    }
  };

  const clearSignature = () => {
    setSignature(null);
    setError(null);
  };

  if (!connected) {
    return (
      <div className="card">
        <h2>Message Signing</h2>
        <p>Please connect your wallet first to sign messages.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Message Signing</h2>
      <p>Sign a custom message with your Phantom wallet.</p>

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ marginBottom: '1em' }}>
        <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5em' }}>
          <strong>Message to Sign:</strong>
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message here..."
          rows={3}
          style={{
            width: '100%',
            padding: '0.5em',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'inherit',
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
        />
      </div>

      <div className="button-group">
        <button 
          onClick={handleSignMessage}
          disabled={signing || !message.trim()}
          className="phantom-button"
        >
          {signing ? 'Signing...' : 'Sign Message'}
        </button>

        {signature && (
          <button onClick={clearSignature}>
            Clear Signature
          </button>
        )}
      </div>

      {signature && (
        <div className="success">
          <h3>✅ Message Signed Successfully!</h3>
          
          <div style={{ marginTop: '1em' }}>
            <h4>Signature Details:</h4>
            
            <div style={{ marginBottom: '1em' }}>
              <strong>Public Key:</strong>
              <code style={{ 
                display: 'block',
                wordBreak: 'break-all', 
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '0.5em',
                borderRadius: '4px',
                marginTop: '0.25em',
                fontSize: '0.85em'
              }}>
                {signature.publicKey?.toString()}
              </code>
            </div>

            <div style={{ marginBottom: '1em' }}>
              <strong>Signature:</strong>
              <code style={{ 
                display: 'block',
                wordBreak: 'break-all', 
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '0.5em',
                borderRadius: '4px',
                marginTop: '0.25em',
                fontSize: '0.85em'
              }}>
                {signature.signature ? 
                  Array.from(signature.signature).map(b => b.toString(16).padStart(2, '0')).join('') :
                  'No signature data'
                }
              </code>
            </div>

            <div>
              <strong>Original Message:</strong>
              <div style={{ 
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '0.5em',
                borderRadius: '4px',
                marginTop: '0.25em',
                fontStyle: 'italic'
              }}>
                "{message}"
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageSigner;
