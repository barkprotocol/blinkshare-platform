'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from "@/components/ui/button"
import { AlertTriangle } from 'lucide-react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h1>
          <p className="text-lg mb-4">We&apos;re sorry, but there was an error processing your request.</p>
          <Button
            onClick={() => this.setState({ hasError: false })}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
