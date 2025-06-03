import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface MessageProps {
  variant: 'info' | 'success' | 'error' | 'warning';
  children: React.ReactNode;
}

const Message: React.FC<MessageProps> = ({ variant, children }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'info':
        return <Info className="h-5 w-5" />;
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'error':
        return <XCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className={`${getVariantClasses()} flex items-center p-4 mb-4 border rounded-lg`}>
      <div className="mr-2">{getIcon()}</div>
      <div>{children}</div>
    </div>
  );
};

export default Message;