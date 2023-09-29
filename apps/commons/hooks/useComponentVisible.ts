import { useEffect, useRef, useState } from 'react';

// Use this hook to hide component display on outside click
export default function useComponentVisible(initialIsVisible) {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: Event) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible };
}
