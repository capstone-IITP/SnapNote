import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = useState<ThemeMode>('dark');

  // Load theme from localStorage on initial mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('stickyNotesTheme') as ThemeMode | null;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setMode(savedTheme);
    } else {
      // If no saved theme, set dark as default and save it
      localStorage.setItem('stickyNotesTheme', 'dark');
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('stickyNotesTheme', mode);
    
    // Set data-theme attribute on document.body
    document.body.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Theme colors
export const lightTheme = {
  background: '#f7f9fc',
  backgroundPattern: '#e1e5eb',
  text: '#333333',
  textSecondary: '#666666',
  header: 'rgba(255, 255, 255, 0.9)',
  headerShadow: 'rgba(0, 0, 0, 0.05)',
  border: '#e0e0e0',
  primary: '#4c6ef5',
  primaryHover: '#3c5ef2',
  primaryLight: 'rgba(76, 110, 245, 0.1)',
  shadow: 'rgba(0, 0, 0, 0.15)',
  noteText: 'rgba(0, 0, 0, 0.8)',
  notePlaceholder: 'rgba(0, 0, 0, 0.3)',
  noteTimestamp: 'rgba(0, 0, 0, 0.4)'
};

export const darkTheme = {
  background: '#1a1a2e',
  backgroundPattern: '#282846',
  text: '#f1f1f1',
  textSecondary: '#aaaaaa',
  header: 'rgba(26, 26, 46, 0.95)',
  headerShadow: 'rgba(0, 0, 0, 0.2)',
  border: '#393952',
  primary: '#6c8fff',
  primaryHover: '#597aff',
  primaryLight: 'rgba(108, 143, 255, 0.15)',
  shadow: 'rgba(0, 0, 0, 0.3)',
  noteText: 'rgba(255, 255, 255, 0.9)',
  notePlaceholder: 'rgba(255, 255, 255, 0.3)',
  noteTimestamp: 'rgba(255, 255, 255, 0.5)'
}; 