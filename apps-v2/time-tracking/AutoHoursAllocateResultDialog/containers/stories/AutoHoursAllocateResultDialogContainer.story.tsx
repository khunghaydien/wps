/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Provider } from 'react-redux';

import { action } from '@storybook/addon-actions';
import { number, withKnobs } from '@storybook/addon-knobs';
import { Story } from '@storybook/react';

import { State } from '../../modules';

import configureStore from '../../store/configureStore';
import AutoHoursAllocateResultDialogContainer from '../AutoHoursAllocateResultDialogContainer';

const render = (state: State) => (
  <Provider store={configureStore(state)}>
    <AutoHoursAllocateResultDialogContainer
      empId={''}
      targetDate="2022-2-21"
      onClose={action('onClose')}
      onApply={action('onApply')}
      timeOfAttendance={100}
      timeOfExternalTaskTime={100}
    />
  </Provider>
);

export default {
  title:
    'time-tracking/AutoHoursAllocateResultDialog/AutoHoursAllocateResultDialogContainer',
  decorators: [withKnobs],
};

export const Standard: Story = () => {
  const mockState: State = {
    common: {
      app: { loadingDepth: number('common.app.loadingDepth', 0) } as any,
      accessControl: { permission: {} as any },
      toast: {} as any,
    },
    ui: {
      blocking: {} as any,
      allocateResult: {
        selectedTime: 200,
      } as any,
    },
    entities: {
      jobList: {} as any,
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
    ui: { blocking: { enabled: true }, allocateResult: {} as any },
    entities: {
      jobList: {} as any,
    },
  };

  return render(mockState);
};
