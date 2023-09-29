import React, { lazy, Suspense } from 'react';

import GlobalContainer from '../../commons/containers/GlobalContainer';

import {
  isPermissionSatisfied,
  Permission,
} from '../../domain/models/access-control/Permission';

import MainContentContainer from '../containers/MainContentContainer';

// Dialogs (load lazily)
const PersonalMenuPopoverContainer = lazy(
  () => import('../../commons/containers/PersonalMenuPopoverContainer')
);
const DailyAttTimeDialogContainer = lazy(
  () => import('../containers/dialogs/DailyAttTimeDialogContainer')
);
const DailyAttRequestDialogContainer = lazy(
  () => import('../containers/dialogs/DailyAttRequestDialogContainer')
);
const DailyRemarksDialogContainer = lazy(
  () => import('../containers/dialogs/DailyRemarksDialogContainer')
);
const DailyAttentionsDialogContainer = lazy(
  () => import('../containers/dialogs/DailyAttentionsDialogContainer')
);
const FixSummaryRequestDialogContainer = lazy(
  () => import('../containers/dialogs/FixSummaryRequestDialogContainer')
);
const ApproverEmployeeSettingDialogContainer = lazy(
  () =>
    import(
      '../../commons/containers/dialogs/ApproverEmployeeSettingDialogContanier'
    )
);
const ApproverEmployeeSearchDialogContainer = lazy(
  () =>
    import(
      '../../commons/containers/dialogs/ApproverEmployeeSearchDialogContanier'
    )
);
const ApprovalHistoryDialogContainer = lazy(
  () => import('../containers/dialogs/ApprovalHistoryDialogContainer')
);
const ProxyEmployeeSelectDialogContainer = lazy(
  () =>
    import(
      '../../../widgets/dialogs/ProxyEmployeeSelectDialog/containers/ProxyEmployeeSelectDialogContainer'
    )
);

type Props = {
  isProxyMode: boolean;
  userPermission: Permission;
  onDecideProxyEmployee: (employeeId: string) => Promise<boolean>;
  onChangeApproverEmployee: () => void;
};

export default class App extends React.Component<Props> {
  render() {
    const { onDecideProxyEmployee, userPermission, isProxyMode } = this.props;
    const isEnableViewAttTimeSheetByDelegate = isPermissionSatisfied({
      userPermission,
      isByDelegate: isProxyMode,
      requireIfByEmployee: ['viewAttTimeSheetByDelegate'],
      requireIfByDelegate: ['viewAttTimeSheetByDelegate'],
    });

    return (
      <GlobalContainer>
        <MainContentContainer />

        {/* Dialogs */}
        <Suspense fallback={<React.Fragment />}>
          <PersonalMenuPopoverContainer
            showProxyEmployeeSelectButton={isEnableViewAttTimeSheetByDelegate}
          />
          <ProxyEmployeeSelectDialogContainer
            onDecide={onDecideProxyEmployee}
          />
          <DailyAttTimeDialogContainer />
          <DailyAttRequestDialogContainer />
          <DailyRemarksDialogContainer />
          <DailyAttentionsDialogContainer />
          <FixSummaryRequestDialogContainer />
          <ApprovalHistoryDialogContainer />
          <ApproverEmployeeSettingDialogContainer
            handleSave={this.props.onChangeApproverEmployee}
          />
          <ApproverEmployeeSearchDialogContainer />
        </Suspense>
      </GlobalContainer>
    );
  }
}
