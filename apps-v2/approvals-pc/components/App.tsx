import React from 'react';

import filter from 'lodash/fp/filter';
import flatMap from 'lodash/fp/flatMap';
import flow from 'lodash/fp/flow';
import head from 'lodash/fp/head';

import GlobalHeader from '../../commons/components/GlobalHeader';
import Tab from '../../commons/components/Tab';
import Unavailable from '../../commons/components/Unavailable';
import GlobalContainer from '../../commons/containers/GlobalContainer';
import PersonalMenuPopoverContainer from '../../commons/containers/PersonalMenuPopoverContainer';
import msg from '../../commons/languages';
import ToastContainer from '@commons/containers/ToastContainer';

import { UserSetting } from '../../domain/models/UserSetting';

import { tabType } from '../modules/ui/tabs';

import SwitchApproverContainer from '../../../widgets/dialogs/SwitchApporverDialog/containers/SwitchApproverContainer';
import AttDailyFixProcessListPane from '../containers/AttDailyFixProcess';
import AttDailyProcessListPane from '../containers/AttDailyProcessListPane';
import AttLegalAgreementProcessListPane from '../containers/AttLegalAgreementProcessListPane';
import AttMonthlyFixProcessListPane from '../containers/AttMonthlyFixProcessListPane';
import DelegateApproverContainer from '../containers/DelegateApprover/DelegateApproverContainer';
import TrackingProcessListPaneContainer from '../containers/TrackingProcessListPane';

import imgHeaderIcon from '../images/Approval.svg';
import CustomRequest from './CustomRequest';
import ExpensesPreApprovalListPane from './ExpensesPreApprovalListPane';
import ExpensesRequestListPane from './ExpensesRequestListPane';

import './App.scss';

type Props = Readonly<{
  requestCounts: {
    attDaily: number;
    attFixDaily: number;
    attLegalAgreement: number;
    attFixMonthly: number;
    expenses: number;
    expPreApproval: number;
    timeRequest: number;
    customRequest: number;
  };
  selectTab: ($Values: typeof tabType[keyof typeof tabType]) => void;
  selectedTab: typeof tabType[keyof typeof tabType];
  userSetting: UserSetting;
  // Delegate Approver
  isShowDADialog: boolean;
  listDA: (arg0: string) => void;
  // Switch Employee
  isProxyMode: boolean;
  isShowSwitchApproverDialog: boolean;
  listSwitchEmployee: (arg0: string) => void;
  onExitProxyMode: () => void;
  // Switch Company
  isDefaultCompany: boolean;
  isShowSidePanel: boolean;
  resetCompanyOption: () => void;
}>;

export default class ApprovalsContainer extends React.Component<Props> {
  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.userSetting.employeeId !== nextProps.userSetting.employeeId
    ) {
      this.props.listDA(nextProps.userSetting.employeeId);
      this.props.listSwitchEmployee(nextProps.userSetting.employeeId);
    }
  }

  componentDidUpdate(prevProps: Props) {
    // Select a tab at the time of the first display of the page
    if (
      !prevProps.selectedTab ||
      prevProps.userSetting !== this.props.userSetting // checking shallow equality is valid.
    ) {
      const tabGroups = [
        {
          available: this.props.userSetting.useAttendance,
          tabs: [
            [
              tabType.ATT_DAILY,
              this.props.userSetting.viewAttDailyRequestApproval,
            ],
            [
              tabType.ATT_FIX_DAILY,
              this.props.userSetting.viewAttFixDailyRequestApproval,
            ],
            [
              tabType.ATT_LEGAL_AGREEMENT,
              this.props.userSetting.viewAttLegalAgreementRequestApproval,
            ],
            [
              tabType.ATT_FIX_MONTHLY,
              this.props.userSetting.viewAttRequestApproval,
            ],
          ].reduce((arr, [tabName, flag]) => {
            if (flag) {
              arr.push(tabName);
            }
            return arr;
          }, []),
        },
        {
          available: this.props.userSetting.useWorkTime,
          tabs: [tabType.TRACKING],
        },
        {
          available: this.props.userSetting.useExpense,
          tabs: [tabType.EXPENSES],
        },
        {
          available: this.props.userSetting.useExpenseRequest,
          tabs: [tabType.EXP_PRE_APPROVAL],
        },
        {
          available: this.props.userSetting.useCustomRequest,
          tabs: [tabType.CUSTOM_REQUEST],
        },
        {
          // Default
          available: true,
          tabs: [tabType.UNAVAILABLE],
        },
      ];
      const selectedTab = flow(
        filter((tg: any) => tg.available),
        flatMap((tg: any) => tg.tabs),
        head
      )(tabGroups);
      this.props.selectTab(selectedTab);
    }
  }

  isActiveMenu(i: typeof tabType[keyof typeof tabType]) {
    return this.props.selectedTab === i;
  }

  changeMenu(i: typeof tabType[keyof typeof tabType]) {
    this.props.selectTab(i);
    if (this.props.selectedTab !== i) {
      this.props.resetCompanyOption();
    }
  }

  renderApprovalHeaderItem(
    menuNum: typeof tabType[keyof typeof tabType],
    available: boolean,
    label: string,
    notificationCount: number
  ) {
    if (!available) {
      return null;
    }

    return (
      <Tab
        label={label}
        selected={this.isActiveMenu(menuNum)}
        onSelect={() => this.changeMenu(menuNum)}
        notificationCount={notificationCount}
        data-testid={`approval-${label.replace(/\s/g, '').toLowerCase()}`}
      />
    );
  }

  renderHeaderContent() {
    const { isProxyMode, userSetting, requestCounts } = this.props;
    return (
      <div className="ts-approval__header">
        <div className="ts-approval__header__tab" role="tablist">
          {!isProxyMode &&
            this.renderApprovalHeaderItem(
              tabType.ATT_DAILY,
              userSetting.useAttendance &&
                userSetting.viewAttDailyRequestApproval,
              msg().Appr_Lbl_AttendanceRequest,
              requestCounts.attDaily
            )}
          {!isProxyMode &&
            this.renderApprovalHeaderItem(
              tabType.ATT_FIX_DAILY,
              userSetting.useAttendance &&
                userSetting.viewAttFixDailyRequestApproval,
              msg().Appr_Lbl_DailyFixRequest,
              requestCounts.attFixDaily
            )}
          {!isProxyMode &&
          userSetting.useAttendance &&
          userSetting.viewAttLegalAgreementRequestApproval ? (
            <div
              className="ts-approval-legal-agreement-tab"
              title={msg().Appr_Lbl_LegalAgreementRequest}
            >
              {this.renderApprovalHeaderItem(
                tabType.ATT_LEGAL_AGREEMENT,
                userSetting.useAttendance &&
                  userSetting.viewAttLegalAgreementRequestApproval,
                msg().Appr_Lbl_LegalAgreementRequest,
                requestCounts.attLegalAgreement
              )}
            </div>
          ) : null}
          {!isProxyMode &&
            this.renderApprovalHeaderItem(
              tabType.ATT_FIX_MONTHLY,
              userSetting.useAttendance && userSetting.viewAttRequestApproval,
              msg().Appr_Lbl_MonthlyFixRequest,
              requestCounts.attFixMonthly
            )}

          {!isProxyMode &&
            this.renderApprovalHeaderItem(
              tabType.TRACKING,
              userSetting.useWorkTime,
              msg().Appr_Btn_TimeTrackRequest,
              requestCounts.timeRequest
            )}

          {this.renderApprovalHeaderItem(
            tabType.EXPENSES,
            userSetting.useExpense,
            msg().Appr_Clbl_ExpensesRequest,
            requestCounts.expenses
          )}
          {this.renderApprovalHeaderItem(
            tabType.EXP_PRE_APPROVAL,
            userSetting.useExpenseRequest,
            msg().Appr_Clbl_ExpensesPreApproval,
            requestCounts.expPreApproval
          )}
          {this.renderApprovalHeaderItem(
            tabType.CUSTOM_REQUEST,
            userSetting.useCustomRequest,
            msg().Appr_Clbl_CustomRequest,
            requestCounts.customRequest
          )}
        </div>
      </div>
    );
  }

  renderContent() {
    switch (this.props.selectedTab) {
      case tabType.TRACKING:
        return <TrackingProcessListPaneContainer />;
      case tabType.ATT_DAILY:
        return <AttDailyProcessListPane />;
      case tabType.ATT_FIX_DAILY:
        return <AttDailyFixProcessListPane />;
      case tabType.ATT_LEGAL_AGREEMENT:
        return <AttLegalAgreementProcessListPane />;
      case tabType.ATT_FIX_MONTHLY:
        return <AttMonthlyFixProcessListPane />;
      case tabType.UNAVAILABLE:
        return <Unavailable />;
      case tabType.EXPENSES:
        return (
          <ExpensesRequestListPane
            isShowSidePanel={this.props.isShowSidePanel}
          />
        );
      case tabType.EXP_PRE_APPROVAL:
        return (
          <ExpensesPreApprovalListPane
            isShowSidePanel={this.props.isShowSidePanel}
          />
        );
      case tabType.CUSTOM_REQUEST:
        return <CustomRequest isShowSidePanel={this.props.isShowSidePanel} />;
      default:
        return null;
    }
  }

  renderDADialog = () => {
    return this.props.isShowDADialog && <DelegateApproverContainer />;
  };

  renderSwitchApproverDialog = () => {
    // @ts-ignore Ignore the error because it is difficult to type the container
    return this.props.isShowSwitchApproverDialog && <SwitchApproverContainer />;
  };

  render() {
    // conditions to show PersonalMenu:
    // 1.current user is not delegate approver
    // 2.current page is user's default company
    // 3.current tab is Expenses or Requests
    const isShowPersonalMenu =
      !this.props.isProxyMode &&
      this.props.isDefaultCompany &&
      (this.props.selectedTab === tabType.EXPENSES ||
        this.props.selectedTab === tabType.EXP_PRE_APPROVAL);
    return (
      <GlobalContainer>
        <main className="ts-approval__contents slds">
          <PersonalMenuPopoverContainer showProxyEmployeeSelectButton={false} />
          <GlobalHeader
            iconSrc={imgHeaderIcon}
            iconSrcType="svg"
            iconAssistiveText={msg().Appr_Lbl_Approval}
            content={this.renderHeaderContent()}
            showPersonalMenuPopoverButton={isShowPersonalMenu}
            showProxyIndicator={this.props.isProxyMode}
            onClickProxyExitButton={this.props.onExitProxyMode}
          />
          {this.renderContent()}
          {this.renderDADialog()}
          {this.renderSwitchApproverDialog()}
        </main>
        <ToastContainer />
      </GlobalContainer>
    );
  }
}
