import { useEffect, useState, useMemo, useCallback } from "react";

// Helper function for debouncing input processing
const debounce = (func: Function, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

// Refactored useDetectors Hook
export const useDetectors = (inputMessage: string) => {
  const [detectedType, setDetectedType] = useState<
    "text" | "code" | "link" | "poll"
  >("text");

  const detectType = useCallback(
    debounce((message: string) => {
      if (/https?:\/\/\S+|www\.\S+/.test(message))
        return setDetectedType("link");
      if (/^(if|for|while|function|const|let|var)\s|{.*}|<.*>/.test(message))
        return setDetectedType("code");
      if (/^poll:\s+\w+(\s*,\s*\w+)+/.test(message))
        return setDetectedType("poll");
      setDetectedType("text");
    }, 300),
    [],
  );

  useEffect(() => {
    detectType(inputMessage);
  }, [inputMessage, detectType]);

  return useMemo(
    () => ({
      detectedType,
      isCode: detectedType === "code",
      isLink: detectedType === "link",
      isPoll: detectedType === "poll",
    }),
    [detectedType],
  );
};
