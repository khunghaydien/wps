import React from 'react';

import styled from 'styled-components';

import { Body, Cell, Header, HeaderCol, Row, Table } from '../Table';

const Container = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100vh;
`;

export default {
  title: 'time-tracking/TrackSummary',
  decorators: [(story: Function) => <Container>{story()}</Container>],
};

export const _Table = () => (
  <Table>
    <Header>
      <HeaderCol>A</HeaderCol>
      <HeaderCol>B</HeaderCol>
      <HeaderCol>C</HeaderCol>
    </Header>
    <Body>
      <Row>
        <Cell>1</Cell>
        <Cell>2</Cell>
        <Cell>3</Cell>
      </Row>
      <Row>
        <Cell>4</Cell>
        <Cell>5</Cell>
        <Cell>6</Cell>
      </Row>
    </Body>
  </Table>
);
