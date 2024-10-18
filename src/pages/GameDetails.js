import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingBar from '../components/LoadingBar';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { MdGamepad, MdCalendarToday, MdStar, MdLink, MdClose } from 'react-icons/md';
import DOMPurify from 'dompurify';


const Container = styled(motion.div)`
  max-width: 80vw;
  margin: 0 auto;
  padding: 2vw;
  z-index: 9999;
  font-family: 'GeistVF', sans-serif;
  
  @media (max-width: 1080px) {
    padding: 10px;
  }
`;

const HeroSection = styled(motion.div)`
  display: flex;
  gap: 20px;
  max-width: 90vw;
  margin-bottom: 40px;

  @media (max-width: 1080px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;



const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: none;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: blur(8px);
  transform: scale(1.1);
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%);
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 40px;
  gap: 40px;
  font-family: 'GeistVF', sans-serif;
  @media (max-width: 1024px) {
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const CoverImage = styled(motion.img)`
  width: 300px;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
  @media (max-width: 1024px) {
    width: 250px;
    height: 333px;
  }
  @media (max-width: 768px) {
    width: 200px;
    height: 266px;
  }
`;

const HeroInfo = styled.div`
  color: ${props => props.theme.text};
  max-width: 600px;
  @media (max-width: 1024px) {
    max-width: 100%;
  }
`;
const MediaSection = styled(motion.div)`
  margin: 40px 0;
  .swiper {
    border-radius: 12px;
    overflow: hidden;
  }
  
  .swiper-button-next,
  .swiper-button-prev {
    color: ${props => props.theme.primary};
  }

  .swiper-pagination-bullet-active {
    background: ${props => props.theme.primary};
  }
`;


const MediaSwiper = styled(Swiper)`
  .swiper-slide {
    height: 500px;
    img, video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      cursor: pointer;
    }
  }

  .swiper-button-next,
  .swiper-button-prev {
    color: ${props => props.theme.primary};
  }

  .swiper-pagination-bullet-active {
    background: ${props => props.theme.primary};
  }

  @media (max-width: 1024px) {
    .swiper-slide {
      height: 400px;
    }
  }
  @media (max-width: 768px) {
    .swiper-slide {
      height: 300px;
    }
  }
`;
const InfoGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 40px 0;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled(motion.div)`
  background: ${props => props.theme.secondary};
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 15px;
  svg {
    font-size: 24px;
    color: ${props => props.theme.primary};
  }
`;

const RequirementsSection = styled(motion.div)`
  background: ${props => props.theme.secondary};
  padding: 30px;
  border-radius: 12px;
  margin: 40px 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);

  h2 {
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid ${props => props.theme.primary};
  }

  .req-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
`;

const DownloadSection = styled(motion.div)`
  text-align: center;
  padding: 40px;
  background: ${props => props.theme.secondary};
  border-radius: 12px;
  margin-top: 40px;
`;

const DownloadButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: ${props => props.theme.primary};
  color: white;
  padding: 15px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  margin: 10px;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.2);
  }
`;

const ExtraLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
`;

const ExtraLink = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255,255,255,0.1);
  border-radius: 6px;
  text-decoration: none;
  color: ${props => props.theme.text};
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255,255,255,0.2);
  }
`;

const MediaWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
`;
const FullscreenMedia = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;  // Changed from right: 0
  width: 100vw;  // Changed from calc(100% - 60px)
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
`;

const FullscreenVideo = styled.iframe`
  width: 90%;
  height: 80vh;
  border: none;
`;

const FullscreenContent = styled.div`
  position: relative;
  width: 90%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FullscreenImage = styled.img`
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
`;


const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.direction === 'prev' ? 'left: 20px;' : 'right: 20px;'}
  background: none;
  border: none;
  color: white;
  font-size: 40px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  z-index: 10;

  &:hover {
    opacity: 1;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 40px;
  cursor: pointer;
  z-index: 10;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const GameDetails = () => {
  const { id } = useParams();
  const [gameDetails, setGameDetails] = useState(null);
  const [igdbData, setIgdbData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [media, setMedia] = useState([]);
  const [fullscreenMedia, setFullscreenMedia] = useState(null);
    const [sidebarWidth, setSidebarWidth] = useState(60); // default closed sidebar width
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

 
  const ACCESS_TOKEN = process.env.REACT_APP_IGDB_ACCESS_TOKEN;
  const CLIENT_ID = process.env.REACT_APP_IGDB_CLIENT_ID;
  const extractTitleFromSlug = (slug) => {
    return slug
      .replace(/-/g, ' ')
      .replace(/free|download/gi, '')
      .trim()
      .split(' ')
      .filter(word => word.length > 0);
  };

  const cleanTitle = (title) => {
    if (!title) return '';
    return title.replace(/\b(free|download)\b/gi, '').trim();
  };

  const cleanHtml = (html) => {
    if (!html) return '';
    return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] })
      .replace(/<\/?(?:strong|li)>/g, '')
      .trim();
  };

  const fetchIGDBData = async (searchTerms) => {
    try {
      const searchQuery = searchTerms.join(' | ');
      const response = await fetch('https://sudo-proxy-latest-cmp7.onrender.com/?destination=https://api.igdb.com/v4/games', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Client-ID': CLIENT_ID,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: `search "${searchQuery}";
          fields name,summary,rating,rating_count,first_release_date,genres.name,
          platforms.name,screenshots.url,artworks.url,cover.url,
          involved_companies.company.name,aggregated_rating,videos.*,
          similar_games.name,similar_games.cover.url,websites.*;
          where platforms = (6,7,8,9,12,13,14,169);
          limit 1;`
      });

      const [gameData] = await response.json();
      
      if (gameData) {
        // Process media
        const allMedia = [];
        
        // Process cover
        if (gameData.cover) {
          gameData.cover.url = `https:${gameData.cover.url.replace('t_thumb', 't_cover_big')}`;
        }

        // Process screenshots
        if (gameData.screenshots) {
          gameData.screenshots.forEach(screenshot => {
            allMedia.push({
              type: 'image',
              url: `https:${screenshot.url.replace('t_thumb', 't_1080p')}`
            });
          });
        }

        // Process artworks
        if (gameData.artworks) {
          gameData.artworks.forEach(artwork => {
            allMedia.push({
              type: 'image',
              url: `https:${artwork.url.replace('t_thumb', 't_1080p')}`
            });
          });
        }

        // Process videos
        if (gameData.videos) {
          gameData.videos.forEach(video => {
            allMedia.push({
              type: 'video',
              videoId: video.video_id
            });
          });
        }

        setMedia(allMedia);
        setIgdbData(gameData);
      }
    } catch (error) {
      console.error('Error fetching IGDB data:', error);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://games.mda2233.workers.dev/game/${id}`);
      const data = await response.json();
      
      // Clean system requirements HTML
      if (data.systemRequirements) {
  Object.keys(data.systemRequirements).forEach(key => {
    data.systemRequirements[key] = cleanHtml(data.systemRequirements[key])
      .replace(/<\/?strong>/g, '') // Removes <strong> and </strong>
      .replace(/<\/?li>/g, '');    // Removes <li> and </li>
  });
}

      
      setGameDetails(data);

      let searchTerms = [];
      const title = data.systemRequirements?.Title || data.gameInfo?.TITLE;
      
      if (title) {
        searchTerms = cleanTitle(title).split(' ');
      } else {
        searchTerms = extractTitleFromSlug(id);
      }

      await fetchIGDBData(searchTerms);
    } catch (error) {
      console.error('Error fetching game details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

  }, [id]);

  useEffect(() => {
    if (fullscreenMedia) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [fullscreenMedia]);

  if (isLoading) return <LoadingBar isLoading={true} />;

  const getWebsiteIcon = (category) => {
    switch(category) {
      case 1: return '🌐'; // official
      case 2: return '🎮'; // wikia
      case 3: return '🔵'; // wikipedia
      case 4: return '🎮'; // facebook
      case 5: return '🐦'; // twitter
      case 6: return '🎮'; // twitch
      case 8: return '🎮'; // instagram
      case 9: return '📺'; // youtube
      case 13: return '💭'; // steam
      case 14: return '👾'; // reddit
      case 15: return '🎵'; // itch
      case 16: return '📱'; // epic
      default: return '🔗';
    }
  };

  return (
  <Container
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <HeroSection>
      <HeroBackground image={igdbData?.screenshots?.[0]?.url || igdbData?.cover?.url} />
      <HeroContent>
        <CoverImage
          src={igdbData?.cover?.url || gameDetails?.image}
          alt={igdbData?.name || "Game Cover"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        />
        <HeroInfo>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {igdbData?.name || gameDetails?.systemRequirements?.Title || gameDetails?.gameInfo?.TITLE}
          </motion.h1>
          {igdbData?.summary && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {igdbData.summary}
            </motion.p>
          )}
        </HeroInfo>
      </HeroContent>
    </HeroSection>
    <InfoGrid>
      {igdbData?.first_release_date && (
        <InfoCard>
          <MdCalendarToday />
          <div>
            <h3>Release Date</h3>
            <p>{new Date(igdbData.first_release_date * 1000).toLocaleDateString()}</p>
          </div>
        </InfoCard>
      )}
      {igdbData?.rating && (
        <InfoCard>
          <MdStar />
          <div>
            <h3>User Rating</h3>
            <p>{Math.round(igdbData.rating)}% ({igdbData.rating_count} reviews)</p>
          </div>
        </InfoCard>
      )}
      {igdbData?.genres && (
        <InfoCard>
          <MdGamepad />
          <div>
            <h3>Genres</h3>
            <p>{igdbData.genres.map(g => g.name).join(', ')}</p>
          </div>
        </InfoCard>
      )}
    </InfoGrid>
    {media.length > 0 && (
  <MediaSection>
    <MediaSwiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 7000 }}
    >
      {media.map((item, index) => (
  <SwiperSlide key={index}>
    {item.type === 'image' ? (
      <img 
        src={item.url} 
        alt={`Screenshot ${index + 1}`} 
        onClick={() => {
          setCurrentMediaIndex(index);
          setFullscreenMedia(item);
        }}
      />
    ) : (
      <MediaWrapper>
        <VideoOverlay
          onClick={() => {
            setCurrentMediaIndex(index);
            setFullscreenMedia(item);
          }}
        />
        <iframe
          src={`https://www.youtube.com/embed/${item.videoId}?enablejsapi=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: '100%', height: '100%' }}
        />
      </MediaWrapper>
    )}
  </SwiperSlide>
))}
    </MediaSwiper>
  </MediaSection>
)}
    <RequirementsSection>
      <h2>System Requirements</h2>
      <div className="req-grid">
  {Object.entries(gameDetails.systemRequirements)
    .filter(([key]) => !['Title', 'TITLE'].includes(key))
    .map(([key, value]) => (
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3>{key.replace(/<\/?strong>/g, '').replace(/<\/?li>/g, '')}</h3>
        <p>{value.replace(/<\/?strong>/g, '').replace(/<\/?li>/g, '')}</p> {/* Cleaned HTML */}
      </motion.div>
    ))}
</div>
    </RequirementsSection>
    {igdbData?.websites && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ExtraLinks>
          {igdbData.websites.map((website, index) => (
            <ExtraLink
              key={index}
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{getWebsiteIcon(website.category)}</span>
              {website.url.split('/')[2]}
            </ExtraLink>
          ))}
        </ExtraLinks>
      </motion.div>
    )}
    <DownloadSection
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Download Links</h2>
      <div>
        {gameDetails.downloadLinks.map((link, index) => (
          <DownloadButton
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdLink />
            Download from {link.name}
          </DownloadButton>
        ))}
      </div>
    </DownloadSection>
    <AnimatePresence>
  {fullscreenMedia && (
    <FullscreenMedia
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setFullscreenMedia(null)}
    >
      <FullscreenContent onClick={(e) => e.stopPropagation()}>
        {fullscreenMedia.type === 'image' ? (
          <FullscreenImage 
            src={fullscreenMedia.url} 
            alt="Full screen media" 
          />
        ) : (
          <FullscreenVideo
            src={`https://www.youtube.com/embed/${fullscreenMedia.videoId}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        <NavigationButton 
          direction="prev" 
          onClick={(e) => {
            e.stopPropagation();
            const newIndex = currentMediaIndex === 0 ? media.length - 1 : currentMediaIndex - 1;
            setCurrentMediaIndex(newIndex);
            setFullscreenMedia(media[newIndex]);
          }}
        >
          ←
        </NavigationButton>
        <NavigationButton 
          direction="next" 
          onClick={(e) => {
            e.stopPropagation();
            const newIndex = currentMediaIndex === media.length - 1 ? 0 : currentMediaIndex + 1;
            setCurrentMediaIndex(newIndex);
            setFullscreenMedia(media[newIndex]);
          }}
        >
          →
        </NavigationButton>
        <CloseButton onClick={() => setFullscreenMedia(null)}>
          ×
        </CloseButton>
      </FullscreenContent>
    </FullscreenMedia>
  )}
</AnimatePresence>
  </Container>
);
};

export default GameDetails;