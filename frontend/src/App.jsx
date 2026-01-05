/**
 * App Component
 * Root application component with user browsing functionality
 * Integrates alphabet navigation and user list with infinite scroll
 * Improved with error boundaries and loading states
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
        {/* Header section with fixed height to prevent layout shift */}
        <div style={{ minHeight: '80px' }}>
          <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
            Browse Usernames
          </h2>
          <p className="text-text-secondary">
            Select a letter to explore millions of usernames alphabetically
          </p>
        </div>

        {/* Error message with fixed height */}
        {error && (
          <div 
            className="bg-red-50 border border-red-200 rounded-lg p-4 transition-all duration-300"
            role="alert"
            style={{ minHeight: '60px' }}
          >
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 text-sm flex-1">{error}</p>
            </div>
          </div>
        )}

        {/* Alphabet navigation with consistent spacing */}
        <AlphabetNav
          index={index}
          selectedLetter={selectedLetter}
          onLetterSelect={handleLetterSelect}
          loading={loading || indexLoading}
        />

        {/* User list with virtualization */}
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