import React from 'react';

import { Icons, Spinner } from '../../../../../core';

import Snackbar from '../../ExploreInHierarchy/Snackbar';

export default {
  title: 'time-tracking/JobSelectDialog/ExploreInHierarchy/Snackbar',
};

export const Top = () => (
  <Snackbar
    isOpen
    addon={<Icons.Search color="base" />}
    message="LOOKING FOR...."
  />
);

Top.storyName = 'top';

export const Bottom = () => (
  <Snackbar
    isOpen
    align="bottom"
    addon={<Spinner size="x-small" variant="inverse" />}
    message="LOADING..."
  />
);

Bottom.storyName = 'bottom';
