import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { getTvShowDetails, getTvShowRecommendations, getTvShowCredits, getTvShowExternalIds } from '../services/tmdbApi';
import VideoPlayer from '../components/VideoPlayer';
import MovieCard from '../components/MovieCard';
import DownloadOption from '../components/DownloadOption';
import OpenPlayerJS from 'openplayerjs';
import 'openplayerjs/dist/openplayer.css';

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

  @media (max-width: 768px) {
    padding: 5px;
  }
`;

const TvShowInfo = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Poster = styled.img`
  width: 300px;
  height: auto;
  object-fit: cover;
  padding: 20px;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
    padding: 10px;
  }
`;

const Info = styled.div`
  flex: 1;
  min-width: 300px;

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const Title = styled.h2`
  font-family: ${(props) => props.fontFamily};
  font-size: 2.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SelectorsContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 10px;
  }
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
  flex-wrap: wrap;
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

  @media (max-width: 768px) {
    width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
  }
`;

const EmbedPlayer = styled.iframe`
  width: 100%;
  height: 450px;
  border: none;

  @media (max-width: 768px) {
    height: 250px;
  }
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
  const [videoSources, setVideoSources] = useState([]);
  const [server4Data, setServer4Data] = useState(null);
  const playerRef = useRef(null);

  const fetchVideoSources = useCallback(async (embedUrl) => {
    try {
      const response = await axios.get(embedUrl);
      const html = response.data;
      const sourceMatch = html.match(/src: (\[[^\]]+\])/);
      if (sourceMatch) {
        const sourcesArray = JSON.parse(sourceMatch[1]);
        const formattedSources = sourcesArray.map(source => ({
          src: source.src,
          quality: `${source.height}p`
        }));
        setVideoSources(formattedSources);
      } else {
        setVideoSources([]);
      }
    } catch (error) {
      console.error('Error fetching video sources:', error);
      setVideoSources([]);
    }
  }, []);

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

        if (watchOption === 'server3') {
          const currentSeason = detailsResponse.data.seasons.find(season => season.season_number === selectedSeason);
          const totalEpisodes = detailsResponse.data.seasons.reduce((sum, season) => sum + season.episode_count, 0);
          const embedData = {
            type: "Series",
            title: detailsResponse.data.name,
            year: detailsResponse.data.first_air_date.split('-')[0],
            poster: `https://image.tmdb.org/t/p/original${detailsResponse.data.poster_path}`,
            season: selectedSeason.toString(),
            totalSeasons: detailsResponse.data.number_of_seasons.toString(),
            episode: selectedEpisode.toString(),
            totalEpisodes: totalEpisodes.toString(),
            seasonNumber: selectedSeason,
            totalSeasonsNumber: detailsResponse.data.number_of_seasons,
            episodeNumber: selectedEpisode,
            totalEpisodesNumber: currentSeason ? currentSeason.episode_count : 0,
            seasonId: currentSeason ? currentSeason.id.toString() : "",
            episodeId: "",
            tmdbId: detailsResponse.data.id.toString(),
            imdbId: externalIdsResponse.data.imdb_id || "",
            runtime: detailsResponse.data.episode_run_time[0] || 0
          };
          const embedUrl = `https://embed-testing-v7.vercel.app/tests/sutorimu/${encodeURIComponent(JSON.stringify(embedData))}`;
          fetchVideoSources(embedUrl);
        }
      } catch (error) {
        console.error('Error fetching TV show data:', error);
      }
    };

    fetchTvShowData();
  }, [id, watchOption, selectedSeason, selectedEpisode, fetchVideoSources]);

   const fetchServer4Data = useCallback(async () => {
    try {
      const response = await axios.get(`https://hugo.vidlink.pro/api/tv/${tvShow.id}/${selectedSeason}/${selectedEpisode}?multiLang=1`);
      setServer4Data(response.data);
    } catch (error) {
      console.error('Error fetching server 4 data:', error);
    }
  }, [tvShow, selectedSeason, selectedEpisode]);

  useEffect(() => {
    if (watchOption === 'server4' && tvShow) {
      fetchServer4Data();
    }
  }, [watchOption, tvShow, fetchServer4Data]);

    useEffect(() => {
    if (watchOption === 'server4' && server4Data && playerRef.current) {
      const player = new OpenPlayerJS('server4-player', {
        controls: {
          layers: {
            left: ['play', 'time', 'volume'],
            middle: ['progress'],
            right: ['captions', 'settings', 'levels', 'fullscreen'],
          }
        },
        detachMenus: true, // This will create a separate menu for quality levels
      });
      player.init();
  }}, [watchOption, server4Data]);

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
    episodeId: "",
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
        <>
          <EmbedPlayer 
            src={`https://embed-testing-v7.vercel.app/tests/sutorimu/${encodeURIComponent(JSON.stringify(embedData))}`}
            allowFullScreen
          />
          <DownloadOption 
            sources={videoSources}
            title={`${tvShow.name} S${selectedSeason}E${selectedEpisode}`}
          />
        </>
      ) : watchOption === 'server4' && server4Data ? (
        <div>
          <video id="server4-player" className="op-player__media" controls playsInline ref={playerRef}>
            <source src={server4Data.stream.playlist} type="application/x-mpegURL" />
            {server4Data.stream.captions.map((caption, index) => (
              <track 
                key={index}
                kind="captions"
                label={caption.language}
                srcLang={caption.language.toLowerCase()}
                src={caption.url}
                
              />
            ))}
          </video>
        </div>
      ) : null}

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