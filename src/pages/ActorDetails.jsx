import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import tmdbApi from '../services/tmdbApi';
import MovieCard from '../components/MovieCard';

const ActorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 2000px;
  margin: 0 auto;
  padding: 20px;
`;

const ActorInfo = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;

  font-family: "Geist";
`;

const ProfilePic = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
`;

const Info = styled.div`
  flex: 1;
  min-width: 300px;
`;

const KnownFor = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  padding: 10px 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

function ActorDetails() {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [knownFor, setKnownFor] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setActor(null);
    setKnownFor([]);
    setError('');

    Promise.all([
      tmdbApi.get(`/person/${encodeURIComponent(id)}`, { signal: controller.signal }),
      tmdbApi.get(`/person/${encodeURIComponent(id)}/combined_credits`, { signal: controller.signal }),
    ]).then(([actorResponse, creditsResponse]) => {
      if (!active) return;

      const cast = Array.isArray(creditsResponse.data?.cast) ? creditsResponse.data.cast : [];
      const filteredCredits = cast
        .filter(credit => credit.media_type !== 'tv' || !credit.genre_ids?.includes(10767))
        .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
        .slice(0, 30);

      setActor(actorResponse.data);
      setKnownFor(filteredCredits);
    }).catch((requestError) => {
      if (active && requestError?.code !== 'ERR_CANCELED' && requestError?.name !== 'AbortError') {
        console.error('Error fetching actor details:', requestError);
        setError('Unable to load this actor right now.');
      }
    });

    return () => {
      active = false;
      controller.abort();
    };
  }, [id]);

  if (error) return <div role="alert">{error}</div>;
  if (!actor) return <div>Loading...</div>;

  return (
    <ActorContainer>
      <ActorInfo>
        {actor.profile_path ? (
          <ProfilePic src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`} alt={actor.name} />
        ) : null}
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
