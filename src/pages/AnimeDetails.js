import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchAnimeDetails, fetchAnimeRecommendations, fetchAnimeCharacters, fetchAnimeEpisodes } from '../services/jikanApi';
import { fetchAnilistData } from '../services/anilistApi';
import VideoPlayer from '../components/VideoPlayer';
import AnimeCard from '../components/AnimeCard';
import { FaPlay, FaInfoCircle, FaTimes } from 'react-icons/fa';

const AnimeContainer = styled.div`
  width: 100%;
  max-width: 1400px; // Adjust this value as needed
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;


const Hero = styled.div`
  position: relative;
  height: 80vh;
  background-image: url(${props => props.backdrop});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding: 40px;

  @media (max-width: 768px) {
    height: 60vh;
    padding: 20px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, rgba(20,20,20,0.8) 0%, rgba(20,20,20,0) 60%, rgba(20,20,20,0.8) 100%);
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 50%;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2px;
font-family: 'GeistVF';
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Overview = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: white;
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1.1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 8px 16px;
  }
`;
const Tagline = styled.p`
  font-style: italic;
  color: white;
  margin-bottom: 10px;
`;

const Ratings = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  color: white;
`;

const RatingItem = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  
  svg {
    color: ${props => props.theme.accent};
  }
`;
const PlayButton = styled(Button)`
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.primary};
  border-radius: 9px;
  @font-face {
    font-family: 'GeistVF';
    src: url('fonts/GeistVF.ttf') format('truetype');
  }
  font-family: 'GeistVF';

  &:hover {
      background-color: ${props => props.theme.background};
    }
`;

const InfoButton = styled(Button)`
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.background};
  border-radius: 9px;
  font-family: 'GeistVF';
`;

const Section = styled.section`
  margin: 40px 0;
  width: 100%;

  @media (max-width: 768px) {
    margin: 20px 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CastContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 20px;
  padding: 20px 0;

  &::-webkit-scrollbar {
    height: 0px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.background};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.secondary};
    border-radius: 20px;
    border: 3px solid ${props => props.theme.background};
  }
`;

const CastMember = styled(Link)`
  text-align: center;
  width: 120px;
  flex-shrink: 0;
  text-decoration: none;
  color: inherit;

  @media (max-width: 768px) {
    width: 100px;
  }
`;

const CastImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const CastName = styled.p`
  font-size: 0.9rem;
  margin: 0;
  color: ${props => props.theme.primary};

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const RecommendationsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
  cursor: pointer;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 90%;
  max-width: 1200px;
  aspect-ratio: 16 / 9;


  @media (min-width: 768px) and (max-width: 1024px) {
    width: 95%;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: -50px;
  padding-bottom: 4px;
  right: 0;
  background: transparent;
  color: ${props => props.theme.primary};
  border: none;
  font-size: 2rem;
  cursor: pointer;

   &:hover {
      background-color: ${props => props.theme.background};
    }
`;
const EmbedPlayer = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  aspect-ratio: 16 / 9;

  @media (max-width: 768px) {
    height: 56.25vw;
  }

   @media (max-width: 1024px) {
    height: 56.25vw;
  }
`;
const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.0);
  border-radius: 5px;
  margin-bottom: 10px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const Select = styled.select`
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.primary};
  border: none;
  padding: 10px;
  font-family: 'GeistVF';
  font-weight: bold;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 10px;
  width: 100%;

  &:focus {
    outline: none;
  }

  @media (min-width: 768px) {
    width: auto;
    margin-bottom: 0;
    margin-right: 10px;
  }
`;



const ServerDropdown = styled(Select)`
  // margin-left: 10px;
  font-family: 'GeistVF';

  @media (min-width: 768px) {
    margin-right: 0;
  }
`;

const CharactersContainer = styled(CastContainer)``;

const CharacterCard = styled(CastMember)``;

const EpisodesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const EpisodeCard = styled.div`
  background-color: ${props => props.theme.background};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const EpisodeImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
`;

const EpisodeInfo = styled.div`
  padding: 10px;
`;

const EpisodeTitle = styled.h3`
  font-size: 1rem;
  margin: 0 0 5px 0;
`;

const EpisodeDescription = styled.p`
  font-size: 0.8rem;
  color: ${props => props.theme.secondary};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

function AnimeDetails() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [selectedAudio, setSelectedAudio] = useState('sub');
  const [isWatching, setIsWatching] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [watchOption, setWatchOption] = useState('server1');
  const [backdrop, setBackdrop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchAnimeData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [detailsResponse, recommendationsResponse, charactersResponse, episodesResponse] = await Promise.all([
          fetchAnimeDetails(id),
          fetchAnimeRecommendations(id),
          fetchAnimeCharacters(id),
          fetchAnimeEpisodes(id)
        ]);

        setAnime(detailsResponse.data);
        setRecommendations(recommendationsResponse.data?.recommendations?.slice(0, 10) || []);
        setCharacters(charactersResponse.data?.characters?.slice(0, 10) || []);
        setEpisodes(episodesResponse.data?.episodes || []);

        // Fetch AniList backdrop
        const anilistData = await fetchAnilistData(detailsResponse.data.title);
        if (anilistData && anilistData.bannerImage) {
          setBackdrop(anilistData.bannerImage);
        } else {
          setBackdrop(detailsResponse.data.images?.webp?.large_image_url || detailsResponse.data.images?.jpg?.large_image_url);
        }
      } catch (error) {
        console.error('Error fetching anime data:', error);
        setError('Failed to load anime data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimeData();
  }, [id]);

if (isLoading) return <div>Loading...</div>;
if (error) return <div>{error}</div>;
if (!anime) return <div>No anime data available.</div>;

  return (
    <AnimeContainer>
      <Hero banner={anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url}>
        <HeroContent>
          <Title>{anime.title}</Title>
          {showMoreInfo && (
            <>
              <Overview>{anime.synopsis}</Overview>
              <Ratings>
                <RatingItem>Score: {anime.score}</RatingItem>
                <RatingItem>Rank: {anime.rank}</RatingItem>
                <RatingItem>Popularity: {anime.popularity}</RatingItem>
              </Ratings>
            </>
          )}
          <ButtonGroup>
            <PlayButton onClick={() => setIsWatching(true)}>
              <FaPlay /> Play
            </PlayButton>
            <InfoButton onClick={() => setShowMoreInfo(!showMoreInfo)}>
              <FaInfoCircle /> {showMoreInfo ? 'Less Info' : 'More Info'}
            </InfoButton>
          </ButtonGroup>
        </HeroContent>
      </Hero>

      <Section>
        <SectionTitle>Characters</SectionTitle>
        <CharactersContainer>
          {characters.map((character) => (
            <CharacterCard key={character.character.mal_id}>
              <CastImage 
                src={character.character.images.jpg.image_url} 
                alt={character.character.name} 
              />
              <CastName>{character.character.name}</CastName>
            </CharacterCard>
          ))}
        </CharactersContainer>
      </Section>

      <Section>
        <SectionTitle>Episodes</SectionTitle>
        <EpisodesContainer>
          {episodes.map((episode) => (
            <EpisodeCard key={episode.mal_id} onClick={() => {
              setSelectedEpisode(episode.mal_id);
              setIsWatching(true);
            }}>
              <EpisodeImage src={episode.images.jpg.image_url} alt={episode.title} />
              <EpisodeInfo>
                <EpisodeTitle>Episode {episode.episode}</EpisodeTitle>
                <EpisodeDescription>{episode.synopsis}</EpisodeDescription>
              </EpisodeInfo>
            </EpisodeCard>
          ))}
        </EpisodesContainer>
      </Section>

      <Section>
        <SectionTitle>Recommendations</SectionTitle>
        <RecommendationsContainer>
          {recommendations.map((recommendation) => (
            <AnimeCard key={recommendation.entry.mal_id} anime={recommendation.entry} />
          ))}
        </RecommendationsContainer>
      </Section>

      {isWatching && (
        <Backdrop onClick={() => setIsWatching(false)}>
          <VideoContainer onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setIsWatching(false)}>
              <FaTimes />
            </CloseButton>
            <ControlsContainer>
              <Select value={selectedAudio} onChange={(e) => setSelectedAudio(e.target.value)}>
                <option value="sub">Sub</option>
                <option value="dub">Dub</option>
              </Select>
              <ServerDropdown value={watchOption} onChange={(e) => setWatchOption(e.target.value)}>
                <option value="server1">Server 1</option>
                <option value="server2">Server 2 (Gogoanime)</option>
                <option value="server3">Server 3 (Zoro)</option>
                <option value="server4">Server 4 (9anime)</option>
              </ServerDropdown>
            </ControlsContainer>
            {watchOption === 'server1' && (
              <VideoPlayer malId={anime.mal_id} episode={selectedEpisode} audio={selectedAudio} />
            )}
            {watchOption === 'server2' && (
              <EmbedPlayer 
                src={`https://api-consumet-ten-delta.vercel.app/anime/gogoanime/watch/${anime.title}-episode-${selectedEpisode}?server=gogocdn`}
                allowFullScreen
              />
            )}
            {watchOption === 'server3' && (
              <EmbedPlayer 
                src={`https://api-consumet-ten-delta.vercel.app/anime/zoro/watch?episodeId=${selectedEpisode}&id=${anime.mal_id}`}
                allowFullScreen
              />
            )}
            {watchOption === 'server4' && (
              <EmbedPlayer 
                src={`https://api-consumet-ten-delta.vercel.app/anime/9anime/watch/${anime.mal_id}?episodeNumber=${selectedEpisode}`}
                allowFullScreen
              />
            )}
          </VideoContainer>
        </Backdrop>
      )}
    </AnimeContainer>
  );
}

export default AnimeDetails;