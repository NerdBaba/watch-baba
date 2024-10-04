import React, {forwardRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaCompass, FaFilm, FaTv, FaUser, FaTimes, FaBars, FaPalette, FaEye,FaBook } from 'react-icons/fa';

// import { themes } from '../theme';

const SidebarContainer = styled.nav`
  width: ${(props) => (props.isOpen ? '200px' : '60px')};
  background-color: ${(props) => props.theme.background};
  padding: 20px 8px;
  transition: all 0.3s ease;
  position: fixed;
  height: 100%;
  overflow-y: auto;
  z-index: 1000;
  top: 0;
  left: 0;

  @media (max-width: 768px) {
    left: ${(props) => (props.isOpen ? '0' : '-60px')};
  }
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.text};
  text-decoration: none;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 5px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.primary};
    color: ${(props) => props.theme.background};
  }
`;

const IconWrapper = styled.span`
  margin-right: ${(props) => (props.isOpen ? '10px' : '0')};
  display: flex;
  justify-content: center;
  width: ${(props) => (props.isOpen ? 'auto' : '100%')};
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.text};
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: ${(props) => (props.isOpen ? 'flex-end' : 'center')};
`;

// const ThemeSelector = styled.select`
//   width: 100%;
//   padding: 5px;
//   margin-top: 10px;
//   background-color: ${(props) => props.theme.background};
//   color: ${(props) => props.theme.text};
//   border: 1px solid ${(props) => props.theme.primary};
//   border-radius: 5px;
// `;

const Sidebar = forwardRef(({ setTheme, isOpen, setIsOpen }, ref) => {
  // const theme = useContext(ThemeContext);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // const handleThemeChange = (e) => {
  //   const themeName = e.target.value;
  //   console.log('Selected theme:', themeName);
  //   setTheme(themeName);
  // };

  return (
    <SidebarContainer ref={ref} isOpen={isOpen}>
      <ToggleButton onClick={toggleSidebar} isOpen={isOpen}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </ToggleButton>
      <NavItem to="/">
        <IconWrapper isOpen={isOpen}><FaHome /></IconWrapper>
        {isOpen && 'Home'}
      </NavItem>
      <NavItem to="/discovery">
        <IconWrapper isOpen={isOpen}><FaCompass /></IconWrapper>
        {isOpen && 'Discovery'}
      </NavItem>
      <NavItem to="/movies">
        <IconWrapper isOpen={isOpen}><FaFilm /></IconWrapper>
        {isOpen && 'Movies'}
      </NavItem>
      <NavItem to="/tv">
        <IconWrapper isOpen={isOpen}><FaTv /></IconWrapper>
        {isOpen && 'Series'}
      </NavItem>
      <NavItem to="/actors">
        <IconWrapper isOpen={isOpen}><FaUser /></IconWrapper>
        {isOpen && 'Actors'}
      </NavItem>
      <NavItem to="/anime">
        <IconWrapper isOpen={isOpen}><FaEye /></IconWrapper>
        {isOpen && 'Anime'}
      </NavItem>
      <NavItem to="/manga">
      <IconWrapper isOpen={isOpen}><FaBook /></IconWrapper>
      {isOpen && 'Manga'}
      </NavItem>
      <NavItem to="/themes">
        <IconWrapper isOpen={isOpen}><FaPalette /></IconWrapper>
        {isOpen && 'Themes'}
      </NavItem>
    </SidebarContainer>
  );
});

export default Sidebar;