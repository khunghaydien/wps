import React from 'react';

import { action } from '@storybook/addon-actions';

import AccessControlContainer from '@apps/commons/containers/AccessControlContainer';

import { withProvider } from '../../../../../../.storybook/decorator/Provider';
import configureStore from '../../../store/configureStore';
import mockStore from '../../__stories__/mock-data/storeMock';
import Utilities from '../Utilities';

// @ts-ignore
const store = configureStore(mockStore);
export default {
  title: 'attendance/timesheet-pc/MainContent',
  decorators: [withProvider(store)],
};

export const _Utilities = () => (
  <Utilities
    onClickOpenSummaryWindowButton={action('onClickOpenSummaryWindowButton')}
    onClickOpenLeaveWindowButton={action('onClickOpenLeaveWindowButton')}
    AccessControlContainer={AccessControlContainer}
  />
);

_Utilities.parameters = {
  info: { propTables: [Utilities], inline: true, source: true },
};
