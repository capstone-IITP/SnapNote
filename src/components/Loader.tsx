import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../theme';

interface LoaderProps {
  onComplete?: () => void;
  minDisplayTime?: number;
}

// Floating animation for the sticky notes
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-15px) rotate(2deg); }
  50% { transform: translateY(0px) rotate(0deg); }
  75% { transform: translateY(-8px) rotate(-2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

// Pulse animation for the loading text
const pulse = keyframes`
  0% { opacity: 0.6; transform: scale(0.98); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.6; transform: scale(0.98); }
`;

// Shimmer effect for the loading bar
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Fade out animation
const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const LoaderContainer = styled.div<{ $isClosing: boolean; $theme: 'light' | 'dark' }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  background: ${props => props.$theme === 'dark' 
    ? 'linear-gradient(135deg, #161a2b 0%, #1a1f38 100%)' 
    : 'linear-gradient(135deg, #f8faff 0%, #eef4fc 100%)'};
  opacity: 1;
  transition: opacity 0.8s ease-out;
  animation: ${props => props.$isClosing ? fadeOut : 'none'} 0.8s forwards;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$theme === 'dark' 
      ? 'radial-gradient(circle at 70% 20%, rgba(54, 54, 115, 0.3) 0%, rgba(26, 26, 46, 0) 50%)' 
      : 'radial-gradient(circle at 70% 20%, rgba(200, 210, 255, 0.3) 0%, rgba(247, 249, 252, 0) 50%)'};
    pointer-events: none;
  }
`;

const NotesContainer = styled.div`
  position: relative;
  width: 240px;
  height: 240px;
`;

const Note = styled.div<{ $delay: number; $color: string; $size: number; $x: number; $y: number; $rotation: number }>`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background: ${props => props.$color};
  border-radius: 4px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  top: ${props => props.$y}px;
  left: ${props => props.$x}px;
  transform: rotate(${props => props.$rotation}deg);
  animation: ${float} 3s infinite ease-in-out;
  animation-delay: ${props => props.$delay}s;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(to right, rgba(255,255,255,0.5), rgba(255,255,255,0.8), rgba(255,255,255,0.5));
    opacity: 0.8;
    border-radius: 3px 3px 0 0;
  }
`;

const LoadingBar = styled.div<{ $progress: number; $theme: 'light' | 'dark' }>`
  width: 280px;
  height: 6px;
  background: ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  border-radius: 3px;
  margin-top: 30px;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => props.$progress}%;
    height: 100%;
    background: ${props => props.$theme === 'dark' 
      ? 'linear-gradient(90deg, #6C8FFF, #536DFE, #6C8FFF)' 
      : 'linear-gradient(90deg, #4C6EF5, #3B5BDB, #4C6EF5)'};
    background-size: 200% 100%;
    animation: ${shimmer} 1.5s infinite linear;
    border-radius: 3px;
    transition: width 0.3s ease-out;
  }
`;

const LoadingText = styled.div<{ $theme: 'light' | 'dark' }>`
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'};
  margin-top: 15px;
  animation: ${pulse} 2s infinite ease-in-out;
  letter-spacing: 0.5px;
`;

const AppTitle = styled.h1<{ $theme: 'light' | 'dark' }>`
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 32px;
  font-weight: 600;
  color: ${props => props.$theme === 'dark' ? '#f0f4fd' : '#2d3748'};
  margin: 0 0 10px 0;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const getRandomColor = () => {
  const colors = [
    'linear-gradient(135deg, #FF9A8B 0%, #FF6A88 100%)',
    'linear-gradient(135deg, #FBDA61 0%, #FF5ACD 100%)',
    'linear-gradient(135deg, #A9C9FF 0%, #FFBBEC 100%)',
    'linear-gradient(135deg, #8EC5FC 0%, #E0C3FC 100%)',
    'linear-gradient(135deg, #0BA360 0%, #3CBA92 100%)',
    'linear-gradient(135deg, #FCCF31 0%, #F55555 100%)',
    'linear-gradient(135deg, #43CBFF 0%, #9708CC 100%)',
    'linear-gradient(135deg, #5EFCE8 0%, #736EFE 100%)'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const Loader: React.FC<LoaderProps> = ({ onComplete, minDisplayTime = 2000 }) => {
  const [progress, setProgress] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const { mode } = useTheme();
  
  // Generate sticky notes
  const notes = Array.from({ length: 7 }).map((_, i) => ({
    color: getRandomColor(),
    size: Math.floor(Math.random() * 40) + 60,
    x: Math.floor(Math.random() * 140) - 20,
    y: Math.floor(Math.random() * 140) - 20,
    rotation: Math.floor(Math.random() * 16) - 8,
    delay: i * 0.2
  }));

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + (100 - prevProgress) * 0.1;
        
        if (newProgress >= 99) {
          clearInterval(interval);
          
          // Check if minimum display time has passed
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
          
          // Set progress to 100% first
          setProgress(100);
          
          // After minimum display time, trigger the closing animation
          setTimeout(() => {
            setIsClosing(true);
            
            // After animation completes, call onComplete
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 800); // Match the fadeOut animation duration
          }, remainingTime);
        }
        
        return newProgress;
      });
    }, 150);
    
    return () => clearInterval(interval);
  }, [onComplete, minDisplayTime]);

  return (
    <LoaderContainer $isClosing={isClosing} $theme={mode}>
      <AppTitle $theme={mode}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
          <path fill={mode === 'dark' ? '#6C8FFF' : '#4C6EF5'} d="M21,2H3C1.9,2,1,2.9,1,4v16c0,1.1,0.9,2,2,2h18c1.1,0,2-0.9,2-2V4C23,2.9,22.1,2,21,2z M21,20H3V4h18V20z"/>
          <path fill={mode === 'dark' ? '#6C8FFF' : '#4C6EF5'} d="M6,7h12v2H6V7z"/>
          <path fill={mode === 'dark' ? '#6C8FFF' : '#4C6EF5'} d="M6,11h12v2H6V11z"/>
          <path fill={mode === 'dark' ? '#6C8FFF' : '#4C6EF5'} d="M6,15h8v2H6V15z"/>
        </svg>
        Sticky Notes
      </AppTitle>
      
      <NotesContainer>
        {notes.map((note, index) => (
          <Note 
            key={index}
            $color={note.color}
            $size={note.size}
            $x={note.x}
            $y={note.y}
            $rotation={note.rotation}
            $delay={note.delay}
          />
        ))}
      </NotesContainer>
      
      <LoadingBar $progress={progress} $theme={mode} />
      <LoadingText $theme={mode}>Loading your notes...</LoadingText>
    </LoaderContainer>
  );
};

export default Loader; 