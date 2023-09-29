import React from 'react';

import styled from 'styled-components';

import VirtualizedList from '../components/VirtualizedList';

const Center = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
`;

const generateArray = (): { name: string; id: string; code: string }[] => {
  return [...Array(100)].map((_, i) => ({
    name: `開発 ${i}`,
    id: `${i}`,
    code: '1',
  }));
};

const Item = styled.div`
  height: 44px;
`;

export default {
  title: 'commons/VirtualizedList',
  decorators: [(Story) => <Center>{<Story />}</Center>],
};

export const Basic = () => (
  <VirtualizedList items={generateArray()}>
    {(item) => {
      return <Item>{item.name}</Item>;
    }}
  </VirtualizedList>
);

Basic.storyName = 'VirtualizedList';
