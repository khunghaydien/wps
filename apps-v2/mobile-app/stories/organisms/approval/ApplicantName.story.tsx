import * as React from 'react';

import { text, withKnobs } from '@storybook/addon-knobs';

import Component from '@apps/mobile-app/components/organisms/approval/ApplicantName';

export default {
  title: 'Components/organisms/approval',
  decorators: [withKnobs],
};

export const ApplicantName = (): React.ReactNode => (
  <Component
    employeeName={text('employeeName', 'EMPLOYEE_NAME')}
    delegatedEmployeeName={text(
      'delegatedEmployeeName',
      'DELEGATED_EMPLOYEE_NAME'
    )}
  />
);
