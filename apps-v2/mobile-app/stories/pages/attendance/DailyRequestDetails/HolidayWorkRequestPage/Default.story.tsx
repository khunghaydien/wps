import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';

import msg from '@apps/commons/languages';

import { SUBSTITUTE_LEAVE_TYPE } from '@attendance/domain/models/SubstituteLeaveType';

import Component from '../../../../../components/pages/attendance/DailyRequestDetails/HolidayWorkRequestPage';

import {
  compensatoryStocked,
  noSubstitute,
  reapply,
  substitute,
} from '../../../../mocks/holidayWorkRequests';
import store from '../../store.mock';

const substituteLeaveTypes = [
  SUBSTITUTE_LEAVE_TYPE.None,
  SUBSTITUTE_LEAVE_TYPE.Substitute,
  SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked,
];

const typeOptions = [
  {
    label: msg().Att_Lbl_DoNotUseReplacementDayOff,
    value: SUBSTITUTE_LEAVE_TYPE.None,
  },
  {
    label: msg().$Att_Lbl_SubstituteLeave,
    value: SUBSTITUTE_LEAVE_TYPE.Substitute,
  },
  {
    label: msg().Att_Lbl_CompensatoryLeave,
    value: SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked,
  },
];

export default {
  // FIXME: Typo...
  title:
    'Components/pages/attendance/DailyRequestDatails/HolidayWorkPage/Default',

  decorators: [
    (story: Function) => <Provider store={store}>{story()}</Provider>,
    (story: Function) => (
      <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ),
    withKnobs,
    withInfo,
  ],
};

export const NoSubstituteNoList = () => {
  return (
    <Component
      readOnly={false}
      request={{
        ...noSubstitute,
        substituteLeaveTypes: [SUBSTITUTE_LEAVE_TYPE.None],
      }}
      selectedPattern={null}
      typeOptions={typeOptions}
      validation={{}}
      onUpdateValue={action('Updated')}
    />
  );
};

NoSubstituteNoList.storyName = 'No Substitute (No list)';

export const NoSubstitute = () => {
  return (
    <Component
      readOnly={false}
      request={{
        ...noSubstitute,
        substituteLeaveTypes,
      }}
      selectedPattern={null}
      typeOptions={typeOptions}
      validation={{}}
      onUpdateValue={action('Updated')}
    />
  );
};

export const Substitute = () => {
  return (
    <Component
      readOnly={false}
      request={{
        ...substitute,
        substituteLeaveTypes,
      }}
      selectedPattern={null}
      typeOptions={typeOptions}
      validation={{}}
      onUpdateValue={action('Updated')}
    />
  );
};

export const CompensatoryStocked = () => {
  return (
    <Component
      readOnly={false}
      request={{ ...compensatoryStocked, substituteLeaveTypes }}
      selectedPattern={null}
      typeOptions={typeOptions}
      validation={{}}
      onUpdateValue={action('Updated')}
    />
  );
};

export const Reapply = () => {
  return (
    <Component
      readOnly={false}
      request={{ ...reapply, substituteLeaveTypes }}
      selectedPattern={null}
      typeOptions={typeOptions}
      validation={{}}
      onUpdateValue={action('Updated')}
    />
  );
};

export const ReadOnly = () => {
  return (
    <Component
      readOnly
      request={{ ...substitute, substituteLeaveTypes }}
      selectedPattern={null}
      typeOptions={typeOptions}
      validation={{}}
      onUpdateValue={action('Updated')}
    />
  );
};
