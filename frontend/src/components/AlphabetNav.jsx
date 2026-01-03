/**
 * AlphabetNav Component
 * Displays A-Z navigation with user counts per letter
 * Highlights selected letter and shows loading states
 */

function AlphabetNav({ index, selectedLetter, onLetterSelect, loading }) {
  if (!index || index.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse text-text-muted">Loading alphabet...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border p-4">
      <div className="flex flex-wrap gap-2 justify-center">
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