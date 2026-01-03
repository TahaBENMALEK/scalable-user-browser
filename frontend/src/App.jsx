/**
 * App Component
 * Root application component with user browsing functionality
 * Integrates alphabet navigation and user list with infinite scroll
 */

import Layout from './components/Layout';
import AlphabetNav from './components/AlphabetNav';
import UserList from './components/UserList';
import useUserBrowser from './hooks/useUserBrowser';

function App() {
  const {
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
  } = useUserBrowser();

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
            Browse Usernames
          </h2>
          <p className="text-text-secondary">
            Select a letter to explore millions of usernames alphabetically
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <AlphabetNav
          index={index}
          selectedLetter={selectedLetter}
          onLetterSelect={handleLetterSelect}
          loading={loading || indexLoading}
        />

        <UserList
          users={users}
          hasMore={hasMore}
          loading={loading}
          onLoadMore={loadMore}
          selectedLetter={selectedLetter}
          totalCount={totalCount}
        />
      </div>
    </Layout>
  );
}

export default App;