import { useState, useRef } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_KEY;

/**
 * Hook for asking AI questions about products
 * Uses OpenAI GPT-4o-mini via Supabase Edge Function
 */
export function useProductQA() {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const askQuestion = async (productData, question) => {
    if (!question || question.trim().length === 0) {
      setError("Vennligst skriv et spørsmål");
      return;
    }

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);
    setAnswer(""); // Clear previous answer

    try {
      console.log(`Asking question: "${question}"`);

      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/product-qa`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            productData: {
              title: productData.title,
              brand: productData.brand,
              description: productData.description,
              price: productData.price,
              salePrice: productData.salePrice,
              discount: productData.discount,
              merchant: productData.merchant,
              availability: productData.availability,
            },
            question: question.trim(),
          }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get answer: ${response.status} ${errorText}`);
      }

      const data = await response.json();

      console.log(`Received answer: ${data.answer.substring(0, 100)}...`);
      setAnswer(data.answer);
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Request was cancelled");
        return;
      }
      console.error("Product Q&A error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const clearAnswer = () => {
    setAnswer("");
    setError(null);
  };

  return {
    answer,
    loading,
    error,
    askQuestion,
    clearAnswer,
  };
}
