# Phantom Wallet SDK Example

A comprehensive React application demonstrating Phantom wallet integration using React hooks and components.

## 🚀 Features

- **Wallet Connection**: Connect/disconnect Phantom wallet with real-time status
- **Balance Display**: Show SOL balance with auto-refresh functionality
- **Message Signing**: Sign custom messages with cryptographic verification
- **Transaction Sending**: Send SOL transactions on Solana Devnet
- **React Hooks**: Custom `usePhantomWallet` hook for wallet state management
- **Modern UI**: Clean, responsive interface with tab navigation

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **@solana/web3.js** - Solana blockchain interaction
- **Phantom Wallet** - Browser extension wallet integration

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 Usage

### 1. Wallet Connection
- Detects Phantom wallet installation
- Connects/disconnects with user consent
- Shows wallet address and balance
- Real-time balance updates

### 2. Message Signing
- Sign custom text messages
- Cryptographic proof of ownership
- Display signature details
- Verify message authenticity

### 3. Transaction Demo
- Send SOL to any Solana address
- Real-time transaction status
- Solana Explorer integration
- Automatic balance refresh

## 🎯 Components

### `usePhantomWallet` Hook
Custom React hook providing:
- Wallet connection state
- Balance management
- Transaction methods
- Error handling

### `WalletConnection` Component
- Connection status display
- Connect/disconnect buttons
- Balance information
- Detailed wallet info

### `MessageSigner` Component
- Custom message input
- Signature generation
- Result display with verification

### `TransactionDemo` Component
- SOL transfer interface
- Transaction confirmation
- Explorer link integration

## 🌐 Network

This app uses **Solana Devnet** (test network):
- Free test SOL from [Solana Faucet](https://faucet.solana.com/)
- No real value transactions
- Safe for testing and development

## 🔐 Security Features

- Client-side wallet interaction only
- No private key exposure
- User consent for all operations
- Secure message signing
- Transaction verification

## 📱 Browser Support

- Chrome/Chromium with Phantom extension
- Firefox with Phantom extension
- Edge with Phantom extension
- Safari (limited support)

## 🚨 Prerequisites

1. **Phantom Wallet Extension**
   - Install from [phantom.app](https://phantom.app/)
   - Create or import a wallet
   - Switch to Devnet in settings

2. **Devnet SOL**
   - Get free SOL from [Solana Faucet](https://faucet.solana.com/)
   - Required for transaction testing

## 📖 API Reference

### usePhantomWallet Hook

```javascript
const {
  // State
  wallet,           // Phantom provider instance
  connected,        // Connection status
  connecting,       // Connection in progress
  publicKey,        // Wallet public key
  balance,          // SOL balance
  error,            // Error message
  isPhantomInstalled, // Installation status
  
  // Actions
  connect,          // Connect wallet
  disconnect,       // Disconnect wallet
  signMessage,      // Sign text message
  refreshBalance,   // Update balance
  
  // Utils
  connection        // Solana RPC connection
} = usePhantomWallet();
```

## 🔄 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🐛 Troubleshooting

### Wallet Not Detected
- Ensure Phantom extension is installed
- Refresh the page
- Check browser console for errors

### Connection Failed
- Unlock Phantom wallet
- Check network settings (should be Devnet)
- Clear browser cache if needed

### Transaction Failed
- Ensure sufficient SOL balance
- Verify recipient address format
- Check network connectivity

## 📄 License

MIT License - feel free to use for learning and development!

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Test thoroughly
5. Submit pull request

## 🔗 Links

- [Phantom Wallet](https://phantom.app/)
- [Solana Documentation](https://docs.solana.com/)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
