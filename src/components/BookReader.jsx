import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ViewVerticalIcon,
  ViewHorizontalIcon,
  EnterFullScreenIcon,
  ExitFullScreenIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ColumnsIcon,
  LockClosedIcon,
  LockOpen1Icon,
  HeightIcon,
  WidthIcon,
} from '@radix-ui/react-icons';

const ReaderContainer = styled(motion.div)`
  width: 100%;
  height: ${props => props.isFullscreen ? '100vh' : '100vh'};
  position: relative;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  display: flex;
  flex-direction: column;
  font-family: 'GeistVF', sans-serif;
`;

const ViewerCanvas = styled.div`
  flex: 1;
  position: relative;
  background: ${props => props.theme.background};
  display: flex;
  flex-direction: ${props => props.mode === 'vertical' ? 'column' : 'row'};
  align-items: center;
  justify-content: ${props => props.mode === 'vertical' ? 'flex-start' : 'center'};
  overflow: auto;

  /* Chrome, Safari, Edge scrollbar styles */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.background};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border};
    border-radius: 4px;
    
    &:hover {
      background: ${props => props.theme.text}40;
    }
  }

  /* Firefox scrollbar styles */
  scrollbar-width: thick;
  @media (max-width: 768px) {
   scrollbar-width: none; 
  }
  scrollbar-color: ${props => `${props.theme.border} ${props.theme.background}`};
`;

const PageWrapper = styled.div`
  position: relative;
  width: ${props => props.mode === 'vertical' ? '100%' : props.mode === 'double' ? '45%' : '90%'};
  height: ${props => props.mode === 'vertical' ? 'auto' : '100%'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${props => props.mode === 'vertical' ? '10px 0' : '0'};

  @media (max-width: 768px) {
    width: ${props => props.mode === 'vertical' ? '100%' : '90%'};
  }
`;

const PageImage = styled.img`
  max-width: 100%;
  max-height: ${props => props.fitToHeight ? 'calc(100vh - 50px)' : 'none'};
  width: ${props => props.fitToWidth ? '100%' : 'auto'};
  object-fit: contain;
  user-select: none;
`;

const ToolBar = styled(motion.div)`
  height: 50px;
  background: ${props => props.theme.background};
  border-top: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  font-family: 'GeistVF', sans-serif;

  @media (max-width: 768px) {
    height: 40px;
  }
`;

const ToolBarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    gap: 5px;
  }
`;

const ControlButton = styled.button`
  padding: 8px;
  background: transparent;
  border: none;
  color: ${props => props.active ? props.theme.primary : props.theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.hover};
    color: ${props => props.theme.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 6px;
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const PageNav = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'GeistVF', sans-serif;
  color: ${props => props.theme.text};

  @media (max-width: 768px) {
    gap: 5px;
    font-size: 12px;
  }
`;

const PageInput = styled.input`
  width: 50px;
  padding: 4px 8px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  text-align: center;
  font-family: 'GeistVF', sans-serif;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }

  @media (max-width: 768px) {
    width: 40px;
    padding: 2px 4px;
    font-size: 12px;
  }
`;

const UnlockButton = styled(ControlButton)`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px;
  border-radius: 50%;
`;
const SwipeOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BookReader = ({ images }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mode, setMode] = useState('vertical');
  const [fitToHeight, setFitToHeight] = useState(true);
  const [fitToWidth, setFitToWidth] = useState(false);
  const [isImmersive, setIsImmersive] = useState(false);
  const [showSwipeOverlay, setShowSwipeOverlay] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

    const navigatePage = React.useCallback((direction) => {
  if (mode !== 'vertical') {
    const newPage = currentPage + (mode === 'double' ? direction * 2 : direction);
    if (newPage >= 0 && newPage < images.length) {
      setCurrentPage(newPage);
      if (viewerRef.current) {
        viewerRef.current.scrollTo(0, 0);
      }
    }
  }
}, [currentPage, mode, images.length]);


   useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

   
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!isFullscreen) {
      setIsImmersive(false);
    }
  }, [isFullscreen]);

 useEffect(() => {
    if (!isMounted) return;

    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleKeyDown = (e) => {
      if (!isMounted) return;
      
      if (mode === 'vertical' && viewer) {
        const scrollAmount = 400;
        
        switch (e.key) {
          case 'ArrowUp':
          case 'k':
            viewer.scrollBy({
              top: -scrollAmount,
              behavior: 'smooth'
            });
            break;
          case 'ArrowDown':
          case 'j':
            viewer.scrollBy({
              top: scrollAmount,
              behavior: 'smooth'
            });
            break;
          case 'PageUp':
            viewer.scrollBy({
              top: -viewer.clientHeight,
              behavior: 'smooth'
            });
            break;
          case 'PageDown':
          case ' ':
            viewer.scrollBy({
              top: viewer.clientHeight,
              behavior: 'smooth'
            });
            break;
          case 'Home':
            viewer.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
            break;
          case 'End':
            viewer.scrollTo({
              top: viewer.scrollHeight,
              behavior: 'smooth'
            });
            break;
          default:
            break;
        }
      } else {
        switch (e.key) {
          case 'ArrowLeft':
          case 'h':
            navigatePage(-1);
            break;
          case 'ArrowRight':
          case 'l':
            navigatePage(1);
            break;
          default:
            break;
        }
      }
    };

    const handleTouchStart = (e) => {
      if (!isMounted) return;
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      if (!isMounted) return;
      touchEndX.current = e.touches[0].clientX;
      
      if (touchStartX.current && Math.abs(touchStartX.current - touchEndX.current) > 20) {
        setShowSwipeOverlay(true);
        setSwipeDirection(touchStartX.current - touchEndX.current > 0 ? 'left' : 'right');
      }
    };

    const handleTouchEnd = () => {
      if (!isMounted) return;
      if (!touchStartX.current || !touchEndX.current) return;

      const diffX = touchStartX.current - touchEndX.current;
      const threshold = 50;

      if (mode !== 'vertical') {
        if (Math.abs(diffX) > threshold) {
          if (diffX > 0) {
            navigatePage(1);
          } else {
            navigatePage(-1);
          }
        }
      }

      touchStartX.current = null;
      touchEndX.current = null;
      setShowSwipeOverlay(false);
      setSwipeDirection(null);
    };

    const cleanup = () => {
      if (viewer) {
        viewer.removeEventListener('touchstart', handleTouchStart);
        viewer.removeEventListener('touchmove', handleTouchMove);
        viewer.removeEventListener('touchend', handleTouchEnd);
      }
      document.removeEventListener('keydown', handleKeyDown);
    };

    viewer.addEventListener('touchstart', handleTouchStart);
    viewer.addEventListener('touchmove', handleTouchMove);
    viewer.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('keydown', handleKeyDown);

    return cleanup;
  }, [mode, currentPage, navigatePage, isMounted]);


  useEffect(() => {
    if (!isMounted) return;

    const viewer = viewerRef.current;
    if (!viewer || mode !== 'vertical') return;

    const handleScroll = () => {
      if (!isMounted) return;
      
      const scrollPosition = viewer.scrollTop;
      const pages = viewer.children;
      let currentPageIndex = 0;

      for (let i = 0; i < pages.length; i++) {
        if (pages[i].offsetTop > scrollPosition) {
          break;
        }
        currentPageIndex = i;
      }

      setCurrentPage(currentPageIndex);
    };

    viewer.addEventListener('scroll', handleScroll);
    return () => {
      if (viewer) {
        viewer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [mode, isMounted]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };




  const handlePageInput = (e) => {
    const page = parseInt(e.target.value) - 1;
    if (page >= 0 && page < images.length) {
      setCurrentPage(page);
      if (viewerRef.current && mode === 'vertical') {
        viewerRef.current.scrollTo({
          top: viewerRef.current.children[page].offsetTop,
          behavior: 'smooth'
        });
      }
    }
  };

  const toggleFitToHeight = () => {
    setFitToHeight(true);
    setFitToWidth(false);
  };

  const toggleFitToWidth = () => {
    setFitToWidth(true);
    setFitToHeight(false);
  };

  const renderPages = () => {
    if (mode === 'vertical') {
      return images.map((image, index) => (
        <PageWrapper key={index} mode={mode}>
          <PageImage
            src={image}
            alt={`Page ${index + 1}`}
            fitToHeight={fitToHeight}
            fitToWidth={fitToWidth}
          />
        </PageWrapper>
      ));
    }

    if (mode === 'double') {
      return (
        <>
          <PageWrapper mode={mode}>
            <PageImage
              src={images[currentPage]}
              alt={`Page ${currentPage + 1}`}
              fitToHeight={fitToHeight}
              fitToWidth={fitToWidth}
            />
          </PageWrapper>
          {currentPage + 1 < images.length && (
            <PageWrapper mode={mode}>
              <PageImage
                src={images[currentPage + 1]}
                alt={`Page ${currentPage + 2}`}
                fitToHeight={fitToHeight}
                fitToWidth={fitToWidth}
              />
            </PageWrapper>
          )}
        </>
      );
    }

    return (
      <PageWrapper mode={mode}>
        <PageImage
          src={images[currentPage]}
          alt={`Page ${currentPage + 1}`}
          fitToHeight={fitToHeight}
          fitToWidth={fitToWidth}
        />
      </PageWrapper>
    );
  };

  useEffect(() => {
    if (mode === 'vertical' && viewerRef.current) {
      const handleScroll = () => {
        const scrollPosition = viewerRef.current.scrollTop;
        const pages = viewerRef.current.children;
        let currentPageIndex = 0;

        for (let i = 0; i < pages.length; i++) {
          if (pages[i].offsetTop > scrollPosition) {
            break;
          }
          currentPageIndex = i;
        }

        setCurrentPage(currentPageIndex);
      };

      viewerRef.current.addEventListener('scroll', handleScroll);
      return () => viewerRef.current.removeEventListener('scroll', handleScroll);
    }
  }, [mode]);

  return (
    <ReaderContainer
      ref={containerRef}
      isFullscreen={isFullscreen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <ViewerCanvas ref={viewerRef} mode={mode}>
        {renderPages()}
      </ViewerCanvas>

      <AnimatePresence>
        {(!isImmersive || !isFullscreen) && (
          <ToolBar
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <ToolBarGroup>
              <ControlButton onClick={() => navigatePage(-1)} disabled={mode === 'vertical' || currentPage === 0}>
                <ArrowLeftIcon />
              </ControlButton>
              
              <PageNav>
                <PageInput
                  type="number"
                  min={1}
                  max={images.length}
                  value={currentPage + 1}
                  onChange={handlePageInput}
                />
                <span>/ {images.length}</span>
              </PageNav>

              <ControlButton onClick={() => navigatePage(1)} disabled={mode === 'vertical' || currentPage >= images.length - 1}>
                <ArrowRightIcon />
              </ControlButton>
            </ToolBarGroup>

            <ToolBarGroup>
              <ControlButton onClick={() => setMode('single')} active={mode === 'single'}>
                <ViewHorizontalIcon />
              </ControlButton>

              <ControlButton onClick={() => setMode('double')} active={mode === 'double'}>
                <ColumnsIcon />
              </ControlButton>

              <ControlButton onClick={() => setMode('vertical')} active={mode === 'vertical'}>
                <ViewVerticalIcon />
              </ControlButton>

              <ControlButton onClick={toggleFitToHeight} active={fitToHeight}>
                <HeightIcon />
              </ControlButton>

              <ControlButton onClick={toggleFitToWidth} active={fitToWidth}>
                <WidthIcon />
              </ControlButton>

              <ControlButton onClick={toggleFullscreen}>
                {isFullscreen ? <ExitFullScreenIcon /> : <EnterFullScreenIcon />}
              </ControlButton>

              {isFullscreen && (
                <ControlButton onClick={() => setIsImmersive(true)}>
                  <LockClosedIcon />
                </ControlButton>
              )}
            </ToolBarGroup>
          </ToolBar>
        )}
      </AnimatePresence>

      {isImmersive && isFullscreen && (
        <UnlockButton onClick={() => setIsImmersive(false)}>
          <LockOpen1Icon />
        </UnlockButton>
      )}
      <AnimatePresence>
        {showSwipeOverlay && (
          <SwipeOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ArrowLeftIcon 
              style={{ 
                opacity: swipeDirection === 'right' ? 1 : 0,
                transform: 'scale(2)'
              }} 
            />
            <ArrowRightIcon 
              style={{ 
                opacity: swipeDirection === 'left' ? 1 : 0,
                transform: 'scale(2)'
              }} 
            />
          </SwipeOverlay>
        )}
      </AnimatePresence>
    </ReaderContainer>
  );
};

export default BookReader;