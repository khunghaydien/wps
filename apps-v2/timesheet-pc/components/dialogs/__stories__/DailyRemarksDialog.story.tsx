import React from 'react';

import { action } from '@storybook/addon-actions';

import DialogDecorator from '../../../../../.storybook/decorator/Dialog';
import DailyRemarksDialog from '../DailyRemarksDialog';

export default {
  title: 'timesheet-pc/dialogs',
  decorators: [(story) => <DialogDecorator>{story()}</DialogDecorator>],
};

export const _DailyRemarksDialog = (): React.ReactElement => {
  return (
    <DailyRemarksDialog
      dailyRemarks={{
        recordId: 'dummy-id',
        recordDate: '2017-10-10',
        remarks: 'よろしくお願いします',
      }}
      onUpdateValue={action('Update')}
      onSubmit={action('Submit')}
      onCancel={action('Cancel')}
      isReadOnly={false}
    />
  );
};

_DailyRemarksDialog.storyName = 'DailyRemarksDialog';

_DailyRemarksDialog.parameters = {
  info: { propTables: [DailyRemarksDialog], inline: false, source: true },
};
