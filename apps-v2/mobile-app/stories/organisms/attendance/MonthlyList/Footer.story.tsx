import React from 'react';

import { action } from '@storybook/addon-actions';
import { text, withKnobs } from '@storybook/addon-knobs';

import { ACTIONS_FOR_FIX } from '@attendance/domain/models/AttFixSummaryRequest';

import Footer from '@mobile/components/organisms/attendance/MonthlyList/Footer';

export default {
  title: 'Components/organisms/attendance/MonthlyList',
  decorators: [withKnobs],
};

export const FooterActionsForFixNone = (): React.ReactNode => (
  <Footer
    comment={text('comment', '')}
    onChangeComment={action('onChangeComment')}
    performableActionForFix={ACTIONS_FOR_FIX.None}
    onClickSendAttendanceRequest={action('onClickSendAttendanceRequest')}
  />
);

export const FooterActionsForFixSubmit = (): React.ReactNode => (
  <Footer
    comment={text('comment', '')}
    onChangeComment={action('onChangeComment')}
    performableActionForFix={ACTIONS_FOR_FIX.Submit}
    onClickSendAttendanceRequest={action('onClickSendAttendanceRequest')}
  />
);

export const FooterActionsForFixCancelApproval = (): React.ReactNode => (
  <Footer
    comment={text('comment', '')}
    onChangeComment={action('onChangeComment')}
    performableActionForFix={ACTIONS_FOR_FIX.CancelApproval}
    onClickSendAttendanceRequest={action('onClickSendAttendanceRequest')}
  />
);

export const FooterActionsForFixCancelRequest = (): React.ReactNode => (
  <Footer
    comment={text('comment', '')}
    onChangeComment={action('onChangeComment')}
    performableActionForFix={ACTIONS_FOR_FIX.CancelRequest}
    onClickSendAttendanceRequest={action('onClickSendAttendanceRequest')}
  />
);
