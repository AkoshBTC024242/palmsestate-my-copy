// src/components/LoadingSpinner.jsx
import { Loader } from 'lucide-react';

function LoadingSpinner({ fullScreen = false, size = 'medium' }) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizeClasses[size]} mb-4 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center`}>
        <Loader className={`${sizeClasses[size].replace('w-', 'w-').replace('h-', 'h-')} text-orange-600 animate-spin`} />
      </div>
      <p className="text-gray-600">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return (
    <div className="min-h-[200px] flex items-center justify-center">
      {spinner}
    </div>
  );
}

export default LoadingSpinner;
