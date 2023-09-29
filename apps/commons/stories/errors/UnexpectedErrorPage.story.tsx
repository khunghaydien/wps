import React from 'react';

import UnexpectedErrorPage from '../../components/errors/UnexpectedErrorPage';

import apexError from '../mock-data/dummyApexError';
import fatalError from '../mock-data/dummyFatalError';

export default {
  title: 'commons/errors',
};

export const UnexpectedErrorPageWithFatalError = () => (
  <UnexpectedErrorPage error={fatalError} />
);

UnexpectedErrorPageWithFatalError.storyName =
  'UnexpectedErrorPage with FatalError';

UnexpectedErrorPageWithFatalError.parameters = {
  info: {
    text: 'FatalError版',
    propTables: [UnexpectedErrorPage],
    inline: false,
    source: true,
  },
};

export const UnexpectedErrorPageWithApexError = () => (
  <UnexpectedErrorPage error={apexError} />
);

UnexpectedErrorPageWithApexError.storyName =
  'UnexpectedErrorPage with ApexError';

UnexpectedErrorPageWithApexError.parameters = {
  info: {
    text: 'ApexError版',
    propTables: [UnexpectedErrorPage],
    inline: false,
    source: true,
  },
};
