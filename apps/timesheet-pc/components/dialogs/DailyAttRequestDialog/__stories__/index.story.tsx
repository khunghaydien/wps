import React from 'react';

import { action } from '@storybook/addon-actions';

import DailyAttRequestDialog from '..';
import dummyDailyRequestConditions from '../../../__stories__/mock-data/dailyRequestConditions';
import mockStore from '../../../__stories__/mock-data/storeMock';
import DialogDecorator from '../../../../../../.storybook/decorator/Dialog';
import { withProvider } from '../../../../../../.storybook/decorator/Provider';
import configureStore from '../../../../store/configureStore';

// @ts-ignore
const store = configureStore(mockStore);

export default {
  title: 'timesheet-pc/dialogs/DailyAttRequestDialog',

  decorators: [
    withProvider(store),
    (story: Function) => <DialogDecorator>{story()}</DialogDecorator>,
  ],
};

export const Index = () => {
  return (
    <DailyAttRequestDialog
      isLoading={false}
      approverEmployee={null}
      requestConditions={dummyDailyRequestConditions}
      onCancel={action('onCancel()')}
      onCancelEditing={action('onCancelEditing()')}
      onClickRequestDetailButton={action('onClickRequestDetailButton()')}
      onClickRequestEntryButton={action('onClickRequestEntryButton()')}
      onClickOpenApprovalHistoryDialog={action(
        'onClickOpenApprovalHistoryDialog()'
      )}
      onClickOpenApproverEmployeeSettingDialog={action(
        'onClickOpenApproverEmployeeSettingDialog()'
      )}
      onDisableRequest={action('onDisableRequest()')}
      onStartEditing={action('onStartEditing()')}
      onSubmitRequest={action('onSubmitRequest()')}
      editing={{
        id: null,
        requestTypeCode: null,
        isEditing: true,
        editAction: 'None',
        disableAction: 'None',
      }}
      targetRequest={null}
    />
  );
};

Index.storyName = 'index';

Index.parameters = {
  info: {
    propTables: [DailyAttRequestDialog],
    inline: false,
    source: true,
  },
};
