import React from 'react';

import styled from 'styled-components';

import LoadingScreen from '../LoadingScreen';

const Container = styled.div`
  height: 400px;
  width: 400px;
`;

export default {
  title: 'attendance/daily-allowance/loading-screen',
  decorators: [(story: Function) => <Container>{story()}</Container>],
};

export const _LoadingScreen = () => <LoadingScreen isLoading />;

_LoadingScreen.storyName = 'LoadingScreen';
