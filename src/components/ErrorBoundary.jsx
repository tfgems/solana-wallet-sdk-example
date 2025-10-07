import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2em',
          textAlign: 'center',
          background: 'rgba(255, 0, 0, 0.1)',
          border: '1px solid rgba(255, 0, 0, 0.3)',
          borderRadius: '8px',
          margin: '2em auto',
          maxWidth: '600px'
        }}>
          <h2 style={{ color: '#ff6b6b', marginBottom: '1em' }}>
            ⚠️ Something went wrong
          </h2>
          
          <p style={{ marginBottom: '1em', color: '#888' }}>
            The application encountered an unexpected error. Please try refreshing the page.
          </p>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ 
              textAlign: 'left', 
              background: 'rgba(0, 0, 0, 0.2)',
              padding: '1em',
              borderRadius: '4px',
              marginBottom: '1em'
            }}>
              <summary style={{ cursor: 'pointer', marginBottom: '0.5em' }}>
                <strong>Error Details (Development Mode)</strong>
              </summary>
              
              <div style={{ fontSize: '0.85em', fontFamily: 'monospace' }}>
                <p><strong>Error:</strong> {this.state.error.toString()}</p>
                
                {this.state.errorInfo.componentStack && (
                  <div>
                    <strong>Component Stack:</strong>
                    <pre style={{ 
                      whiteSpace: 'pre-wrap', 
                      fontSize: '0.8em',
                      background: 'rgba(0, 0, 0, 0.3)',
                      padding: '0.5em',
                      borderRadius: '4px',
                      marginTop: '0.5em'
                    }}>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          <div style={{ display: 'flex', gap: '1em', justifyContent: 'center' }}>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75em 1.5em',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Refresh Page
            </button>
            
            <button 
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              style={{
                padding: '0.75em 1.5em',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'inherit',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
