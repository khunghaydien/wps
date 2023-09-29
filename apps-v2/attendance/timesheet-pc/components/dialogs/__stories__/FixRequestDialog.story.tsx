import React from 'react';

import { action } from '@storybook/addon-actions';

import imgPhoto from '../../../../../commons/images/Sample_photo001.png';
import AccessControlContainer from '@apps/commons/containers/AccessControlContainer';

import { STATUS } from '@attendance/domain/models/AttFixSummaryRequest';

import DialogDecorator from '../../../../../../.storybook/decorator/Dialog';
import { withProvider } from '../../../../../../.storybook/decorator/Provider';
import configureStore from '../../../store/configureStore';
import mockStore from '../../__stories__/mock-data/storeMock';
import FixRequestDialog from '../FixRequestDialog';
// @ts-ignore
const store = configureStore(mockStore);
export default {
  title: 'attendance/timesheet-pc/dialogs',
  decorators: [
    (story: Function) => <DialogDecorator>{story()}</DialogDecorator>,
    withProvider(store),
  ],
};

export const _FixRequestDialog = () => {
  return (
    <FixRequestDialog
      fixSummaryRequest={{
        summaryId: 'abcd',
        requestId: 'abcd',
        status: STATUS.NOT_REQUESTED,
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
      AccessControlContainer={AccessControlContainer}
    />
  );
};

_FixRequestDialog.storyName = 'FixRequestDialog';

_FixRequestDialog.parameters = {
  info: { propTables: [FixRequestDialog], inline: false, source: true },
};
