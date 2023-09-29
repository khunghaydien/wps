import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';

import Component from '..';
import DateSelector from '../DateSelector';

export const Default = () => (
  <Component
    disabledRegistering={boolean('disabledRegistering', false)}
    disabledChecking={boolean('disabledChecking', false)}
    onClickFetchContractedWorkTimes={action('onClickFetchContractedWorkTime()')}
    onClickCheckTimesheet={action('onClickCheckTimesheet()')}
    onClickRegisterToTimesheet={action('onClickRegisterToTimesheet()')}
    DateSelectorContainer={() => (
      <DateSelector
        {...{
          startDate: text('DateSelector: startDate', null),
          endDate: text('DateSelector: endDate', null),
          onChangeStartDate: action('DateSelector: onChangeStartDate'),
          onChangeEndDate: action('DateSelector: onChangeEndDate'),
        }}
      />
    )}
    disabledFetchContractedWorkTimes={boolean(
      'disabledFetchContractedWorkTimes',
      false
    )}
  />
);
