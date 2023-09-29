import React from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import { withInfo } from '@storybook/addon-info';
import { boolean, withKnobs } from '@storybook/addon-knobs';

import LoadingPage from '../../../components/organisms/commons/LoadingPage';

interface FCStory extends React.FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'Components/organisms',
  decorators: [withKnobs, withInfo],
};

export const _LoadingPage: FCStory = () => (
  <LoadingPage isShowing={boolean('isShowing', true)} />
);

_LoadingPage.storyName = 'LoadingPage';
_LoadingPage.parameters = {
  info: {
    inline: false,
    text: `
    ページの表示を待っている間に表示されるコンテンツ
  `,
  },
};
