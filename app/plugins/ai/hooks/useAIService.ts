import { useState } from 'react';

interface AIServiceOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface AIServiceResponse {
  text: string;
  error?: string;
}

export function useAIService() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateText = async (
    prompt: string,
    options: AIServiceOptions = {}
  ): Promise<AIServiceResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          ...options,
        }),
      });

      if (!response.ok) {
        throw new Error('Hiba történt az AI szolgáltatás használata során');
      }

      const data = await response.json();
      return { text: data.text };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ismeretlen hiba történt';
      setError(errorMessage);
      return { text: '', error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeText = async (
    text: string,
    options: AIServiceOptions = {}
  ): Promise<AIServiceResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          ...options,
        }),
      });

      if (!response.ok) {
        throw new Error('Hiba történt az AI szolgáltatás használata során');
      }

      const data = await response.json();
      return { text: data.analysis };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ismeretlen hiba történt';
      setError(errorMessage);
      return { text: '', error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const extractKeywords = async (
    text: string,
    options: AIServiceOptions = {}
  ): Promise<AIServiceResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          ...options,
        }),
      });

      if (!response.ok) {
        throw new Error('Hiba történt az AI szolgáltatás használata során');
      }

      const data = await response.json();
      return { text: data.keywords.join(', ') };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ismeretlen hiba történt';
      setError(errorMessage);
      return { text: '', error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    generateText,
    analyzeText,
    extractKeywords,
  };
} 