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
  patterns,
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
    'Components/pages/attendance/DailyRequestDatails/HolidayWorkPage/EnabledPatternApply',

  decorators: [
    (story: Function) => <Provider store={store}>{story()}</Provider>,
    (story: Function) => (
      <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ),
    withKnobs,
    withInfo,
  ],
};
export const NoSubstitute = () => (
  <Component
    readOnly={false}
    request={{
      ...noSubstitute,
      substituteLeaveTypes,
      patterns,
      patternCode: patterns[1].code,
      enabledPatternApply: true,
    }}
    selectedPattern={patterns[1]}
    typeOptions={typeOptions}
    validation={{}}
    onUpdateValue={action('Updated')}
  />
);

export const WithDirectInput = () => {
  return (
    <Component
      readOnly={false}
      request={{
        ...noSubstitute,
        substituteLeaveTypes,
        patterns,
        patternCode: patterns[0].code,
        enabledPatternApply: true,
      }}
      selectedPattern={patterns[0]}
      typeOptions={typeOptions}
      validation={{}}
      onUpdateValue={action('Updated')}
    />
  );
};

export const WithNoList = () => {
  return (
    <Component
      readOnly={false}
      request={{
        ...noSubstitute,
        substituteLeaveTypes,
        patterns: [patterns[0]],
        patternCode: patterns[0].code,
        enabledPatternApply: true,
      }}
      selectedPattern={patterns[0]}
      typeOptions={typeOptions}
      validation={{}}
      onUpdateValue={action('Updated')}
    />
  );
};

export const JpFlex = () => {
  return (
    <Component
      readOnly={false}
      request={{
        ...noSubstitute,
        substituteLeaveTypes,
        patterns: [patterns[2]],
        patternCode: patterns[2].code,
        enabledPatternApply: true,
      }}
      selectedPattern={patterns[2]}
      typeOptions={typeOptions}
      validation={{}}
      onUpdateValue={action('Updated')}
    />
  );
};

export const JpFlexWithoutCoreTime = () => {
  return (
    <Component
      readOnly={false}
      request={{
        ...noSubstitute,
        substituteLeaveTypes,
        patterns: [patterns[3]],
        patternCode: patterns[3].code,
        enabledPatternApply: true,
      }}
      selectedPattern={patterns[3]}
      typeOptions={typeOptions}
      validation={{}}
      onUpdateValue={action('Updated')}
    />
  );
};

export const JpDiscretion = () => {
  return (
    <Component
      readOnly={false}
      request={{
        ...noSubstitute,
        substituteLeaveTypes,
        patterns: [patterns[4]],
        patternCode: patterns[4].code,
        enabledPatternApply: true,
      }}
      selectedPattern={patterns[4]}
      typeOptions={typeOptions}
      validation={{}}
      onUpdateValue={action('Updated')}
    />
  );
};

export const JpManager = () => {
  return (
    <Component
      readOnly={false}
      request={{
        ...noSubstitute,
        substituteLeaveTypes,
        patterns: [patterns[5]],
        patternCode: patterns[5].code,
        enabledPatternApply: true,
      }}
      selectedPattern={patterns[5]}
      typeOptions={typeOptions}
      validation={{}}
      onUpdateValue={action('Updated')}
    />
  );
};

export const JpModified = () => {
  return (
    <Component
      readOnly={false}
      request={{
        ...noSubstitute,
        substituteLeaveTypes,
        patterns: [patterns[6]],
        patternCode: patterns[6].code,
        enabledPatternApply: true,
      }}
      selectedPattern={patterns[6]}
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
        patterns,
        patternCode: patterns[0].code,
        enabledPatternApply: true,
      }}
      selectedPattern={patterns[0]}
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
      request={{
        ...compensatoryStocked,
        substituteLeaveTypes,
        patterns,
        patternCode: patterns[1].code,
        enabledPatternApply: true,
      }}
      selectedPattern={patterns[1]}
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
      request={{
        ...reapply,
        substituteLeaveTypes,
        patterns,
        patternCode: patterns[1].code,
        enabledPatternApply: true,
      }}
      selectedPattern={patterns[1]}
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
      request={{
        ...noSubstitute,
        substituteLeaveTypes,
        patterns,
        patternCode: patterns[1].code,
        enabledPatternApply: true,
      }}
      selectedPattern={patterns[1]}
      typeOptions={typeOptions}
      validation={{}}
      onUpdateValue={action('Updated')}
    />
  );
};
