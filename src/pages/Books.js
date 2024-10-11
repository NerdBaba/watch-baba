import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Book as BookIcon, Download, User, Globe, FileText, HardDrive, Search } from 'react-feather';
import { themes } from '../theme';

const Container = styled.div`
  padding: 20px;
  background: ${themes.background};
  color: ${themes.text};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
`;

const SearchBar = styled.input`
  padding: 12px 20px 12px 50px;
  width: 100%;
  border: 2px solid ${themes.primary};
  border-radius: 30px;
  font-size: 16px;
  background: ${themes.cardBackground};
  color: ${themes.text};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${themes.primary}40;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: ${themes.primary};
`;

const SearchButton = styled.button`
  background: ${themes.primary};
  color: ${themes.buttonText};
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  font-family: 'Isidora Sans Bold', sans-serif;
  font-size: 14px;
  margin-left: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${themes.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
`;

const BookCard = styled.div`
  background: ${themes.cardBackground};
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
`;

const BookCover = styled.div`
  width: 100%;
  padding-top: 150%;
  position: relative;
  background: ${themes.background};
  overflow: hidden;
`;

const BookImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${BookCard}:hover & {
    transform: scale(1.05);
  }
`;

const PlaceholderCover = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Isidora Sans Bold', sans-serif;
  color: ${themes.text};
  background: ${themes.primary};

  svg {
    width: 40px;
    height: 40px;
    margin-bottom: 10px;
  }

  .readbaba {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .book-title {
    font-size: 14px;
    text-align: center;
    padding: 0 10px;
  }
`;

const BookInfo = styled.div`
  padding: 15px;
`;

const BookTitle = styled.h3`
  margin: 0 0 10px 0;
  font-family: 'Isidora Sans Bold', sans-serif;
  font-size: 16px;
  color: ${themes.heading};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BookMeta = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  color: ${themes.textMuted};
  font-size: 12px;

  svg {
    margin-right: 6px;
    min-width: 14px;
  }
`;

const DownloadButton = styled.button`
  background: ${themes.primary};
  color: ${themes.buttonText};
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-family: 'Isidora Sans Bold', sans-serif;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: ${themes.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  svg {
    margin-right: 8px;
  }
`;

const defaultQueries = [
  'Shakespeare',
  'Classics',
  'Coding',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Romance',
  'Adventure',
  'Historical Fiction',
  'Self-Help'
];

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentQuery, setCurrentQuery] = useState('');

  useEffect(() => {
    if (searchQuery) {
      fetchBooks(searchQuery);
    } else {
      fetchRandomDefaultBooks();
    }
  }, []);

  const fetchBooks = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(`https://backend.bookracy.ru/api/books?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setBooks(data.results || []);
      setCurrentQuery(query);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomDefaultBooks = () => {
    const randomQuery = defaultQueries[Math.floor(Math.random() * defaultQueries.length)];
    fetchBooks(randomQuery);
  };

  const handleDownload = (link) => {
    const a = document.createElement('a');
    a.href = link;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  const handleSearchChange = () => {
    if (searchQuery.trim() !== '') {
      fetchBooks(searchQuery);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchChange();
    }
  };

  return (
    <Container>
      <SearchBarContainer>
        <SearchIcon size={20} />
        <SearchBar
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search books..."
        />
        <SearchButton onClick={handleSearchChange}>Search</SearchButton>
      </SearchBarContainer>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h2>Results for: {currentQuery}</h2>
          <BooksGrid>
            {books.map((book) => (
              <BookCard key={book.md5}>
                <BookCover>
                  <BookImage
                    src={book.book_image}
                    alt={book.title}
                    onError={handleImageError}
                  />
                  <PlaceholderCover style={{ display: 'none' }}>
                    <BookIcon />
                    <div className="readbaba">readbaba</div>
                    <div className="book-title">{book.title}</div>
                  </PlaceholderCover>
                </BookCover>
                <BookInfo>
                  <BookTitle title={book.title}>{book.title}</BookTitle>
                  <BookMeta>
                    <User size={14} />
                    <span>{book.authors || 'Unknown Author'}</span>
                  </BookMeta>
                  <BookMeta>
                    <Globe size={14} />
                    <span>{book.book_lang}</span>
                  </BookMeta>
                  <BookMeta>
                    <FileText size={14} />
                    <span>{book.book_filetype}</span>
                  </BookMeta>
                  <BookMeta>
                    <HardDrive size={14} />
                    <span>{book.book_size}</span>
                  </BookMeta>
                  <DownloadButton onClick={() => handleDownload(book.link)}>
                    <Download size={14} />
                    Download
                  </DownloadButton>
                </BookInfo>
              </BookCard>
            ))}
          </BooksGrid>
        </>
      )}
    </Container>
  );
}

export default Books;