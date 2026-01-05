/**
 * UserList Component
 * Virtualized list with infinite scroll
 * Uses react-window for performance with large datasets
 * Improved with smooth scrolling and reduced layout shifts
 */

import { useEffect, useRef, useCallback } from 'react';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

function UserList({ 
  users, 
  hasMore, 
  loading, 
  onLoadMore, 
  selectedLetter,
  totalCount 
}) {
  const listRef = useRef();
  const loaderRef = useRef();

  // Reset scroll position and clear loader cache when letter changes
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(0);
    }
    if (loaderRef.current) {
      loaderRef.current.resetloadMoreItemsCache();
    }
  }, [selectedLetter]);

  // Check if item is loaded
  const isItemLoaded = useCallback(
    (index) => !hasMore || index < users.length,
    [hasMore, users.length]
  );

  // Load more items
  const loadMoreItems = useCallback(
    (startIndex, stopIndex) => {
      if (loading || !hasMore) return Promise.resolve();
      return onLoadMore();
    },
    [loading, hasMore, onLoadMore]
  );

  // Item count (add 1 for loading row if has more)
  const itemCount = hasMore ? users.length + 1 : users.length;

  // Row renderer with smooth transitions
  const Row = ({ index, style }) => {
    if (!isItemLoaded(index)) {
      return (
        <div 
          style={style} 
          className="flex items-center px-6 border-b border-gray-100"
        >
          <div className="flex items-center gap-3 w-full">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      );
    }

    const username = users[index];
    
    // Validate that username starts with selected letter (skip for ALL mode)
    if (username && selectedLetter !== 'ALL' && username[0].toUpperCase() !== selectedLetter) {
      return null;
    }

    return (
      <div
        style={style}
        className="flex items-center px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
      >
        <span className="text-text-primary font-mono text-sm">{username}</span>
      </div>
    );
  };

  // Show selection prompt
  if (!selectedLetter) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden" style={{ minHeight: '600px' }}>
        <div className="flex items-center justify-center h-full p-12">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-text-muted text-lg">
              Select a letter to browse usernames
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (users.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden" style={{ minHeight: '600px' }}>
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-text-primary">
            Letter {selectedLetter}
            <span className="ml-2 text-sm font-normal text-text-muted">
              (0 users)
            </span>
          </h3>
        </div>
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-text-muted text-lg">
              No usernames found for letter {selectedLetter}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
      {/* Header with fixed height to prevent layout shift */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50" style={{ minHeight: '60px' }}>
        <h3 className="text-lg font-semibold text-text-primary">
          {selectedLetter === 'ALL' ? 'All Users' : `Letter ${selectedLetter}`}
          <span className="ml-2 text-sm font-normal text-text-muted">
            ({totalCount.toLocaleString()} {totalCount === 1 ? 'user' : 'users'})
          </span>
        </h3>
      </div>

      {/* Virtualized list with InfiniteLoader */}
      <InfiniteLoader
        ref={loaderRef}
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
        threshold={10}
      >
        {({ onItemsRendered, ref }) => (
          <FixedSizeList
            ref={(list) => {
              ref(list);
              listRef.current = list;
            }}
            height={600}
            itemCount={itemCount}
            itemSize={50}
            onItemsRendered={onItemsRendered}
            width="100%"
            className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            {Row}
          </FixedSizeList>
        )}
      </InfiniteLoader>

      {/* Loading indicator with fixed height */}
      {loading && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-center" style={{ minHeight: '56px' }}>
          <div className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm text-text-muted">Loading more...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;