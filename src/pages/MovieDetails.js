import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import axios from 'axios';
import { getMovieDetails, getMovieCredits, getMovieRecommendations, getMovieExternalIds } from '../services/tmdbApi';
import VideoPlayer from '../components/VideoPlayer';
import MovieCard from '../components/MovieCard';
import DownloadOption from '../components/DownloadOption';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { FaPlay, FaInfoCircle, FaTimes } from 'react-icons/fa';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

const theme = {
  background: '#141414',
  text: 'white',
  secondary: '#6D6D6E',
};

const GlobalStyle = createGlobalStyle`
  body {
    color: ${props => props.theme.text};
    font-family: 'Netflix Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }
  * {
    -webkit-tap-highlight-color: transparent;
  }
`;

const MovieContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const CustomMediaPlayer = styled(MediaPlayer)`
  --media-brand: ${props => props.theme.background};
  --media-focus-ring-color: ${props => props.theme.primary};
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

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Overview = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
  font-family: 'GeistVF';

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
  font-family: 'GeistVF';

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const RatingItem = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: 'GeistVF';
  svg {
    color: ${props => props.theme.accent};
  }

@media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const InfoItem = styled.p`
  margin: 5px 0;
  font-size: 1rem;
  font-family: 'GeistVF';

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const PlayButton = styled(Button)`
  background-color: ${props => props.theme.text};
  color: ${props => props.theme.background};
  border-radius: 9px;
  @font-face {
    font-family: 'GeistVF';
    src: url('fonts/GeistVF.ttf') format('truetype');
  }
  font-family: 'GeistVF';
`;

const InfoButton = styled(Button)`
  background-color: rgba(109, 109, 110, 0.7);
  color: ${props => props.theme.text};
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
  scrollbar-width: thin;
  scrollbar-color: ${props => props.theme.secondary} ${props => props.theme.background};

  &::-webkit-scrollbar {
    height: 8px;
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
  top: -40px;
  right: 0;
  background: transparent;
  color: ${props => props.theme.text};
  border: none;
  font-size: 2rem;
  cursor: pointer;
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
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  margin-bottom: 10px;
`;

const ServerDropdown = styled.select`
  background-color: ${props => props.theme.secondary};
  color: ${props => props.theme.text};
  border: none;
  padding: 10px;
  font-family: 'GeistVF';
  font-weight: bold;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

const TamilYogiResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;

const TamilYogiResultButton = styled.button`
  padding: 10px;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const LogoImage = styled.img`
  max-width: 300px;
  height: auto;
  margin-bottom: 20px;
`;

const LoadingPlaceholder = styled.div`
  width: 300px;
  height: 100px;
  background-color: #333;
  margin-bottom: 20px;
`;

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [cast, setCast] = useState([]);
  const [externalIds, setExternalIds] = useState(null);
  const [isWatching, setIsWatching] = useState(false);
  const [watchOption, setWatchOption] = useState('server1');
  const [videoSources, setVideoSources] = useState([]);
  const [server4Data, setServer4Data] = useState(null);
  const [tamilYogiResults, setTamilYogiResults] = useState([]);
  const [selectedTamilYogiLink, setSelectedTamilYogiLink] = useState('');
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const videoContainerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [logoUrl, setLogoUrl] = useState('');

  const fetchMovieData = useCallback(async () => {
    try {
      const [detailsResponse, externalIdsResponse] = await Promise.all([
        getMovieDetails(id),
        getMovieExternalIds(id)
      ]);

      setMovie(detailsResponse.data);
      setExternalIds(externalIdsResponse.data);
      setLogoUrl(`https://live.metahub.space/logo/medium/${externalIdsResponse.data.imdb_id}/img`);

      // Fetch additional data after setting the initial movie details
      const [recommendationsResponse, creditsResponse] = await Promise.all([
        getMovieRecommendations(id),
        getMovieCredits(id)
      ]);

      setRecommendations(recommendationsResponse.data.results.slice(0, 20));
      setCast(creditsResponse.data.cast.slice(0, 10));

    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchMovieData();
  }, [fetchMovieData]);


  const fetchVideoSources = useCallback(async (embedUrl) => {
    try {
      const response = await axios.get(embedUrl);
      const html = response.data;
      const sourceMatch = html.match(/src: (\[[^\]]+\])/);
      if (sourceMatch) {
        const sourcesArray = JSON.parse(sourceMatch[1]);
        const formattedSources = sourcesArray.map(source => ({
          src: source.src,
          quality: `${source.height}p`,
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

const calculateEndTime = (startTime, runtime) => {
    const endTime = new Date(startTime.getTime() + runtime * 60000);
    return endTime.toLocaleTimeString();
  };


  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const [detailsResponse, recommendationsResponse, creditsResponse, externalIdsResponse] = await Promise.all([
          getMovieDetails(id),
          getMovieRecommendations(id),
          getMovieCredits(id),
          getMovieExternalIds(id),
        ]);

        setMovie(detailsResponse.data);
        setRecommendations(recommendationsResponse.data.results.slice(0, 20));
        setCast(creditsResponse.data.cast.slice(0, 10));
        setExternalIds(externalIdsResponse.data);

        if (watchOption === 'server3') {
          const embedData = {
            type: "Movie",
            title: detailsResponse.data.title,
            year: detailsResponse.data.release_date.split('-')[0],
            poster: `https://image.tmdb.org/t/p/original${detailsResponse.data.poster_path}`,
            tmdbId: detailsResponse.data.id.toString(),
            imdbId: externalIdsResponse.data.imdb_id || "",
            runtime: detailsResponse.data.runtime,
          };
          const embedUrl = `https://embed-testing-v7.vercel.app/tests/sutorimu/${encodeURIComponent(JSON.stringify(embedData))}`;
          fetchVideoSources(embedUrl);
        }

        if (watchOption === 'tamilyogi') {
          const fetchTamilYogiResults = async () => {
            const searchTerm = detailsResponse.data.title.split(' ').slice(0, 2).join('+');
            const url = `https://simple-proxy.mda2233.workers.dev/?destination=https://tamilyogi.fm/?s=${searchTerm}`;

            try {
              const response = await axios.get(url);
              const parser = new DOMParser();
              const doc = parser.parseFromString(response.data, 'text/html');
              const results = Array.from(doc.querySelectorAll('.ml-item')).slice(0, 5).map(item => ({
                title: item.querySelector('.mli-info h2').textContent,
                link: item.querySelector('a').href
              }));
              setTamilYogiResults(results);
            } catch (error) {
              console.error('Error fetching TamilYogi results:', error);
            }
          };

          fetchTamilYogiResults();
        }
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    fetchMovieData();
  }, [id, watchOption, fetchVideoSources]);

  const fetchServer4Data = useCallback(async () => {
    if (!movie) return;
    try {
      const response = await axios.get(`https://hugo.vidlink.pro/api/movie/${movie.id}?multiLang=1`);
      setServer4Data(response.data);
    } catch (error) {
      console.error('Error fetching server 4 data:', error);
    }
  }, [movie]);

  useEffect(() => {
    if (watchOption === 'server4' && movie) {
      fetchServer4Data();
    }
  }, [watchOption, movie, fetchServer4Data]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        document.body.style.zoom = 1;
        document.body.style.width = '100%';
        if (videoContainerRef.current) {
          videoContainerRef.current.style.width = '100%';
          videoContainerRef.current.style.height = 'auto';
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (!movie || !externalIds) return <div>Loading...</div>;

  const embedData = {
    type: "Movie",
    title: movie.title,
    year: movie.release_date.split('-')[0],
    poster: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
    tmdbId: movie.id.toString(),
    imdbId: externalIds.imdb_id || "",
    runtime: movie.runtime,
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <MovieContainer>
        <Hero backdrop={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}>
          <HeroContent>
           <Suspense fallback={<LoadingPlaceholder />}>
              <LogoImage src={logoUrl} alt={movie.title} />
            </Suspense>
            {!logoUrl && <Title>{movie.title}</Title>}
            {movie.tagline && <Tagline>{movie.tagline}</Tagline>}
            <ButtonGroup>
              <PlayButton onClick={() => {
                setIsWatching(true);
                setWatchOption('server1');
              }}>
                <FaPlay /> Play
              </PlayButton>
              <InfoButton onClick={() => setShowMoreInfo(!showMoreInfo)}>
                <FaInfoCircle /> {showMoreInfo ? 'Less Info' : 'More Info'}
              </InfoButton>
            </ButtonGroup>
            {showMoreInfo && (
              <>
                <Overview>{movie.overview}</Overview>
                <Ratings>
                  <RatingItem>IMDb: {movie.vote_average.toFixed(1)}/10</RatingItem>
                </Ratings>
                <InfoItem>Release Date: {new Date(movie.release_date).toLocaleDateString()}</InfoItem>
                <InfoItem>Runtime: {movie.runtime} minutes</InfoItem>
                <InfoItem>Ends at: {calculateEndTime(currentTime, movie.runtime)}</InfoItem>
              </>
            )}
          </HeroContent>
        </Hero>

        <Suspense fallback={<div>Loading cast...</div>}>
          <Section>
            <SectionTitle>Cast</SectionTitle>
            <CastContainer>
              {cast.map((member) => (
                <CastMember key={member.id} to={`/actor/${member.id}`}>
                  <CastImage 
                    src={member.profile_path ? `https://image.tmdb.org/t/p/w200${member.profile_path}` : '/placeholder.png'} 
                    alt={member.name} 
                  />
                  <CastName>{member.name}</CastName>
                </CastMember>
              ))}
            </CastContainer>
          </Section>
        </Suspense>

        <Suspense fallback={<div>Loading recommendations...</div>}>
          <Section>
            <SectionTitle>More Like This</SectionTitle>
            <RecommendationsContainer>
              {recommendations.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </RecommendationsContainer>
          </Section>
        </Suspense>

        {isWatching && (
          <Backdrop onClick={() => setIsWatching(false)}>
            <VideoContainer ref={videoContainerRef} onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={() => setIsWatching(false)}>
                <FaTimes />
              </CloseButton>
              <ControlsContainer>
                <ServerDropdown value={watchOption} onChange={(e) => setWatchOption(e.target.value)}>
                  <option value="server1">Server 1</option>
                  <option value="server2">Server 2</option>
                  <option value="server3">Server 3 (4K)</option>
                  <option value="server4">Server 4</option>
                  <option value="tamilyogi">TamilYogi</option>
                </ServerDropdown>
              </ControlsContainer>
              {watchOption === 'server1' && (
                <VideoPlayer imdbId={externalIds.imdb_id} />
              )}
              {watchOption === 'server2' && (
                <EmbedPlayer 
                  src={`https://player.smashy.stream/movie/${movie.id}`}
                  allowFullScreen
                />
              )}
              {watchOption === 'server3' && (
                <>
                  <EmbedPlayer 
                    src={`https://embed-testing-v7.vercel.app/tests/sutorimu/${encodeURIComponent(JSON.stringify(embedData))}`}
                    allowFullScreen
                  />
                  <DownloadOption 
                    sources={videoSources}
                    title={movie.title}
                  />
                </>
              )}
              {watchOption === 'server4' && server4Data && (
                <CustomMediaPlayer
                  title={movie.title}
                  src={server4Data.stream.playlist}
                >
                  <MediaProvider>
                    {server4Data.stream.captions
                      .filter(caption => caption.language.toLowerCase().includes('english'))
                      .map((caption, index) => (
                        <track
                          key={index}
                          kind="subtitles"
                          src={caption.url}
                          srcLang="en"
                          label={`English ${index + 1}`}
                          default={index === 0}
                        />
                      ))}
                  </MediaProvider>
                  <DefaultVideoLayout icons={defaultLayoutIcons} />
                </CustomMediaPlayer>
              )}
              {watchOption === 'tamilyogi' && (
                selectedTamilYogiLink ? (
                  <EmbedPlayer src={selectedTamilYogiLink} allowFullScreen />
                ) : (
                  <TamilYogiResultsContainer>
                    {tamilYogiResults.map((result, index) => (
                      <TamilYogiResultButton 
                        key={index} 
                        onClick={() => setSelectedTamilYogiLink(result.link)}
                      >
                        {result.title}
                      </TamilYogiResultButton>
                    ))}
                  </TamilYogiResultsContainer>
                )
              )}
            </VideoContainer>
          </Backdrop>
        )}
      </MovieContainer>
    </ThemeProvider>
  );
}

export default MovieDetails;
