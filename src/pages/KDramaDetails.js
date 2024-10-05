import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import KDramaPlayer from '../components/KDramaPlayer';
import { getKDramaInfo, getKDramaEpisode } from '../services/kDramaApi';


const DetailContainer = styled.div`
  padding: 20px;
  max-width: 2000px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;
const HeroContent = styled.div`
  padding: 40px;
  max-width: 800px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  
  @media (max-width: 768px) {
    padding: 15px;
      background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0) 100%);

  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    gap: 8px;
    margin-bottom: 8px;
  }
`;

const MetaItem = styled.span`
  color: ${props => props.theme.text};
  opacity: 0.8;
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const Overview = styled.p`
  font-size: 1rem;
  line-height: 1.4;
  margin-bottom: 15px;
  opacity: 0.9;
  max-height: ${props => props.isExpanded ? 'none' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
    line-height: 1.3;
    margin-bottom: 10px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 6px 12px;
  }
`;

const PlayButton = styled(Button)`
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.primary};
  border-radius: 6px;
  font-family: 'GeistVF';

  &:hover {
    background-color: ${props => props.theme.background};
  }
`;

const InfoButton = styled(Button)`
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.background};
  border-radius: 6px;
  font-family: 'GeistVF';
`;

const Hero = styled.div`
  position: relative;
  height: 80vh;
  background-image: linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.5)), url(${props => props.backdrop});
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    height: 60vh;
    border-radius: 8px;
    margin-bottom: 20px;
  }
`;
const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: ${props => props.theme.primary};

  @media (max-width: 768px) {
    font-size: 1.4rem;
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

const CharacterCard = styled.div`
  text-align: center;
  flex: 0 0 150px;
`;

const CharacterImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 10px;
`;

const CharacterName = styled.h3`
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;
const EpisodeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
    gap: 10px;
  }
`;

const EpisodeCard = styled.div`
  background: ${props => props.theme.secondary};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const EpisodeContent = styled.div`
  padding: 15px;
`;

const EpisodeTitle = styled.h3`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

function KDramaDetails() {
  const location = useLocation();
  const id = location.pathname.split('/kdrama/')[1];
  const [drama, setDrama] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWatching, setIsWatching] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [streamingData, setStreamingData] = useState(null);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    const fetchDramaDetails = async () => {
      try {
        const response = await getKDramaInfo(id);
        setDrama(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching drama details:', error);
        setLoading(false);
      }
    };

    fetchDramaDetails();
  }, [id]);

  const handleEpisodeClick = async (episode) => {
    try {
      const response = await getKDramaEpisode(episode.id, id);
      setStreamingData(response.data);
      setCurrentEpisode(episode);
      setIsWatching(true);
    } catch (error) {
      console.error('Error fetching episode:', error);
    }
  };
   const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };


  if (loading || !drama) return <div>Loading...</div>;

  return (
    <DetailContainer>
      <Hero backdrop={drama.image}>
        <HeroContent>
          <Title>{drama.title}</Title>
          <MetaInfo>
            <MetaItem>{drama.releaseDate}</MetaItem>
            <MetaItem>•</MetaItem>
            <MetaItem>{drama.status}</MetaItem>
            <MetaItem>•</MetaItem>
            <MetaItem>{drama.contentRating}</MetaItem>
          </MetaInfo>
          <Overview isExpanded={isDescriptionExpanded}>{drama.description}</Overview>
          <ButtonContainer>
            <PlayButton onClick={() => handleEpisodeClick(drama.episodes[0])}>
              <FaPlay /> Watch Now
            </PlayButton>
            <InfoButton onClick={toggleDescription}>
              <FaInfoCircle /> {isDescriptionExpanded ? 'Hide Info' : 'More Info'}
            </InfoButton>
          </ButtonContainer>
        </HeroContent>
      </Hero>


      <Section>
        <SectionTitle>Cast</SectionTitle>
        <CastContainer>
          {drama.characters.map((character) => (
            <CharacterCard key={character.name}>
              <CharacterImage src={character.image} alt={character.name} />
              <CharacterName>{character.name}</CharacterName>
            </CharacterCard>
          ))}
        </CastContainer>
      </Section>

      <Section>
        <SectionTitle>Episodes</SectionTitle>
        <EpisodeGrid>
          {drama.episodes.map((episode) => (
            <EpisodeCard key={episode.id} onClick={() => handleEpisodeClick(episode)}>
              <EpisodeContent>
                <EpisodeTitle>
                  <span>Episode {episode.episode}</span>
                  <FaPlay />
                </EpisodeTitle>
              </EpisodeContent>
            </EpisodeCard>
          ))}
        </EpisodeGrid>
      </Section>

      {isWatching && streamingData && (
        <KDramaPlayer
          title={drama.title}
          posterSrc={drama.image}
          streamingData={streamingData}
          onClose={() => setIsWatching(false)}
          onNextEpisode={() => {
            const currentIndex = drama.episodes.findIndex(ep => ep.id === currentEpisode.id);
            if (currentIndex < drama.episodes.length - 1) {
              handleEpisodeClick(drama.episodes[currentIndex + 1]);
            }
          }}
          onPreviousEpisode={() => {
            const currentIndex = drama.episodes.findIndex(ep => ep.id === currentEpisode.id);
            if (currentIndex > 0) {
              handleEpisodeClick(drama.episodes[currentIndex - 1]);
            }
          }}
          hasNextEpisode={drama.episodes.findIndex(ep => ep.id === currentEpisode.id) < drama.episodes.length - 1}
          hasPreviousEpisode={drama.episodes.findIndex(ep => ep.id === currentEpisode.id) > 0}
          episodeNumber={currentEpisode.episode}
        />
      )}
    </DetailContainer>
  );
}

export default KDramaDetails;