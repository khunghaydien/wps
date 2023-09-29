import * as React from 'react';

import { action } from '@storybook/addon-actions';

import DateRangeField from '../DateRangeField';

export default {
  title: 'timesheet-pc/dialogs/fields/DateRangeField',
};

export const Default = () => (
  <DateRangeField
    startDateFieldProps={{
      value: '2020/03/18',
      maxDate: '2020/03/30',
      onChange: () => action('onChange'),
    }}
    endDateFieldProps={{
      value: '2020/03/19',
      minDate: '2020/03/15',
      onChange: () => action('onChange'),
    }}
    onChangeHasRange={action('onChangeHasRange')}
    hasRange={false}
  />
);

Default.storyName = 'default';

export const HasRange = () => (
  <DateRangeField
    startDateFieldProps={{
      value: '2020/03/18',
      maxDate: '2020/03/30',
      onChange: () => action('onChange'),
    }}
    endDateFieldProps={{
      value: '2020/03/19',
      minDate: '2020/03/15',
      onChange: () => action('onChange'),
    }}
    onChangeHasRange={action('onChangeHasRange')}
    hasRange
  />
);

HasRange.storyName = 'hasRange';

export const StartDateDisabled = () => (
  <DateRangeField
    startDateFieldProps={{
      disabled: true,
      showsIcon: false,
      value: '2020/03/18',
      maxDate: '2020/03/30',
      onChange: () => action('onChange'),
    }}
    endDateFieldProps={{
      value: '2020/03/19',
      minDate: '2020/03/15',
      onChange: () => action('onChange'),
    }}
    onChangeHasRange={action('onChangeHasRange')}
    hasRange
  />
);

StartDateDisabled.storyName = 'startDate Disabled';

export const EndDateDisabled = () => (
  <DateRangeField
    startDateFieldProps={{
      value: '2020/03/18',
      maxDate: '2020/03/30',
      onChange: () => action('onChange'),
    }}
    endDateFieldProps={{
      disabled: true,
      showsIcon: false,
      value: '2020/03/19',
      minDate: '2020/03/15',
      onChange: () => action('onChange'),
    }}
    onChangeHasRange={action('onChangeHasRange')}
    hasRange
  />
);

EndDateDisabled.storyName = 'endDate Disabled';
