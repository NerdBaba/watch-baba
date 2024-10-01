import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { fetchAnimeDetails, fetchAnimeEpisodes, fetchEpisodeSources } from '../services/aniWatchApi';
import { FaPlay, FaInfoCircle, FaStar, FaCalendar, FaClock } from 'react-icons/fa';
import AnimePlayer from '../components/AnimePlayer';
import AnimeCard from '../components/AnimeCard';

const AnimeDetailsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${props => props.theme.backgroundSecondary};
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const AnimeHeader = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const AnimePoster = styled.img`
  width: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const AnimeInfo = styled.div`
  flex: 1;
`;

const AnimeTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.primary};
`;

const AnimeDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const AnimeMetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const MetaItem = styled.span`
  background-color: ${props => props.theme.backgroundTertiary};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const AudioToggle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const AudioButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? props.theme.background : props.theme.text};
  border: 1px solid ${props => props.theme.primary};
  cursor: pointer;

  &:first-child {
    border-radius: 4px 0 0 4px;
  }

  &:last-child {
    border-radius: 0 4px 4px 0;
  }
`;

const PlayButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: ${props => props.theme.background};
  background-color: ${props => props.theme.primary};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.primaryDark};
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin: 2rem 0 1rem;
  color: ${props => props.theme.primary};
`;

const EpisodeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const EpisodeCard = styled.div`
  background-color: ${props => props.theme.backgroundTertiary};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const EpisodeImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
`;

const EpisodeTitle = styled.p`
  padding: 0.5rem;
  text-align: center;
`;

const AnimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;



const AnimeImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
`;

const AnimeCardTitle = styled.p`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem;
  font-size: 0.9rem;
  text-align: center;
`;

function AnimeDetails() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [isWatching, setIsWatching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [streamingData, setStreamingData] = useState(null);
  const [error, setError] = useState(null);

  const fetchAnimeData = useCallback(async () => {
    try {
      setIsLoading(true);
      const animeData = await fetchAnimeDetails(id);
      setAnime(animeData);

      // Fetch episodes
      if (animeData.title?.romaji) {
        const gogoData = await fetchAnimeEpisodes(animeData.title.romaji);
        if (gogoData && gogoData.episodes) {
          setEpisodes(gogoData.episodes);
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching anime data:', error);
      setError('Failed to load anime data. Please try again later.');
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAnimeData();
  }, [fetchAnimeData]);

  const handleEpisodeSelect = async (episode) => {
    try {
      setSelectedEpisode(episode);
      setIsWatching(true);
      
      const sources = await fetchEpisodeSources(episode.id);
      setStreamingData(sources);
    } catch (error) {
      console.error('Error fetching episode sources:', error);
      setError('Failed to load episode. Please try again later.');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!anime) return <div>No anime data available.</div>;

  return (
    <AnimeDetailsContainer>
      <AnimeHeader>
        <AnimePoster src={anime.image} alt={anime.title.romaji} />
        <AnimeInfo>
          <AnimeTitle>{anime.title.romaji}</AnimeTitle>
          <AnimeDescription>{anime.description}</AnimeDescription>
          <AnimeMetaInfo>
            <MetaItem><FaStar /> {(anime.rating / 10).toFixed(1)}</MetaItem>
            <MetaItem><FaCalendar /> {anime.releaseDate}</MetaItem>
            {anime.duration && <MetaItem><FaClock /> {anime.duration} min</MetaItem>}
            <MetaItem>{anime.status}</MetaItem>
          </AnimeMetaInfo>
          {episodes.length > 0 && (
            <PlayButton onClick={() => handleEpisodeSelect(episodes[0])}>
              <FaPlay /> Watch Now
            </PlayButton>
          )}
        </AnimeInfo>
      </AnimeHeader>

      {episodes.length > 0 && (
        <>
          <SectionTitle>Episodes</SectionTitle>
          <EpisodeGrid>
            {episodes.map((episode) => (
              <EpisodeCard key={episode.id} onClick={() => handleEpisodeSelect(episode)}>
                <EpisodeImage src={episode.image || anime.image} alt={`Episode ${episode.number}`} />
                <EpisodeTitle>Episode {episode.number}</EpisodeTitle>
              </EpisodeCard>
            ))}
          </EpisodeGrid>
        </>
      )}

      {anime.recommendations?.length > 0 && (
        <>
          <SectionTitle>Recommendations</SectionTitle>
          <AnimeGrid>
            {anime.recommendations.map((rec) => (
              <AnimeCard key={rec.id} anime={rec} />
            ))}
          </AnimeGrid>
        </>
      )}

      {anime.relations?.length > 0 && (
        <>
          <SectionTitle>Related Anime</SectionTitle>
          <AnimeGrid>
            {anime.relations.map((relation) => (
              <AnimeCard key={relation.id} anime={relation} />
            ))}
          </AnimeGrid>
        </>
      )}

      {isWatching && streamingData && (
        <AnimePlayer
          title={`${anime.title.romaji} - Episode ${selectedEpisode.number}`}
          posterSrc={anime.image}
          streamingData={streamingData}
          onClose={() => {
            setIsWatching(false);
            setStreamingData(null);
          }}
        />
      )}
    </AnimeDetailsContainer>
  );
}

export default AnimeDetails;