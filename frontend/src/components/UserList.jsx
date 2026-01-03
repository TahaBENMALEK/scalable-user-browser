/**
 * UserList Component
 * Virtualized list with infinite scroll
 * Uses react-window for performance with large datasets
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

  // Row renderer
  const Row = ({ index, style }) => {
    if (!isItemLoaded(index)) {
      return (
        <div style={style} className="flex items-center justify-center">
          <div className="animate-pulse text-text-muted">Loading...</div>
        </div>
      );
    }

    const username = users[index];
    
    // Validate that username starts with selected letter
    if (username && username[0].toUpperCase() !== selectedLetter) {
      return null;
    }

    return (
      <div
        style={style}
        className="flex items-center px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors"
      >
        <span className="text-text-primary font-mono text-sm">{username}</span>
      </div>
    );
  };

  if (!selectedLetter) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-border p-12 text-center">
        <p className="text-text-muted text-lg">
          Select a letter to browse usernames
        </p>
      </div>
    );
  }

  if (users.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-border p-12 text-center">
        <p className="text-text-muted text-lg">
          No usernames found for letter {selectedLetter}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-text-primary">
          Letter {selectedLetter}
          <span className="ml-2 text-sm font-normal text-text-muted">
            ({totalCount.toLocaleString()} total users)
          </span>
        </h3>
      </div>

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
          >
            {Row}
          </FixedSizeList>
        )}
      </InfiniteLoader>

      {loading && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-center">
          <span className="text-sm text-text-muted">Loading more...</span>
        </div>
      )}
    </div>
  );
}

export default UserList;