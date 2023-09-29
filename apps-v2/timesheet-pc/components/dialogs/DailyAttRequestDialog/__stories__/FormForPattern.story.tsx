import React from 'react';

import { action } from '@storybook/addon-actions';

import FormForPattern from '../FormForPattern';
import {
  attPatternList,
  defaultPatternRequest,
  selectedAttPattern,
} from './mock-data/patternRequest';

export default {
  title: 'timesheet-pc/dialogs/DailyAttRequestDialog/FormForPattern',
};

export const Default = () => {
  return (
    <FormForPattern
      isReadOnly={false}
      hasRange={false}
      targetRequest={defaultPatternRequest}
      attPatternList={attPatternList}
      selectedAttPattern={selectedAttPattern}
      onUpdateValue={action('Updated')}
      onUpdateHasRange={action('Updated')}
    />
  );
};

Default.storyName = 'default';

export const RangeDays = () => {
  return (
    <FormForPattern
      isReadOnly={false}
      hasRange
      targetRequest={defaultPatternRequest}
      attPatternList={attPatternList}
      selectedAttPattern={selectedAttPattern}
      onUpdateValue={action('Updated')}
      onUpdateHasRange={action('Updated')}
    />
  );
};

RangeDays.storyName = 'range days';

export const ReadOnly = () => {
  return (
    <FormForPattern
      isReadOnly
      hasRange
      targetRequest={defaultPatternRequest}
      attPatternList={attPatternList}
      selectedAttPattern={selectedAttPattern}
      onUpdateValue={action('Updated')}
      onUpdateHasRange={action('Updated')}
    />
  );
};

ReadOnly.storyName = 'read only';
