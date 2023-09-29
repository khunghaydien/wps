import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { text, withKnobs } from '@storybook/addon-knobs';

import { defaultValue } from '@attendance/domain/models/approval/__tests__/mocks/AttAttendanceRequestDetail.mock';

import Component from '@mobile/components/pages/approval/attendance/AttendanceRequest';

export default {
  title: 'Components/pages/approval/attendance',
  decorators: [withKnobs],
};

export const AttendanceRequest = (): React.ReactNode => (
  <Component
    request={defaultValue}
    onClickRow={action('onClickRow')}
    comment={text('comment', 'comment')}
    onChangeComment={action('onChangeComment')}
    onClickApproveButton={action('onClickApproveButton')}
    onClickRejectButton={action('onClickRejectButton')}
    onClickBack={action('onClickBack')}
  />
);
