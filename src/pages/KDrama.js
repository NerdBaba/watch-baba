import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import KDramaCard from '../components/KDramaCard';
import Pagination from '../components/Pagination';
import { getPopularKDramas } from '../services/kDramaApi';
import LoadingScreen from '../components/LoadingScreen';

const KDramaContainer = styled.div`
  padding: 20px;
  @media (max-width: 768px) {
   padding: 5px; 
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 26px;
  color: ${props => props.theme.text};
  align-items: center;
  
&:before {
    content: '';
    display: inline-block;
    width: 7px;
    height: 26px;
    background-color: ${props => props.theme.primary};
    margin-right: 10px;
    margin-bottom: -3px;
    border-radius: 32px;
    @media (max-width: 768px) {
      height: 24px;
      margin-bottom: -4px;
    }
  }

  @media (max-width: 768px) {
    font-size: 20px;
  margin-bottom: 15px;
  }
`;

function KDrama() {
  const [dramas, setDramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchDramas = async () => {
      setLoading(true);
      try {
        const response = await getPopularKDramas(currentPage);
        setDramas(response.data.results);
        setTotalPages(response.data.hasNextPage ? currentPage + 1 : currentPage);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dramas:', error);
        setLoading(false);
      }
    };

    fetchDramas();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

if (loading) {
  return <LoadingScreen />;
}
  return (
    <KDramaContainer>
      <Title>Popular K-Dramas</Title>
      <GridContainer>
        {dramas.map((drama) => (
          <KDramaCard key={drama.id} drama={drama} />
        ))}
      </GridContainer>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </KDramaContainer>
  );
}

export default KDrama;