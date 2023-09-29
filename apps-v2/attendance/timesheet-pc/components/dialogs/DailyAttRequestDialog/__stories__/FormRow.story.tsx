import * as React from 'react';

import { action } from '@storybook/addon-actions';

import AttTimeRangeField from '../../../../../../commons/components/fields/AttTimeRangeField';
import DateRangeField from '../../../../../../commons/components/fields/DateRangeField';
import RadioGroupField from '../../../../../../commons/components/fields/RadioGroupField';
import SelectField from '../../../../../../commons/components/fields/SelectField';
import TextField from '../../../../../../commons/components/fields/TextField';

import FormRow from '../FormRow';

const options = [
  {
    value: 'leave1',
    text: '日数管理休暇',
  },
  {
    value: 'leave2',
    text: '年次有給休暇',
  },
  {
    value: 'leave3',
    text: '無給休暇',
  },
];

export default {
  title: 'attendance/timesheet-pc/dialogs/DailyAttRequestDialog',
};

export const _FormRow = () => {
  return (
    <>
      <FormRow labelText="テキスト">
        日本語日本語日本語日本語 EnglishEnglishEnglishEnglishEnglish
      </FormRow>
      <FormRow labelText="TextField">
        <TextField />
      </FormRow>
      <FormRow labelText="AttTimeRangeField">
        <AttTimeRangeField
          startTime="12:00"
          endTime="13:00"
          onBlurAtStart={action('onBlurAtStart')}
          onBlurAtEnd={action('onBlurAtEnd')}
          required
        />
      </FormRow>
      <FormRow labelText="DateRangeField">
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
      </FormRow>
      <FormRow labelText="SelectField">
        <SelectField options={options} />
      </FormRow>
      <FormRow labelText="RadioGroupField">
        <RadioGroupField
          layout="vertical"
          options={options}
          value="leave2"
          onChange={action('onChange')}
        />
      </FormRow>
    </>
  );
};

_FormRow.storyName = 'FormRow';
