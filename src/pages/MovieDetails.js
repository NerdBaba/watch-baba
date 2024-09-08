// pages/MovieDetails.js
import React, { useState, useEffect} from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { getMovieDetails, getMovieCredits, getMovieRecommendations } from '../services/tmdbApi';
import VideoPlayer from '../components/VideoPlayer';
import MovieCard from '../components/MovieCard';

const MovieContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px ;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px;
`;

const MovieInfo = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Poster = styled.img`
  width: 300px;
  height: auto;
  object-fit: cover;
  padding: 20px;
`;

const Info = styled.div`
  flex: 1;
  min-width: 300px;
`;


const CastContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 20px;
  padding: 20px 0;
  scrollbar-width: thin;
  scrollbar-color: #888 #000;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #000;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 20px;
    border: 3px solid #000;
  }
`;

const CastMember = styled(Link)`
  text-align: center;
  width: 100px;
  flex-shrink: 0;
  text-decoration: none;
  color: inherit;
`;

const CastImage = styled.img`
  width: 100px;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
`;

const RecommendationsContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 20px;
  padding: 10px 10px;
  scrollbar-width: thin;
  scrollbar-color: #888 #000;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #000;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 20px;
    border: 3px solid #000;
  }
`;

const WatchOptions = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const WatchButton = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.active ? '#4CAF50' : '#ddd'};
  color: ${props => props.active ? 'white' : 'black'};
  border: none;
  cursor: pointer;
  border-radius: 5px;
`;


const EmbedPlayer = styled.iframe`
  width: 100%;
  height: 450px;
  border: none;
`;



function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [watchOption, setWatchOption] = useState('server1');

  useEffect(() => {
    getMovieDetails(id).then((response) => setMovie(response.data));
    getMovieCredits(id).then((response) => setCast(response.data.cast.slice(0, 10)));
    getMovieRecommendations(id).then((response) => setRecommendations(response.data.results.slice(0, 20)));
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  return (
    <MovieContainer>
      <MovieInfo>
        <Poster src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
        <Info>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>Release Date: {movie.release_date}</p>
          <p>Runtime: {movie.runtime} minutes</p>
          <p>Genres: {movie.genres.map(genre => genre.name).join(', ')}</p>
        </Info>
      </MovieInfo>

      <WatchOptions>
        <WatchButton active={watchOption === 'server1'} onClick={() => setWatchOption('server1')}>Server 1</WatchButton>
        <WatchButton active={watchOption === 'server2'} onClick={() => setWatchOption('server2')}>Server 2</WatchButton>
      </WatchOptions>

      {watchOption === 'server1' ? (
        <VideoPlayer imdbId={movie.imdb_id || id} />
      ) : (
        <EmbedPlayer 
          src={`https://vidlink.pro/movie/id=${id}`}
          allowFullScreen
        />
      )}

      <h3>Cast</h3>
      <CastContainer>
        {cast.map((member) => (
          <CastMember key={member.id} to={`/actor/${member.id}`}>
            <CastImage src={`https://image.tmdb.org/t/p/w200${member.profile_path}`} alt={member.name} />
            <p>{member.name}</p>
          </CastMember>
        ))}
      </CastContainer>

      <h3>Recommendations</h3>
      <RecommendationsContainer>
        {recommendations.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </RecommendationsContainer>
    </MovieContainer>
  );
}

export default MovieDetails;