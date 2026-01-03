/**
 * useUserBrowser Hook
 * Custom hook for managing user browsing state
 * Handles alphabet index, user fetching, and pagination
 * Shows all users by default, filters by letter when selected
 */

import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

function useUserBrowser() {
  const [index, setIndex] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState('ALL');
  const [users, setUsers] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [indexLoading, setIndexLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);

  // Fetch alphabet index on mount
  useEffect(() => {
    const fetchIndex = async () => {
      try {
        setIndexLoading(true);
        const data = await apiService.getIndex();
        setIndex(data.index);
        setTotalCount(data.totalUsers);
        setError(null);
        
        // Start loading all users from first letter
        if (data.index.length > 0) {
          fetchUsersForAllMode(data.index, 0);
        }
      } catch (err) {
        setError('Failed to load alphabet index');
        console.error('Index error:', err);
      } finally {
        setIndexLoading(false);
      }
    };

    fetchIndex();
  }, []);

  // Fetch users for "ALL" mode (letter by letter)
  const fetchUsersForAllMode = useCallback(async (indexData, letterIdx) => {
    if (letterIdx >= indexData.length) {
      setHasMore(false);
      return;
    }

    try {
      setLoading(true);
      const letter = indexData[letterIdx].letter;
      const data = await apiService.getUsersByLetter(letter, 0, 50);
      
      setUsers((prev) => [...prev, ...data.data]);
      setCurrentLetterIndex(letterIdx);
      setHasMore(letterIdx < indexData.length - 1 || data.hasMore);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch users for specific letter
  const fetchUsers = useCallback(
    async (letter, cursorPosition = 0, append = false) => {
      if (loading) return;

      try {
        setLoading(true);
        const data = await apiService.getUsersByLetter(letter, cursorPosition);

        if (append) {
          setUsers((prev) => [...prev, ...data.data]);
        } else {
          setUsers(data.data);
        }

        setCursor(data.nextCursor || 0);
        setHasMore(data.hasMore);
        setTotalCount(data.total);
        setError(null);
      } catch (err) {
        setError(`Failed to load users for letter ${letter}`);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  // Handle letter selection
  const handleLetterSelect = useCallback(
    (letter) => {
      if (letter === 'ALL') {
        // Reset to show all
        setSelectedLetter('ALL');
        setUsers([]);
        setCursor(0);
        setCurrentLetterIndex(0);
        if (index.length > 0) {
          fetchUsersForAllMode(index, 0);
        }
      } else {
        // Filter by specific letter
        setSelectedLetter(letter);
        setUsers([]);
        setCursor(0);
        setHasMore(false);
        fetchUsers(letter, 0, false);
      }
    },
    [fetchUsers, fetchUsersForAllMode, index]
  );

  // Load more users (infinite scroll)
  const loadMore = useCallback(() => {
    if (loading) return Promise.resolve();

    if (selectedLetter === 'ALL') {
      // Continue loading next letters
      if (currentLetterIndex < index.length - 1) {
        return fetchUsersForAllMode(index, currentLetterIndex + 1);
      }
    } else if (hasMore && cursor > 0) {
      // Load more from current letter
      return fetchUsers(selectedLetter, cursor, true);
    }
    
    return Promise.resolve();
  }, [selectedLetter, hasMore, loading, cursor, currentLetterIndex, index, fetchUsers, fetchUsersForAllMode]);

  return {
    index,
    selectedLetter,
    users,
    hasMore,
    loading,
    indexLoading,
    error,
    totalCount,
    handleLetterSelect,
    loadMore,
  };
}

export default useUserBrowser;