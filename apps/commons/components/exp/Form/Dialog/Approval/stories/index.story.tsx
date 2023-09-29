import React from 'react';

import { action } from '@storybook/addon-actions';
import { createGlobalStyle } from 'styled-components';

import { expReport } from '../../../../__tests__/mocks/expReport.mock';
import ApprovalDialog from '../index';

const commonProps = {
  comment: 'Comment',
  title: 'Request Approval',
  mainButtonTitle: 'Request',
  expReport,
  errors: {},
  photoUrl:
    'https://images.pexels.com/photos/89775/dog-hovawart-black-pet-89775.jpeg?auto:compress&cs:tinysrgb&dpr:2&h:650&w:940',
  onChangeComment: action('No Action'),
  onClickHideDialogButton: action('No Action'),
  onClickMainButton: action('No Action'),
};
const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
  }
`;

export default {
  title: 'expenses-pc/Form/Dialog/ApprovalDialog',

  decorators: [
    (story) => (
      <div className="ts-expenses">
        <GlobalStyle />
        {story()}
      </div>
    ),
  ],
};

export const ApprovalDialogWithoutAttendanceWarning = () => (
  <ApprovalDialog {...commonProps} />
);

ApprovalDialogWithoutAttendanceWarning.storyName =
  'Approval Dialog without attendance warning';
