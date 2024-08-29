import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { getTvShowDetails, getTvShowRecommendations, getTvShowCredits } from '../services/tmdbApi';
import VideoPlayer from '../components/VideoPlayer';
import MovieCard from '../components/MovieCard';

const TvShowContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px;
`;

const TvShowInfo = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Poster = styled.img`
  width: 300px;
  height: auto;
  object-fit: cover;
  padding: 20px
`;

const Info = styled.div`
  flex: 1;
  min-width: 300px;
`;

const SelectorsContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

const SelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  color: #757575;
  margin-bottom: 8px;
`;

const Select = styled.select`
  font-size: 16px;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  background-color: #f5f5f5;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:focus {
    outline: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    background-color: #e0e0e0;
  }
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

function TvShowDetails() {
  const { id } = useParams();
  const [tvShow, setTvShow] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [cast, setCast] = useState([]);

  useEffect(() => {
    getTvShowDetails(id).then((response) => setTvShow(response.data));
    getTvShowRecommendations(id).then((response) => setRecommendations(response.data.results.slice(0, 20)));
    getTvShowCredits(id).then((response) => setCast(response.data.cast.slice(0, 10)));
  }, [id]);

  if (!tvShow) return <div>Loading...</div>;

  const handleSeasonChange = (event) => {
    setSelectedSeason(parseInt(event.target.value));
    setSelectedEpisode(1);
  };

  const handleEpisodeChange = (event) => {
    setSelectedEpisode(parseInt(event.target.value));
  };

  return (
    <TvShowContainer>
      <TvShowInfo>
        <Poster src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`} alt={tvShow.name} />
        <Info>
          <h2>{tvShow.name}</h2>
          <p>{tvShow.overview}</p>
          <p>First Air Date: {tvShow.first_air_date}</p>
          <p>Number of Seasons: {tvShow.number_of_seasons}</p>
          <p>Number of Episodes: {tvShow.number_of_episodes}</p>
          <SelectorsContainer>
            <SelectorWrapper>
              <Label htmlFor="season">Season:</Label>
              <Select id="season" value={selectedSeason} onChange={handleSeasonChange}>
                {[...Array(tvShow.number_of_seasons)].map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </Select>
            </SelectorWrapper>
            <SelectorWrapper>
              <Label htmlFor="episode">Episode:</Label>
              <Select id="episode" value={selectedEpisode} onChange={handleEpisodeChange}>
                {[...Array(tvShow.seasons.find((season) => season.season_number === selectedSeason)?.episode_count || 0)].map(
                  (_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}
                    </option>
                  )
                )}
              </Select>
            </SelectorWrapper>
          </SelectorsContainer>
        </Info>
      </TvShowInfo>
      <h3>Cast</h3>
      <CastContainer>
        {cast.map((member) => (
          <CastMember key={member.id} to={`/actor/${member.id}`}>
            <CastImage 
              src={member.profile_path ? `https://image.tmdb.org/t/p/w200${member.profile_path}` : '/placeholder.png'} 
              alt={member.name} 
            />
            <p>{member.name}</p>
          </CastMember>
        ))}
      </CastContainer>
      <VideoPlayer imdbId={tvShow.id} season={selectedSeason} episode={selectedEpisode} />
      <h3>Recommendations</h3>
      <RecommendationsContainer>
        {recommendations.map((tvShow) => (
          <MovieCard key={tvShow.id} movie={tvShow} />
        ))}
      </RecommendationsContainer>
    </TvShowContainer>
  );
}

export default TvShowDetails;