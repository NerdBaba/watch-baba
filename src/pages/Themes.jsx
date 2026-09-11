// Themes.js
import React,{ useState, useContext } from 'react';
import styled, {ThemeContext} from 'styled-components';
import { themes } from '../theme';
import { FaCheck } from 'react-icons/fa';


const ThemesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const ThemeCard = styled.div`
  position: relative;
  background-color: ${props => props.theme.background};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;
const SelectedIndicator = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.background};
  border-radius: 50%;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;
const ThemePreview = styled.div`
  height: 150px;
  display: flex;
  flex-direction: column;
`;

const ColorStrip = styled.div`
  flex: 1;
  background-color: ${props => props.color};
`;

const ThemeInfo = styled.div`
  padding: 15px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

const ThemeName = styled.h3`
  margin: 0 0 5px 0;
  font-size: 18px;
`;

const ThemeDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${props => props.theme.text}aa;
`;


const FilterSelect = styled.select`
  margin-bottom: 20px;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.primary};
`;

const Themes = ({ setTheme }) => {
  const [filter, setFilter] = useState('all');
  const currentTheme = useContext(ThemeContext);

  const filteredThemes = Object.entries(themes).filter(([_, theme]) => 
    filter === 'all' || theme.category === filter
  );

  const isCurrentTheme = (theme) => {
    return theme.primary === currentTheme.primary &&
           theme.background === currentTheme.background &&
           theme.text === currentTheme.text;
  };

  return (
    <div>
      <FilterSelect value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All Themes</option>
        <option value="dark">Dark</option>
        <option value="amoled">AMOLED</option>
        <option value="light">Light</option>
        <option value="pastel">Pastel</option>
      </FilterSelect>
      <ThemesContainer>
        {filteredThemes.map(([key, theme]) => (
          <ThemeCard key={key} onClick={() => setTheme(key)}>
            <ThemePreview>
              <ColorStrip color={theme.primary} />
              <ColorStrip color={theme.background} />
              <ColorStrip color={theme.text} />
            </ThemePreview>
            <ThemeInfo>
              <ThemeName>{theme.name}</ThemeName>
              <ThemeDescription>{theme.description}</ThemeDescription>
            </ThemeInfo>
            {isCurrentTheme(theme) && (
              <SelectedIndicator>
                <FaCheck />
              </SelectedIndicator>
            )}
          </ThemeCard>
        ))}
      </ThemesContainer>
    </div>
  );
};

export default Themes;

