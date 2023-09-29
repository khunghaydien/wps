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
import imgIconTimesheet from '../../commons/images/iconTimesheet.png';
import imgIconTracking from '../../commons/images/iconTracking.png';
import msg from '../../commons/languages';

import { UserSetting } from '../../domain/models/UserSetting';

import { tabType } from '../modules/ui/tabs';

import SwitchApproverContainer from '../../../widgets/dialogs/SwitchApporverDialog/containers/SwitchApproverContainer';
import AttDailyProcessListPane from '../containers/AttDailyProcessListPane';
import AttMonthlyProcessListPane from '../containers/AttMonthlyProcessListPane';
import DelegateApproverContainer from '../containers/DelegateApprover/DelegateApproverContainer';
import TrackingProcessListPaneContainer from '../containers/TrackingProcessListPane';

import imgIconExpenses from '../../expenses-pc/images/menuIconExpenseRequestBigger.png';
import imgHeaderIcon from '../images/Approval.svg';
import ExpensesPreApprovalListPane from './ExpensesPreApprovalListPane';
import ExpensesRequestListPane from './ExpensesRequestListPane';

import './App.scss';

type Props = Readonly<{
  requestCounts: {
    attDaily: number;
    attMonthly: number;
    expenses: number;
    expPreApproval: number;
    timeRequest: number;
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
          tabs: [tabType.ATT_DAILY, tabType.ATT_MONTHLY],
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
    iconSrc: string,
    iconWidth: number,
    label: string,
    notificationCount: number
  ) {
    if (!available) {
      return null;
    }

    return (
      <Tab
        label={label}
        icon={iconSrc}
        iconWidth={iconWidth.toString()}
        selected={this.isActiveMenu(menuNum)}
        onSelect={() => this.changeMenu(menuNum)}
        notificationCount={notificationCount}
        data-testid={`approval-${label.replace(/\s/g, '').toLowerCase()}`}
      />
    );
  }

  renderHeaderContent() {
    return (
      <div className="ts-approval__header">
        <div className="ts-approval__header__tab" role="tablist">
          {!this.props.isProxyMode &&
            this.renderApprovalHeaderItem(
              tabType.ATT_DAILY,
              this.props.userSetting.useAttendance,
              imgIconTimesheet,
              20,
              msg().Appr_Lbl_AttendanceRequest,
              this.props.requestCounts.attDaily
            )}
          {!this.props.isProxyMode &&
            this.renderApprovalHeaderItem(
              tabType.ATT_MONTHLY,
              this.props.userSetting.useAttendance,
              imgIconTimesheet,
              20,
              msg().Appr_Lbl_MonthlyAttendanceRequest,
              this.props.requestCounts.attMonthly
            )}

          {!this.props.isProxyMode &&
            this.renderApprovalHeaderItem(
              tabType.TRACKING,
              this.props.userSetting.useWorkTime,
              imgIconTracking,
              16,
              msg().Appr_Btn_TimeTrackRequest,
              this.props.requestCounts.timeRequest
            )}

          {this.renderApprovalHeaderItem(
            tabType.EXPENSES,
            this.props.userSetting.useExpense,
            imgIconExpenses,
            20,
            msg().Appr_Btn_ExpensesRequest,
            this.props.requestCounts.expenses
          )}
          {this.renderApprovalHeaderItem(
            tabType.EXP_PRE_APPROVAL,
            this.props.userSetting.useExpenseRequest,
            imgIconExpenses,
            20,
            msg().Appr_Btn_ExpensesPreApproval,
            this.props.requestCounts.expPreApproval
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
      case tabType.ATT_MONTHLY:
        return <AttMonthlyProcessListPane />;
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
      </GlobalContainer>
    );
  }
}
