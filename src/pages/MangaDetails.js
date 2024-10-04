// src/pages/MangaDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { FaBookmark } from 'react-icons/fa';
import LoadingScreen from '../components/LoadingScreen';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const MangaHeader = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CoverImage = styled.img`
  max-width: 300px;
  border-radius: 10px;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const MangaInfo = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  margin: 0 0 10px 0;
  color: ${props => props.theme.text};
`;

const Author = styled.p`
  color: ${props => props.theme.primary};
  margin-bottom: 10px;
`;

const GenreList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
`;

const Genre = styled.span`
  background: ${props => props.theme.primary}33;
  color: ${props => props.theme.primary};
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
`;

const Status = styled.div`
  margin-bottom: 10px;
  color: ${props => props.theme.text}CC;
`;

const Description = styled.p`
  line-height: 1.6;
  color: ${props => props.theme.text};
`;

const ChapterList = styled.div`
  margin-top: 30px;
`;

const ChapterItem = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  background: ${props => props.theme.background}CC;
  border: 1px solid ${props => props.theme.border};
  border-radius: 5px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.primary}22;
  }
`;

const BookmarkButton = styled.button`
  background: ${props => props.theme.primary};
  color: ${props => props.theme.background};
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.9;
  }
`;

function MangaDetails() {
  const { id } = useParams();
  const [manga, setManga] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        const response = await axios.get(`https://simple-proxy.mda2233.workers.dev/?destination=https://mangahook-api-jfg5.onrender.com/api/manga/${id}`);
        setManga(response.data);
      } catch (error) {
        console.error('Error fetching manga details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMangaDetails();
  }, [id]);

 if (isLoading) {
  return <LoadingScreen />;
}
  if (!manga) return <div>Manga not found</div>;

  return (
    <Container>
      <MangaHeader>
        <CoverImage src={manga.imageUrl} alt={manga.name} />
        <MangaInfo>
          <Title>{manga.name}</Title>
          <Author>by {manga.author}</Author>
          <GenreList>
            {manga.genres.map((genre, index) => (
              <Genre key={index}>{genre}</Genre>
            ))}
          </GenreList>
          <Status>Status: {manga.status}</Status>
          <BookmarkButton>
          <FaBookmark />
          Bookmark</BookmarkButton>
        </MangaInfo>
      </MangaHeader>
      
      <ChapterList>
        <h2>Chapters</h2>
        {manga.chapterList.map((chapter) => (
          <ChapterItem key={chapter.id} to={`/manga/${id}/${chapter.id}`}>
            <span>{chapter.name}</span>
            <span>{chapter.createdAt}</span>
          </ChapterItem>
        ))}
      </ChapterList>
    </Container>
  );
}

export default MangaDetails;