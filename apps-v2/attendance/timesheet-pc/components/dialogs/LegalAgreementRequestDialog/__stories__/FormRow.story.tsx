import * as React from 'react';

import { action } from '@storybook/addon-actions';

import AttTimeRangeField from '../../../../../../commons/components/fields/AttTimeRangeField';
import DateRangeField from '../../../../../../commons/components/fields/DateRangeField';
import TextField from '../../../../../../commons/components/fields/TextField';

import $FormRow from '../FormRow';

export default {
  title: 'attendance/timesheet-pc/dialogs/LegalAgreementRequestDialog',
};

export const FormRow = () => {
  return (
    <>
      <$FormRow labelText="テキスト">
        日本語日本語日本語日本語 EnglishEnglishEnglishEnglishEnglish
      </$FormRow>
      <$FormRow labelText="TextField">
        <TextField />
      </$FormRow>
      <$FormRow labelText="TimeRangeField">
        <AttTimeRangeField
          startTime="12:00"
          endTime="13:00"
          onBlurAtStart={action('onBlurAtStart')}
          onBlurAtEnd={action('onBlurAtEnd')}
          required
        />
      </$FormRow>
      <$FormRow labelText="DateRangeField">
        <DateRangeField
          startDateFieldProps={{
            disabled: true,
            value: '2020-03-12',
            onChange: action('onChange'),
          }}
          endDateFieldProps={{
            disabled: false,
            value: '2020-03-13',
            onChange: action('onChange'),
          }}
          required
        />
      </$FormRow>
    </>
  );
};
