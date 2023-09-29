/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Provider } from 'react-redux';

import { action } from '@storybook/addon-actions';
import { number, withKnobs } from '@storybook/addon-knobs';
import { Story } from '@storybook/react';

import CoreProvider from '@apps/core/contexts';

import { State } from '../../modules';

import configureStore from '../../store/configureStore';
import AutoHoursAllocateDictDialogContainer from '../AutoHoursAllocateDictDialogContainer';

const render = (state: State) => (
  <Provider store={configureStore(state)}>
    <CoreProvider>
      <AutoHoursAllocateDictDialogContainer
        onClose={action('onClose')}
        empId={''}
        targetDate="2020-3-15"
      />
    </CoreProvider>
  </Provider>
);

export default {
  title:
    'time-tracking/AutoHoursAllocateDictDialog/AutoHoursAllocateDictDialogContainer',
  decorators: [withKnobs],
};

export const Standard: Story = () => {
  const mockState: State = {
    common: {
      app: { loadingDepth: number('common.app.loadingDepth', 0) } as any,
      accessControl: { permission: {} as any },
      toast: {} as any,
    },
    entities: {
      jobList: {
        byId: {},
        allIds: [],
      },
    },
    ui: {
      blocking: {} as any,
      allocateDic: { byKey: {}, allKeys: [], errors: [] },
      basicSetting: {} as any,
    },
  };

  return render(mockState);
};

export const AnyErrorOccurred: Story = () => {
  const mockState: State = {
    common: {
      app: {} as any,
      accessControl: { permission: {} as any },
      toast: { isShow: true, message: 'Any Error Message', variant: 'error' },
    },
    entities: {
      jobList: {
        byId: {},
        allIds: [],
      },
    },
    ui: {
      blocking: {} as any,
      allocateDic: { byKey: {}, allKeys: [], errors: [] },
      basicSetting: {} as any,
    },
  };

  return render(mockState);
};
