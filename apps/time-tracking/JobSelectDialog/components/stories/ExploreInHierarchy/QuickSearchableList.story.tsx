import React from 'react';

import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

import QuickSearchableList from '../../ExploreInHierarchy/QuickSearchableList';

const Center = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
`;

const generateJobs = (): { name: string; id: string; code: string }[] => {
  return [...Array(100)].map((_, i) => {
    if (i < 50) {
      return {
        name: `Development`,
        id: `${i}`,
        code: `${i}`,
      };
    } else {
      return {
        name: `Meeting`,
        id: `${i}`,
        code: `${i - 50}`,
      };
    }
  });
};

const Item = styled.div`
  height: 44px;
`;

export default {
  title: 'time-tracking/JobSelectDialog/ExploreInHierarchy/QuickSearchableList',
  decorators: [(story: Function) => <Center>{story()}</Center>],
};

export const Basic = () => (
  <QuickSearchableList
    isTall={false}
    items={generateJobs()}
    onSearch={action('onSearch')}
  >
    {(
      item // TODO: Replace Item to JobItem
    ) => (
      <Item>
        {item.name} {item.code}
      </Item>
    )}
  </QuickSearchableList>
);

Basic.storyName = 'Basic';

export const NotFound = () => (
  <QuickSearchableList
    isTall={false}
    items={[]}
    isLoadDone
    onSearch={action('onSearch')}
  >
    {(
      item // TODO: Replace Item to JobItem
    ) => (
      <Item>
        {item.name} {item.code}
      </Item>
    )}
  </QuickSearchableList>
);

NotFound.storyName = 'Records Not Found';
