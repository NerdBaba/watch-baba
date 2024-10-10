import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaHome, FaCompass, FaFilm, FaTv, FaUser, FaTimes, FaEye, FaBook, FaMask, FaPalette, FaBaseballBall } from 'react-icons/fa';

const TopbarOverlay = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    background-color: ${props => props.theme.background};
    z-index: 2000;
    flex-direction: column;
    padding: 20px;
    overflow-y: auto;

    

  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 24px;
  cursor: pointer;
`;

const NavGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 60px;
`;

const NavItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.text};
  text-decoration: none;
  padding: 15px;
  border-radius: 10px;
  background-color: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.primary}20;
  
  &:active {
    background-color: ${props => props.theme.primary}20;
  }
`;

const IconWrapper = styled.span`
  font-size: 24px;
  margin-bottom: 8px;
  color: ${props => props.theme.primary};
`;

const Label = styled.span`
  font-size: 14px;
`;

const navItems = [
  { icon: FaHome, label: 'Home', path: '/' },
  { icon: FaCompass, label: 'Discovery', path: '/discovery' },
  { icon: FaFilm, label: 'Movies', path: '/movies' },
  { icon: FaTv, label: 'Series', path: '/tv' },
  { icon: FaUser, label: 'Actors', path: '/actors' },
  { icon: FaEye, label: 'Anime', path: '/anime' },
  { icon: FaBook, label: 'Manga', path: '/manga' },
  { icon: FaMask, label: 'K-Drama', path: '/kdrama' },
  { icon: FaBaseballBall, label: 'Live Sports', path: '/sports' },
  { icon: FaPalette, label: 'Themes', path: '/themes' },
];

function Topbar({ isOpen, onClose }) {
  return (
    <TopbarOverlay isOpen={isOpen}>
      <CloseButton onClick={onClose}>
        <FaTimes />
      </CloseButton>
      <NavGrid>
        {navItems.map((item, index) => (
          <NavItem key={index} to={item.path} onClick={onClose}>
            <IconWrapper>
              <item.icon />
            </IconWrapper>
            <Label>{item.label}</Label>
          </NavItem>
        ))}
      </NavGrid>
    </TopbarOverlay>
  );
}

export default Topbar;