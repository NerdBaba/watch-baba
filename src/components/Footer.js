import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color:  ${props => props.theme.background};
  padding: 10px;
  text-align: center;
`;

function Footer() {
  return (
    <FooterContainer>
      <p>&copy; 2024 Watch.Baba.</p>
    </FooterContainer>
  );
}

export default Footer;