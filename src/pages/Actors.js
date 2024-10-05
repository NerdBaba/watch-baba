import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import tmdbApi from '../services/tmdbApi';
import Pagination from '../components/Pagination';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;

  @media (min-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
`;

const ActorCard = styled(Link)`
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  color: white;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ProfilePic = styled.img`
  width: 100%;
  height: auto;
  aspect-ratio: 2 / 3;
  object-fit: cover;
`;

const Name = styled.h3`
  font-size: 14px;
  text-align: center;
  color: ${props => props.theme.primary};
  margin: 10px 0;

  @media (min-width: 480px) {
    font-size: 15px;
  }
`;
const SectionTitle = styled.h2`
   font-size: 20px;
  margin-bottom: 15px;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  
  &:before {
    content: '';
    display: inline-block;
    width: 7px;
    height: 23px;
    background-color: ${props => props.theme.primary};
    margin-right: 10px;
    border-radius: 32px;

  }
  
  @media (min-width: 768px) {
    font-size: 26px;
    margin-bottom: 20px;
    
    &:before {
      height: 28px;
    }
  }
`;

function Actors() {
  const [actors, setActors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const [response1, response2] = await Promise.all([
          tmdbApi.get('/person/popular', { params: { page: currentPage * 2 - 1 } }),
          tmdbApi.get('/person/popular', { params: { page: currentPage * 2 } })
        ]);

        const combinedActors = [...response1.data.results, ...response2.data.results];
        setActors(combinedActors);
        setTotalPages(Math.ceil(response1.data.total_pages / 2));
      } catch (error) {
        console.error('Error fetching actors:', error);
      }
    };

    fetchActors();
  }, [currentPage]);

  const handlePageChange = useCallback((pageNumber) => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    scrollToTop();

    setTimeout(() => {
      setCurrentPage(pageNumber);
    }, 500);
  }, []);

  return (
    <div>
      <SectionTitle>Popular Actors</SectionTitle>
      <Grid>
        {actors.map((actor) => (
          <ActorCard key={actor.id} to={`/actor/${actor.id}`}>
            <ProfilePic src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`} alt={actor.name} />
            <Name>{actor.name}</Name>
          </ActorCard>
        ))}
      </Grid>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default Actors;
