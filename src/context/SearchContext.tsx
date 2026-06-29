import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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

// Mock products for local search
const MOCK_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'Snuggle Cami Set - Cream', 
    price: 299, 
    img: 'minimal fashion cream cami set lounge studio', 
    handle: 'cream-cami' 
  },
  { 
    id: '2', 
    name: 'Snuggle Cami Set - Brown', 
    price: 299, 
    img: 'minimal fashion brown cami set lounge studio', 
    handle: 'brown-cami' 
  },
  {
    id: '3',
    name: 'Snuggle Lounge Pants - Grey',
    price: 199,
    img: 'minimal fashion grey lounge pants studio',
    handle: 'grey-lounge-pants'
  },
  {
    id: '4',
    name: 'Snuggle Robe - White',
    price: 349,
    img: 'minimal fashion white robe studio',
    handle: 'white-robe'
  }
];

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
        // Local mock search first
        const localResults = MOCK_PRODUCTS.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Optional: Call Shopify API here if needed
        // const shopifyResults = await searchShopify(searchQuery);
        
        setSearchResults(localResults);
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
