import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchAnimeDetails, fetchEpisodeSources } from '../services/aniWatchApi';
import { FaPlay, FaBook, FaInfoCircle, FaStar, FaCalendar, FaClock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';import AnimePlayer from '../components/AnimePlayer';
import AnimeCard from '../components/AnimeCard';
import LoadingScreen from '../components/LoadingScreen';

const AnimeDetailsContainer = styled.div`
  max-width: 2000px;
  margin: 0 auto;
  padding: 1rem;
  background-color: ${props => props.theme.backgroundSecondary};
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  @media (min-width: 769px) {
    padding: 2rem;
  }
`;

const AnimeHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 769px) {
    flex-direction: row;
    gap: 2rem;
  }
`;

const AnimePoster = styled.img`
  width: 100%;
  max-width: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  margin: 0 auto;

  @media (min-width: 769px) {
    width: 300px;
    margin: 0;
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
  @media (max-width: 768px) {
   font-size: 0.9rem; 
  }
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
const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${props => props.primary ? props.theme.primary : props.theme.secondary};
  background-color: transparent;
  border: 2px solid ${props => props.primary ? props.theme.primary : props.theme.secondary};
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background-color: ${props => props.primary ? props.theme.primary : props.theme.secondary};
    transition: all 0.3s ease;
    z-index: -1;
  }

  &:hover {
    color: ${props => props.theme.background};
    
    &:before {
      left: 0;
    }
  }

  svg {
    margin-right: 0.5rem;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;
const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin: 2rem 0 1rem;
  color: ${props => props.theme.primary};
`;

const EpisodeGrid = styled.div`
  display: none;

  @media (min-width: 769px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
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
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
`;

const PaginationButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.background};
  border: none;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.primaryDark};
  }

  &:disabled {
    background-color: ${props => props.theme.backgroundTertiary};
    cursor: not-allowed;
  }
`;

const TrailerContainer = styled.div`
  margin-top: 2rem;
`;

const TrailerVideo = styled.iframe`
  width: 100%;
  height: 400px;
  border: none;
  border-radius: 8px;
`;

const EpisodeInput = styled.input`
  padding: 0.75rem 1.5rem;
  border: 2px solid ${props => props.theme.primary}40;
  gap: 1000000x;
  border-radius: 8px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.primary}40;
  }
`;

const EpisodeGoButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.background};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.primaryDark};
  }
`;

// Add new styled components
const AnimeCover = styled.div`
  width: 100%;
  height: 400px;
  background-image: url(${props => props.coverImage});
  background-size: cover;
  background-position: center;
  margin-bottom: 2rem;
  border-radius: 16px;
  display: none;

  @media (min-width: 769px) {
    display: block;
  }
`;

const EpisodeContainer = styled.div`
  margin-top: 2rem;
`;

const EpisodeSearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;





const EpisodeNumberGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 0.5rem;

  @media (min-width: 769px) {
    display: none;
  }
`;

const EpisodeNumber = styled.div`
  background-color: ${props => props.theme.backgroundTertiary};
  color: ${props => props.theme.text};
  border-radius: 8px;
  padding: 0.75rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.primary};
    color: ${props => props.theme.background};
  }
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
  const navigate = useNavigate();

  const handleReadNow = () => {
    navigate(`/manga?search=${encodeURIComponent(anime.title.romaji)}`);
  };
 const [currentPage, setCurrentPage] = useState(1);
  const [episodeInput, setEpisodeInput] = useState('');
const cleanHtmlTags = (text) => {
  if (!text) return '';
  return text
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<i>(.*?)<\/i>/g, '_$1_')  // Convert <i> to markdown italic
    .replace(/<b>(.*?)<\/b>/g, '**$1**')  // Convert <b> to markdown bold
    .replace(/<[^>]+>/g, ''); // Remove any remaining HTML tags
};

  const fetchAnimeData = useCallback(async () => {
  try {
    setIsLoading(true);
    setError(null);
    
    if (id === "21") {
      // Only fetch GoGoAnime data for One Piece
      const onePieceResponse = await fetch('https://api-consumet-ten-delta.vercel.app/anime/gogoanime/info/one-piece');
      const onePieceData = await onePieceResponse.json();
      
      // Set anime data using GogoAnime data
      setAnime({
        title: { romaji: onePieceData.title },
        description: onePieceData.description,
        image: onePieceData.image,
        rating: onePieceData.rating * 10, // Assuming GogoAnime rating is out of 10
        releaseDate: onePieceData.releaseDate,
        status: onePieceData.status
      });
      
      if (onePieceData.episodes && onePieceData.episodes.length > 0) {
        const formattedEpisodes = onePieceData.episodes.map(ep => ({
          id: ep.id,
          number: parseInt(ep.number),
          image: onePieceData.image,
          title: `Episode ${ep.number}`
        }));
        setEpisodes(formattedEpisodes);
      }
    } else {
      // Handle other anime normally with AniList
      const anilistData = await fetchAnimeDetails(id);
  setAnime({
    ...anilistData,
    description: cleanHtmlTags(anilistData.description) // Clean description
  });
      
      if (anilistData.episodes && anilistData.episodes.length > 0) {
        const formattedEpisodes = anilistData.episodes.map(ep => ({
          id: ep.id,
          title: ep.title || `Episode ${ep.number}`,
          image: ep.image || anilistData.image,
          number: ep.number,
          description: ep.description
        }));
        setEpisodes(formattedEpisodes);
      }
    }
    
    // Fetch MAL data if not One Piece and if malId is available
    if (id !== "21" && anime?.malId) {
      const malResponse = await fetch(`https://api-consumet-ten-delta.vercel.app/meta/mal/info/${anime.malId}`);
      const malInfo = await malResponse.json();
      
      // Remove episodes from malInfo to avoid overwriting episodes
      const { episodes: _, ...malDataWithoutEpisodes } = malInfo;
      
      setMalData(malDataWithoutEpisodes);
    }
  } catch (error) {
    console.error('Error fetching anime data:', error);
    setError('Failed to load anime data. Please try again later.');
  } finally {
    setIsLoading(false);
  }
}, [id]);

  useEffect(() => {
  fetchAnimeData();
  // Reset states when id changes
  setMalData(null);
  setEpisodes([]);
  setSelectedEpisode(null);
  setIsWatching(false);
  setStreamingData(null);
}, [fetchAnimeData, id]);

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
 
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, Math.ceil(episodes.length / 20)));
  };

  const handleEpisodeInputChange = (e) => {
    setEpisodeInput(e.target.value);
  };

  const handleEpisodeGoClick = () => {
    const episodeNumber = parseInt(episodeInput);
    if (episodeNumber && episodeNumber > 0 && episodeNumber <= episodes.length) {
      const targetEpisode = episodes.find(ep => ep.number === episodeNumber);
      if (targetEpisode) {
        handleEpisodeSelect(targetEpisode);
      }
    }
  };

 if (isLoading) {
  return <LoadingScreen />;
}

  if (error) {
    return <ErrorContainer>{error}</ErrorContainer>;
  }

  if (!anime) {
    return <ErrorContainer>No anime data available.</ErrorContainer>;
  }

  const currentEpisodes = episodes.slice((currentPage - 1) * 20, currentPage * 20);
  return (
    <AnimeDetailsContainer>
    {anime.cover && <AnimeCover coverImage={anime.cover} />}
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
          
          
          
          <ButtonContainer>
          {episodes.length > 0 && (
            <ActionButton primary onClick={() => handleEpisodeSelect(episodes[0])}>
              <FaPlay /> Watch Now
            </ActionButton>
          )}
          {(anime.type === 'NOVEL' || anime.type === 'MANGA' || anime.type === 'ONE_SHOT') && (
            <ActionButton onClick={handleReadNow}>
              <FaBook /> Read Now
            </ActionButton>
          )}
        </ButtonContainer>
        </AnimeInfo>
      </AnimeHeader>

     {episodes.length > 0 && (
      <EpisodeContainer>
        <SectionTitle>Episodes</SectionTitle>
        <EpisodeSearchContainer>
          <EpisodeInput
            type="number"
            placeholder="Go to episode..."
            value={episodeInput}
            onChange={handleEpisodeInputChange}
          />
          <EpisodeGoButton onClick={handleEpisodeGoClick}>Go</EpisodeGoButton>
        </EpisodeSearchContainer>

        {/* Mobile Episode Numbers */}
        <EpisodeNumberGrid>
          {currentEpisodes.map((episode) => (
            <EpisodeNumber
              key={episode.id}
              onClick={() => handleEpisodeSelect(episode)}
            >
              {episode.number}
            </EpisodeNumber>
          ))}
        </EpisodeNumberGrid>

        {/* Desktop Episode Grid */}
        <EpisodeGrid>
          {currentEpisodes.map((episode) => (
            <EpisodeCard key={episode.id} onClick={() => handleEpisodeSelect(episode)}>
              <EpisodeImage src={episode.image} alt={`Episode ${episode.number}`} />
              <EpisodeTitle>Episode {episode.number}</EpisodeTitle>
            </EpisodeCard>
          ))}
        </EpisodeGrid>

        <PaginationContainer>
          <PaginationButton onClick={handlePreviousPage} disabled={currentPage === 1}>
            <FaChevronLeft />
          </PaginationButton>
          <span>Page {currentPage} of {Math.ceil(episodes.length / 20)}</span>
          <PaginationButton 
            onClick={handleNextPage} 
            disabled={currentPage === Math.ceil(episodes.length / 20)}
          >
            <FaChevronRight />
          </PaginationButton>
        </PaginationContainer>
      </EpisodeContainer>
    )}


       {/* Trailer Section */}
      {malData?.trailer && malData.trailer.id && (
        <TrailerContainer>
          <SectionTitle>Trailer</SectionTitle>
          <TrailerVideo
            src={`https://www.youtube.com/embed/${malData.trailer.id}`}
            allowFullScreen
          />
        </TrailerContainer>
      )}

 {/* Related Anime Section */}
      {anime.relations?.length > 0 && (
        <>
          <SectionTitle>Related</SectionTitle>
          <AnimeGrid>
            {anime.relations.map((relation) => (
              <AnimeCard key={relation.id} anime={relation} />
            ))}
          </AnimeGrid>
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

     
      {/* Video Player */}
      {isWatching && streamingData && (
  <AnimePlayer
    title={`${anime.title.romaji} - Episode ${selectedEpisode.number}`}
    posterSrc={anime.image}
    streamingData={streamingData}
    episodeNumber={selectedEpisode.number}
    onClose={() => {
      setIsWatching(false);
      setStreamingData(null);
    }}
    onNextEpisode={() => {
      const nextEpisode = episodes.find(ep => ep.number === selectedEpisode.number + 1);
      if (nextEpisode) {
        handleEpisodeSelect(nextEpisode);
      }
    }}
    onPreviousEpisode={() => {
      const prevEpisode = episodes.find(ep => ep.number === selectedEpisode.number - 1);
      if (prevEpisode) {
        handleEpisodeSelect(prevEpisode);
      }
    }}
    hasNextEpisode={episodes.some(ep => ep.number === selectedEpisode.number + 1)}
    hasPreviousEpisode={episodes.some(ep => ep.number === selectedEpisode.number - 1)}
  />
)}
    </AnimeDetailsContainer>
  );
}

export default AnimeDetails;