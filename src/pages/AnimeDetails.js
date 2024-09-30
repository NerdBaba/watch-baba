import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { fetchAnimeDetails, fetchAnimeEpisodes, fetchEpisodeSources } from '../services/aniWatchApi';
import { FaPlay, FaInfoCircle, FaStar, FaCalendar, FaClock } from 'react-icons/fa';
import AnimePlayer from '../components/AnimePlayer';

const AnimeContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
`;

const Hero = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  background: ${props => props.theme.backgroundSecondary};
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const PosterContainer = styled.div`
  flex-shrink: 0;
  width: 250px;
`;

const Poster = styled.img`
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const AnimeInfo = styled.div`
  flex-grow: 1;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: ${props => props.theme.primary};
`;

const Overview = styled.p`
  font-size: 1rem;
  margin-bottom: 20px;
  color: ${props => props.theme.text};
  line-height: 1.6;
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 25px;
`;

const MetaItem = styled.span`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
`;

const Button = styled.button`
  padding: 12px 25px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  font-weight: bold;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const PlayButton = styled(Button)`
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.background};
`;

const InfoButton = styled(Button)`
  background-color: ${props => props.theme.backgroundSecondary};
  color: ${props => props.theme.text};
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin: 40px 0 20px;
  color: ${props => props.theme.primary};
  border-bottom: 2px solid ${props => props.theme.primary};
  padding-bottom: 10px;
`;

const EpisodeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
`;

const EpisodeButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: ${props => props.isSelected ? props.theme.primary : props.theme.backgroundSecondary};
  color: ${props => props.isSelected ? props.theme.background : props.theme.text};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${props => props.isSelected ? 'bold' : 'normal'};

  &:hover {
    background-color: ${props => props.theme.primary};
    color: ${props => props.theme.background};
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const CharactersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
`;

const CharacterCard = styled.div`
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  img {
    width: 100%;
    height: 160px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  p {
    margin-top: 10px;
    font-size: 0.9rem;
    color: ${props => props.theme.text};
  }
`;

const RecommendationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
`;

const RecommendationCard = styled.div`
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  p {
    margin-top: 10px;
    font-size: 0.9rem;
    color: ${props => props.theme.text};
  }
`;

function AnimeDetails() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState('sub');
  const [isWatching, setIsWatching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streamingData, setStreamingData] = useState(null);

  const fetchAnimeData = useCallback(async (retryCount = 0) => {
    try {
      setIsLoading(true);
      const [detailsResponse, episodesResponse] = await Promise.all([
        fetchAnimeDetails(id),
        fetchAnimeEpisodes(id)
      ]);
      setAnime(detailsResponse.anime);
      setEpisodes(episodesResponse.episodes || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching anime data:', error);
      setError('Failed to load anime data. Please try again later.');
      setIsLoading(false);
      if (retryCount < 3) {
        console.log(`Retrying... (Attempt ${retryCount + 1})`);
        setTimeout(() => fetchAnimeData(retryCount + 1), 1000 * (retryCount + 1));
      }
    }
  }, [id]);

  useEffect(() => {
    fetchAnimeData();
  }, [fetchAnimeData]);

  const handleEpisodeSelect = async (episodeNumber) => {
    setSelectedEpisode(episodeNumber);
    setIsWatching(true);
    try {
      const sources = await fetchEpisodeSources(episodes[episodeNumber - 1].episodeId, 'hd-1', selectedAudio);
      setStreamingData(sources);
    } catch (error) {
      console.error('Error fetching episode data:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!anime) return <div>No anime data available.</div>;

  return (
    <AnimeContainer>
      <Hero>
        <PosterContainer>
          <Poster src={anime.info.poster} alt={anime.info.name} />
        </PosterContainer>
        <AnimeInfo>
          <Title>{anime.info.name}</Title>
          <Overview>{anime.info.description}</Overview>
          <MetaInfo>
            <MetaItem><FaStar /> {anime.info.stats.rating}</MetaItem>
            <MetaItem><FaCalendar /> {anime.moreInfo.aired}</MetaItem>
            <MetaItem><FaClock /> {anime.info.stats.duration}</MetaItem>
          </MetaInfo>
          <ButtonGroup>
            <PlayButton onClick={() => handleEpisodeSelect(1)}>
              <FaPlay /> Watch Now
            </PlayButton>
            <InfoButton>
              <FaInfoCircle /> More Info
            </InfoButton>
          </ButtonGroup>
        </AnimeInfo>
      </Hero>

      <SectionTitle>Episodes</SectionTitle>
      <EpisodeGrid>
        {episodes.map((episode) => (
          <EpisodeButton
            key={episode.episodeId}
            onClick={() => handleEpisodeSelect(episode.number)}
            isSelected={selectedEpisode === episode.number}
          >
            Ep {episode.number}
          </EpisodeButton>
        ))}
      </EpisodeGrid>

      {anime.info.charactersVoiceActors && anime.info.charactersVoiceActors.length > 0 && (
        <>
          <SectionTitle>Characters</SectionTitle>
          <CharactersGrid>
            {anime.info.charactersVoiceActors.map((char) => (
              <CharacterCard key={char.character.id}>
                <img src={char.character.poster} alt={char.character.name} />
                <p>{char.character.name}</p>
              </CharacterCard>
            ))}
          </CharactersGrid>
        </>
      )}

      {anime.recommendedAnimes && anime.recommendedAnimes.length > 0 && (
        <>
          <SectionTitle>Recommended Anime</SectionTitle>
          <RecommendationsGrid>
            {anime.recommendedAnimes.map((recommendedAnime) => (
              <RecommendationCard key={recommendedAnime.id}>
                <img src={recommendedAnime.poster} alt={recommendedAnime.name} />
                <p>{recommendedAnime.name}</p>
              </RecommendationCard>
            ))}
          </RecommendationsGrid>
        </>
      )}

      {isWatching && streamingData && (
        <AnimePlayer
          sources={streamingData.sources}
          subtitles={streamingData.subtitles}
          onClose={() => setIsWatching(false)}
          selectedAudio={selectedAudio}
          onAudioChange={setSelectedAudio}
        />
      )}
    </AnimeContainer>
  );
}

export default AnimeDetails;