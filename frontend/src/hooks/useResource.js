import { useEffect, useState } from 'react';

export function useResource(load, initialValue) {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }
      setError('');
      const response = await load();
      setData(response.data);
    } catch (err) {
      setError('Unable to load data right now.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        const response = await load();

        if (!cancelled) {
          setError('');
          setData(response.data);
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load data right now.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initialize();

    return () => {
      cancelled = true;
    };
  }, [load]);

  return {
    data,
    setData,
    loading,
    error,
    refresh,
  };
}
