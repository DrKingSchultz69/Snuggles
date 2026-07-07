import { useEffect, useRef } from 'react';
import { Search, X, Clock, ArrowRight } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../lib/utils';

const SearchModal = () => {
  const { 
    isSearchOpen, 
    closeSearch, 
    searchQuery, 
    setSearchQuery, 
    searchResults, 
    recentSearches, 
    addRecentSearch,
    clearRecentSearches
  } = useSearch();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeSearch]);

  if (!isSearchOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={closeSearch}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-sm overflow-hidden animate-slide-in-up">
        {/* Header / Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-muted px-6 py-4">
          <Search className="w-5 h-5 text-muted-foreground mr-4" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for products..."
            className="flex-1 text-lg outline-none placeholder:text-muted-foreground bg-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="button" 
            onClick={closeSearch}
            className="ml-4 p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Results / Recent Searches */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {!searchQuery ? (
            // Empty State: Recent Searches
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-serif uppercase tracking-widest text-muted-foreground">Recently Searched</h3>
                {recentSearches.length > 0 && (
                  <button 
                    onClick={clearRecentSearches}
                    className="text-xs text-muted-foreground hover:text-black transition-colors underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              {recentSearches.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No recent searches</p>
              ) : (
                <div className="space-y-2">
                  {recentSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(term)}
                      className="flex items-center w-full p-3 hover:bg-muted/50 rounded-sm transition-colors group text-left"
                    >
                      <Clock className="w-4 h-4 text-muted-foreground mr-3 group-hover:text-black transition-colors" />
                      <span className="text-sm">{term}</span>
                      <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Search Results
            <div className="space-y-6">
              <h3 className="text-xs font-serif uppercase tracking-widest text-muted-foreground">
                {searchResults.length} Result{searchResults.length !== 1 ? 's' : ''}
              </h3>
              
              {searchResults.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No products found for "{searchQuery}"</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {searchResults.map((product) => (
                    <Link 
                      key={product.id} 
                      to={`/product/${product.handle}`}
                      onClick={() => {
                        addRecentSearch(searchQuery);
                        closeSearch();
                      }}
                      className="flex gap-4 p-2 hover:bg-muted/30 rounded-sm transition-colors group"
                    >
                      <div className="w-16 h-20 bg-muted shrink-0 overflow-hidden">
                        <img 
                          src={product.img}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-sm font-medium group-hover:underline decoration-1 underline-offset-4">{product.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{formatPrice(product.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
