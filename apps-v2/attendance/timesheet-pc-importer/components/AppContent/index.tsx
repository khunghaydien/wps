import * as React from 'react';

const Content: React.FC<{
  HeaderContainer: React.ComponentType;
  ContentContainer: React.ComponentType;
}> = ({ HeaderContainer, ContentContainer }) => (
  <div>
    <HeaderContainer />
    <ContentContainer />
  </div>
);

export default Content;
