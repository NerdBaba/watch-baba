import React, { useState, useEffect, useCallback, useRef} from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { getTvShowDetails, getTvShowRecommendations, getTvShowCredits, getTvShowExternalIds, getTvShowEpisodeDetails  } from '../services/tmdbApi';
import VideoPlayer from '../components/VideoPlayer';
import MovieCard from '../components/MovieCard';
// import DownloadOption from '../components/DownloadOption';
import { FaPlay, FaInfoCircle, FaTimes} from 'react-icons/fa';


const TvShowContainer = styled.div`
  width: 100%;
  max-width: 2000px; // Adjust this value as needed
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

const LogoImage = styled.img`
  max-width: 300px;
  height: auto;
  margin-bottom: 20px;

  @media (max-width: 768px) {
   max-width: 200px; 
   height: auto;
  }
`;


const AdBlockedIframe = ({ src, allowFullScreen }) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    const checkDomain = () => {
      const blockedDomains = [
        'example-ad-domain.com',
        'another-ad-domain.com',
        // Add more blocked domains here
      ];
      const url = new URL(src);
      if (blockedDomains.some(domain => url.hostname.includes(domain))) {
        setIsBlocked(true);
      } else {
        setIsBlocked(false);
      }
    };

    checkDomain();

    const observer = new MutationObserver(() => {
      if (iframeRef.current) {
        checkDomain();
      }
    });

    if (iframeRef.current) {
      observer.observe(iframeRef.current, { attributes: true, attributeFilter: ['src'] });
    }

    return () => observer.disconnect();
  }, [src]);

  if (isBlocked) {
    return null; // Return nothing if the domain is blocked
  }

  return (
    <iframe
      ref={iframeRef}
      src={src}
      allowFullScreen={allowFullScreen}
      sandbox="allow-same-origin allow-scripts allow-forms allow-presentation"
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  );
};


function TvShowDetails() {
  const { id } = useParams();
  const [tvShow, setTvShow] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [cast, setCast] = useState([]);
  const [externalIds, setExternalIds] = useState(null);
  const [isWatching, setIsWatching] = useState(false);
  const [watchOption, setWatchOption] = useState('server1');
  const [videoSources, setVideoSources] = useState([]);
  const [episodeId, setEpisodeId] = useState(null);
    const [logoUrl, setLogoUrl] = useState('');
  // const playerRef = useRef(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  

  // ... (keep all the existing useEffect and useCallback functions)

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

   useEffect(() => {
    const fetchTvShowData = async () => {
      try {
        const [detailsResponse, recommendationsResponse, creditsResponse, externalIdsResponse] = await Promise.all([
          getTvShowDetails(id),
          getTvShowRecommendations(id),
          getTvShowCredits(id),
          getTvShowExternalIds(id),
        ]);

        setTvShow(detailsResponse.data);
        setRecommendations(recommendationsResponse.data.results.slice(0, 20));
        setCast(creditsResponse.data.cast.slice(0, 10));
        setExternalIds(externalIdsResponse.data);

        if (externalIdsResponse.data.imdb_id) {
          setLogoUrl(`https://live.metahub.space/logo/medium/${externalIdsResponse.data.imdb_id}/img`);
        }

        // The specified snippet has been removed from here

      } catch (error) {
        console.error('Error fetching TV show data:', error);
      }
    };

    fetchTvShowData();
  }, [id, watchOption, selectedSeason, selectedEpisode, fetchVideoSources]);
 


 //episode id

  useEffect(() => {
    const fetchEpisodeDetails = async () => {
      if (watchOption === 'server8') {
        try {
          const episodeResponse = await getTvShowEpisodeDetails(id, selectedSeason, selectedEpisode);
          setEpisodeId(episodeResponse.data.id);
        } catch (error) {
          console.error('Error fetching episode details:', error);
        }
      }
    };

    fetchEpisodeDetails();
  }, [id, watchOption, selectedSeason, selectedEpisode]);





// Fullscreen Fix For Mobiles
  const videoContainerRef = useRef(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        // Exiting fullscreen
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


  const fetchMegacloudHash = async (title, year, tmdbId, mediaType, seasonId = 1, episodeId = 1) => {
  try {
    const encodedTitle = encodeURIComponent(title);
    const url = `https://api.braflix.gd/megacloud/sources-with-title?title=${encodedTitle}&year=${year}&mediaType=${mediaType}&episodeId=${episodeId}&seasonId=${seasonId}&tmdbId=${tmdbId}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching Megacloud hash:', error);
    return null;
  }
};


const [megacloudHash, setMegacloudHash] = useState(null);

useEffect(() => {
  const fetchHash = async () => {
    if (watchOption === 'server11' && tvShow) {
      const year = new Date(tvShow.first_air_date).getFullYear();
      const hash = await fetchMegacloudHash(
        tvShow.name, 
        year, 
        tvShow.id, 
        'tv', 
        selectedSeason,
        selectedEpisode
      );
      setMegacloudHash(hash);
    }
  };
  
  fetchHash();
}, [watchOption, tvShow, selectedSeason, selectedEpisode]);


  useEffect(() => {
  if (watchOption === 'server11') {
    setMegacloudHash(null);
    const fetchHash = async () => {
      if (tvShow) {
        const year = new Date(tvShow.first_air_date).getFullYear();
        const hash = await fetchMegacloudHash(
          tvShow.name, 
          year, 
          tvShow.id, 
          'tv', 
          selectedSeason,
          selectedEpisode
        );
        setMegacloudHash(hash);
      }
    };
    fetchHash();
  }
}, [selectedSeason, selectedEpisode, watchOption, tvShow]);

  if (!tvShow || !externalIds) return <div>Loading...</div>;

  // const embedData = {
  //   type: "Series",
  //   title: tvShow.name,
  //   year: tvShow.first_air_date.split('-')[0],
  //   poster: `https://image.tmdb.org/t/p/original${tvShow.poster_path}`,
  //   season: selectedSeason.toString(),
  //   totalSeasons: tvShow.number_of_seasons.toString(),
  //   episode: selectedEpisode.toString(),
  //   totalEpisodes: tvShow.seasons.reduce((sum, season) => sum + season.episode_count, 0).toString(),
  //   seasonNumber: selectedSeason,
  //   totalSeasonsNumber: tvShow.number_of_seasons,
  //   episodeNumber: selectedEpisode,
  //   totalEpisodesNumber: tvShow.seasons.find(season => season.season_number === selectedSeason)?.episode_count || 0,
  //   seasonId: tvShow.seasons.find(season => season.season_number === selectedSeason)?.id.toString() || "",
  //   episodeId: "",
  //   tmdbId: tvShow.id.toString(),
  //   imdbId: externalIds.imdb_id || "",
  //   runtime: tvShow.episode_run_time[0] || 0,
  // };



  return (
      <TvShowContainer>
        <Hero backdrop={`https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`}>
    <HeroContent>
   
   {logoUrl ? (
              <LogoImage src={logoUrl} alt={tvShow.name} onError={() => setLogoUrl('')} />
            ) : (
              <Title>{tvShow.name}</Title>
            )}
  {tvShow.tagline && <Tagline>{tvShow.tagline}</Tagline>}
  {showMoreInfo && (
    <>
      <Overview>{tvShow.overview}</Overview>
      <Ratings>
        <RatingItem>⭐ {tvShow.vote_average.toFixed(1)}/10</RatingItem>
        {tvShow.external_ids?.imdb_id && (
          <RatingItem>
            Rotten Tomatoes: {/* Fetch Rotten Tomatoes rating */}
          </RatingItem>
        )}
      </Ratings>
    </>
  )}
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
</HeroContent>
        </Hero>

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

        <Section>
          <SectionTitle>More Like This</SectionTitle>
          <RecommendationsContainer>
            {recommendations.map((tvShow) => (
              <MovieCard key={tvShow.id} movie={tvShow} />
            ))}
          </RecommendationsContainer>
        </Section>

        {isWatching && (
          <Backdrop onClick={() => setIsWatching(false)}>
           <VideoContainer ref={videoContainerRef} onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={() => setIsWatching(false)}>
                <FaTimes />
              </CloseButton>
              <ControlsContainer>
                <Select value={selectedSeason} onChange={(e) => setSelectedSeason(Number(e.target.value))}>
                  {tvShow.seasons.map((season) => (
                    <option key={season.id} value={season.season_number}>
                      Season {season.season_number}
                    </option>
                  ))}
                </Select>
                <Select value={selectedEpisode} onChange={(e) => setSelectedEpisode(Number(e.target.value))}>
                  {[...Array(tvShow.seasons.find(s => s.season_number === selectedSeason)?.episode_count || 0)].map((_, index) => (
                    <option key={index} value={index + 1}>
                      Episode {index + 1}
                    </option>
                  ))}
                </Select>
                <ServerDropdown value={watchOption} onChange={(e) => setWatchOption(e.target.value)}>
                  <option value="server1">Server 1</option>
                  <option value="server2">Server 2</option>
                  <option value="server3">Server 3.1</option>
                  <option value="server32">Server 3.2</option>
                  <option value="server4">Server 4</option>
                  <option value="server5">Server 5</option>
                  <option value="server6">Server 6</option>
                  <option value="server7">Server 7 (Ads)</option>
                  <option value="server8">Server 8</option>
                  <option value="server9">Server 9</option>
                  <option value="server10">Server 10</option>
                  <option value="server11">Server 11</option>
                  <option value="server12">Server 12 (Ads) </option>
                </ServerDropdown>
              </ControlsContainer>
              {watchOption === 'server1' && (
                <VideoPlayer tmdbId={tvShow.id} season={selectedSeason} episode={selectedEpisode} />
              )}
              {watchOption === 'server2' && (
                <EmbedPlayer 
                  src={`https://player.smashy.stream/tv/${tvShow.id}?s=${selectedSeason}&e=${selectedEpisode}`}
                  allowFullScreen
                />
              )}
              {watchOption === 'server5' && (
                <>
                  <AdBlockedIframe 
                    src={`https://www.2embed.cc/embedtv/${tvShow.id}&s=${selectedSeason}&e=${selectedEpisode}`}
                    allowFullScreen
                  />
  
                </>
              )}
              {watchOption === 'server7' && (
                <EmbedPlayer 

                  src={`https://moviee.tv/embed/tv/${tvShow.id}?season=${selectedSeason}&episode=${selectedEpisode}`}

                  allowFullScreen
                />
              )}
             {watchOption === 'server6' && (
                <AdBlockedIframe 
                  src={`https://vidsrc.pro/embed/tv/${tvShow.id}/${selectedSeason}/${selectedEpisode}?player=new`}
                  allowFullScreen
                />
              )} 
              {watchOption === 'server4' && (
                <AdBlockedIframe
                src={`https://vidbinge.dev/embed/tv/${tvShow.id}/${selectedSeason}/${selectedEpisode}`}
              allowFullScreen
              />
              )}
              {watchOption === 'server3' && (
                <AdBlockedIframe
                src={`https://vidsrc.cc/v2/embed/tv/${tvShow.id}/${selectedSeason}/${selectedEpisode}`}
                allowFullScreen
                />
              )}
              {watchOption === 'server32' && (
              <EmbedPlayer
                  src={`https://vidsrc.cc/v3/embed/tv/${tvShow.id}/${selectedSeason}/${selectedEpisode}`}
                  allowFullScreen
                  scrolling="no"
                />
            )}
              {watchOption === 'server8' && (
                <EmbedPlayer
                src={`https://player.vidsrc.nl/embed/tv/${tvShow.id}/${selectedSeason}/${selectedEpisode}`}
                allowFullScreen
                />
              )}
              {watchOption === 'server9' && ( // New server embed
                <EmbedPlayer
                  src={`https://filmex.to/#/media/tmdb-tv-${tvShow.id}/${tvShow.seasons.find(season => season.season_number === selectedSeason)?.id}/${episodeId}`}
                  allowFullScreen
                  scrolling="no"
                />
              )}
              {watchOption === 'server10' && (
                <AdBlockedIframe
                src={`https://embed.su/embed/tv/${tvShow.id}/${selectedSeason}/${selectedEpisode}`}
                allowFullScreen
                />
              )}
              {watchOption === 'server11' && megacloudHash && (
  <EmbedPlayer
    src={`https://megacloud.tv/embed-1/e-1/${megacloudHash}?_debug=true`}
    allowFullScreen
  />
)}
            {watchOption === 'server12' && (
                <EmbedPlayer
                src={`https://multiembed.mov/?video_id=${tvShow.id}&tmdb=1&s=${selectedSeason}&e=${selectedEpisode}`}
                allowFullScreen
                />
              )}
            </VideoContainer>
          </Backdrop>
        )}
      </TvShowContainer>
  );
}

export default TvShowDetails;
