import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public props: Props;
  public state: State = {
    hasError: false
  };

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-white p-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">حدث خطأ غير متوقع</h1>
            <p className="text-gray-400 mb-8">نعتذر، يبدو أن هناك مشكلة في تحميل هذه الصفحة.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-[#FFD700] text-black rounded-xl font-bold"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
