import React from 'react';

import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import { withInfo } from '@storybook/addon-info';
import { text, withKnobs } from '@storybook/addon-knobs';

import SubmitWithCommentPage from '../../../components/pages/commons/SubmitWithCommentPage';

interface FCStory extends React.FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'Components/pages/commons',
  decorators: [withKnobs, withInfo],
};

export const _SubmitWithCommentPage: FCStory = () => (
  <SubmitWithCommentPage
    title={text('title', 'TITLE TITLE TITLE TITLE TITLE')}
    avatarUrl={text(
      'avatarUrl',
      'https://images.pexels.com/photos/89775/dog-hovawart-black-pet-89775.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
    )}
    submitLabel={text('submitLabel', 'Submit')}
    // @ts-ignore
    getBackLabel={action('getBackLabel')}
    onClickBack={action('onClickBack')}
    onClickSubmit={action('onClickSubmit')}
  />
);

_SubmitWithCommentPage.storyName = 'SubmitWithCommentPage';
_SubmitWithCommentPage.parameters = {
  info: {
    inline: false,
    styles: (stylesheet) => ({
      ...stylesheet,
      button: {
        ...stylesheet.button,
        topRight: {
          display: 'none',
        },
      },
    }),
    text: `
        # Description

        Common page for submitting request/report/approval with comment.
      `,
  },
};
