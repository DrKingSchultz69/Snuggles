import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getProducts } from '../lib/shopify';

export interface Product {
  id: string;
  name: string;
  price: number;
  img: string;
  handle: string;
}

interface SearchContextType {
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Product[];
  isSearching: boolean;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Product catalog fetched from Shopify, cached for the session
let catalogCache: Product[] | null = null;

async function loadCatalog(): Promise<Product[]> {
  if (catalogCache) return catalogCache;
  const data = await getProducts(50);
  catalogCache = (data || []).map(p => ({
    id: p.id,
    name: p.title,
    price: parseFloat(p.priceRange?.minVariantPrice?.amount || '0'),
    img: p.images?.edges?.[0]?.node?.url || '',
    handle: p.handle,
  }));
  return catalogCache;
}

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Search effect
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      
      try {
        const catalog = await loadCatalog();
        const results = catalog.filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    setRecentSearches(prev => {
      const newSearches = [query, ...prev.filter(q => q !== query)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
      return newSearches;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <SearchContext.Provider value={{
      isSearchOpen,
      openSearch,
      closeSearch,
      searchQuery,
      setSearchQuery,
      searchResults,
      isSearching,
      recentSearches,
      addRecentSearch,
      clearRecentSearches
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
