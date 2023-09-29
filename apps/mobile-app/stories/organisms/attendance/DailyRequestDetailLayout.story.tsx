import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import { defaultValue } from '../../../../domain/models/attendance/AttDailyRequest/BaseAttDailyRequest';

import Component from '../../../components/organisms/attendance/DailyRequestDetailLayout';

import ImgSample from '../../images/sample.png';
import store from './store.mock';

export default {
  title: 'Components/organisms/attendance',

  decorators: [
    (story: Function) => <Provider store={store}>{story()}</Provider>,
    (story: Function) => (
      <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ),
    withKnobs,
    withInfo,
  ],
};

export const DailyRequestDetailLayout = () => (
  // @ts-ignore
  <Component
    isLocked={boolean('isLocked', false)}
    isEditing={boolean('isEditing', false)}
    target={{
      ...defaultValue,
      requestTypeName: text('requestTypeName', 'NONE'),
      requestTypeCode: text('requestTypeCode', 'NONE'),
    }}
    editAction={text('editAction', 'None')}
    disableAction={text('disableAction', 'None')}
    approvalHistories={[
      {
        id: 'ID001',
        stepName: 'STEP NAME',
        approveTime: '2019-01-01 00:00',
        status: '',
        statusLabel: 'STATUS LABEL',
        approverName: 'APPROVER NAME',
        actorName: 'ACTOR NAME',
        actorPhotoUrl: ImgSample,
        comment: 'COMMENT',
        isDelegated: false,
      },
      {
        id: 'ID002',
        stepName: 'STEP NAME',
        approveTime: '2019-01-01 00:00',
        status: '',
        statusLabel: 'STATUS LABEL',
        approverName: 'APPROVER NAME',
        actorName: 'ACTOR NAME',
        actorPhotoUrl: ImgSample,
        comment: 'COMMENT',
        isDelegated: false,
      },
      {
        id: 'ID003',
        stepName: 'STEP NAME',
        approveTime: '2019-01-01 00:00',
        status: '',
        statusLabel: 'STATUS LABEL',
        approverName: 'APPROVER NAME',
        actorName: 'ACTOR NAME',
        actorPhotoUrl: ImgSample,
        comment: 'COMMENT',
        isDelegated: false,
      },
    ]}
    onClickBack={action('onClickBack')}
    onClickStartEditing={action('onClickStartEditing')}
    onClickCancelEditing={action('onClickCancelEditing')}
    onClickCreate={action('onClickCreate')}
    onClickModify={action('onClickModify')}
    onClickReapply={action('onClickReapply')}
    onClickCancelRequest={action('onClickCancelRequest')}
    onClickCancelApproval={action('onClickCancelApproval')}
    onClickRemove={action('onClickRemove')}
  >
    <div>STORYBOOK</div>
  </Component>
);

// FIXME: Typo...
DailyRequestDetailLayout.storyName = 'DailyReuqestDetailLayout';
DailyRequestDetailLayout.parameters = {
  info: {
    inline: false,
    text: `
      # Description

      各種勤怠申請詳細画面
    `,
  },
};
