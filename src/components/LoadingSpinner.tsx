import React from 'react';

export default function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative">
        <div className="w-10 h-10 border-4 border-blue-100 rounded-full"></div>
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      {message && <p className="mt-3 text-sm font-medium text-slate-500 animate-pulse">{message}</p>}
    </div>
  );
}
