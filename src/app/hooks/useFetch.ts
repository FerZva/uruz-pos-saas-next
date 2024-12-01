import { useState, useEffect, useCallback } from "react";

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseFetchReturn<T> extends UseFetchState<T> {
  handleCancelRequest: () => void;
}

export function useFetch<T = unknown>(url: string): UseFetchReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [controller, setController] = useState<AbortController | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    setController(abortController);

    fetch(url, { signal: abortController.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((json: T) => setData(json))
      .catch((error) => {
        if (error.name === "AbortError") {
          console.log("Cancelled request");
        } else {
          setError(error.message || "An unknown error occurred");
        }
      })
      .finally(() => setLoading(false));

    return () => {
      abortController.abort();
    };
  }, [url]);

  const handleCancelRequest = useCallback(() => {
    if (controller) {
      controller.abort();
      setError("Cancelled Request");
    }
  }, [controller]);

  return { data, loading, error, handleCancelRequest };
}
