// pages/SeriesDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchCategoryDetails } from '../services/comicApi';
import { getFullUrl, getSlugFromUrl } from '../utils/urlHelpers';
import LoadingBar from '../components/LoadingBar';
import { motion } from 'framer-motion';

const SeriesDetailsContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SeriesHeader = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const CoverImage = styled(motion.img)`
  width: 300px;
  height: 450px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const SeriesInfo = styled.div`
  flex: 1;
  min-width: 300px;
`;

const SeriesTitle = styled.h1`
  font-size: 2.5em;
  margin-bottom: 20px;
  color: ${props => props.theme.text};
`;

const ChapterList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  padding: 20px;
`;

const ChapterCard = styled(motion.div)`
  background: ${props => props.theme.background};
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const ChapterLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.theme.text};
  display: block;
  font-size: 1.1em;
  
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const StatItem = styled.div`
  background: ${props => props.theme.background};
  padding: 10px 20px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  span {
    color: ${props => props.theme.primary};
    font-weight: bold;
  }
`;

function SeriesDetails() {
  const { slug } = useParams();
  const [seriesDetails, setSeriesDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const removeHtmlEntities = (text) => {
    return text.replace(/&#\d+;/g, '');
  };

  const capitalizeFirstLetter = (string) => {
    return string.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const fullUrl = getFullUrl(slug, 'category');
        const response = await fetchCategoryDetails(fullUrl);
        setSeriesDetails(response);
      } catch (error) {
        console.error('Error fetching series details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [slug]);

  if (!seriesDetails && !loading) {
    return <div>No series details available.</div>;
  }

  return (
    <>
      <LoadingBar isLoading={loading} />
      <SeriesDetailsContainer>
        {seriesDetails && (
          <>
            <SeriesHeader>
              <CoverImage
                src={seriesDetails.coverImage}
                alt="Series Cover"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              />
              <SeriesInfo>
                <SeriesTitle>
                  {capitalizeFirstLetter(removeHtmlEntities(decodeURIComponent(slug.replace(/-/g, ' '))))}
                </SeriesTitle>
                <StatsContainer>
                  <StatItem>
                    Chapters: <span>{seriesDetails.chapters.length}</span>
                  </StatItem>
                  <StatItem>
                    Status: <span>Ongoing</span>
                  </StatItem>
                </StatsContainer>
              </SeriesInfo>
            </SeriesHeader>
            
            <ChapterList>
              {seriesDetails.chapters.map((chapter, index) => (
                <ChapterCard
                  key={chapter.url}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ChapterLink to={`/comics/chapter/${getSlugFromUrl(chapter.url)}`}>
                    {capitalizeFirstLetter(removeHtmlEntities(chapter.title))}
                  </ChapterLink>
                </ChapterCard>
              ))}
            </ChapterList>
          </>
        )}
      </SeriesDetailsContainer>
    </>
  );
}

export default SeriesDetails;