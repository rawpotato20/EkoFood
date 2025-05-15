'use client';

import { useEffect } from 'react';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
      <h1 className="text-2xl font-bold text-red-600">⚠️ Kažkas nutiko ne taip</h1>
      <p className="mt-2 text-gray-700">{error.message}</p>

      <button
        onClick={() => reset()}
        className="mt-6 px-5 py-2 bg-primary text-white rounded hover:bg-primary/80 transition"
      >
        Bandykite dar kartą
      </button>
    </div>
  );
}