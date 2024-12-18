import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUpIcon, DownloadIcon } from '@radix-ui/react-icons';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { fetchComicChapter } from '../services/comicApi';
import { getFullUrl, getSlugFromUrl } from '../utils/urlHelpers';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import BookReader from '../components/BookReader';
import { jsPDF } from 'jspdf';
import LoadingBar from '../components/LoadingBar';




const ComicReaderContainer = styled(motion.div)`
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  font-family: 'GeistVF';

  @media (max-width: 768px) {
   padding: 0;
   max-width: 100vw; 
  margin: 0;
  }
`;

const DownloadButton = styled.button`
  padding: 10px 15px;
  background: ${props => props.theme.primary};
  color: ${props => props.theme.background};
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background: ${props => props.theme.primaryDark};
  }
`;
const ComicImage = styled(motion.img)`
  width: 100%;
  max-width: 800px;
 @media (max-width: 768px) {
    max-width: 100%;
    width: 100vw;
    margin: 0;
    border-radius: 0;
    box-shadow: none;
  }
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
  display: none;
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
  display: none;
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
  
  @media (max-width: 768px) {
    margin: 0;
    touch-action: ${props => props.isZomed ? 'none' : 'pan-y'};
  }

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
  display: none;
  bottom: 80px;
  right: 20px;
  background: ${props => props.theme.primary};

  color: ${props => props.theme.background};
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;

  @media (max-width: 768px) {
    display: none;
    background-color: ${props => props.theme.primary}4d;
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
  const [downloadProgress, setDownloadProgress] = useState(0);

  const removeHtmlEntities = (text) => {
    return text.replace(/&#\d+;/g, '');
  };

  const downloadAsPDF = async () => {
    if (!comicChapter?.images?.length) return;

    setLoading(true);
    try {
      const pdf = new jsPDF('p', 'px', 'a4');
      const totalImages = comicChapter.images.length;
      
      for (let i = 0; i < totalImages; i++) {
        // Update progress
        setDownloadProgress(((i + 1) / totalImages) * 100);
        
        // Create a temporary image element
        const img = await new Promise((resolve, reject) => {
          const image = new Image();
          image.src = comicChapter.images[i];
          image.onload = () => resolve(image);
          image.onerror = reject;
        });

        // Calculate dimensions to fit the page
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        const imgRatio = img.height / img.width;
        let imgWidth = pageWidth - 40; // 20px margin on each side
        let imgHeight = imgWidth * imgRatio;

        // If image is taller than page, scale it down
        if (imgHeight > pageHeight - 40) {
          imgHeight = pageHeight - 40;
          imgWidth = imgHeight / imgRatio;
        }

        // Add new page for each image except the first one
        if (i > 0) {
          pdf.addPage();
        }

        // Center the image on the page
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        // Add the image to PDF
        pdf.addImage(
          img, 
          'JPEG',
          x,
          y,
          imgWidth,
          imgHeight,
          `image-${i}`,
          'FAST'
        );
      }

      // Save the PDF
      pdf.save(`${removeHtmlEntities(comicChapter.metadata.title)}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
      setDownloadProgress(0);
    }
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

  const filteredChapters = (comicChapter?.metadata?.chapters || []).reduce((acc, chapter) => {
    const chapterSlug = getSlugFromUrl(chapter.url);
    if (!acc.some(chap => chap.url === chapter.url) && !chapter.title.toLowerCase().includes('duplicate')) {
      acc.push(chapter);
    }
    return acc;
  }, []);

  if (!comicChapter && !loading) {
    return <div>No comic chapter available.</div>;
  }

  return (
    <>
      <LoadingBar isLoading={loading} progress={downloadProgress} />
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
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <DropdownMenu.Root>
                <StyledDropdownMenuTrigger>
                  Select Chapter
                </StyledDropdownMenuTrigger>
                <StyledDropdownMenuContent>
                  {filteredChapters.map((chapter) => (
                    <StyledDropdownMenuItem
                      key={chapter.url}
                      onSelect={() => handleChapterChange(getSlugFromUrl(chapter.url))}
                    >
                      {chapter.title}
                    </StyledDropdownMenuItem>
                  ))}
                </StyledDropdownMenuContent>
              </DropdownMenu.Root>
              <DownloadButton 
                onClick={downloadAsPDF}
                disabled={loading}
              >
                <DownloadIcon /> {loading ? `${Math.round(downloadProgress)}%` : 'Download PDF'}
              </DownloadButton>
            </div>
          </ChapterHeader>
        )}

        {comicChapter && (
          <BookReader 
            images={comicChapter.images}
            title={removeHtmlEntities(comicChapter.metadata.title)}
          />
        )}

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