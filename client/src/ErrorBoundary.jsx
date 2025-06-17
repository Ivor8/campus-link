import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
componentDidCatch(error, errorInfo) {
  console.error("ErrorBoundary caught:", error, errorInfo);
  // Store the error in state
  this.setState({ 
    hasError: true,
    errorMessage: error.toString() 
  });
}


render() {
  if (this.state.hasError) {
    return (
      <div className="error-fallback">
        <h2>Something went wrong</h2>
        <p>{this.state.errorMessage}</p>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
      </div>
    );
  }
  return this.props.children;
}
}

export default ErrorBoundary;