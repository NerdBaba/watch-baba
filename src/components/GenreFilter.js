import React from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const GenreButton = styled.button`
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.primary};
  background-color: ${props => props.active ? props.theme.primary : props.theme.background};
  color: ${props => props.active ? props.theme.background : props.theme.text};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.primary};
    color: ${props => props.theme.background};
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 12px;
  }
`;

function GenreFilter({ genres, selectedGenre, onGenreSelect }) {
  return (
    <FilterContainer>
      <GenreButton
        active={selectedGenre === ''}
        onClick={() => onGenreSelect('')}
      >
        All
      </GenreButton>
      {genres.map(genre => (
        <GenreButton
          key={genre.id}
          active={selectedGenre === genre.id.toString()}
          onClick={() => onGenreSelect(genre.id.toString())}
        >
          {genre.name}
        </GenreButton>
      ))}
    </FilterContainer>
  );
}

export default GenreFilter;