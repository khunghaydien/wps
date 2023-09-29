import React from 'react';

import { action } from '@storybook/addon-actions';

import { STATUS } from '@attendance/domain/models/LegalAgreementRequest';

import Component from '../LegalAgreementRequestButton';

export default {
  title:
    'attendance/timesheet-pc/MainContent/Timesheet/LegalAgreementRequestButton',
};

export const Default = () => (
  <table>
    {Object.values(STATUS).map((status) => (
      <tr key={status}>
        <td>{status}</td>
        <td>
          <Component status={status} onClick={action(`${status}: onClick()`)} />
        </td>
      </tr>
    ))}
    <tr key="disabled">
      <td>Disabled</td>
      <td>
        <Component
          status={STATUS.NOT_REQUESTED}
          disabled={true}
          onClick={action('Disabled: onClick()')}
        />
      </td>
    </tr>
  </table>
);
