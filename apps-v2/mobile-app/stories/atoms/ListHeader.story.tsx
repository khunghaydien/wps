import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { withKnobs } from '@storybook/addon-knobs';

import ListHeader from '../../components/atoms/ListHeader';

import './ListHeader.story.scss';

export default {
  title: 'Components/atoms/ListHeader',
  decorators: [withKnobs, withInfo],
};

export const Basic = () => (
  <div>
    <div className="list-header-body">
      <ListHeader onClick={action('onClick only header')}>
        LIST HEADER
      </ListHeader>
    </div>
    <div className="list-header-body">
      <ListHeader onClick={action('onClick 1st header')}>
        LIST HEADER 1
      </ListHeader>
      <ListHeader onClick={action('onClick 2nd header')}>
        LIST HEADER 2
      </ListHeader>
      <ListHeader onClick={action('onClick 3rd header')}>
        LIST HEADER 3
      </ListHeader>
      <ListHeader onClick={action('onClick 4th header')}>
        LIST HEADER 4
      </ListHeader>
    </div>
  </div>
);

Basic.story = {
  parameters: {
    info: {
      text: `
    # Description

    ListHeader コンポーネント

    # Props

    \`onClick\` コンポーネント全体をクリックできるようになっております。
      `,
    },
  },
};
