// pages/MovieDetails.js
import React, { useState, useEffect} from 'react';
import axios from 'axios';
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

const ServerButton = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.active ? props.theme.primary : props.theme.background};
  color: ${props => props.active ? props.theme.background : props.theme.text};
  border: 1px solid ${props => props.theme.primary};
  cursor: pointer;
  border-radius: 5px;
  margin-right: 10px;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
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




const EmbedPlayer = styled.iframe`
  width: 100%;
  height: 450px;
  border: none;
`;



const TamilYogiResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;

const TamilYogiResultButton = styled.button`
  padding: 10px;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;



function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [watchOption, setWatchOption] = useState('server1');
  const [tamilYogiResults, setTamilYogiResults] = useState([]);
  const [selectedTamilYogiLink, setSelectedTamilYogiLink] = useState('');

  useEffect(() => {
    getMovieDetails(id).then((response) => setMovie(response.data));
    getMovieCredits(id).then((response) => setCast(response.data.cast.slice(0, 10)));
    getMovieRecommendations(id).then((response) => setRecommendations(response.data.results.slice(0, 20)));
  }, [id]);

   const fetchTamilYogiResults = async () => {
    if (!movie) return;
    const searchTerm = movie.title.split(' ').slice(0, 2).join('+');
    const url = `https://simple-proxy.mda2233.workers.dev/?destination=https://tamilyogi.fm/?s=${searchTerm}`;
    
    try {
      const response = await axios.get(url);
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data, 'text/html');
      const results = Array.from(doc.querySelectorAll('.ml-item')).slice(0, 5).map(item => ({
        title: item.querySelector('.mli-info h2').textContent,
        link: item.querySelector('a').href
      }));
      setTamilYogiResults(results);
    } catch (error) {
      console.error('Error fetching TamilYogi results:', error);
    }
  };

   useEffect(() => {
  if (watchOption === 'tamilyogi') {
    fetchTamilYogiResults();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [watchOption, movie]);


  const renderPlayer = () => {
  switch(watchOption) {
    case 'server1':
      return <VideoPlayer imdbId={movie.imdb_id || id} />;
    case 'server2':
      return (
        <EmbedPlayer 
          src={`https://player.smashy.stream/movie/${id}`}
          allowFullScreen
        />
      );
    case 'server3':
      return (
        <EmbedPlayer 
          src={`https://embed-testing-v7.vercel.app/tests/sutorimu/${encodeURIComponent(JSON.stringify({
            type: "Movie",
            title: movie.title,
            year: movie.release_date.split('-')[0],
            poster: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
            tmdbId: movie.id.toString(),
            imdbId: movie.imdb_id,
            runtime: movie.runtime
          }))}`}
          allowFullScreen
        />
      );
    case 'server4':
      return (
        <EmbedPlayer 
          src={`https://vidlink.pro/movie/${movie.id}?player=jw&multiLang=true`}
          allowFullScreen
        />
      );
    case 'tamilyogi':
      return selectedTamilYogiLink ? (
        <EmbedPlayer src={selectedTamilYogiLink} allowFullScreen />
      ) : (
        <TamilYogiResultsContainer>
          {tamilYogiResults.map((result, index) => (
            <TamilYogiResultButton 
              key={index} 
              onClick={() => setSelectedTamilYogiLink(result.link)}
            >
              {result.title}
            </TamilYogiResultButton>
          ))}
        </TamilYogiResultsContainer>
      );
    default:
      return null;
  }
};


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
  <ServerButton active={watchOption === 'server1'} onClick={() => setWatchOption('server1')}>Server 1</ServerButton>
  <ServerButton active={watchOption === 'server2'} onClick={() => setWatchOption('server2')}>Server 2</ServerButton>
  <ServerButton active={watchOption === 'server3'} onClick={() => setWatchOption('server3')}>Server 3 (4K)</ServerButton>
  <ServerButton active={watchOption === 'server4'} onClick={() => setWatchOption('server4')}>Server 4</ServerButton>
  <ServerButton active={watchOption === 'tamilyogi'} onClick={() => setWatchOption('tamilyogi')}>TamilYogi</ServerButton>
</WatchOptions>

      {renderPlayer()}

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