import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background px-6 py-12">
          <div className="text-center max-w-2xl">
            <h1 className="text-5xl font-bold text-black mb-6">
              Oops! Something went wrong
            </h1>
            <p className="text-lg text-textSecondary mb-8 leading-relaxed">
              We encountered an unexpected error. Please try again.
            </p>
            <button className="btn-primary" onClick={this.handleReset}>
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
