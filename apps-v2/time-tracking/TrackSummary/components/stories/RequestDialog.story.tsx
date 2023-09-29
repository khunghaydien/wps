import React from 'react';

import { action } from '@storybook/addon-actions';
import { text, withKnobs } from '@storybook/addon-knobs';

import { withProvider } from '../../../../../.storybook/decorator/Provider';
import configureStore from '../../store/configureStore';
import RequestDialog from '../RequestDialog';

import '../RequestDialog.scss';

const store = configureStore();

export default {
  title: 'time-tracking/TrackSummary/RequestDialog',
  decorators: [withProvider(store), withKnobs],
};

export const _RequestDialog = () => (
  <RequestDialog
    status="NotRequested"
    userPhotoUrl={text(
      'photoUrl',
      'https://cdn.onlinewebfonts.com/svg/img_415067.png'
    )}
    comment={text('comment', 'comment')}
    approverName={text('approverName', 'Manager')}
    onChangeComment={action('onChangeComment')}
    onClickClose={action('onClickClose')}
    // @ts-ignore
    onClickSubmit={action('onClickSubmit')}
  />
);

_RequestDialog.storyName = 'RequestDialog';
