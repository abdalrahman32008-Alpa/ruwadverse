import React from 'react';
import * as Sentry from '@sentry/react';

// Add this button component to your app to test Sentry's error tracking
export function ErrorButton() {
  return (
    <button
      onClick={() => {
        throw new Error('This is your first error!');
      }}
      className="fixed bottom-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors z-50 text-sm font-bold"
    >
      Break the world (Sentry Test)
    </button>
  );
}
