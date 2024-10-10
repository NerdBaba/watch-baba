import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { getMovieDetails, getMovieCredits, getMovieRecommendations, getMovieExternalIds } from '../services/tmdbApi';
import VideoPlayer from '../components/VideoPlayer';
import MovieCard from '../components/MovieCard';
// import DownloadOption from '../components/DownloadOption';
import { FaPlay, FaInfoCircle, FaTimes, FaDownload } from 'react-icons/fa';



const MovieContainer = styled.div`
  width: 100%;
  max-width: 2000px;
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
  flex-direction: column;
  justify-content: flex-end;
  padding: 40px;

  @media (max-width: 768px) {
    height: 50vh; // Reduced from 60vh to 50vh
    padding: 15px; // Reduced padding
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
    display: flex;
    flex-direction: column;
    gap: 5px; // Adds a small gap between elements
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
  font-family: 'GeistVF';
  color: white;
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 5px;
  }
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
    font-size: 0.9rem;
    padding: 6px 12px;
    gap: 5px;
  }
`;

const Tagline = styled.p`
  font-style: italic;
  color: white;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-bottom: 5px;
  }
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
  color:white;

  @media (max-width: 768px) {
    font-size: 0.8rem;
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
  font-size: 20px;
  margin-bottom: 15px;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  
  &:before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 22px;
    background-color: ${props => props.theme.primary};
    margin-right: 10px;
    border-radius: 32px;

  }
  
  @media (min-width: 768px) {
    font-size: 26px;
    margin-bottom: 20px;
    
    &:before {
      height: 28px;
      width: 7px;
    }
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
  height: 100vh;
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
  top: 0px;
  right: 0;
  padding-bottom: 5px;
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
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.0);
  border-radius: 5px;
  margin-bottom: 10px;
`;

const ServerDropdown = styled.select`
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.primary};
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

const LoadingRing = styled.div`
  display: inline-block;
  width: 80px;
  height: 80px;
  :after {
    content: " ";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid ${props => props.theme.text};
    border-color: ${props => props.theme.text} transparent ${props => props.theme.text} transparent;
    animation: ring 1.2s linear infinite;
  }
  @keyframes ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const TamilYogiResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
  min-height: 200px; // Ensure there's enough space for the loading ring
`;
const TamilYogiResultButton = styled.button`
  padding: 10px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.primary};
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

  @media (max-width: 768px) {
    max-width: 150px; // Reduced from 200px to 150px
    margin-bottom: 10px;
  }
`;

const LoadingPlaceholder = styled.div`
  width: 300px;
  height: 100px;
  background-color: #333;
  margin-bottom: 20px;
`;

const TamilYogiNoResults = styled.p`
  color: ${props => props.theme.text};
  text-align: center;
  margin-top: 20px;
`;


const DownloadButton = styled(Button)`
  background-color: ${props => props.disabled ? '#666' : props.theme.background};
  color: ${props => props.disabled ? '#999' : props.theme.primary};
  opacity: ${props => props.disabled ? 0.7 : 1};
  border-radius: 9px;
  font-family: 'GeistVF';
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
   &:hover {
      background-color: ${props => props.theme.background};
    }
`;

const CloseDownloadButton = styled(Button)`
  background-color: transparent;
  border-radius: 9px;
  font-family: 'GeistVF';
  color: ${props => props.theme.primary};
  &:hover {
    color: ${props => props.theme.background};
  }
`;

const DownloadOptionsContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${props => props.theme.background};
  padding: 20px;
  border-radius: 8px;
  z-index: 1000;
`;

const DownloadSelect = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  font-size: 1rem;
  background-color: ${props => props.theme.primary};
`;

const DownloadLinkButton = styled.a`
  display: inline-block;
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.background};
  padding: 10px 15px;
  margin: 5px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
`;


const AdBlockedIframe = ({ src, allowFullScreen }) => {
  const iframeRef = useRef(null);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const checkDomain = () => {
      const blockedDomains = [
        'example-ad-domain.com',
        'another-ad-domain.com',
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
    return null;
  }

  return (
    <iframe
      ref={iframeRef}
      src={src}
      allowFullScreen={allowFullScreen}
      sandbox="allow-same-origin allow-scripts allow-forms allow-presentation allow-orientation-lock"
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  );
};

// 

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [cast, setCast] = useState([]);
  const [externalIds, setExternalIds] = useState(null);
  const [isWatching, setIsWatching] = useState(false);
  const [watchOption, setWatchOption] = useState('server1');
  const [videoSources, setVideoSources] = useState([]);
  const [tamilYogiResults, setTamilYogiResults] = useState([]);
  const [isTamilYogiLoading, setIsTamilYogiLoading] = useState(false);
  const [selectedTamilYogiLink, setSelectedTamilYogiLink] = useState('');
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const videoContainerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [logoUrl, setLogoUrl] = useState('');
  const [megacloudHash, setMegacloudHash] = useState(null);
  const [moviesDriveLinks, setMoviesDriveLinks] = useState([]);
  const [moviesDriveOptions, setMoviesDriveOptions] = useState([]);
   const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [selectedDownloadOption, setSelectedDownloadOption] = useState(null);
    const [isDownloadFetching, setIsDownloadFetching] = useState(false);

  const fetchMovieData = useCallback(async () => {
    try {
      const [detailsResponse, externalIdsResponse] = await Promise.all([
        getMovieDetails(id),
        getMovieExternalIds(id)
      ]);

      setMovie(detailsResponse.data);
      setExternalIds(externalIdsResponse.data);
      setLogoUrl(`https://live.metahub.space/logo/medium/${externalIdsResponse.data.imdb_id}/img`);

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

        if (watchOption === 'tamilyogi') {
          fetchTamilYogiResults(detailsResponse.data.title);
        }
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    fetchMovieData();
  }, [id, watchOption, fetchVideoSources]);

  const fetchTamilYogiResults = async (title) => {
  const searchTerm = title.split(' ').slice(0, 2).join('+');
  const url = `https://simple-proxy.mda2233.workers.dev/?destination=https://tamilyogi.fm/?s=${searchTerm}`;

  setIsTamilYogiLoading(true);
  setTamilYogiResults([]);

  try {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 2 second delay
    const response = await axios.get(url);
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.data, 'text/html');
    const results = Array.from(doc.querySelectorAll('.ml-item')).slice(0, 5).map(item => ({
      title: item.querySelector('.mli-info h2').textContent,
      link: item.querySelector('a').href
    }));
    setTamilYogiResults(results);
    setSelectedTamilYogiLink('');
  } catch (error) {
    console.error('Error fetching TamilYogi results:', error);
    setTamilYogiResults([]);
  } finally {
    setIsTamilYogiLoading(false);
  }
};


const invokeMoviesdrive = async (title, year) => {
    try {
      const MDRIVE_PROXY_URL = "https:/oxy.wafflehacker.io/?destination=";
      const HUBCLOUD_PROXY_URL = "https://simple-proxy.mda2233.workers.dev/?destination=";
      const MovieDrive_API = "https://moviesdrive.world";
      const CHROME_USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
      
      const axiosConfig = {
        headers: {
          'User-Agent': CHROME_USER_AGENT,
          'Origin': 'https://moviesdrive.world',
          'Referer': 'https://moviesdrive.world/',
        }
      };

      const fixTitle = title?.replace(/-/g, ' ').replace(/:/g, ' ').replace(/&/g, ' ');
      const searchTitle = title?.replace(/-/g, ' ').toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      const cleanTitle = (dirtyTitle) => {
        return dirtyTitle
          .replace(/$$Moviesdrives\.com$$-/g, '')
          .replace(/$$moviesdrives\.com$$/g, '')
          .replace(/\.mkv$|\.mp4$|\.avi$/i, '')
          .replace(/\s*-\s*$/, '')
          .replace(/^\s*-\s*/, '')
          .replace(/\s+/g, ' ')
          .trim();
      };

      const url = year 
        ? `${MDRIVE_PROXY_URL}${MovieDrive_API}/search/${fixTitle} ${year}`
        : `${MDRIVE_PROXY_URL}${MovieDrive_API}/search/${fixTitle}`;

      const response = await axios.get(url, axiosConfig);
      const hrefPattern = new RegExp(`<a\\s+href="([^"]*\\b${searchTitle}\\b[^"]*)"`, 'i');
      const hrefMatch = response.data.match(hrefPattern);
      const moviePageUrl = hrefMatch?.[1];

      if (!moviePageUrl) return null;

      const moviePageResponse = await axios.get(`${MDRIVE_PROXY_URL}${moviePageUrl}`, axiosConfig);
      const parser = new DOMParser();
      const movieDoc = parser.parseFromString(moviePageResponse.data, 'text/html');
      
      const links = Array.from(movieDoc.querySelectorAll('h5 > a'));
      const archiveLinks = links
        .filter(a => a.href && a.href.includes('mdrive.site/archives'))
        .map(a => a.href);
      
      const directGpdlLinks = links
        .filter(a => a.href && a.href.includes('gpdl.technorozen.workers.dev'))
        .map(a => ({
          href: a.href,
          text: cleanTitle(a.textContent.trim()),
          title: cleanTitle(a.textContent.trim()),
          quality: 'Unknown',
          size: 'Unknown'
        }));

      const hubcloudLinks = await Promise.all(archiveLinks.map(async archiveUrl => {
        try {
          const archiveResponse = await axios.get(`${MDRIVE_PROXY_URL}${archiveUrl}`, axiosConfig);
          const archiveDoc = parser.parseFromString(archiveResponse.data, 'text/html');
          
          return Array.from(archiveDoc.querySelectorAll('h5 a'))
            .map(a => a.getAttribute('href'))
            .filter(href => href && href.includes('hubcloud.art'));
        } catch (error) {
          console.error('Error processing archive link:', error);
          return [];
        }
      }));

      const allHubcloudLinks = [...new Set(hubcloudLinks.flat())];
const directLinks = await Promise.all(allHubcloudLinks.map(async hubcloudUrl => {
      try {
        const directConfig = {
          headers: {
            'User-Agent': CHROME_USER_AGENT,
          }
        };

        const hubDoc = await axios.get(`${HUBCLOUD_PROXY_URL}${hubcloudUrl}`, directConfig);
        const newLink = hubDoc.data.match(/url=([^"]*)/)?.[1];
        if (!newLink) return null;

        // Fetch the hubcloud.cloud page
        const cloudResponse = await axios.get(`${HUBCLOUD_PROXY_URL}${newLink}`, directConfig);
        const cloudHtml = cloudResponse.data;

        // Extract the title
        const titleMatch = cloudHtml.match(/<div class="card-header text-white bg-primary mb-3">\s*(.*?)\s*<\/div>/);
        let extractedTitle = titleMatch ? titleMatch[1] : '';
        extractedTitle = extractedTitle.replace(/$$$$\s*moviesdrives\.com\s*$$$$\s*/i, '');

        // Extract the gamerxyt link from the entire source
        const gamerLinkMatch = cloudHtml.match(/https:\/\/gamerxyt\.com\/hubcloud\.php\?[^'"]+/);
        const gamerLink = gamerLinkMatch ? gamerLinkMatch[0] : null;

        // Extract file size
        const sizeMatch = cloudHtml.match(/<i id="size">(.*?)<\/i>/);
        const size = sizeMatch ? sizeMatch[1] : 'Unknown';

        // Extract quality from the title
        const qualityMatch = extractedTitle.match(/\d+p/);
        const quality = qualityMatch ? qualityMatch[0] : 'Unknown';

        return {
          title: cleanTitle(extractedTitle),
          quality: quality,
          size: size,
          gamerLink: gamerLink
        };
      } catch (error) {
        console.error('Error processing HubCloud link:', error);
        return null;
      }
    }));

    return [...directLinks.filter(link => link !== null), ...directGpdlLinks];
  } catch (error) {
    console.error('Error in MoviesDrive extractor:', error);
    return null;
  } finally {
    setIsDownloadFetching(false);
  }
};

  useEffect(() => {
    const fetchMoviesDriveLinks = async () => {
      if (movie) {
        setMoviesDriveLinks([]); // Reset links when a new movie is selected
        setSelectedDownloadOption(null); // Reset selected option
        const year = new Date(movie.release_date).getFullYear();
        const links = await invokeMoviesdrive(movie.title, year);
        setMoviesDriveLinks(links || []);
      }
    };

    fetchMoviesDriveLinks();
  }, [movie]);



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




useEffect(() => {
  const fetchHash = async () => {
    if (watchOption === 'server11' && movie) {
      const year = new Date(movie.release_date).getFullYear();
      const hash = await fetchMegacloudHash(movie.title, year, movie.id, 'movie');
      setMegacloudHash(hash);
    }
  };
  
  fetchHash();
}, [watchOption, movie]);


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
  const handleFullscreenChange = () => {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      try {
        if (window.screen && window.screen.orientation && window.screen.orientation.lock) {
          window.screen.orientation.lock('landscape').catch((err) => {
            console.error('Failed to lock orientation:', err);
          });
        }
      } catch (err) {
        // Handle error or silently fail if screen orientation API is not supported
      }
    } else {
      try {
        if (window.screen && window.screen.orientation && window.screen.orientation.unlock) {
          window.screen.orientation.unlock();
        }
      } catch (err) {
        // Handle error or silently fail
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

  
  return (
      <MovieContainer>
        <Hero backdrop={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}>
          <HeroContent>
          <Suspense fallback={<LoadingPlaceholder />}>
            {logoUrl ? (
              <LogoImage src={logoUrl} alt={movie.title} onError={() => setLogoUrl('')} />
            ) : (
              <Title>{movie.title}</Title>
            )}
            </Suspense>
            {movie.tagline && <Tagline>{movie.tagline}</Tagline>}
            
            {showMoreInfo && (
              <>
                <Overview>{movie.overview}</Overview>
                <Ratings>
                  <RatingItem>⭐ {movie.vote_average.toFixed(1)}/10</RatingItem>
                </Ratings>
                <InfoItem>Release Date: {new Date(movie.release_date).toLocaleDateString()}</InfoItem>
                <InfoItem>Runtime: {movie.runtime} minutes</InfoItem>
                <InfoItem>Ends at: {calculateEndTime(currentTime, movie.runtime)}</InfoItem>
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
   <DownloadButton 
          disabled={isDownloadFetching || moviesDriveLinks.length === 0}
          onClick={() => moviesDriveLinks.length > 0 && setShowDownloadOptions(true)}
        >
          <FaDownload /> {isDownloadFetching ? 'Fetching...' : 'Download'}
        </DownloadButton>
</ButtonGroup>
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
                <ServerDropdown 
                value={watchOption} 
                onChange={(e) => {
                  setWatchOption(e.target.value);
                  if (e.target.value === 'tamilyogi') {
                    fetchTamilYogiResults(movie.title);
                  }
                }}
              >
                  <option value="server1">Server 1</option>
                  <option value="server2">Server 2</option>
                  <option value="server3">Server 3.1</option>
                  <option value="server32">Server 3.2</option>
                  <option value="server4">Server 4</option>
                  <option value="server5">Server 5</option>
                  <option value="server6">Server 6</option>
                  <option value="server7">Server 7 (Ads)</option>
                  <option value="server8">Server 8</option>
                  <option value="tamilyogi">TamilYogi</option>
                  <option value="server9">Server 9</option>
                  <option value="server10">Server 10 (Ads)</option>
                  <option value="server11">Server 11</option>
                  <option value="server12">Server 12 (Ads)</option>
                  <option value="server13">Server 13 (Single Ad)</option>
                  <option value="server14">Server 14</option>
                  <option value="server15">Server 15 (Ads)</option>
                  <option value="server16">Server 16 (Site)</option>
                </ServerDropdown>
              </ControlsContainer>
              {watchOption === 'server1' && (
                <VideoPlayer tmdbId={movie.id} />
              )}
              {watchOption === 'server2' && (
                <AdBlockedIframe 
                  src={`https://player.smashy.stream/movie/${movie.id}`}
                  allowFullScreen
                />
              )}
              {watchOption === 'server4' && (
                <AdBlockedIframe
                src={`https://vidbinge.dev/embed/movie/${movie.id}`}
              allowFullScreen
              />
              )}
              {watchOption === 'server3' && (

                <AdBlockedIframe 
                  src={`https://vidsrc.cc/v2/embed/movie/${movie.id}`}

                  allowFullScreen
                />
              )}
              {watchOption === 'server5' && (
                <AdBlockedIframe 
                  src={`https://www.2embed.cc/embed/${movie.id}`}
                  allowFullScreen
                />
              )}
              {watchOption === 'server6' && (
                <AdBlockedIframe
                src={`https://vidsrc.icu/embed/movie/${movie.id}`}
              allowFullScreen
              />
              )}
                {watchOption === 'server7' && (
                <EmbedPlayer 
                  // src={`https://moviee.tv/embed/movie/${movie.id}`}
                src={`https://vidsrc.xyz/embed/movie/${movie.id}`}
                  allowFullScreen
                />
              )}
              {watchOption === 'server8' && (
                <EmbedPlayer
                src={`https://player.vidsrc.nl/embed/movie/${movie.id}`}
                allowFullScreen
                />
              )}
              {watchOption === 'server9' && (
              <EmbedPlayer
                  src={`https://filmex.to/#/media/tmdb-movie-${movie.id}`}
                  allowFullScreen
                  scrolling="no"
                />
            )}
             {watchOption === 'server32' && (
              <EmbedPlayer
                  src={`https://vidsrc.cc/v3/embed/movie/${movie.id}?autoPlay=true`}
                  allowFullScreen
                  scrolling="no"
                />
            )}
            {watchOption === 'server10' && (
                <EmbedPlayer
                src={`https://embed.su/embed/movie/${movie.id}`}
                allowFullScreen
                />
              )}
            {watchOption === 'server11' && megacloudHash && (
  <AdBlockedIframe
    src={`${megacloudHash}`}
    allowFullScreen
  />
)}
{watchOption === 'server12' && (
              <EmbedPlayer
                  src={`https://moviesapi.club/movie/${movie.id}`}
                  allowFullScreen
                  
                />
            )}
            {watchOption === 'server13' && (
                <AdBlockedIframe
                src={`https://play2.123embed.net/movie/${movie.id}`}
                allowFullScreen
                />
              )}
              {watchOption === 'server14' && (
              <EmbedPlayer
                  src={`https://embed-arh.pages.dev/media/tmdb-movie-${movie.id}`}
                  allowFullScreen
                  scrolling="no"
                />
            )}
            {watchOption === 'server15' && (
                <AdBlockedIframe
                src={`https://www.rgshows.me/player/movies/api3/index.html?id=${movie.id}`}
                allowFullScreen
                />
              )}

              {watchOption === 'server16' && (
  <AdBlockedIframe
    src={`https://fsharetv.co/w/${movie.title.toLowerCase().replace(/ /g, '-')}-episode-1-tt${externalIds.imdb_id.replace('tt', '')}`}
    allowFullScreen
  />
)}




         {watchOption === 'tamilyogi' && (
  selectedTamilYogiLink ? (
    <EmbedPlayer src={selectedTamilYogiLink} allowFullScreen />
  ) : (
    <TamilYogiResultsContainer>
      {isTamilYogiLoading ? (
        <LoadingRing />
      ) : tamilYogiResults.length > 0 ? (
        tamilYogiResults.map((result, index) => (
          <TamilYogiResultButton 
            key={index} 
            onClick={() => setSelectedTamilYogiLink(result.link)}
          >
            {result.title}
          </TamilYogiResultButton>
        ))
      ) : (
        <TamilYogiNoResults>No results found</TamilYogiNoResults>
      )}
    </TamilYogiResultsContainer>
  )
)}
            </VideoContainer>
          </Backdrop>
        )}



{showDownloadOptions && (
  <DownloadOptionsContainer>
    <DownloadSelect
      value={selectedDownloadOption ? selectedDownloadOption.title : ''}
      onChange={(e) => setSelectedDownloadOption(moviesDriveLinks.find(link => link.title === e.target.value))}
    >
      <option value="">Select a download option</option>
      {moviesDriveLinks.map((link, index) => (
        <option key={index} value={link.title}>
          {link.title} {link.quality !== 'Unknown' ? `- ${link.quality}` : ''} {link.size !== 'Unknown' ? `(${link.size})` : ''}
        </option>
      ))}
    </DownloadSelect>
    {selectedDownloadOption && (
      <div>
        {selectedDownloadOption.gamerLink && (
          <DownloadLinkButton href={selectedDownloadOption.gamerLink} target="_blank" rel="noopener noreferrer">
            Download
          </DownloadLinkButton>
        )}
        {selectedDownloadOption.href && selectedDownloadOption.href.includes('gpdl.technorozen.workers.dev') && (
          <DownloadLinkButton href={selectedDownloadOption.href} target="_blank" rel="noopener noreferrer">
            Direct GPDL
          </DownloadLinkButton>
        )}
      </div>
    )}
    <CloseDownloadButton onClick={() => setShowDownloadOptions(false)}>
      <FaTimes /> Close
    </CloseDownloadButton>
  </DownloadOptionsContainer>
)}
      </MovieContainer>
  );
}

export default MovieDetails;
