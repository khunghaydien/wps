import React, { FC, ReactElement, useEffect } from 'react';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { Text } from '../../../core';
import { SubRoleOption } from '@commons/components/exp/SubRole/subRoleOptionCreator';

import {
  Delegator,
  Delegators,
} from '../../../domain/models/exp/DelegateApplicant';
import { Report, status, VIEW_MODE } from '@apps/domain/models/exp/Report';

import { modes } from '../../../requests-pc/modules/ui/expenses/mode';

import TextUtil from '../../utils/TextUtil';

// Pagination
import SubHeaderPager, {
  Props as subHeaderPageProps,
} from '../../../finance-approval-pc/components/FinanceApproval/SubHeaderPager';

import msg from '../../languages';
import Overlap from '../Overlap';
import TabNav from '../TabNav';
import ListHeaderNavIcon from './ReportList/ListHeaderNavIcon';

import './index.scss';

const ROOT = 'ts-expenses';

// Containers passed from HOC
type Containers = {
  baseCurrency?: any;
  dialog: any;
  foreignCurrency?: any;
  form?: any;
  isBulkEditMode: boolean;
  isListLoading?: boolean;
  isPartialLoading: boolean;
  recordItem?: any;
  recordList?: any;
  reportList: any;
  reportSummary?: any;
  routeForm?: any;
  suggest?: any;
  mileageForm: () => React.ReactElement;
};

export type OverlapProps = {
  overlap: { record: boolean; report: boolean };
};

export type CommonProps = {
  employeeId: string;
  isReadOnlyApexPage?: boolean;
  mode: string;
  selectedExpPreRequest?: Report;
  selectedExpReport: Report;
  selectedTab: number;
  selectedView: string;
  labelObject: () => any;
  onChangeTab: (tabIndex: number, companyId?: string) => void;
};

type Props = (CommonProps &
  Containers &
  OverlapProps & {
    delegatorList: Delegators;
    employeeId: string;
    isFromPreRequest?: boolean;
    isProxyMode: boolean;
    primaryRole?: any;
    reportLoading?: boolean;
    selectedDelegator: Delegator;
    subrolesMap?: { [companyId: string]: SubRoleOption };
    fetchHistories: (employeeId: string) => void;
    onClickExit: () => void;
    openSubRoleInfoDialog: () => void;
    openSwitchEmployeeDialog: () => void;
    searchCompany: () => void;
  }) &
  subHeaderPageProps;

// this function contains labels which are different in Expense and Request. if this label edited, change same object in Request
// 経費申請と事前申請で表示するラベルが異なるものを格納。この関数を編集したら、事前申請の同じ関数も編集してください

const tabLabelConstructor = (
  tabLabel: string,
  companyName: string
): { icon?: ReactElement; label: string } => {
  const COMPANY_NAME_MAX_LENGTH = 10;
  if (!companyName) {
    return { label: tabLabel };
  }

  if (companyName.length > COMPANY_NAME_MAX_LENGTH) {
    return {
      label: `${tabLabel} (${companyName.substring(
        0,
        COMPANY_NAME_MAX_LENGTH
      )}...)`,
      icon: <ListHeaderNavIcon hintMsg={companyName} hintAlign="bottom" />,
    };
  }

  return {
    label: `${tabLabel} (${companyName})`,
  };
};

const Expenses: FC<Props> = (props) => {
  const {
    baseCurrency: BaseCurrency,
    currentRequestIdx,
    delegatorList,
    dialog: Dialog,
    employeeId,
    foreignCurrency: ForeignCurrency,
    form: ExpensesForm,
    isBulkEditMode,
    isFromPreRequest,
    isPartialLoading,
    isProxyMode,
    isReadOnlyApexPage,
    labelObject,
    mileageForm: MileageForm,
    mode,
    overlap,
    primaryRole,
    recordItem: RecordItem,
    recordList: RecordList,
    reportList: ExpensesReport,
    reportLoading,
    reportSummary: ReportSummary,
    requestTotalNum,
    routeForm: RouteForm,
    selectedDelegator,
    selectedExpReport,
    selectedTab,
    selectedView,
    subrolesMap,
    suggest: Suggest,
    fetchHistories,
    onChangeTab,
    onClickBackButton,
    onClickExit,
    onClickNextToRequestButton,
    openSubRoleInfoDialog,
    openSwitchEmployeeDialog,
    searchCompany,
    isListLoading,
  } = props;
  const isReportListView = selectedView === VIEW_MODE.REPORT_LIST;
  const [primaryRoleCompanyId, ...secondaryRoleCompanyIds] = subrolesMap
    ? Object.keys(subrolesMap)
    : [];
  const formDisabled =
    mode !== modes.REPORT_SELECT &&
    mode !== modes.REPORT_EDIT &&
    mode !== modes.BULK_RECORD_EDIT;

  useEffect(() => {
    if (!isProxyMode && employeeId) {
      fetchHistories(employeeId);
      searchCompany();
    }
  }, [employeeId]);

  useEffect(() => {
    if (!isEmpty(subrolesMap)) {
      onChangeTab(0, primaryRoleCompanyId);
    }
  }, [Object.keys(subrolesMap).toString()]);

  const getSecondaryRoleTabs = () => {
    if (isEmpty(subrolesMap)) {
      return [];
    }

    return secondaryRoleCompanyIds.reduce((acc, companyId) => {
      const companyName = get(subrolesMap[companyId][0], 'company.name');

      return [
        ...acc,
        {
          component: <ExpensesReport secondary filter="NotRequested" />,
          id: companyId,
          ...tabLabelConstructor(msg().Exp_Lbl_ActiveReport, companyName),
        },
        {
          component: <ExpensesReport secondary filter="Approved" />,
          disabled: !companyId,
          id: companyId,
          isApproval: true,
          ...tabLabelConstructor(msg().Exp_Lbl_ApprovedReport, companyName),
        },
      ];
    }, []);
  };

  const getTabConfig = () => {
    const isProxyMode = !isEmpty(selectedDelegator);

    const activeReportTabConfig = {
      component: <ExpensesReport filter="NotRequested" />,
      label: msg().Exp_Lbl_ActiveReport,
      id: get(primaryRole, 'companyId'),
    };

    const approvedReportTabConfig = {
      component: <ExpensesReport filter="Approved" />,
      label: msg().Exp_Lbl_ApprovedReport,
      disabled: !employeeId,
      id: get(primaryRole, 'companyId'),
      isApproval: true,
    };

    const otherTabs = !isProxyMode ? getSecondaryRoleTabs() : [];
    const isDelegateApplicant = !isProxyMode && !isEmpty(subrolesMap);

    if (isDelegateApplicant) {
      const companyName: string = get(
        subrolesMap[primaryRoleCompanyId][0],
        'company.name'
      );

      return [
        {
          ...activeReportTabConfig,
          id: primaryRoleCompanyId,
          ...tabLabelConstructor(msg().Exp_Lbl_ActiveReport, companyName),
        },
        {
          ...approvedReportTabConfig,
          id: primaryRoleCompanyId,
          ...tabLabelConstructor(msg().Exp_Lbl_ApprovedReport, companyName),
        },
        ...otherTabs,
      ];
    }

    return [activeReportTabConfig, approvedReportTabConfig, ...otherTabs];
  };

  const renderSwitchEmployee = () => (
    <div
      className={`${ROOT}-switch-employee
      ${isListLoading ? ' disable' : ''}
      `}
      onClick={openSwitchEmployeeDialog}
    >
      {msg().Com_Btn_SwitchEmployee}
    </div>
  );

  const renderExitDelegator = () => (
    <div className={`${ROOT}-delegate-applicant`}>
      <span className={`${ROOT}-delegate-applicant-label`}>
        {TextUtil.template(msg().Com_Msg_OperatingAs, selectedDelegator.name)}
      </span>

      {isReportListView && (
        <span
          className={`${ROOT}-delegate-applicant-exit ${
            isListLoading ? ' disable' : ''
          }`}
          onClick={onClickExit}
        >
          {msg().Com_Btn_Exit}
        </span>
      )}
    </div>
  );

  const subroleEditable = (() => {
    if (isBulkEditMode || reportLoading || overlap.record || isFromPreRequest) {
      return false;
    }

    if (selectedExpReport.status) {
      const isNotClaimedApprovedRequest =
        selectedExpReport.preRequestId && !selectedExpReport.reportId;
      const reportStatus = isNotClaimedApprovedRequest
        ? status.APPROVED_PRE_REQUEST
        : selectedExpReport.status;

      if (
        reportStatus === status.PENDING ||
        reportStatus === status.APPROVED ||
        reportStatus === status.APPROVED_PRE_REQUEST
      ) {
        return false;
      }
    }

    return true;
  })();

  /* title label changes according to new report / report list / saved report */
  const titleName = (() => {
    const { newReport, report, reports } = labelObject();

    if (overlap.report && !selectedExpReport.reportId) {
      return newReport;
    }

    if (overlap.report && selectedExpReport.reportId) {
      return report;
    }

    return reports;
  })();

  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}-sub-header`}>
        <div className={`${ROOT}-sub-header__title`}>
          <Text size="xxl" color="secondary" bold>
            {titleName}
          </Text>
        </div>

        {!isEmpty(delegatorList) &&
          isReportListView &&
          !isProxyMode &&
          renderSwitchEmployee()}

        {isProxyMode && renderExitDelegator()}

        {!isReadOnlyApexPage && (
          <div className={`${ROOT}-sub-header__backToList`}>
            <SubHeaderPager
              currentRequestIdx={currentRequestIdx}
              isBulkEditMode={isBulkEditMode}
              isPartialLoading={isPartialLoading}
              onClickBackButton={onClickBackButton}
              onClickNextToRequestButton={onClickNextToRequestButton}
              onClickSubRoleInfo={openSubRoleInfoDialog}
              overlap={overlap}
              requestTotalNum={requestTotalNum}
              showPagination
              showSubrole={!isProxyMode}
              subroleEditable={subroleEditable}
            />
          </div>
        )}
      </div>

      {!isReadOnlyApexPage && isReportListView && (
        <TabNav
          config={getTabConfig()}
          onChangeTab={onChangeTab}
          selectedTab={selectedTab}
          tabLabelContainerClass={`${ROOT}__multi-company-tab`}
          headerContainerClass={`${ROOT}__multi-company-tab-container`}
        />
      )}

      {selectedView === VIEW_MODE.REPORT_DETAIL && ExpensesForm && (
        <Overlap isVisible={overlap.report}>
          <ExpensesForm
            baseCurrency={BaseCurrency}
            dialog={Dialog}
            disabled={formDisabled}
            foreignCurrency={ForeignCurrency}
            isReadOnlyApexPage={isReadOnlyApexPage}
            labelObject={labelObject}
            mileageForm={MileageForm}
            mode={mode}
            recordItem={RecordItem}
            recordList={RecordList}
            reportSummary={ReportSummary}
            routeForm={RouteForm}
            suggest={Suggest}
          />
        </Overlap>
      )}

      {isReportListView && <Dialog />}
    </div>
  );
};

export default Expenses;
