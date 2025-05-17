import { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Note } from '../types';
import { noteTags, escapeRegExp } from '../utils';
import { useTheme } from '../theme.tsx';
import { 
  fadeIn, fadeOut, shake, zoomIn, float, 
  bounce, wiggle, slideOutToBottom, pulse
} from '../animations';

interface NoteComponentProps {
  note: Note;
  onUpdate: (updatedNote: Note) => void;
  onDelete: (id: string) => void;
  bringToFront: (id: string) => void;
  searchTerm?: string;
}

interface StyledNoteProps {
  $left: number;
  $top: number;
  $width: number;
  $height: number;
  $color: string;
  $zIndex: number;
  $rotation: number;
  $isNew: boolean;
  $isDarkMode: boolean;
  $isDeleting: boolean;
  $isGradient: boolean;
}

// Advanced styles with glassmorphism
const StyledNote = styled.div<StyledNoteProps>`
  position: absolute;
  left: ${props => props.$left}px;
  top: ${props => props.$top}px;
  width: ${props => props.$width}px;
  height: ${props => props.$height}px;
  padding: 18px;
  background: ${props => props.$isGradient ? props.$color : (props.$isDarkMode ? 'rgba(30, 30, 45, 0.45)' : 'rgba(255, 255, 255, 0.55)')};
  ${props => !props.$isGradient && css`
    background-color: ${props.$color};
  `}
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
  border-radius: 10px;
  border: 1px solid ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.7)'};
  box-shadow: 
    0 4px 16px ${props => props.$isDarkMode ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.15)'},
    0 8px 25px ${props => props.$isDarkMode ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0.08)'},
    inset 0 0 0 1px ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.35)'};
  z-index: ${props => props.$zIndex};
  cursor: move;
  display: flex;
  flex-direction: column;
  transform: rotate(${props => props.$rotation}deg);
  transition: box-shadow 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67), 
              transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
              filter 0.3s ease;
  transform-origin: center center;
  overflow: hidden;
  
  ${props => props.$isNew && css`
    animation: ${zoomIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  `}
  
  ${props => props.$isDeleting && css`
    animation: ${slideOutToBottom} 0.5s forwards cubic-bezier(0.55, 0.085, 0.68, 0.53);
    pointer-events: none;
    filter: opacity(0.8) saturate(0);
  `}
  
  &:hover {
    box-shadow: 
      0 8px 24px ${props => props.$isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.2)'},
      0 16px 35px ${props => props.$isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.15)'},
      inset 0 0 0 1px ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.5)'};
    filter: brightness(1.05);
  }
  
  &:active {
    cursor: grabbing;
    transform: rotate(${props => props.$rotation}deg) scale(1.02);
    filter: brightness(1.08);
  }

  @media (prefers-reduced-motion: no-preference) {
    animation-name: ${float};
    animation-duration: 4s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
    animation-delay: ${props => Math.random() * 2}s;
    animation-play-state: paused;
    
    &:hover {
      animation-play-state: running;
    }
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.$isGradient ? 
      'linear-gradient(to right, rgba(255,255,255,0.5), rgba(255,255,255,0.8), rgba(255,255,255,0.5))' : 
      'linear-gradient(to right, rgba(255,255,255,0.3), rgba(255,255,255,0.6), rgba(255,255,255,0.3))'
    };
    opacity: 0.7;
    border-radius: 3px 3px 0 0;
  }
`;

const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
`;

const NoteTools = styled.div`
  display: flex;
  gap: 8px;
`;

interface TagProps {
  $selected: boolean;
  $isDarkMode: boolean;
}

const expandOnHover = css`
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  &:hover {
    transform: scale(1.08);
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
`;

const Tag = styled.span<TagProps>`
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 12px;
  background-color: ${props => {
    if (props.$isDarkMode) {
      return props.$selected ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.08)';
    } else {
      return props.$selected ? 'rgba(76, 110, 245, 0.18)' : 'rgba(0, 0, 0, 0.05)';
    }
  }};
  color: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)'};
  cursor: pointer;
  font-weight: ${props => props.$selected ? '500' : '400'};
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: ${props => props.$selected ? 
    '0 2px 5px rgba(0, 0, 0, 0.08)' : 'none'};
  
  &:hover {
    background-color: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.22)' : 'rgba(76, 110, 245, 0.15)'};
    animation: ${wiggle} 0.6s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    color: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 0.9)'};
  }
  
  ${expandOnHover}
`;

const fadeInOut = css`
  animation: ${fadeIn} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  &.fade-out {
    animation: ${fadeOut} 0.3s ease-out forwards;
  }
`;

const ColorPicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
  padding: 12px;
  background-color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
  backdrop-filter: blur(5px);
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  ${fadeInOut}
`;

const ColorOption = styled.div<{$color: string; $isSelected: boolean; $isGradient: boolean}>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  ${props => props.$isGradient ? 
    `background: ${props.$color};` : 
    `background-color: ${props.$color};`}
  border: ${props => props.$isSelected ? '2px solid white' : '1px solid rgba(255, 255, 255, 0.3)'};
  box-shadow: ${props => props.$isSelected ? 
    '0 0 0 1px rgba(0, 0, 0, 0.2), 0 0 8px rgba(0, 0, 0, 0.1)' : 
    '0 0 0 1px rgba(0, 0, 0, 0.05)'};
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67), box-shadow 0.2s;
  
  &:hover {
    transform: scale(1.35);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
    animation: ${bounce} 0.6s ease;
  }
`;

interface ButtonProps {
  $isDarkMode: boolean;
}

const toolButtonHover = css`
  &:hover {
    transform: scale(1.15);
  }
`;

const ToolButton = styled.button<ButtonProps>`
  background: transparent;
  border: none;
  color: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)'};
  cursor: pointer;
  font-size: 17px;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67);
  
  &:hover {
    color: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.8)'};
    background-color: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.06)'};
    animation: ${pulse} 1s infinite;
  }
  
  ${toolButtonHover}
`;

const DeleteButton = styled(ToolButton)`
  &:hover {
    color: #ff5252;
    background-color: rgba(255, 82, 82, 0.15);
    animation: ${shake} 0.6s ease-in-out;
  }
`;

interface ContentProps {
  $isDarkMode: boolean;
  $noteColor: string;
  $isGradient: boolean;
}

const NoteContent = styled.textarea<ContentProps>`
  flex: 1;
  background: transparent;
  border: none;
  resize: none;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  letter-spacing: 0.01em;
  outline: none;
  min-height: 100px;
  color: #000000; /* Always use black text for writing */
  text-shadow: 0px 0px 1px rgba(255, 255, 255, 0.5); /* Light text shadow for contrast */
  
  &::placeholder {
    color: rgba(0, 0, 0, 0.5); /* Dark gray placeholder text */
  }

  &:focus {
    animation: ${fadeIn} 0.4s ease;
  }
`;

// For displaying content with highlighted search terms
const NoteContentDisplay = styled.div<ContentProps>`
  flex: 1;
  background: transparent;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  letter-spacing: 0.01em;
  min-height: 100px;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  white-space: pre-wrap;
  color: #000000; /* Always black text for consistency */
  text-shadow: 0px 0px 1px rgba(255, 255, 255, 0.5); /* Light text shadow for contrast */
  animation: ${fadeIn} 0.2s ease;
`;

const ResizeHandle = styled.div<ButtonProps>`
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 14px;
  height: 14px;
  cursor: se-resize;
  opacity: 0.4;
  transition: opacity 0.3s, transform 0.2s;
  
  &:before, &:after {
    content: "";
    position: absolute;
    background-color: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
    border-radius: 1px;
  }
  
  &:before {
    width: 2px;
    height: 10px;
    bottom: 0;
    right: 0;
  }
  
  &:after {
    width: 10px;
    height: 2px;
    bottom: 0;
    right: 0;
  }
  
  &:hover {
    opacity: 0.9;
    transform: scale(1.25);
  }
`;

const TimeStamp = styled.div<ContentProps>`
  font-size: 10px;
  color: ${props => {
    if (props.$isGradient) {
      return 'rgba(255, 255, 255, 0.7)';
    }
    
    const isLightColor = isLightColorHex(props.$noteColor);
    if (props.$isDarkMode) {
      return isLightColor ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.6)';
    } else {
      return isLightColor ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.6)';
    }
  }};
  margin-top: 10px;
  text-align: right;
  transition: opacity 0.2s;
  opacity: 0.7;
  font-style: italic;
  
  &:hover {
    opacity: 1;
  }
`;

// Helper function to determine if a color is light or dark
function isLightColorHex(color: string): boolean {
  // If it's a gradient, treat as dark
  if (color.startsWith('linear-gradient')) {
    return false;
  }
  
  // Convert hex to RGB
  let r = 0, g = 0, b = 0;
  
  if (color.length === 7) {
    r = parseInt(color.substring(1, 3), 16);
    g = parseInt(color.substring(3, 5), 16);
    b = parseInt(color.substring(5, 7), 16);
  } else if (color.length === 4) {
    r = parseInt(color.substring(1, 2) + color.substring(1, 2), 16);
    g = parseInt(color.substring(2, 3) + color.substring(2, 3), 16);
    b = parseInt(color.substring(3, 4) + color.substring(3, 4), 16);
  }
  
  // Calculate perceived brightness using relative luminance
  // Formula: (0.299*R + 0.587*G + 0.114*B)
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return brightness > 0.5; // If brightness > 0.5, it's a light color
}

// Array of selected colors for the color picker
const colorOptions = [
  '#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', 
  '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF',
  '#B5838D', '#6D6875', '#7F95D1', '#6A8D73'
];

// Gradient options
const gradientOptions = [
  'linear-gradient(135deg, #F6D365 0%, #FDA085 100%)',
  'linear-gradient(135deg, #5EE7DF 0%, #B490CA 100%)',
  'linear-gradient(135deg, #FFD3A5 0%, #FD6585 100%)',
  'linear-gradient(135deg, #C2FFD8 0%, #465EFB 100%)',
  'linear-gradient(135deg, #ABDCFF 0%, #0396FF 100%)',
  'linear-gradient(135deg, #CE9FFC 0%, #7367F0 100%)'
];

/**
 * Highlights search terms in text with styled spans.
 * Returns an array of React elements or strings for rendering.
 * 
 * @param text The text to search within
 * @param searchTerm The search term to highlight
 * @param isDarkMode Whether the app is in dark mode (affects highlight color)
 * @returns Array of elements or strings for rendering
 */
const highlightSearchMatches = (text: string, searchTerm: string, isDarkMode: boolean): React.ReactNode[] => {
  if (!searchTerm) {
    return [text];
  }
  
  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) => {
    // Check if this part matches the search term (case insensitive)
    const isMatch = part.toLowerCase() === searchTerm.toLowerCase();
    
    if (isMatch) {
      return (
        <span 
          key={i}
          style={{ 
            backgroundColor: 'rgba(255, 255, 0, 0.4)', /* Yellow highlight that works with black text */
            color: '#000000',
            borderRadius: '2px',
            padding: '0 2px',
            margin: '0 -2px',
            textShadow: 'none' /* Remove text shadow for highlighted text */
          }}
        >
          {part}
        </span>
      );
    }
    return part;
  });
};

export const NoteComponent: React.FC<NoteComponentProps> = ({
  note,
  onUpdate,
  onDelete,
  bringToFront,
  searchTerm = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState(note.position);
  const [size, setSize] = useState(note.size);
  const [content, setContent] = useState(note.content);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const noteRef = useRef<HTMLDivElement>(null);
  const { mode } = useTheme();
  const isDarkMode = mode === 'dark';
  const isGradient = note.color.startsWith('linear-gradient');
  
  const dragRef = useRef<{
    startX: number;
    startY: number;
    noteX: number;
    noteY: number;
    noteWidth?: number;
    noteHeight?: number;
  }>({
    startX: 0,
    startY: 0,
    noteX: 0,
    noteY: 0,
  });

  // Mark as not new after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNew(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        const newPosition = {
          x: dragRef.current.noteX + dx,
          y: dragRef.current.noteY + dy,
        };
        
        setPosition(newPosition);
      } else if (isResizing) {
        const newWidth = Math.max(150, dragRef.current.noteWidth! + (e.clientX - dragRef.current.startX));
        const newHeight = Math.max(120, dragRef.current.noteHeight! + (e.clientY - dragRef.current.startY));
        
        setSize({
          width: newWidth,
          height: newHeight,
        });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onUpdate({
          ...note,
          position,
          lastModified: Date.now()
        });
      } 
      else if (isResizing) {
        setIsResizing(false);
        onUpdate({
          ...note,
          size,
          lastModified: Date.now()
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, note, onUpdate, position, size]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === noteRef.current || 
        (e.target as HTMLElement).tagName === 'DIV' && 
        !(e.target as HTMLElement).className.includes('Tool') &&
        !(e.target as HTMLElement).className.includes('Color') &&
        !(e.target as HTMLElement).className.includes('Tag')) {
      bringToFront(note.id);
      setIsDragging(true);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        noteX: position.x,
        noteY: position.y,
      };
    }
  };
  
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    bringToFront(note.id);
    setIsResizing(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      noteWidth: size.width,
      noteHeight: size.height
    };
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onUpdate({
      ...note,
      content: newContent,
      lastModified: Date.now()
    });
  };

  const handleColorChange = (color: string, isGradient: boolean = false) => {
    setShowColorPicker(false);
    onUpdate({
      ...note,
      color,
      lastModified: Date.now()
    });
  };
  
  const toggleTag = (tag: string) => {
    const updatedTags = note.tags.includes(tag)
      ? note.tags.filter(t => t !== tag)
      : [...note.tags, tag];
    
    onUpdate({
      ...note,
      tags: updatedTags,
      lastModified: Date.now()
    });
  };

  const handleFocus = () => {
    bringToFront(note.id);
  };
  
  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(note.id);
    }, 500); // Match the animation duration
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <StyledNote
      ref={noteRef}
      $left={position.x}
      $top={position.y}
      $width={size.width}
      $height={size.height}
      $color={note.color}
      $zIndex={note.zIndex}
      $rotation={note.rotation}
      $isNew={isNew}
      $isDarkMode={isDarkMode}
      $isDeleting={isDeleting}
      $isGradient={isGradient}
      onMouseDown={handleMouseDown}
      onClick={handleFocus}
    >
      <NoteHeader>
        <NoteTools>
          <ToolButton onClick={() => setShowTagPicker(!showTagPicker)} title="Tags" $isDarkMode={isDarkMode}>
            #
          </ToolButton>
          <ToolButton onClick={() => setShowColorPicker(!showColorPicker)} title="Change color" $isDarkMode={isDarkMode}>
            🎨
          </ToolButton>
        </NoteTools>
        <DeleteButton onClick={handleDelete} title="Delete note" $isDarkMode={isDarkMode}>
          ×
        </DeleteButton>
      </NoteHeader>
      
      {showTagPicker && (
        <TagsContainer>
          {noteTags.map(tag => (
            <Tag 
              key={tag}
              $selected={note.tags.includes(tag)}
              $isDarkMode={isDarkMode}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Tag>
          ))}
        </TagsContainer>
      )}
      
      {note.tags.length > 0 && !showTagPicker && (
        <TagsContainer>
          {note.tags.map(tag => (
            <Tag 
              key={tag}
              $selected={true}
              $isDarkMode={isDarkMode}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Tag>
          ))}
        </TagsContainer>
      )}
      
      {showColorPicker && (
        <ColorPicker>
          {colorOptions.map(color => (
            <ColorOption 
              key={color}
              $color={color}
              $isSelected={color === note.color}
              $isGradient={false}
              onClick={() => handleColorChange(color, false)}
            />
          ))}
          {gradientOptions.map(gradient => (
            <ColorOption 
              key={gradient}
              $color={gradient}
              $isSelected={gradient === note.color}
              $isGradient={true}
              onClick={() => handleColorChange(gradient, true)}
            />
          ))}
        </ColorPicker>
      )}
      
      {searchTerm ? (
        <NoteContentDisplay
          $isDarkMode={isDarkMode}
          $noteColor={note.color}
          $isGradient={isGradient}
          onClick={handleFocus}
        >
          {highlightSearchMatches(content, searchTerm, isDarkMode)}
        </NoteContentDisplay>
      ) : (
        <NoteContent
          value={content}
          onChange={handleContentChange}
          onFocus={handleFocus}
          placeholder="Write your note here..."
          $isDarkMode={isDarkMode}
          $noteColor={note.color}
          $isGradient={isGradient}
        />
      )}
      
      <TimeStamp 
        $isDarkMode={isDarkMode} 
        $noteColor={note.color}
        $isGradient={isGradient}
      >
        {formatDate(note.lastModified)}
      </TimeStamp>
      
      <ResizeHandle 
        onMouseDown={handleResizeStart}
        $isDarkMode={isDarkMode}
      />
    </StyledNote>
  );
}; 