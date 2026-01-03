/**
 * Header Component
 * Application header with branding and navigation placeholder
 * Sticky positioning for consistent access across scroll
 */

function Header() {
  return (
    <header className="sticky top-0 h-header bg-white border-b border-border shadow-sm z-50">
      <div className="max-w-container h-full mx-auto px-6 lg:px-8 flex items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl lg:text-2xl font-bold text-primary tracking-tight">
            User Browser
          </h1>
          <p className="text-xs lg:text-sm text-text-muted font-normal">
            Browse millions of usernames efficiently
          </p>
        </div>
        
        <nav className="flex items-center gap-4">
          <span className="text-xs lg:text-sm font-medium text-text-secondary px-3 py-1.5 bg-gray-50 rounded-lg">
            Ready
          </span>
        </nav>
      </div>
    </header>
  );
}

export default Header;