import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { assign, cloneDeep, find, get, isEmpty, set } from 'lodash';

import appName from '@commons/constants/appName';

import {
  getRecentCostCenters,
  searchCostCenters,
} from '../../../commons/action-dispatchers/CostCenter';
import { confirm } from '../../../commons/actions/app';
import ReportSummaryView from '../../../commons/components/exp/Form/ReportSummary';
import DateField from '../../../commons/components/fields/DateField';
import msg from '../../../commons/languages';
import { selectors as appSelectors } from '../../../commons/modules/app';
import DateUtil from '../../../commons/utils/DateUtil';
import UrlUtil from '@commons/utils/UrlUtil';

import { defaultCostCenter } from '../../../domain/models/exp/CostCenter';
import {
  EISearchObj,
  getEIsOnly,
} from '../../../domain/models/exp/ExtendedItem';
import {
  ATTACHMENT_MAX_COUNT,
  calcTotalAmount,
  getDisplayOfVendorCCJob,
  initailCostCenterData,
  initailVendorData,
  initialCashAdvanceData,
  initialJobData,
} from '../../../domain/models/exp/Report';
import {
  generateVendorTypes,
  vendorTypes,
} from '../../../domain/models/exp/Vendor';

import { getDefaultCostCenter } from '../../../domain/modules/exp/cost-center/defaultCostCenter';
import { actions as activeDialogActions } from '../../modules/ui/expenses/dialog/activeDialog';
import { actions as vendorIdActions } from '../../modules/ui/expenses/dialog/vendor/id';
import { actions as personalListActions } from '../../modules/ui/expenses/dialog/vendor/personalList';
import { actions as modeActions, modes } from '../../modules/ui/expenses/mode';
import { actions as openTitleActions } from '../../modules/ui/expenses/recordListPane/summary/openTitle';
import { actions as latestCostCenterActions } from '@apps/domain/modules/exp/cost-center/latestCostCenter';
import { actions as reportCloneLinkActions } from '@apps/finance-approval-pc/modules/ui/FinanceApproval/reportCloneLink';

import {
  openCostCenterDialog,
  openEILookupDialog,
  openJobDialog,
  openReceiptLibraryDialog,
  openVendorDetailModal,
  openVendorLookupDialog,
} from '../../action-dispatchers/Dialog';
import { getRecentJobs, searchJobs } from '../../action-dispatchers/Job';
import {
  cloneReport,
  createNewExpReport,
  isNotDefaultCostCenter,
} from '../../action-dispatchers/Requests';
import {
  getRecentVendors,
  searchVendors,
  undoVendorDeletion,
} from '../../action-dispatchers/Vendor';
import { cloneReportInFA } from '@apps/finance-approval-pc/action-dispatchers/FinanceApproval';

const mapStateToProps = (state, ownProps) => {
  const inactiveReportTypeList =
    state.entities.exp.expenseReportType.list.inactive;
  const reportTypeList = state.entities.exp.expenseReportType.list.active || [];

  if (state.ui.expenses.tab) {
    reportTypeList.concat(inactiveReportTypeList);
  }
  const { useCompanyVendor, usePersonalVendor } = state.userSetting;

  const showVendorFilter = !(useCompanyVendor ^ usePersonalVendor);

  const vendorTypes = generateVendorTypes(
    state.userSetting,
    ownProps.isFinanceApproval
  );

  const subroleId = get(state, 'ui.expenses.subrole.selectedRole');
  const subroleIds = get(state, 'ui.expenses.subrole.ids');

  const selectedCompanyId =
    ownProps.selectedCompanyId || state.userSetting.companyId;
  return {
    showVendorFilter,
    isBulkEditMode: state.common.exp.ui.bulkEditRecord.isEnabled,
    isLoading: appSelectors.loadingSelector(state),
    isPartialLoading: appSelectors.loadingAreaSelector(state),
    loadingAreas: state.common.app.loadingAreas,
    reportTypeList,
    inactiveReportTypeList,
    companyId: state.userSetting.companyId,
    mode: state.ui.expenses.mode,
    expReportList: state.entities.exp.preRequest.expReportList,
    selectedExpReport: state.ui.expenses.selectedExpReport,
    baseCurrencySymbol:
      ownProps.currencySymbol || state.userSetting.currencySymbol,
    baseCurrencyDecimal:
      ownProps.currencyDecimalPlaces || state.userSetting.currencyDecimalPlaces,
    employeeId: state.userSetting.employeeId,
    openTitle: state.ui.expenses.recordListPane.summary.openTitle,
    customHint: state.entities.exp.customHint,
    activeVendor: state.ui.expenses.dialog.vendor.search,
    defaultCostCenter: state.entities.exp.costCenter.defaultCostCenter,
    reportCloneLink:
      ownProps.isFinanceApproval && state.ui.FinanceApproval.reportCloneLink,
    selectedDelegator: state.ui.expenses.delegateApplicant.selectedEmployee,
    isExpenseRequest: true,
    vendorTypes,
    removedVendors: state.ui.expenses.dialog.vendor.personal.removed,
    useJctRegistrationNumber: state.userSetting.jctInvoiceManagement,
    subroleId,
    subroleIds,
    ...ownProps,
    selectedCompanyId,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const actions = {
    confirm,
    createNewExpReport,
    openTitleAction: openTitleActions.open,
    onClickTitleToggleButton: openTitleActions.toggle,
    reportEdit: modeActions.reportEdit,
    onClickCostCenterButton: (
      targetDate: string,
      employeeId: string,
      companyId: string,
      isSkipRecentlyUsed: boolean
    ) =>
      openCostCenterDialog(
        targetDate,
        employeeId,
        companyId,
        isSkipRecentlyUsed
      ),
    onClickJobButton: (
      targetDate: string,
      employeeId: string,
      companyId: string,
      isSkipRecentlyUsed: boolean
    ) => openJobDialog(targetDate, employeeId, companyId, isSkipRecentlyUsed),
    openVendorLookupDialog,
    openVendorDetailModal,
    hideAllDialogs: activeDialogActions.hideAll,
    openEILookupDialog,
    cloneReport,
    cloneReportInFA,
    openReceiptLibraryDialog,
    getDefaultCostCenter,
    getRecentJobs,
    searchJobs,
    getRecentCostCenters,
    searchCostCenters,
    getRecentVendors,
    searchVendors,
    undoVendorDeletion,
    clearRemovedVendor: personalListActions.delete,
    clearReportCloneToaster: reportCloneLinkActions.reset,
    clearLatestCostCenter: latestCostCenterActions.clear,
    isNotDefaultCostCenter,
    setVendorIdDialog: vendorIdActions.set,
    clearVendorIdDialog: vendorIdActions.clear,
  };
  const bindActions = bindActionCreators(actions, dispatch);
  return {
    ...bindActions,
    updateReport: (updateObj, isEditTouched = true) => {
      const tmpReport = cloneDeep(ownProps.expReport);
      const tmpTouched = cloneDeep(ownProps.touched);

      Object.keys(updateObj as any).forEach((key) => {
        set(tmpReport, key, updateObj[key]);
        if (isEditTouched) set(tmpTouched, key, isEditTouched);
      });
      ownProps.onChangeEditingExpReport('report', tmpReport, tmpTouched);
    },
    dispatch,
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  createNewExpReport: () => {
    dispatchProps.createNewExpReport(
      stateProps.reportTypeList,
      stateProps.defaultCostCenter
    );
  },
  searchJobs: (keyword) => {
    const reportDate = get(ownProps.expReport, 'scheduledDate');
    const subroleId = stateProps.subroleId;
    const employeeId =
      ownProps.expReport.employeeBaseId || stateProps.employeeId;
    return dispatchProps.searchJobs(
      keyword,
      reportDate,
      employeeId,
      stateProps.selectedCompanyId,
      subroleId
    );
  },
  getRecentJobs: (targetDate) => {
    return dispatchProps.getRecentJobs(
      targetDate,
      stateProps.employeeId,
      stateProps.selectedCompanyId
    );
  },
  searchCostCenters: (keyword) => {
    const reportDate = get(ownProps.expReport, 'scheduledDate');
    return dispatchProps.searchCostCenters(
      stateProps.selectedCompanyId,
      keyword,
      reportDate
    );
  },
  getRecentCostCenters: (targetDate) => {
    return dispatchProps.getRecentCostCenters(
      stateProps.employeeId,
      targetDate,
      stateProps.selectedCompanyId
    );
  },
  searchVendors: async (keyword, types: Array<string>) => {
    const emptyPromise = new Promise((resolve) => resolve([]));

    const employeeId =
      ownProps.expReport.employeeBaseId || stateProps.employeeId;
    const { selectedCompanyId } = stateProps;
    const { searchVendors } = dispatchProps;
    const promisePersonal = () =>
      searchVendors(selectedCompanyId, keyword, employeeId);
    const promiseCompany = () => searchVendors(selectedCompanyId, keyword);

    const { COMPANY, PERSONAL } = vendorTypes;

    const promiseArray = [
      types.includes(PERSONAL) ? promisePersonal() : emptyPromise,
      types.includes(COMPANY) || isEmpty(types)
        ? promiseCompany()
        : emptyPromise,
    ];

    const [result1, result2] = await Promise.all(promiseArray);

    return result1
      .map((x) => ({ ...x, type: PERSONAL }))
      .concat(result2.map((x) => ({ ...x, type: COMPANY })));
  },
  getRecentVendors: async (_, types) => {
    const isPersonalVendor = true;
    const { COMPANY, PERSONAL } = vendorTypes;
    const { employeeId, usePersonalVendor, companyId } = stateProps;
    const { getRecentVendors } = dispatchProps;

    if (!isEmpty(types)) {
      const [resPersonal, resCompany] = await Promise.all([
        getRecentVendors(employeeId, companyId, isPersonalVendor),
        getRecentVendors(employeeId, companyId),
      ]);
      return resPersonal
        .map((x) => ({ ...x, type: PERSONAL }))
        .concat(resCompany.map((x) => ({ ...x, type: COMPANY })));
    } else if (usePersonalVendor) {
      return await getRecentVendors(employeeId, companyId, isPersonalVendor);
    } else {
      return await getRecentVendors(employeeId, companyId);
    }
  },
  onClickNewReportButton: () => {
    if (stateProps.mode === modes.REPORT_EDIT) {
      dispatchProps.confirm(msg().Common_Confirm_DiscardEdits, (yes) => {
        if (yes) {
          dispatchProps.createNewExpReport();
        }
      });
    } else {
      dispatchProps.createNewExpReport();
    }
  },
  onClickBackBtn: () => {
    dispatchProps.moveBackToReport();
  },
  handleChangeEstAmt: (amount: number) => {
    ownProps.expReport.totalAmount = amount;

    ownProps.onChangeEditingExpReport(
      'report.totalAmount',
      ownProps.expReport.totalAmount,
      true
    );
  },
  isNotDefaultCostCenter: async (
    costCenterCode: string,
    scheduleDate: string
  ) => {
    const { defaultCostCenter, employeeId, subroleId } = stateProps;
    dispatchProps.clearLatestCostCenter();
    return await dispatchProps.isNotDefaultCostCenter(
      costCenterCode,
      scheduleDate,
      defaultCostCenter,
      subroleId,
      employeeId
    );
  },
  handleChangeExpenseReportType: async (
    targetedReportType: Record<string, any>,
    isEditTouched?: boolean
  ) => {
    const reportTypeId = targetedReportType.value || targetedReportType.id;
    if (!reportTypeId) return;
    let newReportType = find(stateProps.reportTypeList, ['id', reportTypeId]);
    if (!newReportType) newReportType = stateProps.reportTypeList[0];
    const { isVendorVisible, isJobVisible, isCostCenterVisible } =
      getDisplayOfVendorCCJob(newReportType);
    let resetVendorData = {} as any;
    if (!isVendorVisible) {
      resetVendorData = { ...initailVendorData };
      resetVendorData.paymentDueDate = null;
    }
    let resetJobData = {};
    if (!isJobVisible) {
      resetJobData = initialJobData;
    }
    let resetCostCenterData = {} as any;
    if (!isCostCenterVisible) {
      resetCostCenterData = { ...initailCostCenterData };
      resetCostCenterData.costCenterName = null;
    } else {
      const scheduleDate = ownProps.expReport.scheduledDate;
      const currentCC = ownProps.expReport.costCenterCode;
      const isUpdateDefaultCC =
        !get(ownProps.expReport, 'isCostCenterChangedManually') ||
        isEmpty(currentCC);
      if (scheduleDate && isUpdateDefaultCC) {
        const fetchedDefaultCC = find(stateProps.defaultCostCenter, {
          date: scheduleDate,
          empHistoryId: stateProps.subroleId,
        });
        if (!fetchedDefaultCC) {
          const updateValue = await dispatchProps.getDefaultCostCenter(
            stateProps.employeeId,
            scheduleDate,
            stateProps.subroleId
          );
          resetCostCenterData = updateValue || defaultCostCenter;
        } else {
          resetCostCenterData = fetchedDefaultCC.costCenter;
        }
        resetCostCenterData.isCostCenterChangedManually = false;
      }
    }

    const isUseCashAdvance = get(newReportType, 'useCashAdvance', false);
    const resetCashAdvanceData = !isUseCashAdvance
      ? initialCashAdvanceData
      : {};

    const originalReport = ownProps.expReport;
    const updateReceiptData = {
      useFileAttachment:
        (newReportType && newReportType.useFileAttachment) || false,
    };
    if (!newReportType.useFileAttachment) {
      assign(updateReceiptData, { attachedFileList: [] });
    }
    const updateExtendedData = getEIsOnly(newReportType, originalReport);

    const updatedReportType = {
      expReportTypeId: reportTypeId,
      expReportTypeName: newReportType.name,
    };

    await dispatchProps.updateReport(
      {
        ...resetVendorData,
        ...resetCostCenterData,
        ...resetJobData,
        ...resetCashAdvanceData,
        ...updateReceiptData,
        ...updateExtendedData,
        ...updatedReportType,
      },
      isEditTouched
    );
  },
  handleChangeCostCenter: () => {
    ownProps.onChangeEditingExpReport('report.costCenterHistoryId', null, true);
    ownProps.onChangeEditingExpReport('report.costCenterCode', '', true);
    ownProps.onChangeEditingExpReport('report.costCenterName', '', true);
    ownProps.onChangeEditingExpReport(
      'report.isCostCenterChangedManually',
      false
    );
  },
  handleChangeSubject: (e: any) => {
    ownProps.onChangeEditingExpReport('report.subject', e.target.value, true);
  },
  handleChangePurpose: (e: any) => {
    ownProps.onChangeEditingExpReport('report.purpose', e.target.value, true);
  },
  handleChangeRemarks: (e: any) => {
    ownProps.onChangeEditingExpReport('report.remarks', e.target.value, true);
  },
  handleChangeJob: () => {
    ownProps.onChangeEditingExpReport('report.jobId', null, true);
    ownProps.onChangeEditingExpReport('report.jobName', '', true);
  },
  handleClickCostCenterBtn: () => {
    dispatchProps.onClickCostCenterButton(
      ownProps.expReport.scheduledDate,
      stateProps.employeeId,
      stateProps.selectedCompanyId,
      !isEmpty(stateProps.selectedDelegator)
    );
  },
  handleClickJobBtn: () => {
    const employeeId =
      ownProps.expReport.employeeBaseId || stateProps.employeeId;
    dispatchProps.onClickJobButton(
      ownProps.expReport.scheduledDate,
      employeeId,
      stateProps.selectedCompanyId,
      !isEmpty(stateProps.selectedDelegator)
    );
  },
  renderScheduledDate: (disabled: boolean, errors: any, touched: any) => {
    return (
      <div className="ts-expenses__form-report-summary__form__scheduled-date">
        <div className="ts-text-field-container">
          <p className="key">
            <span className="is-required">*</span>
            &nbsp;{msg().Exp_Clbl_ScheduledDate}
          </p>
          <DateField
            value={DateUtil.format(
              ownProps.expReport.scheduledDate,
              'YYYY-MM-DD'
            )}
            onChange={(value: string) => {
              ownProps.onChangeEditingExpReport(
                'report.scheduledDate',
                value,
                true
              );
            }}
            disabled={disabled}
          />
          {errors.scheduledDate && touched.scheduledDate && (
            <div className="input-feedback">{msg()[errors.scheduledDate]}</div>
          )}
        </div>
      </div>
    );
  },
  onClickVendorSearch: () => {
    dispatchProps.openVendorLookupDialog(
      stateProps.employeeId,
      stateProps.selectedCompanyId,
      stateProps.vendorTypes,
      !isEmpty(stateProps.selectedDelegator)
    );
  },
  onClickLookupEISearch: (item: EISearchObj) => {
    dispatchProps.openEILookupDialog(
      item,
      stateProps.employeeId,
      stateProps.companyId,
      !isEmpty(stateProps.selectedDelegator)
    );
  },
  onClickPrintPageButton: () => {
    const { selectedExpReport, reportTypeList, subroleId, employeeId } =
      stateProps;
    const { reportId, expReportTypeId, employeeBaseId, empHistoryId } =
      selectedExpReport || {};
    const empId = employeeBaseId || employeeId; // newly saved report do not have employeeBaseId
    const historyId = subroleId || empHistoryId; // empHistoryId for FA tab

    const printPageEndPoint = (() => {
      const selectedReportType =
        find(reportTypeList, ['id', expReportTypeId]) || {};
      const customPrintPageEndPoint =
        selectedReportType?.printPageLayoutForRequestDetail?.layoutName || '';

      if (customPrintPageEndPoint) {
        return `c__${customPrintPageEndPoint}`;
      }

      return 'ExpenseReportPrintV2';
    })();

    const url =
      `/apex/${printPageEndPoint}?empId=${empId}&reportId=${reportId}&endDate=2101-01-01&reportTypeId=${expReportTypeId}&isRequest=true` +
      (!isEmpty(historyId) ? `&empHistoryId=${historyId}` : '');
    window.open(url);
  },
  onClickCloneButton: () => {
    const { selectedExpReport, reportTypeList, employeeId, subroleId } =
      stateProps;
    if (ownProps.isFinanceApproval) {
      dispatchProps.cloneReportInFA(
        selectedExpReport.reportId,
        employeeId,
        false
      );
    } else {
      dispatchProps
        .cloneReport(
          selectedExpReport.reportId,
          reportTypeList,
          employeeId,
          selectedExpReport.isCostCenterChangedManually,
          subroleId,
          !isEmpty(stateProps.subroleIds)
            ? { empHistoryIds: stateProps.subroleIds }
            : undefined
        )
        .then(() => ownProps.validateForm());
    }
  },
  openClonedReportTab: () => {
    UrlUtil.openApp(appName.REQUESTS);
  },
  closeReportCloneToaster: () => {
    dispatchProps.clearReportCloneToaster();
  },
  onClickEstAmtEditButton: () => {
    const newIsEstimated = !ownProps.expReport.isEstimated;
    ownProps.onChangeEditingExpReport(
      'report.isEstimated',
      newIsEstimated,
      false
    );
    if (newIsEstimated) {
      ownProps.onChangeEditingExpReport(
        'report.totalAmount',
        ownProps.expReport.totalAmount,
        true
      );
    } else {
      ownProps.onChangeEditingExpReport(
        'report.totalAmount',
        calcTotalAmount(ownProps.expReport, stateProps.baseCurrencyDecimal),
        true
      );
    }
  },
  openReceiptLibraryDialog: () => {
    dispatchProps.openReceiptLibraryDialog(ATTACHMENT_MAX_COUNT);
  },
  toggleVendorDetail: (toOpen: boolean) => {
    if (toOpen) {
      const vendorId = get(ownProps, 'expReport.vendorId', null);
      dispatchProps.setVendorIdDialog(vendorId);
      dispatchProps.openVendorDetailModal();
    } else {
      dispatchProps.hideAllDialogs();
      dispatchProps.clearVendorIdDialog(null);
    }
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ReportSummaryView) as React.ComponentType<Record<string, any>>;
