import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { fadeIn, popIn, slideInFromTop, pulse } from '../animations';
import { useTheme, lightTheme, darkTheme } from '../theme.tsx';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const Overlay = styled.div<{ $show: boolean; $theme: 'light' | 'dark' }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${props => props.$theme === 'dark' ? '#141428' : '#f0f4f8'};
  z-index: 2000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: ${props => props.$show ? 1 : 0};
  visibility: ${props => props.$show ? 'visible' : 'hidden'};
  transition: opacity 0.5s, visibility 0.5s;
`;

const LogoContainer = styled.div`
  animation: ${popIn} 1.2s cubic-bezier(0.17, 0.67, 0.83, 0.67);
  margin-bottom: 40px;
`;

const Logo = styled.div<{ $theme: 'light' | 'dark' }>`
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  svg {
    width: 100%;
    height: 100%;
    animation: ${pulse} 2s infinite ease-in-out;
    color: ${props => props.$theme === 'dark' ? '#6c8fff' : '#4c6ef5'};
  }
`;

const staggeredFadeIn = (delay: number) => keyframes`
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Title = styled.h1<{ $theme: 'light' | 'dark' }>`
  font-size: 36px;
  margin: 0;
  animation: ${slideInFromTop} 0.8s forwards;
  animation-delay: 0.5s;
  opacity: 0;
  color: ${props => props.$theme === 'dark' ? '#ffffff' : '#333333'};
  font-weight: 600;
`;

const Tagline = styled.p<{ $theme: 'light' | 'dark' }>`
  font-size: 18px;
  margin-top: 10px;
  opacity: 0;
  animation: ${fadeIn} 0.8s forwards;
  animation-delay: 1s;
  color: ${props => props.$theme === 'dark' ? '#aaaaaa' : '#666666'};
`;

const NotesContainer = styled.div`
  position: relative;
  width: 300px;
  height: 200px;
  margin-top: 30px;
`;

const Note = styled.div<{ $color: string; $x: number; $y: number; $rotation: number; $delay: number }>`
  position: absolute;
  width: 120px;
  height: 120px;
  background-color: ${props => props.$color};
  border-radius: 6px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.2);
  transform: translate(${props => props.$x}px, ${props => props.$y}px) rotate(${props => props.$rotation}deg);
  opacity: 0;
  animation: ${props => staggeredFadeIn(props.$delay)} 0.5s forwards;
  animation-delay: ${props => 1.2 + props.$delay * 0.2}s;
`;

const LoadingBar = styled.div<{ $progress: number; $theme: 'light' | 'dark' }>`
  width: 200px;
  height: 4px;
  background-color: ${props => props.$theme === 'dark' ? '#393952' : '#e0e0e0'};
  border-radius: 2px;
  margin-top: 40px;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.$progress}%;
    background-color: ${props => props.$theme === 'dark' ? '#6c8fff' : '#4c6ef5'};
    transition: width 0.3s ease;
  }
`;

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);
  const { mode } = useTheme();

  const noteColors = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF'];
  const notes = [
    { color: noteColors[0], x: -80, y: -50, rotation: -15, delay: 0 },
    { color: noteColors[1], x: 80, y: -30, rotation: 12, delay: 1 },
    { color: noteColors[3], x: 0, y: 10, rotation: 0, delay: 2 },
    { color: noteColors[4], x: -60, y: 50, rotation: -8, delay: 3 },
    { color: noteColors[6], x: 60, y: 60, rotation: 5, delay: 4 }
  ];

  useEffect(() => {
    // Progress animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          return prev + 5;
        }
        clearInterval(interval);
        return 100;
      });
    }, 120);

    // Hide welcome screen after animation completes
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500); // Allow fade out animation to complete
    }, 4000); // Total animation time

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <Overlay $show={show} $theme={mode}>
      <LogoContainer>
        <Logo $theme={mode}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21,2H3C1.9,2,1,2.9,1,4v16c0,1.1,0.9,2,2,2h18c1.1,0,2-0.9,2-2V4C23,2.9,22.1,2,21,2z M21,20H3V4h18V20z"/>
            <path d="M6,7h12v2H6V7z"/>
            <path d="M6,11h12v2H6V11z"/>
            <path d="M6,15h8v2H6V15z"/>
          </svg>
        </Logo>
      </LogoContainer>
      <Title $theme={mode}>Sticky Notes</Title>
      <Tagline $theme={mode}>Capture your thoughts beautifully</Tagline>
      
      <NotesContainer>
        {notes.map((note, index) => (
          <Note
            key={index}
            $color={note.color}
            $x={note.x}
            $y={note.y}
            $rotation={note.rotation}
            $delay={note.delay}
          />
        ))}
      </NotesContainer>
      
      <LoadingBar $progress={progress} $theme={mode} />
    </Overlay>
  );
};

export default WelcomeScreen; 