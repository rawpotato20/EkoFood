'use client';
import { useEffect } from 'react';
import Error500 from 'ui/components/Error500';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <Error500 />;
}
