import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { fetchAnimeDetails, fetchEpisodeSources } from '../services/aniWatchApi';
import { FaPlay, FaInfoCircle, FaStar, FaCalendar, FaClock } from 'react-icons/fa';
import AnimePlayer from '../components/AnimePlayer';
import AnimeCard from '../components/AnimeCard';

const AnimeDetailsContainer = styled.div`
  max-width: 2000px;
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

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const AnimePoster = styled.img`
  width: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
`;

const AnimeInfo = styled.div`
  flex: 1;
`;

const AnimeTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.primary};

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const AnimeDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
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
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MetaInfo = styled.div`
  margin-bottom: 1rem;
`;

const MetaLabel = styled.span`
  font-weight: bold;
  margin-right: 0.5rem;
  color: ${props => props.theme.primary};
`;

const SongList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
`;

const SongItem = styled.li`
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
  color: ${props => props.theme.text};
`;

const AudioToggle = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const AudioButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? props.theme.background : props.theme.text};
  border: 1px solid ${props => props.theme.primary};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.active ? props.theme.primaryDark : props.theme.backgroundTertiary};
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
  color: ${props => props.theme.text};
  font-size: 0.9rem;
`;

const AnimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: ${props => props.theme.primary};
`;

const ErrorContainer = styled.div`
  color: ${props => props.theme.error};
  text-align: center;
  padding: 1rem;
`;

function AnimeDetails() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [malData, setMalData] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [isWatching, setIsWatching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [streamingData, setStreamingData] = useState(null);
  const [error, setError] = useState(null);
  const [audioType, setAudioType] = useState('sub');

  const fetchAnimeData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch AniList data
      const anilistData = await fetchAnimeDetails(id);
      setAnime(anilistData);
      
      // Fetch MAL data using the MAL ID
      if (anilistData.malId) {
        const malResponse = await fetch(`https://api-consumet-ten-delta.vercel.app/meta/mal/info/${anilistData.malId}`);
        const malInfo = await malResponse.json();
        setMalData(malInfo);
        
        // Prepare episode data
        if (malInfo.episodes && malInfo.episodes.length > 0) {
          const formattedEpisodes = malInfo.episodes.map(ep => ({
            id: `${anilistData.title.romaji.toLowerCase().replace(/\s+/g, '-')}${audioType === 'dub' ? '-dub' : ''}-episode-${ep.number}`,
            title: ep.title || `Episode ${ep.number}`,
            image: ep.image || anilistData.image,
            number: ep.number,
            description: ep.description
          }));
          setEpisodes(formattedEpisodes);
        }
      }
    } catch (error) {
      console.error('Error fetching anime data:', error);
      setError('Failed to load anime data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [id, audioType]);

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

  const handleAudioToggle = (type) => {
    setAudioType(type);
    setEpisodes([]); // Clear episodes to reload with new audio type
  };

  if (isLoading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>{error}</ErrorContainer>;
  }

  if (!anime) {
    return <ErrorContainer>No anime data available.</ErrorContainer>;
  }

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
          
          {/* Studios and Producers */}
          {malData?.studios && malData.studios.length > 0 && (
            <MetaInfo>
              <MetaLabel>Studios:</MetaLabel>
              {malData.studios.join(', ')}
            </MetaInfo>
          )}
          {malData?.producers && malData.producers.length > 0 && (
            <MetaInfo>
              <MetaLabel>Producers:</MetaLabel>
              {malData.producers.join(', ')}
            </MetaInfo>
          )}
          
          {/* Opening/Ending Songs */}
          {malData?.openings && malData.openings.length > 0 && (
            <MetaInfo>
              <MetaLabel>Openings:</MetaLabel>
              <SongList>
                {malData.openings.map((opening, index) => (
                  <SongItem key={index}>
                    {opening.name} - {opening.band} {opening.episodes && `(${opening.episodes})`}
                  </SongItem>
                ))}
              </SongList>
            </MetaInfo>
          )}
          
          {/* Audio Toggle */}
          <AudioToggle>
            <AudioButton active={audioType === 'sub'} onClick={() => handleAudioToggle('sub')}>SUB</AudioButton>
            <AudioButton active={audioType === 'dub'} onClick={() => handleAudioToggle('dub')}>DUB</AudioButton>
          </AudioToggle>
          
          {episodes.length > 0 && (
            <PlayButton onClick={() => handleEpisodeSelect(episodes[0])}>
              <FaPlay /> Watch Now
            </PlayButton>
          )}
        </AnimeInfo>
      </AnimeHeader>

      {/* Episodes Section */}
      {episodes.length > 0 && (
        <>
          <SectionTitle>Episodes</SectionTitle>
          <EpisodeGrid>
            {episodes.map((episode) => (
              <EpisodeCard key={episode.id} onClick={() => handleEpisodeSelect(episode)}>
                <EpisodeImage src={episode.image} alt={`Episode ${episode.number}`} />
                <EpisodeTitle>Episode {episode.number}: {episode.title}</EpisodeTitle>
              </EpisodeCard>
            ))}
          </EpisodeGrid>
        </>
      )}

      {/* Recommendations Section */}
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

      {/* Related Anime Section */}
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

      {/* Video Player */}
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