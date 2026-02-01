import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2, AlertCircle } from "lucide-react";

interface CityResult {
  display: string;
  city: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string, coords?: { lat: number; lon: number }) => void;
  placeholder?: string;
  className?: string;
}

async function searchCities(query: string, signal?: AbortSignal): Promise<CityResult[]> {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` + new URLSearchParams({
        q: query,
        format: 'json',
        addressdetails: '1',
        limit: '15',
        featuretype: 'city,town,village',
      }),
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'IntitiWellnessApp/1.0',
        },
        signal,
      }
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    
    const results: CityResult[] = data
      .filter((item: any) => {
        const type = item.type;
        const classType = item.class;
        return classType === 'place' || classType === 'boundary' || 
               type === 'city' || type === 'town' || type === 'village' || 
               type === 'administrative';
      })
      .map((item: any) => {
        const address = item.address || {};
        const city = address.city || address.town || address.village || 
                     address.municipality || address.county || item.name || '';
        const state = address.state || address.region || address.province || '';
        const country = address.country || '';
        
        let display = city;
        if (state && state !== city) {
          const stateAbbr = getStateAbbreviation(state, country);
          display += `, ${stateAbbr || state}`;
        }
        if (country) {
          display += `, ${country}`;
        }
        
        return {
          display,
          city,
          state,
          country,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
        };
      })
      .filter((item: CityResult, index: number, self: CityResult[]) => 
        index === self.findIndex(t => t.display === item.display)
      );
    
    return results;
  } catch (error) {
    console.error('City search error:', error);
    return [];
  }
}

const US_STATE_ABBREVIATIONS: Record<string, string> = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
  'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
  'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
  'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
  'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
  'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
  'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
  'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
  'Wisconsin': 'WI', 'Wyoming': 'WY', 'District of Columbia': 'DC',
};

function getStateAbbreviation(state: string, country: string): string | null {
  if (country === 'United States' || country === 'United States of America' || country === 'USA') {
    return US_STATE_ABBREVIATIONS[state] || null;
  }
  return null;
}

export function CityAutocomplete({ value, onChange, placeholder = "Search for your city...", className }: CityAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<CityResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showManualHint, setShowManualHint] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setShowManualHint(false);
      setHasSearched(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setHasSearched(true);
    
    const currentController = abortControllerRef.current;
    
    try {
      const results = await searchCities(searchQuery, currentController?.signal);
      setSuggestions(results);
      setIsOpen(results.length > 0);
      setShowManualHint(results.length === 0 && searchQuery.length >= 3);
      setHighlightedIndex(-1);
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setSuggestions([]);
        setShowManualHint(searchQuery.length >= 3);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query === value && value.length > 0) {
      setIsOpen(false);
      setSuggestions([]);
      return;
    }

    const handler = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => {
      clearTimeout(handler);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, performSearch, value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setShowManualHint(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (result: CityResult) => {
    setQuery(result.display);
    onChange(result.display, { lat: result.lat, lon: result.lon });
    setIsOpen(false);
    setSuggestions([]);
    setShowManualHint(false);
  };

  const handleManualEntry = () => {
    if (query.trim()) {
      onChange(query.trim());
      setIsOpen(false);
      setShowManualHint(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        if (!isOpen && suggestions.length > 0) {
          setIsOpen(true);
        }
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSelect(suggestions[highlightedIndex]);
        } else if (query.trim() && !isOpen) {
          handleManualEntry();
        }
        break;
      case "Escape":
        setIsOpen(false);
        setShowManualHint(false);
        break;
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (query.trim() && !value) {
        onChange(query.trim());
      }
    }, 200);
  };

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400 z-10" />
      {isLoading && (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400 animate-spin z-10" />
      )}
      <Input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!e.target.value) {
            onChange("");
            setShowManualHint(false);
          }
        }}
        onFocus={() => {
          if (suggestions.length > 0) {
            setIsOpen(true);
          }
        }}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
        data-testid="input-city-of-birth"
        autoComplete="off"
      />
      
      {(isOpen && suggestions.length > 0) && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 max-h-72 overflow-auto rounded-md bg-slate-900 border border-violet-500/30 shadow-lg shadow-violet-500/10"
          data-testid="dropdown-city-suggestions"
        >
          {suggestions.map((result, index) => (
            <button
              key={`${result.display}-${index}`}
              type="button"
              onClick={() => handleSelect(result)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`w-full px-4 py-3 text-left text-sm flex items-center gap-2 transition-colors ${
                index === highlightedIndex 
                  ? "bg-violet-500/20 text-white" 
                  : "text-violet-200 hover:bg-violet-500/10"
              }`}
              data-testid={`option-city-${index}`}
            >
              <MapPin className="w-4 h-4 text-violet-400 flex-shrink-0" />
              <span className="truncate">{result.display}</span>
            </button>
          ))}
        </div>
      )}

      {showManualHint && !isOpen && hasSearched && !isLoading && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 rounded-md bg-slate-900 border border-amber-500/30 shadow-lg p-3"
        >
          <div className="flex items-start gap-2 text-sm text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Can't find your city?</p>
              <p className="text-amber-200/70 mt-1">
                Press Enter to use "{query}" as entered, or keep typing to search.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleManualEntry}
            className="mt-2 w-full px-3 py-2 text-sm bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-md transition-colors"
            data-testid="button-use-manual-entry"
          >
            Use "{query}" anyway
          </button>
        </div>
      )}
    </div>
  );
}
