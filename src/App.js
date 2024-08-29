import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createGlobalStyle, styled } from 'styled-components';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Discovery from './pages/Discovery';
import Movies from './pages/Movies';
import TvShows from './pages/TvShows';
import Actors from './pages/Actors';
import MovieDetails from './pages/MovieDetails';
import TvShowDetails from './pages/TvShowDetails';
import SearchResults from './pages/SearchResults';
import ActorDetails from './pages/ActorDetails';
import { themes } from './theme';

import { saveTheme, loadTheme } from './utils/themeStorage';


const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: 20px;
`;

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
  }

  a {
    color: ${props => props.theme.primary};
    text-decoration: none;
  }

  button {
    background-color: ${props => props.theme.primary};
    color: ${props => props.theme.secondary};
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover {
      background-color: ${props => props.theme.accent1};
    }
  }
`;
const isLocalStorageAvailable = () => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch (e) {
    return false;
  }
};

console.log('Is localStorage available?', isLocalStorageAvailable());

function App() {
  const [currentTheme, setCurrentTheme] = useState(themes.default);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
  const savedThemeName = loadTheme();
  console.log('Loaded theme name:', savedThemeName);
  if (savedThemeName && themes[savedThemeName]) {
    console.log('Setting theme to:', themes[savedThemeName]);
    setCurrentTheme(themes[savedThemeName]);
  } else {
    console.log('No saved theme found or invalid theme name');
  }
}, []);

  const changeTheme = (themeName) => {
  console.log('Changing theme to:', themeName); // Log the theme name, not the object
  if (themes[themeName]) {
    setCurrentTheme(themes[themeName]);
    saveTheme(themeName);
    console.log('Theme saved:', themeName);
  }
};

  return (
    <ThemeProvider theme={currentTheme}>
      <Router>
        <GlobalStyle />
        <AppContainer>
          <Sidebar 
            setTheme={changeTheme} 
            isOpen={isSidebarOpen} 
            setIsOpen={setIsSidebarOpen}
          />
          <MainContent style={{ marginLeft: isSidebarOpen ? '210px' : '70px' }}>
            <Header />
            <ContentWrapper>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/discovery" element={<Discovery />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/tv-shows" element={<TvShows />} />
                <Route path="/actors" element={<Actors />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/tv/:id" element={<TvShowDetails />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/actor/:id" element={<ActorDetails />} />
              </Routes>
            </ContentWrapper>
            <Footer />
          </MainContent>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;
