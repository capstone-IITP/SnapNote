import { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Note } from './types';
import { NoteComponent } from './components/NoteComponent';
import { createNewNote, noteTags } from './utils';
import ThemeToggle from './components/ThemeToggle';
import { useTheme, lightTheme, darkTheme } from './theme.tsx';
import WelcomeScreen from './components/WelcomeScreen';
import Loader from './components/Loader';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const subtleFloat = keyframes`
  0% { transform: translate(0, 0); }
  50% { transform: translate(0, 6px); }
  100% { transform: translate(0, 0); }
`;

const breathe = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
`;

const patternAnimation = keyframes`
  0% { background-position: 0 0, 10px 10px; }
  100% { background-position: 20px 20px, 30px 30px; }
`;

interface ThemedProps {
  $theme: 'light' | 'dark';
}

const AppContainer = styled.div<ThemedProps>`
  width: 100%;
  min-height: 100vh;
  background-color: ${props => props.$theme === 'dark' ? darkTheme.background : lightTheme.background};
  background-image: ${props => css`
    radial-gradient(${props.$theme === 'dark' ? darkTheme.backgroundPattern : lightTheme.backgroundPattern} 1px, transparent 1px),
    radial-gradient(${props.$theme === 'dark' ? darkTheme.backgroundPattern : lightTheme.backgroundPattern} 1px, transparent 1px)
  `};
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
  animation: ${patternAnimation} 240s linear infinite;
  overflow: hidden;
  position: relative;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: all 0.5s ease;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$theme === 'dark' ? 
      'radial-gradient(circle at 70% 20%, rgba(54, 54, 115, 0.3) 0%, rgba(26, 26, 46, 0) 50%)' : 
      'radial-gradient(circle at 70% 20%, rgba(200, 210, 255, 0.3) 0%, rgba(247, 249, 252, 0) 50%)'};
    pointer-events: none;
  }
`;

const Header = styled.header<ThemedProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 18px 24px;
  background-color: ${props => props.$theme === 'dark' ? darkTheme.header : lightTheme.header};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 2px 16px ${props => props.$theme === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.08)'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.7s ease-out;
  transition: all 0.4s ease;
  border-bottom: 1px solid ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'};
`;

const AppTitle = styled.h1<ThemedProps>`
  font-size: 26px;
  color: ${props => props.$theme === 'dark' ? darkTheme.text : lightTheme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  letter-spacing: -0.5px;
  transition: all 0.3s ease;
  
  svg {
    height: 28px;
    width: 28px;
    animation: ${subtleFloat} 5s ease-in-out infinite;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 280px;
`;

const SearchInput = styled.input<ThemedProps>`
  width: 100%;
  padding: 10px 16px 10px 40px;
  border-radius: 24px;
  border: 1px solid ${props => props.$theme === 'dark' ? darkTheme.border : lightTheme.border};
  background-color: ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.07)' : 'rgba(255, 255, 255, 0.85)'};
  color: ${props => props.$theme === 'dark' ? darkTheme.text : lightTheme.text};
  font-size: 15px;
  font-weight: 400;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$theme === 'dark' ? 
    '0 2px 10px rgba(0, 0, 0, 0.15)' : 
    '0 2px 10px rgba(0, 0, 0, 0.03)'};
  
  &:focus {
    border-color: ${props => props.$theme === 'dark' ? darkTheme.primary : lightTheme.primary};
    box-shadow: 0 0 0 3px ${props => props.$theme === 'dark' ? 'rgba(108, 143, 255, 0.2)' : 'rgba(76, 110, 245, 0.15)'};
    background-color: ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.09)' : 'rgba(255, 255, 255, 1)'};
  }
  
  &::placeholder {
    color: ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.35)'};
  }
`;

const SearchIcon = styled.div<ThemedProps>`
  position: absolute;
  left: 14px;
  top: 10px;
  color: ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'};
  font-size: 18px;
`;

const ClearButton = styled.button<ThemedProps>`
  position: absolute;
  right: 10px;
  top: 10px;
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  color: ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'};
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 18px;
  opacity: 0.7;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 1;
    background-color: ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
  
  &:focus {
    outline: none;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
  max-width: 460px;
`;

const FilterButton = styled.button<{ $active: boolean; $theme: 'light' | 'dark' }>`
  background: ${props => props.$active 
    ? (props.$theme === 'dark' ? darkTheme.primaryLight : lightTheme.primaryLight)
    : (props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)')
  };
  color: ${props => props.$active 
    ? (props.$theme === 'dark' ? darkTheme.primary : lightTheme.primary)
    : (props.$theme === 'dark' ? darkTheme.textSecondary : lightTheme.textSecondary)
  };
  border: 1px solid ${props => props.$active 
    ? (props.$theme === 'dark' ? darkTheme.primary : lightTheme.primary)
    : 'transparent'
  };
  border-radius: 18px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: ${props => props.$active ? '500' : '400'};
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: ${props => props.$active 
    ? (props.$theme === 'dark' ? '0 2px 8px rgba(108, 143, 255, 0.2)' : '0 2px 8px rgba(76, 110, 245, 0.1)')
    : 'none'
  };
  
  &:hover {
    background: ${props => props.$theme === 'dark' ? 'rgba(108, 143, 255, 0.12)' : 'rgba(76, 110, 245, 0.08)'};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const Content = styled.div`
  padding: 120px 24px 100px;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const AddButton = styled.button<ThemedProps>`
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${props => props.$theme === 'dark' ? 
    'linear-gradient(135deg, #6C8FFF 0%, #536DFE 100%)' : 
    'linear-gradient(135deg, #4C6EF5 0%, #3B5BDB 100%)'};
  color: white;
  font-size: 32px;
  border: none;
  box-shadow: 0 6px 16px ${props => props.$theme === 'dark' ? 'rgba(108, 143, 255, 0.4)' : 'rgba(76, 110, 245, 0.25)'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &:hover {
    transform: scale(1.08) translateY(-4px) rotate(8deg);
    box-shadow: 0 10px 20px ${props => props.$theme === 'dark' ? 'rgba(108, 143, 255, 0.6)' : 'rgba(76, 110, 245, 0.35)'};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background: ${props => props.$theme === 'dark' ? 'rgba(108, 143, 255, 0.2)' : 'rgba(76, 110, 245, 0.2)'};
    border-radius: 50%;
    animation: ${breathe} 3s infinite ease-in-out;
  }
`;

const NoResults = styled.div<ThemedProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  color: ${props => props.$theme === 'dark' ? darkTheme.textSecondary : lightTheme.textSecondary};
  animation: ${fadeIn} 0.8s ease-out;

  h3 {
    font-size: 28px;
    margin-bottom: 16px;
    color: ${props => props.$theme === 'dark' ? darkTheme.text : lightTheme.text};
    font-weight: 500;
  }

  p {
    font-size: 17px;
    margin-bottom: 32px;
    max-width: 400px;
    text-align: center;
    opacity: 0.8;
  }
  
  button {
    background: ${props => props.$theme === 'dark' ? 
      'linear-gradient(135deg, #6C8FFF 0%, #536DFE 100%)' : 
      'linear-gradient(135deg, #4C6EF5 0%, #3B5BDB 100%)'};
    color: white;
    border: none;
    padding: 12px 28px;
    border-radius: 24px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    animation: ${pulseAnimation} 2s ease-in-out infinite;
    transition: all 0.3s ease;
    box-shadow: 0 6px 16px ${props => props.$theme === 'dark' ? 'rgba(108, 143, 255, 0.3)' : 'rgba(76, 110, 245, 0.2)'};
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 20px ${props => props.$theme === 'dark' ? 'rgba(108, 143, 255, 0.5)' : 'rgba(76, 110, 245, 0.3)'};
    }
    
    &:active {
      transform: translateY(1px);
      box-shadow: 0 4px 8px ${props => props.$theme === 'dark' ? 'rgba(108, 143, 255, 0.3)' : 'rgba(76, 110, 245, 0.2)'};
    }
  }
  
  svg {
    width: 120px;
    height: 120px;
    margin-bottom: 24px;
    opacity: 0.6;
  }
`;

type SortOption = 'lastModified' | 'createdAt';

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchText, setSearchText] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('lastModified');
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { mode } = useTheme();
  
  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('stickyNotes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error('Error parsing notes from localStorage:', error);
      }
    }
    
    // Check if we should show welcome screen
    const hasSeenWelcome = localStorage.getItem('stickyNotesWelcomeShown');
    if (hasSeenWelcome === 'true') {
      setShowWelcome(false);
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('stickyNotes', JSON.stringify(notes));
  }, [notes]);

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note => {
      // If no search or filters, return all notes
      if (searchText === '' && !activeTag) {
        return true;
      }
      
      // Apply text search filter - check content and tags
      const searchLower = searchText.toLowerCase();
      const matchesSearch = searchText === '' || 
        note.content.toLowerCase().includes(searchLower) || 
        note.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      // Apply tag filter
      const matchesTag = !activeTag || note.tags.includes(activeTag);
      
      return matchesSearch && matchesTag;
    })
    // Sort notes
    .sort((a, b) => {
      return b[sortBy] - a[sortBy];
    });

  const handleAddNote = () => {
    // Create new note in the center of the visible area
    const newNote = createNewNote(
      window.innerWidth / 2 - 140,
      window.innerHeight / 2 - 120
    );
    setNotes([...notes, newNote]);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(notes.map(note => (note.id === updatedNote.id ? updatedNote : note)));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const bringNoteToFront = (id: string) => {
    setNotes(prevNotes => {
      const highestZIndex = Math.max(...prevNotes.map(n => n.zIndex), 0) + 1;
      return prevNotes.map(note => 
        note.id === id ? { ...note, zIndex: highestZIndex } : note
      );
    });
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only create a note if clicking directly on the background, not on another element
    if (e.target === e.currentTarget) {
      const newNote = createNewNote(e.clientX - 140, e.clientY - 120);
      setNotes([...notes, newNote]);
    }
  };
  
  const toggleTag = (tag: string) => {
    setActiveTag(currentTag => currentTag === tag ? null : tag);
  };
  
  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    localStorage.setItem('stickyNotesWelcomeShown', 'true');
  };

  return (
    <AppContainer $theme={mode}>
      {isLoading && <Loader onComplete={() => setIsLoading(false)} minDisplayTime={2800} />}
      {!isLoading && (
        <>
          {showWelcome && <WelcomeScreen onComplete={handleWelcomeComplete} />}
          
          <Header $theme={mode}>
            <AppTitle $theme={mode}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill={mode === 'dark' ? '#6C8FFF' : '#4C6EF5'} d="M21,2H3C1.9,2,1,2.9,1,4v16c0,1.1,0.9,2,2,2h18c1.1,0,2-0.9,2-2V4C23,2.9,22.1,2,21,2z M21,20H3V4h18V20z"/>
                <path fill={mode === 'dark' ? '#6C8FFF' : '#4C6EF5'} d="M6,7h12v2H6V7z"/>
                <path fill={mode === 'dark' ? '#6C8FFF' : '#4C6EF5'} d="M6,11h12v2H6V11z"/>
                <path fill={mode === 'dark' ? '#6C8FFF' : '#4C6EF5'} d="M6,15h8v2H6V15z"/>
              </svg>
              Sticky Notes
            </AppTitle>
            <Controls>
              <SearchContainer>
                <SearchIcon $theme={mode}>🔍</SearchIcon>
                <SearchInput 
                  placeholder="Search notes..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  $theme={mode}
                />
                {searchText && <ClearButton $theme={mode} onClick={() => setSearchText('')}>✗</ClearButton>}
              </SearchContainer>
              
              <FilterContainer>
                {noteTags.slice(0, 5).map(tag => (
                  <FilterButton 
                    key={tag} 
                    $active={tag === activeTag}
                    $theme={mode}
                    onClick={() => toggleTag(tag)}
                  >
                    #{tag}
                  </FilterButton>
                ))}
                
                <FilterButton 
                  $active={sortBy === 'lastModified'}
                  $theme={mode}
                  onClick={() => setSortBy('lastModified')}
                >
                  Recent
                </FilterButton>
                <FilterButton 
                  $active={sortBy === 'createdAt'} 
                  $theme={mode}
                  onClick={() => setSortBy('createdAt')}
                >
                  Oldest
                </FilterButton>
              </FilterContainer>
              
              <ThemeToggle />
            </Controls>
          </Header>
          
          <Content onDoubleClick={handleDoubleClick}>
            {filteredNotes.map(note => (
              <NoteComponent
                key={note.id}
                note={note}
                onUpdate={handleUpdateNote}
                onDelete={handleDeleteNote}
                bringToFront={bringNoteToFront}
                searchTerm={searchText}
              />
            ))}
            
            {filteredNotes.length === 0 && (
              <NoResults $theme={mode}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="120" height="120">
                  <path fill={mode === 'dark' ? 'rgba(108, 143, 255, 0.6)' : 'rgba(76, 110, 245, 0.6)'} d="M18,2 L6,2 C4.9,2 4,2.9 4,4 L4,20 C4,21.1 4.9,22 6,22 L18,22 C19.1,22 20,21.1 20,20 L20,4 C20,2.9 19.1,2 18,2 Z M18,20 L6,20 L6,4 L18,4 L18,20 Z"/>
                  <path fill={mode === 'dark' ? 'rgba(108, 143, 255, 0.6)' : 'rgba(76, 110, 245, 0.6)'} d="M8,12 L16,12 L16,14 L8,14 L8,12 Z M8,16 L13,16 L13,18 L8,18 L8,16 Z M8,8 L16,8 L16,10 L8,10 L8,8 Z"/>
                </svg>
                <h3>No notes found</h3>
                <p>Try changing your search or filter, or create a new note to get started</p>
                <button onClick={handleAddNote}>Create a new note</button>
              </NoResults>
            )}
          </Content>

          <AddButton onClick={handleAddNote} title="Add new note" $theme={mode}>+</AddButton>
        </>
      )}
    </AppContainer>
  );
};

export default App;
