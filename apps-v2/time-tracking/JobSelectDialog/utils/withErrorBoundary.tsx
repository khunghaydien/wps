import * as React from 'react';

type ErrorInfo = { componentStack: string };
export type CatchError = (error: Error, errorInfo: ErrorInfo) => void;

export default (catchError: CatchError) =>
  <TProps extends Record<string, any>>(
    WrappedComponent: React.ComponentType<TProps>
  ): React.ComponentType<TProps> => {
    return class ErrorBoundary extends React.Component<TProps> {
      static getDerivedStateFromError(_error: Error) {
        return { hasError: true };
      }

      componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        catchError(error, errorInfo);
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    };
  };
