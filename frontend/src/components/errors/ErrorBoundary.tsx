import React, { Component, ErrorInfo, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ExclamationTriangleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console and potentially to error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    // You can also log to an error reporting service here
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} errorInfo={this.state.errorInfo} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset: () => void;
}

const ErrorFallback = ({ error, errorInfo, onReset }: ErrorFallbackProps) => {
  const { theme } = useThemeStore();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0A0A0F] dark:to-[#1A1A2E]">
      <Card className={cn(
        "max-w-2xl w-full p-8",
        theme === "dark"
          ? "bg-[#1A1A2E] border-red-500/30"
          : "bg-white border-red-300"
      )}>
        <div className="text-center mb-6">
          <div className={cn(
            "inline-flex items-center justify-center w-20 h-20 rounded-full mb-4",
            theme === "dark"
              ? "bg-red-500/20 text-red-400"
              : "bg-red-100 text-red-600"
          )}>
            <ExclamationTriangleIcon className="h-10 w-10" />
          </div>
          <h1 className={cn(
            "text-2xl font-black mb-2",
            theme === "dark" ? "text-white" : "text-gray-900"
          )}>
            {t("errors.boundary.title")}
          </h1>
          <p className={cn(
            "text-sm",
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          )}>
            {t("errors.boundary.description")}
          </p>
        </div>

        {process.env.NODE_ENV === "development" && error && (
          <div className={cn(
            "mt-6 p-4 rounded-lg overflow-auto max-h-64",
            theme === "dark"
              ? "bg-[#0A0A0F] border border-red-500/20"
              : "bg-gray-50 border border-red-200"
          )}>
            <p className={cn(
              "text-xs font-mono mb-2",
              theme === "dark" ? "text-red-400" : "text-red-600"
            )}>
              {error.toString()}
            </p>
            {errorInfo && (
              <pre className={cn(
                "text-xs font-mono overflow-auto",
                theme === "dark" ? "text-gray-500" : "text-gray-600"
              )}>
                {errorInfo.componentStack}
              </pre>
            )}
          </div>
        )}

        <div className="flex gap-3 justify-center mt-6">
          <Button
            variant="primary"
            onClick={onReset}
            className="flex items-center gap-2"
          >
            <ArrowPathIcon className="h-4 w-4" />
            {t("errors.boundary.retry")}
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = "/"}
          >
            {t("errors.boundary.home")}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export const ErrorBoundary: React.FC<Props> = (props) => {
  return <ErrorBoundaryClass {...props} />;
};

