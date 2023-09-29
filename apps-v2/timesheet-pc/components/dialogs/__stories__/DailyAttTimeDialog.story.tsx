import React from 'react';

import { action } from '@storybook/addon-actions';

import DialogDecorator from '../../../../../.storybook/decorator/Dialog';
import DailyAttTimeDialog from '../DailyAttTimeDialog';
import dummyDailyAttTime from './mock-data/dailyAttTime';

export default {
  title: 'timesheet-pc/dialogs',
  decorators: [(story) => <DialogDecorator>{story()}</DialogDecorator>],
};

export const _DailyAttTimeDialog = (): React.ReactElement => {
  return (
    <DailyAttTimeDialog
      isLoading={false}
      isReadOnly={false}
      onUpdateClockTime={action('UpdateClockTime')}
      onUpdateRestTime={action('UpdateRestTime')}
      onAddRestTime={action('AddRestTime')}
      onDeleteRestTime={action('DeleteRestTime')}
      onSubmit={action('Submit')}
      onCancel={action('Cancel')}
      dailyAttTime={dummyDailyAttTime}
    />
  );
};

_DailyAttTimeDialog.storyName = 'DailyAttTimeDialog';

_DailyAttTimeDialog.parameters = {
  info: { propTables: [DailyAttTimeDialog], inline: false, source: true },
};
