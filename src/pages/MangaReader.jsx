// src/pages/MangaReader.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import LoadingScreen from '../components/LoadingScreen';
import { FaExpand, FaCompress, FaBookmark } from 'react-icons/fa';
import { MdViewDay, MdViewWeek, MdViewStream, MdViewColumn } from 'react-icons/md';

const ReaderContainer = styled.div`
  position: relative;
  max-width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  padding: ${props => props.immersive ? '0' : '60px 20px 20px'};
  background: ${props => props.theme.background};
  transition: all 0.3s ease;
`;

const ControlPanel = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 10px 20px;
  background: ${props => props.theme.background}E6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  opacity: ${props => props.hidden ? 0 : 1};
  transition: opacity 0.3s ease;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    padding: 5px;
  }
`;

const Button = styled.button`
  background: ${props => props.theme.primary};
  color: ${props => props.theme.background};
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 5px;
  display: flex;
  align-items: center;
  gap: 5px;

  &.active {
    background: ${props => props.theme.primaryHover};
  }

  @media (max-width: 768px) {
    flex: 1 0 auto;
    margin: 2px;
    padding: 6px 10px;
    font-size: 12px;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: ${props => {
    switch (props.mode) {
      case 'longStrip': return 'column';
      case 'wideStrip': return 'row';
      default: return 'column';
    }
  }};
  justify-content: center;
  align-items: center;
  gap: 10px;
  overflow-x: ${props => props.mode === 'wideStrip' ? 'auto' : 'hidden'};
  overflow-y: auto;
  
  ${props => props.mode === 'wideStrip' && `
    width: 100%;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
  `}
`;

const PageWrapper = styled.div`
  flex: 0 0 ${props => props.mode === 'double' ? '50%' : '100%'};
  scroll-snap-align: start;
  display: flex;
  justify-content: center;
  max-width: ${props => {
    switch (props.mode) {
      case 'single': return '800px';
      case 'double': return '50%';
      case 'wideStrip': return '100%';
      case 'longStrip': return '800px';
      default: return '100%';
    }
  }};
`;

const Page = styled.img`
  max-width: 100%;
  height: auto;
  object-fit: contain;
`;

const ProgressBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  height: 3px;
  background: ${props => props.theme.primary};
  width: ${props => props.progress}%;
  transition: width 0.3s;
  z-index: 1001;
`;

const ChapterInfo = styled.div`
  position: fixed;
  top: 70px;
  right: 20px;
  background: ${props => props.theme.background}E6;
  padding: 10px;
  border-radius: 5px;
  backdrop-filter: blur(5px);
  z-index: 999;
  opacity: ${props => props.hidden ? 0 : 1};
  transition: opacity 0.3s ease;
`;

function MangaReader() {
  const { id, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [viewMode, setViewMode] = useState(() => 
    localStorage.getItem('mangaViewMode') || 'single'
  );
  const [isImmersive, setIsImmersive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [controlsHidden, setControlsHidden] = useState(false);
  const containerRef = useRef(null);
  const lastMoveTime = useRef(Date.now());

  useEffect(() => {
    localStorage.setItem('mangaViewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await axios.get(`https://simple-proxy.mda2233.workers.dev/?destination=https://mangahook-api-jfg5.onrender.com/api/manga/${id}/${chapterId}`);
        setChapter(response.data);
      } catch (error) {
        console.error('Error fetching chapter:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapter();
  }, [id, chapterId]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const newProgress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setProgress(Math.min(newProgress, 100));

    lastMoveTime.current = Date.now();
    setControlsHidden(false);
  }, []);

  useEffect(() => {
    const hideControlsTimer = setInterval(() => {
      if (Date.now() - lastMoveTime.current > 3000) {
        setControlsHidden(true);
      }
    }, 1000);

    return () => clearInterval(hideControlsTimer);
  }, []);

  const toggleImmersive = () => {
    setIsImmersive(!isImmersive);
    setControlsHidden(false);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Implement actual bookmark functionality here
  };

  if (isLoading) return <LoadingScreen />;
  if (!chapter) return <div>Chapter not found</div>;

  return (
    <ReaderContainer 
      immersive={isImmersive}
      onMouseMove={() => {
        lastMoveTime.current = Date.now();
        setControlsHidden(false);
      }}
    >
      <ControlPanel hidden={controlsHidden}>
        <Button 
          onClick={() => setViewMode('single')}
          className={viewMode === 'single' ? 'active' : ''}
        >
          <MdViewDay /> Single
        </Button>
        <Button 
          onClick={() => setViewMode('double')}
          className={viewMode === 'double' ? 'active' : ''}
        >
          <MdViewWeek /> Double
        </Button>
        <Button 
          onClick={() => setViewMode('wideStrip')}
          className={viewMode === 'wideStrip' ? 'active' : ''}
        >
          <MdViewStream /> Wide Strip
        </Button>
        <Button 
          onClick={() => setViewMode('longStrip')}
          className={viewMode === 'longStrip' ? 'active' : ''}
        >
          <MdViewColumn /> Long Strip
        </Button>
        <Button onClick={toggleBookmark}>
          <FaBookmark /> {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </Button>
        <Button onClick={toggleImmersive}>
          {isImmersive ? <FaCompress /> : <FaExpand />}
        </Button>
      </ControlPanel>

      <ChapterInfo hidden={controlsHidden}>
        Chapter {chapter.number}: {chapter.title}
      </ChapterInfo>

      <ImageContainer 
        ref={containerRef}
        mode={viewMode}
        onScroll={handleScroll}
      >
        {chapter.images.map((image, index) => (
          <PageWrapper key={index} mode={viewMode}>
            <Page
              src={image.image}
              alt={`Page ${index + 1}`}
              loading="lazy"
            />
          </PageWrapper>
        ))}
      </ImageContainer>

      <ProgressBar progress={progress} />
    </ReaderContainer>
  );
}

export default MangaReader;