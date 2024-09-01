import React from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

const GenreButton = styled.button`
  background-color: ${props => props.active ? props.theme.primary : props.theme.secondary};
  color: ${props => props.active ? props.theme.text : props.theme.secondary};
  border: none;
  padding: 6px 10px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;

  @media (min-width: 768px) {
    padding: 8px 12px;
    font-size: 15px;
  }

  &:hover {
    background-color: ${props => props.theme.primary};
    color: ${props => props.theme.secondary};
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