import React from 'react';

import { action } from '@storybook/addon-actions';

import imgPhoto from '../../../../commons/images/Sample_photo001.png';

import DialogDecorator from '../../../../../.storybook/decorator/Dialog';
import FixRequestDialog from '../FixRequestDialog';

export default {
  title: 'timesheet-pc/dialogs',
  decorators: [
    (story: Function) => <DialogDecorator>{story()}</DialogDecorator>,
  ],
};

export const _FixRequestDialog = () => {
  return (
    <FixRequestDialog
      fixSummaryRequest={{
        summaryId: 'abcd',
        requestId: 'abcd',
        comment: 'comment',
        performableActionForFix: 'Submit',
      }}
      userPhotoUrl={imgPhoto}
      onCancel={action('cancel')}
      onUpdateValue={action('editComment')}
      onSubmit={action('submit')}
      approverEmployee={null}
      onClickOpenApproverEmployeeSettingDialog={action(
        'onClickOpenApproverEmployeeSettingDialog'
      )}
    />
  );
};

_FixRequestDialog.storyName = 'FixRequestDialog';

_FixRequestDialog.parameters = {
  info: { propTables: [FixRequestDialog], inline: false, source: true },
};
