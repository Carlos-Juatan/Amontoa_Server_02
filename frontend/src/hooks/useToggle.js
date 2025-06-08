// hooks/useToggle.js
import { useState, useCallback } from 'react';

const useToggle = (initialState = false) => {
  const [isExpanded, setIsExpanded] = useState(initialState);

  const toggle = useCallback((e) => {
    // Prevent toggling if the click originated from an action icon
    if (e && e.target && e.target.closest('.action-icon')) {
      return;
    }
    setIsExpanded(prev => !prev);
  }, []);

  // Function to explicitly set expanded state (useful for initial open logic)
  const setExpanded = useCallback((state) => {
    setIsExpanded(state);
  }, []);

  return [isExpanded, toggle, setExpanded];
};

export default useToggle;