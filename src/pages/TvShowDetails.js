import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { getTvShowDetails, getTvShowRecommendations, getTvShowCredits, getTvShowExternalIds} from '../services/tmdbApi';
import VideoPlayer from '../components/VideoPlayer';
import MovieCard from '../components/MovieCard';

const fontFamilies = {
  drama: 'Dancing Script, cursive',
  romance: 'Dancing Script, cursive',
  action: 'Bebas Neue, sans-serif',
  adventure: 'Bebas Neue, sans-serif',
  comedy: 'Comic Neue, cursive',
  horror: 'Creepster, cursive',
  thriller: 'Creepster, cursive',
  sciFi: 'Orbitron, sans-serif',
  fantasy: 'Orbitron, sans-serif',
  documentary: 'Roboto Slab, serif',
  animation: 'Permanent Marker, cursive',

  // Additional genres
  mystery: 'Libre Baskerville, serif',
  crime: 'Mukta, sans-serif',
  musical: 'Abril Fatface, cursive',
  family: 'Comfortaa, cursive',
  western: 'Playfair Display, serif',
  war: 'Staatliches, sans-serif',
  history: 'Merriweather, serif',
  biography: 'Lora, serif',
  sport: 'Exo, sans-serif',
  music: 'Fugaz One, cursive',
  talkShow: 'PT Sans, sans-serif',
  reality: 'Raleway, sans-serif',
  kids: 'Bangers, cursive',
};


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

const Title = styled.h2`
  font-family: ${(props) => props.fontFamily};
  font-size: 2.5rem;
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

const WatchOptions = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

// const WatchButton = styled.button`
//   padding: 10px 20px;
//   background-color: ${props => props.active ? '#4CAF50' : '#ddd'};
//   color: ${props => props.active ? 'white' : 'black'};
//   border: none;
//   cursor: pointer;
//   border-radius: 5px;
// `;

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

const EmbedPlayer = styled.iframe`
  width: 100%;
  height: 450px;
  border: none;
`;

function TvShowDetails() {
  const { id } = useParams();
  const [tvShow, setTvShow] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [cast, setCast] = useState([]);
  const [watchOption, setWatchOption] = useState('server1');
  const [externalIds, setExternalIds] = useState(null);

  useEffect(() => {
    const fetchTvShowData = async () => {
      try {
        const [detailsResponse, recommendationsResponse, creditsResponse, externalIdsResponse] = await Promise.all([
          getTvShowDetails(id),
          getTvShowRecommendations(id),
          getTvShowCredits(id),
          getTvShowExternalIds(id)
        ]);

        setTvShow(detailsResponse.data);
        setRecommendations(recommendationsResponse.data.results.slice(0, 20));
        setCast(creditsResponse.data.cast.slice(0, 10));
        setExternalIds(externalIdsResponse.data);
      } catch (error) {
        console.error('Error fetching TV show data:', error);
      }
    };

    fetchTvShowData();
  }, [id]);

  if (!tvShow || !externalIds) return <div>Loading...</div>;

  const currentSeason = tvShow.seasons.find(season => season.season_number === selectedSeason);
  const totalEpisodes = tvShow.seasons.reduce((sum, season) => sum + season.episode_count, 0);

  const embedData = {
    type: "Series",
    title: tvShow.name,
    year: tvShow.first_air_date.split('-')[0],
    poster: `https://image.tmdb.org/t/p/original${tvShow.poster_path}`,
    season: selectedSeason.toString(),
    totalSeasons: tvShow.number_of_seasons.toString(),
    episode: selectedEpisode.toString(),
    totalEpisodes: totalEpisodes.toString(),
    seasonNumber: selectedSeason,
    totalSeasonsNumber: tvShow.number_of_seasons,
    episodeNumber: selectedEpisode,
    totalEpisodesNumber: currentSeason ? currentSeason.episode_count : 0,
    seasonId: currentSeason ? currentSeason.id.toString() : "",
    episodeId: "", // We don't have this information readily available
    tmdbId: tvShow.id.toString(),
    imdbId: externalIds.imdb_id || "",
    runtime: tvShow.episode_run_time[0] || 0
  };

  const genre = tvShow.genres[0]?.name.toLowerCase();
  const fontFamily = fontFamilies[genre] || 'Roboto, sans-serif';

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
          <Title fontFamily={fontFamily}>{tvShow.name}</Title>
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
         <WatchOptions>
        <ServerButton active={watchOption === 'server1'} onClick={() => setWatchOption('server1')}>Server 1</ServerButton>
        <ServerButton active={watchOption === 'server2'} onClick={() => setWatchOption('server2')}>Server 2</ServerButton>
        <ServerButton active={watchOption === 'server3'} onClick={() => setWatchOption('server3')}>Server 3 (4K)</ServerButton>
        <ServerButton active={watchOption === 'server4'} onClick={() => setWatchOption('server4')}>Server 4</ServerButton>
      </WatchOptions>

      {watchOption === 'server1' ? (
        <VideoPlayer imdbId={externalIds.imdb_id} season={selectedSeason} episode={selectedEpisode} />
      ) : watchOption === 'server2' ? (
        <EmbedPlayer 
          src={`https://player.smashy.stream/tv/${tvShow.id}?s=${selectedSeason}&e=${selectedEpisode}`}
          allowFullScreen
        />
      ) : watchOption === 'server3' ? (
        <EmbedPlayer 
          src={`https://embed-testing-v7.vercel.app/tests/sutorimu/${encodeURIComponent(JSON.stringify(embedData))}`}
          allowFullScreen
        />
      ) : (
        <EmbedPlayer 
          src={`https://vidlink.pro/tv/${tvShow.id}/${selectedSeason}/${selectedEpisode}?player=jw&multiLang=true`}
          allowFullScreen
        />
      )}

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