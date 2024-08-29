import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import tmdbApi from '../services/tmdbApi';
import MovieCard from '../components/MovieCard';

const ActorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const ActorInfo = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const ProfilePic = styled.img`
  width: 300px;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
`;

const Info = styled.div`
  flex: 1;
  min-width: 300px;
`;

const KnownFor = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 10px;
  padding: 10px 0;
`;

function ActorDetails() {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [knownFor, setKnownFor] = useState([]);

  useEffect(() => {
    tmdbApi.get(`/person/${id}`).then((response) => setActor(response.data));
    tmdbApi.get(`/person/${id}/combined_credits`).then((response) => 
      setKnownFor(response.data.cast.sort((a, b) => b.popularity - a.vote_average).slice(0, 30))
    );
  }, [id]);

  if (!actor) return <div>Loading...</div>;

  return (
    <ActorContainer>
      <ActorInfo>
        <ProfilePic src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`} alt={actor.name} />
        <Info>
          <h2>{actor.name}</h2>
          <p>Born: {actor.birthday}</p>
          <p>Place of Birth: {actor.place_of_birth}</p>
          <p>{actor.biography}</p>
        </Info>
      </ActorInfo>
      <h3>Known For</h3>
      <KnownFor>
        {knownFor.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </KnownFor>
    </ActorContainer>
  );
}

export default ActorDetails;