import React, { lazy, Suspense } from 'react';

import GlobalContainer from '../../../commons/containers/GlobalContainer';

import Employee from '@widgets/dialogs/ProxyEmployeeSelectDialog/models/Employee';

import MainContentContainer from '../containers/MainContentContainer';

// Dialogs (load lazily)
const PersonalMenuPopoverContainer = lazy(
  () => import('../../../commons/containers/PersonalMenuPopoverContainer')
);
const DailyObjectivelyEventLogDialogContainer = lazy(
  () => import('../containers/dialogs/DailyObjectivelyEventLogDialogContainer')
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
      '../../../commons/containers/dialogs/ApproverEmployeeSettingDialogContanier'
    )
);
const ApproverEmployeeSearchDialogContainer = lazy(
  () =>
    import(
      '../../../commons/containers/dialogs/ApproverEmployeeSearchDialogContanier'
    )
);
const ApprovalHistoryDialogContainer = lazy(
  () => import('../containers/dialogs/ApprovalHistoryDialogContainer')
);
const ProxyEmployeeSelectDialogContainer = lazy(
  () =>
    import(
      '../../../../widgets/dialogs/ProxyEmployeeSelectDialog/containers/ProxyEmployeeSelectDialogContainer'
    )
);

const LegalAgreementRequestDialogContainer = lazy(
  () => import('../containers/dialogs/LegalAgreementRequestDialogContainer')
);

type Props = {
  isEnableViewAttTimeSheetByDelegate: boolean;
  onDecideProxyEmployee: (employee: Employee) => Promise<boolean>;
  onChangeApproverEmployee: () => void;
};

export default class App extends React.Component<Props> {
  render() {
    const {
      isEnableViewAttTimeSheetByDelegate,
      onDecideProxyEmployee,
      onChangeApproverEmployee,
    } = this.props;

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
          <DailyObjectivelyEventLogDialogContainer />
          <DailyAttRequestDialogContainer />
          <DailyRemarksDialogContainer />
          <DailyAttentionsDialogContainer />
          <FixSummaryRequestDialogContainer />
          <LegalAgreementRequestDialogContainer />
          <ApprovalHistoryDialogContainer />
          <ApproverEmployeeSettingDialogContainer
            handleSave={onChangeApproverEmployee}
          />
          <ApproverEmployeeSearchDialogContainer />
        </Suspense>
      </GlobalContainer>
    );
  }
}
