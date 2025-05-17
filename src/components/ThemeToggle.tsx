import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../theme.tsx';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const rayAnimation = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.2) rotate(180deg);
  }
  100% {
    opacity: 0;
    transform: scale(0.5) rotate(360deg);
  }
`;

const moonAnimation = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.1) rotate(180deg);
  }
  100% {
    transform: scale(1) rotate(360deg);
  }
`;

const ThemeButton = styled.button`
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  
  &:hover {
    transform: translateY(-2px);
    background-color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transition: all 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.mode === 'dark' ? '#6C8FFF' : '#4C6EF5'};
  }
`;

const IconContainer = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
`;

const SunIcon = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  color: #FFB600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'scale(1) rotate(0)' : 'scale(0.5) rotate(-180deg)'};
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  .rays {
    animation: ${rayAnimation} 10s linear infinite;
    animation-play-state: paused;
  }
  
  &:hover .rays {
    animation-play-state: running;
  }
`;

const MoonIcon = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  color: #B3C5FF;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'scale(1) rotate(0)' : 'scale(0.5) rotate(180deg)'};
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  &:hover svg {
    animation: ${moonAnimation} 5s ease infinite;
  }
`;

const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme } = useTheme();
  const isDark = mode === 'dark';
  
  return (
    <ThemeButton onClick={toggleTheme} title={`Switch to ${isDark ? 'light' : 'dark'} theme`}>
      <IconContainer>
        <SunIcon $isVisible={!isDark}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="5" fill="currentColor" />
            <g className="rays">
              <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </g>
          </svg>
        </SunIcon>
        <MoonIcon $isVisible={isDark}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" />
          </svg>
        </MoonIcon>
      </IconContainer>
    </ThemeButton>
  );
};

export default ThemeToggle; 