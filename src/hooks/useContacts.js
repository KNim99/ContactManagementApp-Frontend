import { useState, useEffect, useCallback, useRef } from "react";
import { contactService } from "../services/contactService";

const DEBOUNCE_DELAY = 500; // Increased delay for better UX

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false); // Initialize as false
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const abortControllerRef = useRef(null);
  const initialLoadRef = useRef(true);

  const fetchContacts = useCallback(
    async (isInitialLoad = false) => {
      try {
        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        // Only show loading spinner on initial load
        if (isInitialLoad) {
          setLoading(true);
        } else if (searchTerm) {
          setSearchLoading(true);
        }

        const data = await contactService.getAll(
          searchTerm,
          abortControllerRef.current.signal
        );
        setContacts(data || []);
        setError(null);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          setContacts([]);
        }
      } finally {
        setLoading(false);
        setSearchLoading(false);
      }
    },
    [searchTerm]
  );

  // Initial load
  useEffect(() => {
    if (initialLoadRef.current) {
      fetchContacts(true);
      initialLoadRef.current = false;
    }
  }, [fetchContacts]);

  // Debounced search
  useEffect(() => {
    if (!initialLoadRef.current) {
      const timeoutId = setTimeout(
        () => {
          fetchContacts(false);
        },
        searchTerm ? DEBOUNCE_DELAY : 0
      );

      return () => {
        clearTimeout(timeoutId);
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      };
    }
  }, [fetchContacts, searchTerm]);

  return {
    contacts,
    loading,
    searchLoading,
    error,
    searchTerm,
    setSearchTerm,
    setContacts,
  };
};
