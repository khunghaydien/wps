import React from 'react';

import { action } from '@storybook/addon-actions';

import ApproverEmployeeSettingDialog from '../../components/dialogs/ApproverEmployeeSettingDialog';

import DialogDecorator from '../../../../.storybook/decorator/Dialog';

export default {
  title: 'commons/dialogs',
  decorators: [
    (story: Function) => <DialogDecorator>{story()}</DialogDecorator>,
  ],
};

export const DialogsApproverEmployeeSettingDialog書き換え可能 = () => {
  return (
    <ApproverEmployeeSettingDialog
      isHide={false}
      isReadOnly={false}
      isEdited
      approverEmployeeName="１人目の承認者"
      handleCancel={action('Hide Dialog')}
      handleSave={action('Save')}
      handleChangeEmployee={action('Change Employee')}
    />
  );
};

DialogsApproverEmployeeSettingDialog書き換え可能.storyName =
  'dialogs/ApproverEmployeeSettingDialog - 書き換え可能';

DialogsApproverEmployeeSettingDialog書き換え可能.parameters = {
  info: {
    text: '現在の承認ステップと承認者を表示します。',
    propTables: [ApproverEmployeeSettingDialog],
    inline: false,
    source: true,
  },
};

export const DialogsApproverEmployeeSettingDialog未変更による書き換え不可 =
  () => {
    return (
      <ApproverEmployeeSettingDialog
        isHide={false}
        isReadOnly={false}
        isEdited={false}
        approverEmployeeName="１人目の承認者"
        handleCancel={action('Hide Dialog')}
        handleSave={action('Save')}
        handleChangeEmployee={action('Change Employee')}
      />
    );
  };

DialogsApproverEmployeeSettingDialog未変更による書き換え不可.storyName =
  'dialogs/ApproverEmployeeSettingDialog - 未変更による書き換え不可';

DialogsApproverEmployeeSettingDialog未変更による書き換え不可.parameters = {
  info: '現在の承認ステップと承認者を表示します。',
};

export const DialogsApproverEmployeeSettingDialog書き換え不可 = () => {
  return (
    <ApproverEmployeeSettingDialog
      isHide={false}
      isReadOnly
      isEdited={false}
      approverEmployeeName="１人目の承認者"
      handleCancel={action('Hide Dialog')}
    />
  );
};

DialogsApproverEmployeeSettingDialog書き換え不可.storyName =
  'dialogs/ApproverEmployeeSettingDialog - 書き換え不可';

DialogsApproverEmployeeSettingDialog書き換え不可.parameters = {
  info: {
    text: '現在の承認ステップと承認者を表示します。',
    propTables: [ApproverEmployeeSettingDialog],
    inline: false,
    source: true,
  },
};
