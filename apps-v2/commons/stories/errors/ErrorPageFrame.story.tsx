import React from 'react';

import ErrorPageFrame from '../../components/errors/ErrorPageFrame';

import iconErrorLarge from '../../images/iconErrorLarge.png';

export default {
  title: 'commons/errors',
};

export const _ErrorPageFrame = () => (
  <ErrorPageFrame
    title="SOMETHING WENT WRONG"
    icon={iconErrorLarge}
    solution="ブラウザをリロードして再度お試しください。"
  />
);

_ErrorPageFrame.storyName = 'ErrorPageFrame';

_ErrorPageFrame.parameters = {
  info: {
    text: 'FatalError版',
    propTables: [ErrorPageFrame],
    inline: false,
    source: true,
  },
};
