import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { getKDramaInfo, getKDramaEpisode } from '../services/kDramaApi';
import KDramaPlayer from '../components/KDramaPlayer'

const DetailContainer = styled.div`
  padding: 20px;
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
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
`;

const EpisodeList = styled.div`
  margin-top: 40px;
`;

const Episode = styled.div`
  padding: 10px;
  border-bottom: 1px solid ${props => props.theme.secondary};
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.secondary};
  }
`;


function KDramaDetails() {
  const location = useLocation();
  const id = location.pathname.split('/kdrama/')[1];
  const [drama, setDrama] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWatching, setIsWatching] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [streamingData, setStreamingData] = useState(null);

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

  if (loading || !drama) return <div>Loading...</div>;

  return (
    <DetailContainer>
      <Hero backdrop={drama.image}>
        <HeroContent>
          <Title>{drama.title}</Title>
          <Overview>{drama.description}</Overview>
        </HeroContent>
      </Hero>
      <EpisodeList>
        <h2>Episodes</h2>
        {drama.episodes.map((episode) => (
          <Episode key={episode.id} onClick={() => handleEpisodeClick(episode)}>
            {episode.title || `Episode ${episode.number}`}
          </Episode>
        ))}
      </EpisodeList>

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
          episodeNumber={currentEpisode.number}
        />
      )}
    </DetailContainer>
  );
}

export default KDramaDetails;