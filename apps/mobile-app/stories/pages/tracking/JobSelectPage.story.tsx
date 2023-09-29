import React from 'react';
import { BrowserRouter as ReactRouter } from 'react-router-dom';

import { action } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';

/* eslint-disable import/no-extraneous-dependencies */
import JobSelectPage from '../../../components/pages/tracking/JobSelectPage';

import { withProvider } from '../../../../../.storybook-sp/decorator/Provider';
import configureStore from '../../../store/configureStore';
import storeMock from '../../mocks/store.mock';

const Router = ReactRouter as React.ComponentType<
  React.ComponentProps<typeof ReactRouter> & { children: React.ReactNode }
>;

const store = configureStore(storeMock);

export default {
  title: 'Components/pages/tracking',
  decorators: [
    withKnobs,
    withProvider(store),
    (story: (...args: Array<any>) => any) => <Router>{story()}</Router>,
  ],
};

export const _JobSelectPage = () => (
  <JobSelectPage
    isRoot={boolean('isRoot', true)}
    onClickBack={action('onClickBack')}
    onClickCancel={action('onClickCancel')}
    onClickChildJob={action('onClickChildJob')}
    onClickJob={action('onClickJob')}
  />
);

_JobSelectPage.storyName = 'JobSelectPage';
