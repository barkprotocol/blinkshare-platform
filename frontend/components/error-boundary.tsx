import React, { Component, ErrorInfo, ReactNode } from "react";
import { toast } from "sonner";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    toast.error("An unexpected error occurred. Please try again or contact support.");
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
          <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-200">Oops! Something went wrong.</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-950 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

