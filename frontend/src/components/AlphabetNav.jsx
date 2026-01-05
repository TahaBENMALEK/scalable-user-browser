/**
 * AlphabetNav Component
 * Displays A-Z navigation with user counts per letter
 * Highlights selected letter and shows loading states
 * Includes skeleton loader to prevent layout shift
 */

function AlphabetNav({ index, selectedLetter, onLetterSelect, loading }) {
  // Show skeleton loader during initial index load
  if (!index || index.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-border p-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {Array.from({ length: 26 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[3rem] px-4 py-2 rounded-md bg-gray-100 animate-pulse"
            >
              <div className="flex flex-col items-center gap-1">
                <div className="h-4 w-6 bg-gray-200 rounded"></div>
                <div className="h-3 w-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border p-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {/* ALL button for showing all users */}
        <button
          onClick={() => !loading && onLetterSelect('ALL')}
          disabled={loading}
          className={`
            min-w-[3rem] px-4 py-2 rounded-md font-semibold text-sm
            transition-all duration-200
            ${
              selectedLetter === 'ALL'
                ? 'bg-primary text-white shadow-md scale-105'
                : 'bg-gray-50 text-text-primary hover:bg-primary hover:text-white hover:shadow-md'
            }
            ${loading ? 'opacity-50 cursor-wait' : ''}
          `}
          title="Show all users"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-base">ALL</span>
            <span className={`text-xs ${selectedLetter === 'ALL' ? 'text-white' : 'text-text-muted'}`}>
              {index.reduce((sum, item) => sum + item.count, 0) > 999 
                ? `${Math.floor(index.reduce((sum, item) => sum + item.count, 0) / 1000)}k` 
                : index.reduce((sum, item) => sum + item.count, 0)}
            </span>
          </div>
        </button>

        {/* Individual letter buttons */}
        {index.map((item) => {
          const isSelected = selectedLetter === item.letter;
          const isDisabled = loading || item.count === 0;

          return (
            <button
              key={item.letter}
              onClick={() => !isDisabled && onLetterSelect(item.letter)}
              disabled={isDisabled}
              className={`
                min-w-[3rem] px-4 py-2 rounded-md font-semibold text-sm
                transition-all duration-200
                ${
                  isSelected
                    ? 'bg-primary text-white shadow-md scale-105'
                    : item.count === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-50 text-text-primary hover:bg-primary hover:text-white hover:shadow-md'
                }
                ${loading ? 'opacity-50 cursor-wait' : ''}
              `}
              title={`${item.letter} - ${item.count.toLocaleString()} users`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-base">{item.letter}</span>
                <span className={`text-xs ${isSelected ? 'text-white' : 'text-text-muted'}`}>
                  {item.count > 999 ? `${Math.floor(item.count / 1000)}k` : item.count}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AlphabetNav;