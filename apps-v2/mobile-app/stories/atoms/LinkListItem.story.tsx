import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { text, withKnobs } from '@storybook/addon-knobs';

import LinkListItem from '../../components/atoms/LinkListItem';

import './LinkListItem.story.scss';

export default {
  title: 'Components/atoms/LinkListItem',
  decorators: [withKnobs, withInfo],
};

export const Basic = () => (
  <div>
    <div className="list-item-body">
      <LinkListItem onClick={action('onClick only item')}>
        {text('children', 'LIST ITEM')}
      </LinkListItem>
    </div>
    <div className="list-item-body">
      <LinkListItem onClick={action('onClick 1st item')}>
        LIST ITEM 1
      </LinkListItem>
      <LinkListItem onClick={action('onClick 2nd item')}>
        LIST ITEM 2
      </LinkListItem>
      <LinkListItem onClick={action('onClick 3rd item')}>
        LIST ITEM 3
      </LinkListItem>
      <LinkListItem onClick={action('onClick 4th item')}>
        LIST ITEM 4
      </LinkListItem>
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
