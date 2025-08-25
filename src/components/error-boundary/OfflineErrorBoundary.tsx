import React from 'react';
import { useOfflineDetection } from '@/hooks/useOfflineDetection';
import { localize } from '@deriv-com/translations';

interface Props {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error?: Error; resetError?: () => void }>;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class OfflineErrorBoundary extends React.Component<Props, State> {
    private timeoutId?: NodeJS.Timeout;

    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        console.error('[OfflineErrorBoundary] Caught error:', error);
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('[OfflineErrorBoundary] Error details:', error, errorInfo);

        // Check if this is a chunk loading error (common when offline)
        if (
            error.message.includes('Loading chunk') ||
            error.message.includes('ChunkLoadError') ||
            error.message.includes('Loading CSS chunk')
        ) {
            console.log('[OfflineErrorBoundary] Detected chunk loading error, likely offline');
        }
    }

    componentDidMount() {
        // Set a timeout to catch hanging components
        this.timeoutId = setTimeout(() => {
            if (!this.state.hasError) {
                console.log('[OfflineErrorBoundary] Component loading timeout, showing error boundary');
                this.setState({
                    hasError: true,
                    error: new Error('Component loading timeout - possibly offline'),
                });
            }
        }, 10000); // 10 second timeout
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    resetError = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }

            if (this.props.fallback) {
                const FallbackComponent = this.props.fallback;
                return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
            }

            return <DefaultOfflineErrorFallback error={this.state.error} resetError={this.resetError} />;
        }

        return this.props.children;
    }
}

const DefaultOfflineErrorFallback: React.FC<{ error?: Error; resetError?: () => void }> = ({ error, resetError }) => {
    const { isOnline } = useOfflineDetection();

    const isChunkError =
        error?.message.includes('Loading chunk') ||
        error?.message.includes('ChunkLoadError') ||
        error?.message.includes('timeout');

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '20px',
                backgroundColor: '#0e0e0e',
                color: '#ffffff',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                textAlign: 'center',
            }}
        >
            <div style={{ maxWidth: '500px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{isOnline ? '⚠️' : '📱'}</div>

                <h1
                    style={{
                        color: '#ff444f',
                        fontSize: '2rem',
                        marginBottom: '1rem',
                        fontWeight: '600',
                    }}
                >
                    {isChunkError && !isOnline ? localize('Offline Mode') : localize('Something went wrong')}
                </h1>

                <p
                    style={{
                        fontSize: '1.1rem',
                        lineHeight: '1.6',
                        marginBottom: '2rem',
                        opacity: 0.9,
                    }}
                >
                    {isChunkError && !isOnline
                        ? localize('The app is loading in offline mode. Some features may be limited.')
                        : localize('An error occurred while loading the application.')}
                </p>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        marginBottom: '2rem',
                        padding: '12px 20px',
                        backgroundColor: 'rgba(255, 68, 79, 0.1)',
                        borderRadius: '8px',
                        borderLeft: '4px solid #ff444f',
                    }}
                >
                    <span
                        style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: isOnline ? '#4bb4b3' : '#ff444f',
                        }}
                    ></span>
                    {isOnline ? localize('Online') : localize('Offline')}
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            backgroundColor: '#ff444f',
                            color: 'white',
                            border: 'none',
                            padding: '15px 30px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '600',
                        }}
                    >
                        {localize('Reload Page')}
                    </button>

                    {resetError && (
                        <button
                            onClick={resetError}
                            style={{
                                backgroundColor: 'transparent',
                                color: '#ffffff',
                                border: '2px solid #ffffff',
                                padding: '15px 30px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '600',
                            }}
                        >
                            {localize('Try Again')}
                        </button>
                    )}
                </div>

                {error && (
                    <details
                        style={{
                            marginTop: '2rem',
                            textAlign: 'left',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            padding: '1rem',
                            borderRadius: '8px',
                        }}
                    >
                        <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                            {localize('Error Details')}
                        </summary>
                        <pre
                            style={{
                                fontSize: '0.8rem',
                                overflow: 'auto',
                                whiteSpace: 'pre-wrap',
                            }}
                        >
                            {error.message}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    );
};

export default OfflineErrorBoundary;
