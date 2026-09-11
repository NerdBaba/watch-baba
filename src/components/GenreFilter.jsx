import React from 'react';
import styled from 'styled-components';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

const SelectTrigger = styled(Select.Trigger)`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  padding: 0 15px;
  font-size: 14px;
  line-height: 1;
  height: 35px;
  gap: 5px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.border};
  &:hover {
    background-color: ${props => props.theme.hover};
  }
  &:focus {
    box-shadow: 0 0 0 2px ${props => props.theme.primary};
  }
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 0 10px;
    height: 30px;
  }
`;

const SelectContent = styled(Select.Content)`
  overflow: hidden;
  background-color: ${props => props.theme.background};
  border-radius: 6px;
  box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2);
`;

const SelectViewport = styled(Select.Viewport)`
  padding: 5px;
`;

const SelectItem = styled(Select.Item)`
  font-size: 14px;
  line-height: 1;
  color: ${props => props.theme.text};
  border-radius: 3px;
  display: flex;
  align-items: center;
  height: 25px;
  padding: 0 35px 0 25px;
  position: relative;
  user-select: none;
  &[data-highlighted] {
    outline: none;
    background-color: ${props => props.theme.primary};
    color: ${props => props.theme.background};
  }
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 0 25px 0 15px;
  }
`;

const SelectLabel = styled(Select.Label)`
  padding: 0 25px;
  font-size: 12px;
  line-height: 25px;
  color: ${props => props.theme.text};
  @media (max-width: 768px) {
    font-size: 10px;
    padding: 0 15px;
  }
`;

const SelectSeparator = styled(Select.Separator)`
  height: 1px;
  background-color: ${props => props.theme.border};
  margin: 5px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    gap: 5px;
  }
`;

const SelectGroup = styled(Select.Group)`
  padding: 5px;
`;

function FilterDropdown({ label, options, value, onChange }) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label}>
        <Select.Value placeholder={label} />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </SelectTrigger>
      <Select.Portal>
        <SelectContent>
          <Select.ScrollUpButton>
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <SelectViewport>
            <SelectGroup>
              <SelectLabel>{label}</SelectLabel>
              <SelectSeparator />
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <Select.ItemText>{option.label}</Select.ItemText>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectViewport>
          <Select.ScrollDownButton>
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </SelectContent>
      </Select.Portal>
    </Select.Root>
  );
}

function GenreFilter({ genres, selectedGenre, onGenreSelect, selectedSort, onSortSelect, selectedYear, onYearSelect, selectedLanguage, onLanguageSelect }) {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
  });

  const sortOptions = [
    { value: 'popularity.desc', label: 'Popularity Descending' },
    { value: 'popularity.asc', label: 'Popularity Ascending' },
    { value: 'vote_average.desc', label: 'Rating Descending' },
    { value: 'vote_average.asc', label: 'Rating Ascending' },
    { value: 'primary_release_date.desc', label: 'Release Date Descending' },
    { value: 'primary_release_date.asc', label: 'Release Date Ascending' },
    { value: 'original_title.asc', label: 'Title (A-Z)' },
    { value: 'original_title.desc', label: 'Title (Z-A)' },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ta', label: 'Tamil' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'hi', label: 'Hindi' },
    { value: 'te', label: 'Telugu' },
    { value: 'kn', label: 'Kannada' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
    { value: 'zh', label: 'Chinese' },
  ];

  return (
    <FilterContainer>
      <FilterDropdown
        label="Year"
        options={[{ value: 'all', label: 'All Years' }, ...yearOptions]}
        value={selectedYear}
        onChange={onYearSelect}
      />
      <FilterDropdown
        label="Genre"
        options={[{ value: 'all', label: 'All Genres' }, ...genres.map(genre => ({ value: genre.id.toString(), label: genre.name }))]}
        value={selectedGenre}
        onChange={onGenreSelect}
      />
      <FilterDropdown
        label="Sort By"
        options={sortOptions}
        value={selectedSort}
        onChange={onSortSelect}
      />
      <FilterDropdown
        label="Language"
        options={[{ value: 'all', label: 'All Languages' }, ...languageOptions]}
        value={selectedLanguage}
        onChange={onLanguageSelect}
      />
    </FilterContainer>
  );
}

export { FilterDropdown };
export default GenreFilter;