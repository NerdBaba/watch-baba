import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaCompass, FaFilm, FaTv, FaUser, FaTimes, FaPalette, FaBaseballBall, FaBook } from 'react-icons/fa';
import { Sidebar as FeatherSidebar } from 'react-feather';

const SidebarContainer = styled.nav`
  @media (max-width: 768px) {
    display: none;
  }

  width: ${(props) => (props.isOpen ? '200px' : '60px')};
  background-color: ${(props) => props.theme.background};
  padding: 20px 8px;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  position: fixed;
  height: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
  z-index: 1000;
  top: 0;
  left: 0;
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
  font-size: 1.3rem;
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

  &:hover {
    color: ${(props) => props.theme.text};
    background-color: ${(props) => props.theme.hover};
  }
`;

const CustomIcon = styled.i`
  font-family: 'icomoon' !important;
  speak: never;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  font-size: 1.5rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const Sidebar = forwardRef(({ setTheme, isOpen, setIsOpen }, ref) => {
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SidebarContainer ref={ref} isOpen={isOpen}>
      <ToggleButton onClick={toggleSidebar} isOpen={isOpen}>
        {isOpen ? <FaTimes /> : <FeatherSidebar />}
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
        <IconWrapper isOpen={isOpen}><CustomIcon className="icon-anime" /></IconWrapper>
        {isOpen && 'Anime'}
      </NavItem>
      <NavItem to="/manga">
        <IconWrapper isOpen={isOpen}><CustomIcon className="icon-mangaka" /></IconWrapper>
        {isOpen && 'Manga'}
      </NavItem>
      <NavItem to="/kdrama">
        <IconWrapper isOpen={isOpen}><CustomIcon className="icon-manga" /></IconWrapper>
        {isOpen && 'K-Drama'}
      </NavItem>
      <NavItem to="/sports">
        <IconWrapper isOpen={isOpen}><FaBaseballBall /></IconWrapper>
        {isOpen && 'Live Sports'}
      </NavItem>
      <NavItem to="/books">
        <IconWrapper isOpen={isOpen}><FaBook /></IconWrapper>
        {isOpen && 'Books'}
      </NavItem>
      <NavItem to="/themes">
        <IconWrapper isOpen={isOpen}><FaPalette /></IconWrapper>
        {isOpen && 'Themes'}
      </NavItem>
    </SidebarContainer>
  );
});

export default Sidebar;