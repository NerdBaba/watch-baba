import React from 'react';
import styled from 'styled-components';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageButton = styled.button`
  background-color: ${props => props.active ? props.theme.primary : props.theme.background};
  color: ${props => props.active ? props.theme.background : props.theme.text};
  border: 2px solid ${props => props.theme.primary};
  padding: 10px 15px;
  margin: 0 5px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  border-radius: 5px;

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

  for (let i = 1; i <= Math.min(totalPages, 5); i++) {
    pageNumbers.push(i);
  }

  return (
    <PaginationContainer>
      {currentPage > 1 && (
        <PageButton onClick={() => onPageChange(currentPage - 1)}>Prev</PageButton>
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
      {currentPage < totalPages && (
        <PageButton onClick={() => onPageChange(currentPage + 1)}>Next</PageButton>
      )}
    </PaginationContainer>
  );
}

export default Pagination;