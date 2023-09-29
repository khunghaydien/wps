import React from 'react';

import { action } from '@storybook/addon-actions';

import DateRangeField from '../../components/fields/DateRangeField';

export default {
  title: 'commons/fields',
};

export const _DateRangeField = () => (
  <DateRangeField
    startDateFieldProps={
      { onChange: action('on StartDateField change') } as any
    }
    endDateFieldProps={{ onChange: action('on EndDateField change') } as any}
  />
);

_DateRangeField.storyName = 'DateRangeField';

_DateRangeField.parameters = {
  info: { propTables: [DateRangeField], inline: true, source: true },
};
