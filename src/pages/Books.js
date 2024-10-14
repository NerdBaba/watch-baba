import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {  Download, Globe, FileText, HardDrive, Search, Bookmark } from 'react-feather';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';


const Container = styled.div`
  padding: 20px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  min-height: 100vh;
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
  border: 2px solid ${props => props.theme.primary};
  border-radius: 30px;
  font-size: 16px;
  background: ${props => props.theme.secondary};
  color: ${props => props.theme.text};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.theme.primary}40;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.primary};
`;

const SearchButton = styled.button`
  background: ${props => props.theme.button};
  color: ${props => props.theme.text};
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  font-family: 'Isidora Sans Bold', sans-serif;
  font-size: 14px;
  margin-left: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.hover};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (max-width: 768px) {
   grid-template-columns: 1fr; 
  }

  @media (min-width: 1280px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const BookCard = styled.div`
  background: ${props => props.theme.secondary};
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  
  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
`;

const CardContent = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  padding: 16px;
  height: 100%;
  width: 100%;
  
  @media (max-width: 600px) {
  padding: 8px;  
  }
  @media (min-width: 768px) {
    padding: 24px;
  }
`;



const BookDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 24px;
  }
`;

const BookCover = styled.div`
  position: relative;
  width: 100%;
  max-width: 200px;
  margin: 0 auto;

  @media (min-width: 768px) {
    width: 25%;
  }
`;

const BookImage = styled.img`
  width: 100%;
  height: auto;
  aspect-ratio: 5 / 8;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const PlaceholderCover = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  aspect-ratio: 5 / 8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Isidora Sans Bold', sans-serif;

  color: ${props => props.theme.text};
  background: ${props => props.theme.primary};
  border-radius: 8px;
  z-index: 5;

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


  @media (max-width: 600px) {
    display: none;
    }
  }
`;
const MobilePlaceholderCover = styled.div`
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  aspect-ratio: 5 / 8;
  color: ${props => props.theme.text};
  background: ${props => props.theme.primary};
  font-family: 'Isidora Sans Bold', sans-serif;
  border-radius: 8px;

  @media (max-width: 600px) {
    display: flex;
  }

  .icon {
    font-size: 24px;
    margin-bottom: 10px;
  }

  .readbaba {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .book-title {
    font-size: 14px;
    text-align: center;
  }
`;
const BookInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const BookTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-right: 24px;
  margin-bottom: 8px;
  color: ${props => props.theme.text};
  @media (max-width: 600px) {
    font-size: 17px;
  }
`;

const BookAuthor = styled.p`
  font-size: 16px;
  color: ${props => props.theme.textMuted};
  margin-bottom: 16px;
  margin-right: 24px;
   @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const BookDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.textMuted};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 16px;

   @media (max-width: 600px) {
    font-size: 12px;
  }
`;

const BookMeta = styled.p`
  font-size: 14px;
  color: ${props => props.theme.textMuted};
  margin-bottom: 8px;
   @media (max-width: 600px) {
    font-size: 12px;
  }
    svg {
    margin-right: 6px;
    min-width: 14px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
`;

const DownloadButton = styled.button`
  background: ${props => props.theme.button};
  color: ${props => props.theme.text};
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-family: 'Isidora Sans Bold', sans-serif;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.hover};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  svg {
    margin-right: 8px;
  }
`;

const WishlistButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.primary};
  &:hover {
   background-color: ${props => props.theme.hover}; 
  }
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const defaultQueries = [
  'Shakespeare',
  'Classics',
  'Coding',
  'Science Fiction',
  'Fantasy',
  'Mystery',
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
  if (window.innerWidth <= 600) {
    e.target.nextSibling.nextSibling.style.display = 'flex';
  } else {
    e.target.nextSibling.style.display = 'flex';
  }
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
                <CardContent>
                  
                  <BookDetails>
                    <BookCover>
  <BookImage
    src={book.book_image}
    alt={book.title}
    onError={handleImageError}
  />
  <PlaceholderCover style={{ display: 'none' }}>
    <FontAwesomeIcon icon={faBook} />
    <div className="readbaba">readbaba</div>
    <div className="book-title">{book.title}</div>
  </PlaceholderCover>
  <MobilePlaceholderCover style={{ display: 'none' }}>
    <FontAwesomeIcon icon={faBook} className="icon" />
    <div className="readbaba">readbaba</div>
    <div className="book-title">{book.title}</div>
  </MobilePlaceholderCover>
</BookCover>
                    <BookInfo>
                      <div>
                        <BookTitle>{book.title}</BookTitle>
                        <BookAuthor>By {book.authors || 'Unknown Author'}</BookAuthor>
                        <BookDescription>{book.description}</BookDescription>
                        <BookMeta>{book.book_content}</BookMeta>

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
                      </div>
                       <ButtonGroup>
    <DownloadButton onClick={() => handleDownload(book.link)}>
      <Download size={14} />
      Download
    </DownloadButton>
    <WishlistButton>
      <Bookmark size={20} />
    </WishlistButton>
  </ButtonGroup>
                    </BookInfo>
                  </BookDetails>
                </CardContent>
              </BookCard>
            ))}
          </BooksGrid>
        </>
      )}
    </Container>
  );
}

export default Books;