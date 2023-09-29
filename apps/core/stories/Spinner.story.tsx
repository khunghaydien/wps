import React from 'react';

import styled from 'styled-components';

import { Spinner } from '../index';

const Container = styled.div`
  position: relative;
  background: darkslategray;
  height: 100vh;
  width: 100vw;
`;

export default {
  title: 'core/Spinner',
};

export const Default = () => (
  <>
    <Spinner size="x-small" />
    <Spinner size="small" />
    <Spinner size="medium" />
    <Spinner size="large" />
  </>
);

Default.storyName = 'default';

export const Base = () => (
  <>
    <Spinner variant="base" size="x-small" />
    <Spinner variant="base" size="small" />
    <Spinner variant="base" size="medium" />
    <Spinner variant="base" size="large" />
  </>
);

Base.storyName = 'base';

export const Inverse = () => (
  <>
    <Spinner variant="inverse" size="x-small" />
    <Spinner variant="inverse" size="small" />
    <Spinner variant="inverse" size="medium" />
    <Spinner variant="inverse" size="large" />
  </>
);

Inverse.storyName = 'inverse';
Inverse.decorators = [(story: Function) => <Container>{story()}</Container>];
