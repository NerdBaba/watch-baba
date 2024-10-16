import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { X as CloseIcon, Download as DownloadIcon } from 'react-feather';

const TorrentOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 1000;
  overflow-y: auto;
  padding-top: 60px;
`;

const TorrentContainer = styled.div`
  background-color: ${props => props.theme.background};
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: sticky;
  top: 0;
  right: 0;
  background-color: ${props => props.theme.background};
  border: none;
  color: ${props => props.theme.text};
  padding: 10px;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  z-index: 10;
`;

const TorrentList = styled.div`
  padding: 0 20px 20px;
`;

const TorrentCard = styled.div`
  background-color: ${props => props.theme.secondaryBackground};
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid ${props => props.theme.border};
`;

const TorrentName = styled.h3`
  color: ${props => props.theme.primary};
  margin: 0 0 10px;
  font-size: 16px;
  font-family: 'GeistVF', sans-serif;
  word-break: break-word;
  overflow-wrap: break-word;
  @media (max-width: 768px) {
    margin-right: 10px;
    font-size: 13px; 
  }
`;

const TorrentInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-family: 'GeistVF', sans-serif;
  color: ${props => props.theme.text};
  @media (max-width: 768px) {
   font-size: 11px;
    
  }
`;

const DownloadButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.background};
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;
const TorrentComponent = ({ tmdbId, onClose }) => {
  const [torrents, setTorrents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedBothRequests, setHasCompletedBothRequests] = useState(false);
  const [showNoTorrents, setShowNoTorrents] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let requestsCompleted = 0;

    const fetchTorrents = async () => {
      setIsLoading(true);
      setHasCompletedBothRequests(false);
      setShowNoTorrents(false);
      
      // First fetch from Torrentio
      try {
        const torrentioResponse = await axios.get(
          `https://torrentio.strem.fun/stream/movie/${tmdbId}.json`,
          { signal: controller.signal }
        );
        
        if (torrentioResponse.data.streams && torrentioResponse.data.streams.length > 0) {
          setTorrents(torrentioResponse.data.streams);
        }
      } catch (torrentioError) {
        if (torrentioError.name === 'AbortError') return;
        console.error('Error fetching from Torrentio:', torrentioError);
      } finally {
        requestsCompleted++;
      }

      // Then fetch from MediaFusion
      try {
        const mediaFusionResponse = await axios.get(
          `https://mediafusion.elfhosted.com/eJwBgAN__FPrI3nO0zSxMHhJIMgIOcEZ9kO7MMfE6l31fCKSUMxOJjC9koyvX_ZF4mv7wzDLHlXtwK1okhgu5E6Hu9f91FbEpyXIogx2A4ZHAAYKX98nJnp0PYznQCAbrmAUQpDm3u5SFnlA_gX3TQU4XerxnOqG-Z6LMhO_DgFNXRrkjbimMk8l_7CxEe1LCxqaI5wE5Qp6GgdrShfbI-WwIPMXUKh3upJWl1F_V2LgnSS2VpHHhhYtjHelZltV2TwvyKqq28UJ3K8wMAieAn4nsWAY41g8jL3-qm61ekkrwzchX_N1ou7EnHYI-RU6wlFoHarUldc6H65-4nMCxcMRMv6QAiY3zBydGZ5i1CCnEqmCKR1jXfCwg1zwRq0NLbf1kz90u11YOEJqH0v5SCwdLT7NreLz-LqeZGA6Ia4EJXp_49DqwcBdeF1Jj_Ls4_1qe4bBhsoZKZ6uP61Or6DV_7ZucNMhM5G0GAFbYJxAS4oNIYzY7oRw4o_vWzhECTofvqQvzQu_n2g8KWL5m0TZ8Gi87mVoS4-1zmnT4AW5pGyZxMgBcZdL5qLxwhBPnpzqCmpJ1hl85m8M4qqwFp7Ce3JxAl_pg4ZQZftEPheiyB8SxFlXcVIUuKNBoVCKxWptnL5rO9EsVOwU3UsOr7KHgTdoZlScmNBrHXVLic5El16rd5K6TypXxwyKkZylkfX9LmQxJx6VVDoiO2Gn2C279UTDuOn0e8dWQcS5U63_G2jQY7od8hkQAA8Bxr2CT8TV2seeIQcBkZzF_nN0GCWt3Gd_2fQzOqwTlnxnCdN6vRONx1K1484K7ZFhrhor5SGFgZxZNUD54BUUictUC04fgXxCJy3sWjZ3KG2SMSOHbvaY5zQFGY62Qm_VsS4rdurWVG0i0WnGJ6HxeCRwdyWl9rLwAs5_t3X-X68WkVJqSaJt3snvVEt0RNQgf1e7Z6cB1WIzP8ncIUXeA0GI0GcssRK_ga1Q6uK4LPgutE8o3bGGuHCcAhet6SOzdjMzzaI4sHwPxHwxpljG8agGqoDwLsY0dGGApIHGnxeY8P-69WzaqHGc0OxWyfSWEr5t7x3QCrgT1ZtIg4H2_R4IWdW-zFtoZmbGJ5UYeJRyxpTLoxTKY_EFCPpGSOE2K4NwGpHCa7XZ9GNNYQ_MZSyoGaGo80h0W3_yI80gfiPpXRi0RVjH475EzP63KA==/stream/movie/${tmdbId}.json`,
          { signal: controller.signal }
        );
        
        if (mediaFusionResponse.data.streams && mediaFusionResponse.data.streams.length > 0) {
          setTorrents(prevTorrents => [...prevTorrents, ...mediaFusionResponse.data.streams]);
        }
      } catch (mediaFusionError) {
        if (mediaFusionError.name === 'AbortError') return;
        console.error('Error fetching from MediaFusion:', mediaFusionError);
      } finally {
        requestsCompleted++;
        if (requestsCompleted === 2) {
          setHasCompletedBothRequests(true);
          setIsLoading(false);
          
          // If no torrents found, wait 3 seconds before showing the message
          if (torrents.length === 0) {
            setTimeout(() => {
              setShowNoTorrents(true);
            }, 3000);
          }
        }
      }
    };

    fetchTorrents();

    return () => {
      controller.abort();
    };
  }, [tmdbId]);

  const handleDownload = (infoHash) => {
    const magnetLink = `magnet:?xt=urn:btih:${infoHash}`;
    window.open(magnetLink, '_blank');
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <TorrentOverlay onClick={handleClose}>
      <TorrentContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>
          <CloseIcon size={24} />
        </CloseButton>
        <TorrentList>
          {!hasCompletedBothRequests && torrents.length === 0 ? (
            <div>Loading torrents...</div>
          ) : hasCompletedBothRequests && torrents.length === 0 ? (
            showNoTorrents ? <div>No torrents found</div> : <div>Loading torrents...</div>
          ) : (
            torrents.map((torrent, index) => {
              let name, fileSize, quality, language;

              if (torrent.description) {
                // MediaFusion format
                const descParts = torrent.description.split('\n');
                name = descParts[0].replace('📂 ', '');
                fileSize = descParts.find(part => part.includes('💾'))?.replace('💾 ', '') || '';
                language = descParts.find(part => part.includes('🌐'))?.replace('🌐 ', '') || '';
                quality = torrent.name.split('|')[0] || 'Unknown quality';
              } else {
                // Torrentio format
                const titleParts = torrent.title.split('\n');
                name = titleParts[0].replace('Torrentio\n', '');
                const infoMatch = titleParts[1]?.match(/👤 \d+ 💾 ([\d.]+\s[GM]B)/);
                fileSize = infoMatch ? infoMatch[1] : '';
                quality = torrent.name.split('|')[0].trim();
                language = titleParts[2] || '';
              }

              return (
                <TorrentCard key={index}>
                  <TorrentName>{name}</TorrentName>
                  <TorrentInfo>
                    <span>{fileSize} • {quality} • {language}</span>
                    <DownloadButton onClick={() => handleDownload(torrent.infoHash)}>
                      <DownloadIcon size={16} />
                      Download
                    </DownloadButton>
                  </TorrentInfo>
                </TorrentCard>
              );
            })
          )}
        </TorrentList>
      </TorrentContainer>
    </TorrentOverlay>
  );
};

export default TorrentComponent;