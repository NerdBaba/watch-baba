import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import styled from 'styled-components';

const PlayerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const VideoWrapper = styled.div`
  width: 80%;
  max-width: 1000px;
`;

const Video = styled.video`
  width: 100%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
`;

const AudioSelector = styled.select`
  margin-top: 20px;
  padding: 10px;
  font-size: 16px;
`;

function AnimePlayer({ sources, subtitles, onClose, selectedAudio, onAudioChange }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [currentSource, setCurrentSource] = useState(null);

  useEffect(() => {
    if (sources && sources.length > 0) {
      setCurrentSource(sources[0].url);
    }
  }, [sources]);

  useEffect(() => {
    if (!currentSource) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(currentSource);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        videoRef.current.play();
      });
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = currentSource;
      videoRef.current.addEventListener('loadedmetadata', function() {
        videoRef.current.play();
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [currentSource]);

  useEffect(() => {
    if (subtitles && subtitles.length > 0 && videoRef.current) {
      // Remove existing tracks
      while (videoRef.current.firstChild) {
        videoRef.current.removeChild(videoRef.current.firstChild);
      }

      subtitles.forEach((subtitle) => {
        const track = document.createElement('track');
        track.kind = 'captions';
        track.label = subtitle.lang;
        track.srclang = subtitle.lang;
        track.src = subtitle.url;
        videoRef.current.appendChild(track);
      });
    }
  }, [subtitles]);

  return (
    <PlayerContainer>
      <CloseButton onClick={onClose}>&times;</CloseButton>
      <VideoWrapper>
        <Video ref={videoRef} controls />
      </VideoWrapper>
      <AudioSelector value={selectedAudio} onChange={(e) => onAudioChange(e.target.value)}>
        <option value="sub">Subbed</option>
        <option value="dub">Dubbed</option>
      </AudioSelector>
    </PlayerContainer>
  );
}

export default AnimePlayer;