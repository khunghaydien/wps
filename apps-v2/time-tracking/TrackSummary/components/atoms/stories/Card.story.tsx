import React from 'react';

import styled from 'styled-components';

import {
  Body,
  Card,
  Divider,
  Header,
  HeaderGroup,
  HeaderItem,
  Title,
} from '../Card';

const Container = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100vh;
`;

export default {
  title: 'time-tracking/TrackSummary/Cards',
  decorators: [(story: Function) => <Container>{story()}</Container>],
};

export const _Card = () => (
  <Card>
    <Header>
      <Title>Title</Title>
      <HeaderGroup>
        <HeaderItem>item</HeaderItem>
      </HeaderGroup>
      <HeaderGroup>
        <HeaderItem>right 1</HeaderItem>
        <HeaderItem>right 2</HeaderItem>
      </HeaderGroup>
    </Header>
    <Divider />
    <Body>Body</Body>
  </Card>
);

_Card.parameters = {
  info: { propTables: false, inline: false, source: true },
};
