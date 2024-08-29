import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import tmdbApi from '../services/tmdbApi';
import Pagination from '../components/Pagination';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
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
  height: 300px;
  object-fit: cover;
`;

const Name = styled.h3`
  font-size: 15px;
  text-align: center;
  color: ${props => props.theme.primary};
`;

function Actors() {
  const [actors, setActors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    tmdbApi.get('/person/popular', {
      params: { page: currentPage }
    }).then((response) => {
      setActors(response.data.results);
      setTotalPages(response.data.total_pages);
    });
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <h2>Popular Actors</h2>
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
