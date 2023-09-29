import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { text, withKnobs } from '@storybook/addon-knobs';

import LevelLinkListItem from '../../../components/molecules/expense/LevelLinkListItem';

export default {
  title: 'Components/molecules/expense/LevelLinkListItem',
  decorators: [withKnobs, withInfo],
};

export const Basic = () => (
  <div>
    <div className="list-item-body">
      <LevelLinkListItem onClickBody={action('onClickBody only item')}>
        {text('children', 'LIST ITEM')}
      </LevelLinkListItem>
    </div>
    <div className="list-item-body">
      <LevelLinkListItem
        onClickBody={action('onClickBody 1st item')}
        onClickIcon={action('onClickIcon 1st item')}
      >
        LIST ITEM 1
      </LevelLinkListItem>
      <LevelLinkListItem
        onClickBody={action('onClickBody 2nd item')}
        onClickIcon={action('onClickIcon 2nd item')}
      >
        LIST ITEM 2
      </LevelLinkListItem>
      <LevelLinkListItem onClickBody={action('onClickBody 3rd item')}>
        LIST ITEM 3
      </LevelLinkListItem>
      <LevelLinkListItem onClickBody={action('onClickBody 4th item')}>
        LIST ITEM 4
      </LevelLinkListItem>
    </div>
  </div>
);

Basic.story = {
  parameters: {
    info: {
      text: `
    # Description

    LinkListItem コンポーネント

    # Props

    \`onClick\` コンポーネント全体をクリックできるようになっております。
      `,
    },
  },
};
