import * as React from 'react';

import styled from 'styled-components';

const Container = styled.div`
  height: calc(100vh - 56px - 60px);
  width: 100%;
  overflow: scroll;
`;

const Content: React.FC<{
  TimesheetContainer: React.ComponentType;
}> = ({ TimesheetContainer }) => (
  <Container>
    <TimesheetContainer />
  </Container>
);

export default Content;
