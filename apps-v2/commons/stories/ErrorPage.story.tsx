import React from 'react';

import ErrorPage from '../components/ErrorPage';

import dummyError from './mock-data/dummyError';

export default {
  title: 'commons',
};

export const _ErrorPage = () => <ErrorPage error={dummyError} />;

_ErrorPage.storyName = 'ErrorPage';

_ErrorPage.parameters = {
  info: {
    text: '回復方法あり',
    propTables: [ErrorPage],
    inline: false,
    source: true,
  },
};
