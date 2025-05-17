import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createGlobalStyle } from 'styled-components';
import { ThemeProvider, useTheme, lightTheme, darkTheme } from './theme.tsx';

// Dynamic global styles that respond to theme mode
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
  
  body {
    font-family: 'Poppins', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    transition: background-color 0.3s;
  }
  
  body[data-theme='light'] {
    background-color: ${lightTheme.background};
    color: ${lightTheme.text};
  }
  
  body[data-theme='dark'] {
    background-color: ${darkTheme.background};
    color: ${darkTheme.text};
  }
  
  /* Custom scrollbar styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${props => props.theme === 'dark' ? '#232342' : '#f1f1f1'};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme === 'dark' ? '#454564' : '#ccc'};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme === 'dark' ? '#565682' : '#aaa'};
  }
  
  /* Smooth transitions */
  button, a {
    transition: all 0.2s ease-in-out;
  }
  
  /* Better focus styles */
  :focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => 
      props.theme === 'dark' 
      ? 'rgba(108, 143, 255, 0.3)' 
      : 'rgba(76, 110, 245, 0.3)'
    };
  }
`;

// Global styles wrapper that gets theme from context
const ThemedGlobalStyle = () => {
  const { mode } = useTheme();
  return <GlobalStyle theme={mode} />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ThemedGlobalStyle />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
