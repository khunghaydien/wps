import * as React from 'react';

import Component from '..';
import { Default as ContentContainer } from '../Content/__stories__/Container';
import { Default as HeaderContainer } from '../Header/__stories__/Container';

export const Default = () => (
  <Component {...{ HeaderContainer, ContentContainer }} />
);
