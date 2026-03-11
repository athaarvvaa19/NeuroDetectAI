import { useState, useCallback } from 'react';

export interface ApiResponse<T = any> {
  status: string;
  model: string;
  prediction: T;
  confidence?: number;
  all_predictions?: Record<string, number>;
  error?: string;
  timestamp?: string;
}

interface UseApiReturn {
  predict: (
    endpoint: string,
    data: FormData | Record<string, any>
  ) => Promise<ApiResponse | null>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

// ✅ FIX: Use import.meta.env instead of process.env (Vite requirement)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useApi = (): UseApiReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const predict = useCallback(
    async (
      endpoint: string,
      data: FormData | Record<string, any>
    ): Promise<ApiResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const isFormData = data instanceof FormData;

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: isFormData
            ? {} // FormData handles Content-Type header automatically
            : {
                'Content-Type': 'application/json',
              },
          body: isFormData ? data : JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage =
            errorData.message || errorData.error || 'Prediction failed';
          setError(errorMessage);
          return null;
        }

        const result: ApiResponse = await response.json();

        if (result.status !== 'success') {
          setError(result.error || 'Unknown error occurred');
          return null;
        }

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Network error occurred';
        setError(errorMessage);
        console.error('API Error:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { predict, loading, error, clearError };
};
