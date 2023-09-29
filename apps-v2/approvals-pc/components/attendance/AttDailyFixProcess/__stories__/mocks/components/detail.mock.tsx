import React from 'react';

import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

import sampleEmployeeIcon from '@apps/commons/images/Sample_photo001.png';

import { defaultValue as detailRequest } from '@apps/approvals-pc/models/attendance/__tests__/mocks/FixDailyRequestViewModel.mock';
import { histories } from '@apps/domain/models/approval/request/__test__/mocks/History';
import { defaultValue as listRequest } from '@attendance/domain/models/approval/__tests__/mocks/FixDailyRequest.mock';

import $ApproveForm from '../../../../../DetailParts/ApproveForm';
import $HistoryTable from '../../../../../DetailParts/HistoryTable';
import $Content from '../../../Detail/Content';
import $Header from '../../../Detail/Header';

export const Header: React.FC = () => (
  <$Header record={listRequest} onClickClose={action('onClickClose')} />
);

export const HistoryTable: React.FC = () => (
  <$HistoryTable historyList={histories} />
);

export const ApprovalForm: React.FC = () => (
  <$ApproveForm
    comment={text('comment', 'COMMENT COMMENT COMMENT')}
    onChangeApproveComment={action('onChangeApproveComment')}
    onClickApproveButton={action('onClickApproveButton')}
    onClickRejectButton={action('onClickRejectButton')}
    userPhotoUrl={sampleEmployeeIcon}
  />
);

export const Content = {
  Default: (): React.ReactNode => (
    <$Content
      request={detailRequest}
      closingDate={detailRequest.requestDate}
      expanded={false}
    />
  ),
  NotAttention: (): React.ReactNode => (
    <$Content
      request={{
        ...detailRequest,
        attention: {
          ineffectiveWorkingTime: 0,
          insufficientRestTime: 0,
        },
      }}
      closingDate={detailRequest.requestDate}
      expanded={false}
    />
  ),
};
