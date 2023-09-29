import React from 'react';

import isEmpty from 'lodash/isEmpty';

import { Text } from '../../../core';

import {
  Delegator,
  Delegators,
} from '../../../domain/models/exp/DelegateApplicant';
import {
  expensesArea,
  Report,
  VIEW_MODE,
} from '../../../domain/models/exp/Report';

import { modes } from '../../../requests-pc/modules/ui/expenses/mode';

import TextUtil from '../../utils/TextUtil';

// Pagination
import SubHeaderPager, {
  Props as subHeaderPageProps,
} from '../../../finance-approval-pc/components/FinanceApproval/SubHeaderPager';

import msg from '../../languages';
import Overlap from '../Overlap';
import TabNav from '../TabNav';

import './index.scss';

const ROOT = 'ts-expenses';

// Containers passed from HOC
type Containers = {
  baseCurrency?: any;
  dialog: any;
  foreignCurrency?: any;
  form?: any;

  recordItem?: any;
  recordList?: any;
  reportList: any;
  reportSummary?: any;
  routeForm?: any;
  suggest?: any;
};

export type OverlapProps = {
  overlap: { record: boolean; report: boolean };
};

export type CommonProps = {
  employeeId: string;
  isReadOnlyApexPage?: boolean;
  mode: string;
  selectedExpReport: Report;
  selectedTab: number;
  selectedView: string;
  labelObject: () => any;
  onChangeTab: () => void;
};

type Props = (CommonProps &
  Containers &
  OverlapProps & {
    delegatorList: Delegators;
    selectedDelegator: Delegator;
    onClickExit: () => void;
    openSwitchEmployeeDialog: () => void;
  }) &
  subHeaderPageProps;

export default class Expenses extends React.Component<Props> {
  static displayName = expensesArea;
  isMode(mode: string) {
    return this.props.mode === modes[mode];
  }

  renderSwitchEmployee = () => (
    <div
      className={`${ROOT}-switch-employee`}
      onClick={this.props.openSwitchEmployeeDialog}
    >
      {msg().Com_Btn_SwitchEmployee}
    </div>
  );

  renderExitDelegator = (name: string, viewPage: string) => (
    <div className={`${ROOT}-delegate-applicant`}>
      <span className={`${ROOT}-delegate-applicant-label`}>
        {TextUtil.template(msg().Com_Msg_OperatingAs, name)}
      </span>
      {viewPage === VIEW_MODE.REPORT_LIST && (
        <span
          className={`${ROOT}-delegate-applicant-exit`}
          onClick={this.props.onClickExit}
        >
          {msg().Com_Btn_Exit}
        </span>
      )}
    </div>
  );

  render() {
    const ExpensesReport = this.props.reportList;
    const ExpensesForm = this.props.form;
    const ReportSummary = this.props.reportSummary;
    const RecordList = this.props.recordList;
    const RecordItem = this.props.recordItem;
    const BaseCurrency = this.props.baseCurrency;
    const ForeignCurrency = this.props.foreignCurrency;
    const RouteForm = this.props.routeForm;
    const Suggest = this.props.suggest;
    const Dialog = this.props.dialog;
    const isProxyMode = !isEmpty(this.props.selectedDelegator);
    const isReportListView = this.props.selectedView === VIEW_MODE.REPORT_LIST;

    const disabled = !(
      this.isMode('REPORT_SELECT') || this.isMode('REPORT_EDIT')
    );

    const tabConfig = [
      {
        component: <ExpensesReport filter="NotRequested" />,
        label: msg().Exp_Lbl_ActiveReport,
      },
      {
        component: <ExpensesReport filter="Approved" />,
        label: msg().Exp_Lbl_ApprovedReport,
        disabled: !this.props.employeeId,
      },
    ];

    let titleName = this.props.labelObject().reports;

    /* title label changes according to new report / report list / saved report */
    if (this.props.overlap.report && !this.props.selectedExpReport.reportId) {
      titleName = this.props.labelObject().newReport;
    } else if (
      this.props.overlap.report &&
      this.props.selectedExpReport.reportId
    ) {
      titleName = this.props.labelObject().report;
    }

    return (
      <div className={`${ROOT}`}>
        <div className={`${ROOT}-sub-header`}>
          <div className={`${ROOT}-sub-header__title`}>
            <Text size="xxl" color="secondary" bold>
              {titleName}
            </Text>
          </div>

          {!isEmpty(this.props.delegatorList) &&
            isReportListView &&
            !isProxyMode &&
            this.renderSwitchEmployee()}

          {isProxyMode &&
            this.renderExitDelegator(
              this.props.selectedDelegator.name,
              this.props.selectedView
            )}

          {!this.props.isReadOnlyApexPage && (
            <div className={`${ROOT}-sub-header__backToList`}>
              <SubHeaderPager
                overlap={this.props.overlap}
                requestTotalNum={this.props.requestTotalNum}
                currentRequestIdx={this.props.currentRequestIdx}
                onClickBackButton={this.props.onClickBackButton}
                onClickNextToRequestButton={
                  this.props.onClickNextToRequestButton
                }
                showPagination
              />
            </div>
          )}
        </div>
        {!this.props.isReadOnlyApexPage && isReportListView && (
          <TabNav
            config={tabConfig}
            selectedTab={this.props.selectedTab}
            onChangeTab={this.props.onChangeTab}
          />
        )}
        {this.props.selectedView === VIEW_MODE.REPORT_DETAIL && ExpensesForm && (
          <Overlap isVisible={this.props.overlap.report}>
            <ExpensesForm
              recordList={RecordList}
              recordItem={RecordItem}
              reportSummary={ReportSummary}
              baseCurrency={BaseCurrency}
              foreignCurrency={ForeignCurrency}
              routeForm={RouteForm}
              dialog={Dialog}
              suggest={Suggest}
              disabled={disabled}
              mode={this.props.mode}
              labelObject={this.props.labelObject}
              isReadOnlyApexPage={this.props.isReadOnlyApexPage}
            />
          </Overlap>
        )}
        {isReportListView && <Dialog />}
      </div>
    );
  }
}
