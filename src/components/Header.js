import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: ${props => props.theme.secondary};
`;

const Logo = styled.h1`
  font-size: 40px;
  color: ${props => props.theme.primary};
  font-weight: 700;
  margin: 0;
  @font-face {
    font-family: 'Pacify Angry';
    src: url('fonts/Pacify%20Angry.ttf') format('truetype');
  }
  font-family: 'Pacify Angry', sans-serif;
`;

const SearchForm = styled.form`
  width: 250px;
  margin-left: auto;
`;

const SearchBarContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchBar = styled.input`
  padding: 10px;
  padding-right: 40px;
  border-radius: 5px;
  border: 3px solid ${props => props.theme.primary};
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  width: 100%;
  box-sizing: border-box;
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.text};
  cursor: pointer;
`;


function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <HeaderContainer>
      <Logo>Watch.Baba</Logo>
      <SearchForm onSubmit={handleSearch}>
        <SearchBarContainer>
          <SearchBar
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchIcon onClick={handleSearch} />
        </SearchBarContainer>
      </SearchForm>
    </HeaderContainer>
  );
}

export default Header;