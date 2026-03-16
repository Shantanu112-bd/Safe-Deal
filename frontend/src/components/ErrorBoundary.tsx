"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { GradientButton } from "./ui/gradient-button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
          <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="size-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Something went wrong</h2>
          <p className="mt-2 text-slate-500">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          <GradientButton
            onClick={() => window.location.reload()}
            className="mt-8 flex items-center gap-2 rounded-2xl px-8 py-4 font-bold"
          >
            <RefreshCcw className="size-4" />
            Reload Page
          </GradientButton>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
