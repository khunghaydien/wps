import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import imgPhoto from '@commons/images/Sample_photo001.png';

import {
  defaultValue as dummyRequest,
  defaultValueWithManager as dummyRequestWithManager,
  reapplyValue,
} from '@attendance/domain/models/approval/__tests__/mocks/LegalAgreementRequest/MonthlyLegalAgreementRequest';
import {
  defaultValue as yearlyRequest,
  defaultValueWithManager as yearlyRequestWithManager,
} from '@attendance/domain/models/approval/__tests__/mocks/LegalAgreementRequest/YearlyLegalAgreementRequest';
import { STATUS } from '@attendance/domain/models/approval/LegalAgreementRequest';

import Component from '../Detail';

export default {
  title: 'approvals-pc/attendance/AttLegalAgreementProcess/Detail/index',
  decorators: [withKnobs],
};

export const MonthlyLegalAgreementRequestDefault = () => (
  <Component
    id={text('id', 'id')}
    approvalComment={text('approvalComment', 'APPROVAL COMMENT')}
    requestComment={text('requestComment', 'REQUEST COMMENT')}
    userPhotoUrl={imgPhoto}
    request={dummyRequest}
    originalRequestStatus={undefined}
    isExpanded={boolean('isExpanded', false)}
    togglePane={action('togglePane')}
    editComment={action('editComment')}
    onClickRejectButton={action('onClickRejectButton')}
    onClickApproveButton={action('onClickApproveButton')}
  />
);

export const MonthlyLegalAgreementRequestDefaultNoSpecial = () => (
  <Component
    id={text('id', 'id')}
    approvalComment={text('approvalComment', 'APPROVAL COMMENT')}
    requestComment={text('requestComment', 'REQUEST COMMENT')}
    userPhotoUrl={imgPhoto}
    request={dummyRequestWithManager}
    originalRequestStatus={undefined}
    isExpanded={boolean('isExpanded', false)}
    togglePane={action('togglePane')}
    editComment={action('editComment')}
    onClickRejectButton={action('onClickRejectButton')}
    onClickApproveButton={action('onClickApproveButton')}
  />
);

export const YearlyLegalAgreementRequestDefault = () => (
  <Component
    id={text('id', 'id')}
    approvalComment={text('approvalComment', 'APPROVAL COMMENT')}
    requestComment={text('requestComment', 'REQUEST COMMENT')}
    userPhotoUrl={imgPhoto}
    request={yearlyRequest}
    originalRequestStatus={undefined}
    isExpanded={boolean('isExpanded', false)}
    togglePane={action('togglePane')}
    editComment={action('editComment')}
    onClickRejectButton={action('onClickRejectButton')}
    onClickApproveButton={action('onClickApproveButton')}
  />
);

export const YearlyLegalAgreementRequestDefaultNoSpecial = () => (
  <Component
    id={text('id', 'id')}
    approvalComment={text('approvalComment', 'APPROVAL COMMENT')}
    requestComment={text('requestComment', 'REQUEST COMMENT')}
    userPhotoUrl={imgPhoto}
    request={yearlyRequestWithManager}
    originalRequestStatus={undefined}
    isExpanded={boolean('isExpanded', false)}
    togglePane={action('togglePane')}
    editComment={action('editComment')}
    onClickRejectButton={action('onClickRejectButton')}
    onClickApproveButton={action('onClickApproveButton')}
  />
);

export const CommonLongText = () => (
  <Component
    id={'id'}
    approvalComment={
      'APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT APPROVAL COMMENT'
    }
    requestComment={
      'REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT REQUEST COMMENT'
    }
    userPhotoUrl={imgPhoto}
    request={dummyRequest}
    originalRequestStatus={undefined}
    isExpanded={false}
    togglePane={action('togglePane')}
    editComment={action('editComment')}
    onClickRejectButton={action('onClickRejectButton')}
    onClickApproveButton={action('onClickApproveButton')}
  />
);

export const CommonExpanded = () => (
  <Component
    id={'id'}
    approvalComment={'APPROVAL COMMENT'}
    requestComment={'REQUEST COMMENT'}
    userPhotoUrl={imgPhoto}
    request={dummyRequest}
    originalRequestStatus={undefined}
    isExpanded={true}
    togglePane={action('togglePane')}
    editComment={action('editComment')}
    onClickRejectButton={action('onClickRejectButton')}
    onClickApproveButton={action('onClickApproveButton')}
  />
);

export const Reapply = () => (
  <Component
    id={'id'}
    approvalComment={'APPROVAL COMMENT'}
    requestComment={'REQUEST COMMENT'}
    userPhotoUrl={imgPhoto}
    request={reapplyValue}
    originalRequestStatus={STATUS.REAPPLYING}
    isExpanded={true}
    togglePane={action('togglePane')}
    editComment={action('editComment')}
    onClickRejectButton={action('onClickRejectButton')}
    onClickApproveButton={action('onClickApproveButton')}
  />
);
