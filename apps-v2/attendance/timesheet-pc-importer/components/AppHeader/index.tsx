import * as React from 'react';

import styled from 'styled-components';

import Title from './Title';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  border-bottom: 1px solid #dddddd;
  height: 60px;
`;

const Header: React.FC<{
  OwnerEmployeeContainer: React.ComponentType;
}> = ({ OwnerEmployeeContainer }) => (
  <nav>
    <Container>
      <Title />
      <OwnerEmployeeContainer />
    </Container>
  </nav>
);

export default Header;
