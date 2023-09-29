import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import { defaultValue } from '@attendance/domain/models/approval/__tests__/mocks/AttAttendanceRequestDetail.mock';
import { CODE as ATTENTION_CODE } from '@attendance/domain/models/AttDailyAttention';

import Component from '@mobile/components/pages/approval/attendance/AttendanceRequestDetail';

export default {
  title: 'Components/pages/approval/attendance',
  decorators: [withKnobs],
};

export const AttendanceRequestDetail = (): React.ReactNode => {
  const isShowAttention = boolean('showAttention', true);
  const attentions = isShowAttention
    ? [
        {
          code: ATTENTION_CODE.INEFFECTIVE_WORKING_TIME,
          value: {
            fromTime: 7 * 60,
            toTime: 9 * 60,
          },
        },
        {
          code: ATTENTION_CODE.INSUFFICIENT_REST_TIME,
          value: 10,
        },
      ]
    : [];

  return (
    <Component
      record={{
        ...defaultValue.records[0],
        attentions,
      }}
      workingType={{
        useManageCommuteCount: boolean('useManageCommuteCount', true),
        useAllowanceManagement: boolean('useAllowanceManagement', true),
        useObjectivelyEventLog: boolean('useObjectivelyEventLog', true),
        useRestReason: boolean('useRestReason', true),
      }}
      comment={text('comment', 'comment')}
      onChangeComment={action('onChangeComment')}
      onClickApproveButton={action('onClickApproveButton')}
      onClickRejectButton={action('onClickRejectButton')}
      onClickBack={action('onClickBack')}
    />
  );
};
