import * as React from 'react';

import ProxyEmployeeSelectDialog from '../../../../widgets/dialogs/ProxyEmployeeSelectDialog/components/ProxyEmployeeSelectDialog';

import msg from '../../languages';

export default function ApproverEmployeeSearchDialog(props: any) {
  return (
    <ProxyEmployeeSelectDialog
      {...props}
      useDateQuery={false}
      title={msg().Com_Lbl_SearchApproverEmployee}
    />
  );
}
