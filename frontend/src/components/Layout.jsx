/**
 * Layout Component
 * Main application layout wrapper
 * Provides consistent structure for header and content
 */

import Header from './Header';

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col py-8 lg:py-12 bg-gray-50">
        <div className="w-full max-w-container mx-auto px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;