import React, { useEffect } from 'react';
import styled from 'styled-components';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const PageButton = styled.button`
  background-color: ${props => props.active ? props.theme.primary : props.theme.background};
  color: ${props => props.active ? props.theme.background : props.theme.text};
  border: 2px solid ${props => props.theme.primary};
  padding: 8px 12px;
  margin: 5px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  border-radius: 5px;
  font-size: 14px;

  @media (min-width: 768px) {
    padding: 10px 15px;
    font-size: 16px;
  }

  &:hover {
    background-color: ${props => props.theme.primary};
    color: ${props => props.theme.background};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.theme.primary}40;
  }
`;

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <PaginationContainer>
      {currentPage > 1 && (
        <PageButton onClick={() => onPageChange(currentPage - 1)}>Prev</PageButton>
      )}
      {startPage > 1 && (
        <>
          <PageButton onClick={() => onPageChange(1)}>1</PageButton>
          {startPage > 2 && <span>...</span>}
        </>
      )}
      {pageNumbers.map(number => (
        <PageButton
          key={number}
          active={number === currentPage}
          onClick={() => onPageChange(number)}
        >
          {number}
        </PageButton>
      ))}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span>...</span>}
          <PageButton onClick={() => onPageChange(totalPages)}>{totalPages}</PageButton>
        </>
      )}
      {currentPage < totalPages && (
        <PageButton onClick={() => onPageChange(currentPage + 1)}>Next</PageButton>
      )}
    </PaginationContainer>
  );
}

export default Pagination;