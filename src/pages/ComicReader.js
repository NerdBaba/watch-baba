import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUpIcon } from '@radix-ui/react-icons';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { fetchComicChapter } from '../services/comicApi';
import { getFullUrl, getSlugFromUrl } from '../utils/urlHelpers';
import LoadingBar from '../components/LoadingBar';

const ComicReaderContainer = styled(motion.div)`
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
`;

const ComicImage = styled(motion.img)`
  width: 100%;
  max-width: 800px;
  height: auto;
  margin: 10px auto;
  display: block;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const NavigationBar = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  padding: 15px;
  background: ${props => props.theme.background}ee;
  backdrop-filter: blur(10px);
  border-radius: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const NavButton = styled(motion(Link))`
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background: ${props => props.theme.primary};
  color: ${props => props.theme.background};
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px ${props => props.theme.primary}66;
  }

  @media (max-width: 768px) {
    &.previous {
      display: none;
    }
  }
`;

const ReadingProgress = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: ${props => props.theme.background};
  z-index: 1000;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: ${props => props.theme.primary};
    transition: width 0.3s ease;
  }
`;

const ChapterHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 20px;
  padding: 20px;
  background: ${props => props.theme.background};
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative; // Add this line
  z-index: 3000; // Add this line
`;

const ChapterTitle = styled(motion.h1)`
  font-size: 1.8em;
  color: ${props => props.theme.text};
  margin-bottom: 10px;
`;

const ImageContainer = styled(motion.div)`
  position: relative;
  margin: 20px 0;
  
  &:hover {
    .image-number {
      opacity: 1;
    }
  }
`;

const ImageNumber = styled(motion.div)`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${props => props.theme.background}cc;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(5px);

  @media (max-width: 768px) {
    display: none;
  }
`;

const LoadingPlaceholder = styled(motion.div)`
  width: 100%;
  height: 800px;
  background: ${props => props.theme.background};
  border-radius: 10px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: 'Loading...';
    color: ${props => props.theme.text};
  }
`;

const GoToTopButton = styled(motion.button)`
  position: fixed;
  bottom: 80px;
  right: 20px;
  background: ${props => props.theme.primary};
  color: ${props => props.theme.background};
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;

  @media (max-width: 768px) {
    display: ${props => props.show ? 'flex' : 'none'};
  }
`;

const StyledDropdownMenuContent = styled(DropdownMenu.Content)`
  min-width: 200px;
  max-height: 300px; // Set a maximum height
  overflow-y: auto; // Enable vertical scrolling
  background-color: ${props => props.theme.background};
  border-radius: 10px;
  padding: 5px;
  z-index: 3001;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

  // Add custom scrollbar styles
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.background};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.primary};
    border-radius: 4px;
    border: 2px solid ${props => props.theme.background};
  }

  // For Firefox
  scrollbar-width: thin;
  scrollbar-color: ${props => `${props.theme.primary} ${props.theme.background}`};
`;

const StyledDropdownMenuTrigger = styled(DropdownMenu.Trigger)`
  padding: 10px 15px;
  background: ${props => props.theme.primary};
  color: ${props => props.theme.background};
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  width: 200px;
  z-index: 3000; // Add this line

  &:hover {
    background: ${props => props.theme.primaryDark};
  }
`;

const StyledDropdownMenuItem = styled(DropdownMenu.Item)`
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.theme.hover};
    outline: none;
  }
`;

function ComicReader() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [comicChapter, setComicChapter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState([]);
  const [showGoToTop, setShowGoToTop] = useState(false);
  const containerRef = useRef(null);

    const removeHtmlEntities = (text) => {
    return text.replace(/&#\d+;/g, '');
  };

  const fetchChapter = useCallback(async () => {
    setLoading(true);
    try {
      const fullUrl = getFullUrl(slug);
      const response = await fetchComicChapter(fullUrl);
      setComicChapter(response);
      setImagesLoaded(new Array(response.images.length).fill(false));
      loadImagesAsync(response.images);
    } catch (error) {
      console.error('Error fetching comic chapter:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchChapter();
    window.scrollTo(0, 0);
  }, [fetchChapter]);

  const loadImagesAsync = async (images) => {
    for (let i = 0; i < images.length; i++) {
      await loadImage(images[i], i);
    }
  };

  const loadImage = (src, index) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImagesLoaded(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
        resolve();
      };
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setReadingProgress(Math.min(progress, 100));
      setShowGoToTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChapterChange = (value) => {
    navigate(`/comics/chapter/${value}`);
  };

  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!comicChapter && !loading) {
    return <div>No comic chapter available.</div>;
  }

  return (
    <>
      <LoadingBar isLoading={loading} />
      <ReadingProgress progress={readingProgress} />
      <ComicReaderContainer
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {comicChapter && (
          <ChapterHeader
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ChapterTitle>{removeHtmlEntities(comicChapter.metadata.title)}</ChapterTitle>
              <DropdownMenu.Root>
              <StyledDropdownMenuTrigger>
                Select Chapter
              </StyledDropdownMenuTrigger>
              <StyledDropdownMenuContent>
                {comicChapter.metadata.chapters.map((chapter) => (
                  <StyledDropdownMenuItem
                    key={chapter.url}
                    onSelect={() => handleChapterChange(getSlugFromUrl(chapter.url))}
                  >
                    {chapter.title}
                  </StyledDropdownMenuItem>
                ))}
              </StyledDropdownMenuContent>
            </DropdownMenu.Root>
          </ChapterHeader>
        )}

        <AnimatePresence>
          {comicChapter && comicChapter.images.map((image, index) => (
            <ImageContainer
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: imagesLoaded[index] ? 1 : 0, y: imagesLoaded[index] ? 0 : 20 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {!imagesLoaded[index] && <LoadingPlaceholder />}
              <ComicImage
                src={image}
                alt={`Page ${index + 1}`}
                style={{
                  display: imagesLoaded[index] ? 'block' : 'none',
                }}
              />
              <ImageNumber
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Page {index + 1} of {comicChapter.images.length}
              </ImageNumber>
            </ImageContainer>
          ))}
        </AnimatePresence>

        <NavigationBar
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {comicChapter && comicChapter.metadata.navigation.prev && (
            <NavButton 
              to={`/comics/chapter/${getSlugFromUrl(comicChapter.metadata.navigation.prev)}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="previous"
            >
              Previous Chapter
            </NavButton>
          )}
          {comicChapter && comicChapter.metadata.navigation.next && (
            <NavButton 
              to={`/comics/chapter/${getSlugFromUrl(comicChapter.metadata.navigation.next)}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next Chapter
            </NavButton>
          )}
        </NavigationBar>
      </ComicReaderContainer>
      <AnimatePresence>
        {showGoToTop && (
          <GoToTopButton
            onClick={goToTop}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            show={showGoToTop}
          >
            <ChevronUpIcon />
          </GoToTopButton>
        )}
      </AnimatePresence>
    </>
  );
}

export default ComicReader;