import { connect } from 'react-redux';

import { assign, cloneDeep, find, get, isEmpty, set } from 'lodash';

import appName from '../../../commons/constants/appName';

import {
  getRecentCostCenters,
  searchCostCenters,
} from '../../../commons/action-dispatchers/CostCenter';
import { confirm } from '../../../commons/actions/app';
import ReportSummaryView from '../../../commons/components/exp/Form/ReportSummary';
import { selectors as appSelectors } from '../../../commons/modules/app';
import UrlUtil from '../../../commons/utils/UrlUtil';

import { defaultCostCenter } from '../../../domain/models/exp/CostCenter';
import {
  EISearchObj,
  getEIsOnly,
} from '../../../domain/models/exp/ExtendedItem';
import {
  ATTACHMENT_MAX_COUNT,
  CUSTOM_REQUEST_LINK_USAGE_TYPE,
  getDisplayOfVendorCCJob,
  initailCostCenterData,
  initailVendorData,
  initialCustomRequestData,
  initialJobData,
} from '../../../domain/models/exp/Report';
import {
  generateVendorTypes,
  vendorTypes,
} from '../../../domain/models/exp/Vendor';

import { getDefaultCostCenter } from '../../../domain/modules/exp/cost-center/defaultCostCenter';
import { actions as activeDialogActionsFA } from '../../../finance-approval-pc/modules/ui/FinanceApproval/dialog/activeDialog';
import { actions as reportCloneLinkActions } from '../../../finance-approval-pc/modules/ui/FinanceApproval/reportCloneLink';
import { actions as activeDialogActions } from '../../modules/ui/expenses/dialog/activeDialog';
import { actions as personalListActions } from '../../modules/ui/expenses/dialog/vendor/personalList';
import { actions as modeActions } from '../../modules/ui/expenses/mode';
import { actions as openTitleActions } from '../../modules/ui/expenses/recordListPane/summary/openTitle';
import { actions as latestCostCenterActions } from '@apps/domain/modules/exp/cost-center/latestCostCenter';

import { cloneReportInFA } from '../../../finance-approval-pc/action-dispatchers/FinanceApproval';
import {
  openCostCenterDialog,
  openCustomRequestDialog,
  openEILookupDialog,
  openJobDialog,
  openReceiptLibraryDialog,
  openVendorDetailModal,
  openVendorLookupDialog,
} from '../../action-dispatchers/Dialog';
import {
  cloneReport,
  cloneReportAsRequest,
  createNewExpReport,
  isNotDefaultCostCenter,
} from '../../action-dispatchers/Expenses';
import { getRecentJobs, searchJobs } from '../../action-dispatchers/Job';
import {
  getRecentVendors,
  searchVendors,
  undoVendorDeletion,
} from '../../action-dispatchers/Vendor';

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
  return {
    showVendorFilter,
    usePersonalVendor,
    isLoading: appSelectors.loadingSelector(state),
    isPartialLoading: appSelectors.loadingAreaSelector(state),
    loadingAreas: state.common.app.loadingAreas,
    reportTypeList,
    inactiveReportTypeList,
    mode: state.ui.expenses.mode,
    expReportList: state.entities.exp.report.expReportList,
    selectedExpReport: state.ui.expenses.selectedExpReport,
    baseCurrencySymbol:
      ownProps.currencySymbol || state.userSetting.currencySymbol,
    baseCurrencyDecimal:
      ownProps.currencyDecimalPlaces || state.userSetting.currencyDecimalPlaces,
    employeeId: state.userSetting.employeeId,
    companyId: state.userSetting.companyId,
    vendorTypes,
    openTitle: state.ui.expenses.recordListPane.summary.openTitle,
    overlap: state.ui.expenses.overlap,
    customHint: state.entities.exp.customHint,
    availableExpType: state.entities.availableExpType,
    activeVendor: state.ui.expenses.dialog.vendor.search,
    defaultCostCenter: state.entities.exp.costCenter.defaultCostCenter,
    selectedDelegator: state.ui.expenses.delegateApplicant.selectedEmployee,
    // selectedCompanyId from FA cross Company
    selectedCompanyId:
      ownProps.selectedCompanyId || state.userSetting.companyId,
    useJctRegistrationNumber: state.userSetting.jctInvoiceManagement,
    expDisplayTaxDetailsSetting: state.userSetting.expDisplayTaxDetailsSetting,
    updateReport: (updateObj) => {
      const tmpReport = cloneDeep(ownProps.expReport);
      const tmpTouched = cloneDeep(ownProps.touched);

      Object.keys(updateObj as any).forEach((key) => {
        set(tmpReport, key, updateObj[key]);
        set(tmpTouched, key, true);
      });
      ownProps.onChangeEditingExpReport('report', tmpReport, tmpTouched);
    },
    isSkipRecentlyUsedFetch:
      !isEmpty(state.ui.expenses.delegateApplicant.selectedDelegator) ||
      ownProps.isFinanceApproval,
    reportCloneLink:
      ownProps.isFinanceApproval && state.ui.FinanceApproval.reportCloneLink,
    removedVendors: state.ui.expenses.dialog.vendor.personal.removed,
    ...ownProps,
  };
};

const mapDispatchToProps = {
  confirm,
  createNewExpReport,
  openTitleAction: openTitleActions.open,
  onClickTitleToggleButton: openTitleActions.toggle,
  reportEdit: modeActions.reportEdit,
  onClickCostCenterButton: (
    targetDate: string,
    employeeId: string,
    isSkipRecentlyUsed: boolean
  ) => openCostCenterDialog(targetDate, employeeId, isSkipRecentlyUsed),
  onClickJobButton: (
    targetDate: string,
    employeeId: string,
    isSkipRecentlyUsed: boolean
  ) => openJobDialog(targetDate, employeeId, isSkipRecentlyUsed),
  openVendorLookupDialog,
  openVendorDetailModal,
  hideAllDialogs: activeDialogActions.hideAll,
  openEILookupDialog,
  cloneReport,
  openCloneConfirmDialog: activeDialogActionsFA.cloneConfirm,
  cloneReportInFA,
  cloneReportAsRequest,

  openCustomRequestDialog,
  openReceiptLibraryDialog,
  getDefaultCostCenter,
  clearReportCloneToaster: reportCloneLinkActions.reset,
  getRecentJobs,
  searchJobs,
  getRecentCostCenters,
  searchCostCenters,
  getRecentVendors,
  searchVendors,
  undoVendorDeletion,
  clearRemovedVendor: personalListActions.delete,
  clearLatestCostCenter: latestCostCenterActions.clear,
  isNotDefaultCostCenter,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  searchJobs: (keyword) => {
    const reportDate = get(ownProps.expReport, 'accountingDate');
    const employeeId =
      ownProps.expReport.employeeBaseId || stateProps.employeeId;
    return dispatchProps.searchJobs(
      keyword,
      reportDate,
      employeeId,
      stateProps.selectedCompanyId
    );
  },
  getRecentJobs: (targetDate) => {
    return dispatchProps.getRecentJobs(targetDate, stateProps.employeeId);
  },
  searchCostCenters: (keyword) => {
    const reportDate = get(ownProps.expReport, 'accountingDate');
    return dispatchProps.searchCostCenters(
      stateProps.selectedCompanyId,
      keyword,
      reportDate
    );
  },
  getRecentCostCenters: (targetDate) => {
    return dispatchProps.getRecentCostCenters(
      stateProps.employeeId,
      targetDate
    );
  },
  searchVendors: async (keyword, types: Array<string>) => {
    const emptyPromise = new Promise((resolve) => resolve([]));

    const { selectedCompanyId } = stateProps;
    const { searchVendors } = dispatchProps;
    const employeeId =
      ownProps.expReport.employeeBaseId || stateProps.employeeId;
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
    const { employeeId, usePersonalVendor } = stateProps;
    const { getRecentVendors } = dispatchProps;

    if (!isEmpty(types)) {
      const [resPersonal, resCompany] = await Promise.all([
        getRecentVendors(employeeId, isPersonalVendor),
        getRecentVendors(employeeId),
      ]);
      return resPersonal
        .map((x) => ({ ...x, type: PERSONAL }))
        .concat(resCompany.map((x) => ({ ...x, type: COMPANY })));
    } else if (usePersonalVendor) {
      return await getRecentVendors(employeeId, isPersonalVendor);
    } else {
      return await getRecentVendors(employeeId);
    }
  },
  onClickBackBtn: () => {
    dispatchProps.moveBackToReport();
  },
  handleChangeExpenseReportType: async (
    tragetedReportType: Record<string, any>
  ) => {
    const reportTypeId = tragetedReportType.value;
    const newReportType = find(stateProps.reportTypeList, ['id', reportTypeId]);
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
      const reportDate = get(ownProps.expReport, 'accountingDate');
      const currentCC = get(ownProps.expReport, 'costCenterCode');
      const isUpdateDefaultCC =
        !get(ownProps.expReport, 'isCostCenterChangedManually') ||
        isEmpty(currentCC);
      if (reportDate && isUpdateDefaultCC) {
        const fetchedDefaultCC = find(stateProps.defaultCostCenter, {
          date: reportDate,
        });
        if (!fetchedDefaultCC) {
          const updateValue = await dispatchProps.getDefaultCostCenter(
            stateProps.employeeId,
            reportDate
          );
          resetCostCenterData = updateValue || defaultCostCenter;
        } else {
          resetCostCenterData = fetchedDefaultCC.costCenter;
        }
        resetCostCenterData.isCostCenterChangedManually = false;
      }
    }
    const originalReport = ownProps.expReport;
    const updateReceiptData = {
      useFileAttachment: newReportType.useFileAttachment,
    };
    if (!newReportType.useFileAttachment) {
      assign(updateReceiptData, { attachedFileList: [] });
    }

    let customRequestData = {};
    if (
      newReportType.customRequestLinkUsage ===
      CUSTOM_REQUEST_LINK_USAGE_TYPE.NotUsed
    ) {
      customRequestData = initialCustomRequestData;
    }
    const updateExtendedData = getEIsOnly(newReportType, originalReport);

    const updatedReportType = {
      expReportTypeId: reportTypeId,
      expReportTypeName: newReportType.name,
    };

    await stateProps.updateReport({
      ...resetVendorData,
      ...resetJobData,
      ...resetCostCenterData,
      ...updateReceiptData,
      ...customRequestData,
      ...updateExtendedData,
      ...updatedReportType,
    });
    ownProps.onChangeEditingExpReport('ui.isFileAttachmentRequired', false);
    ownProps.onChangeEditingExpReport('ui.isCustomRequestRequired', false);
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
      ownProps.expReport.accountingDate,
      stateProps.employeeId,
      stateProps.isSkipRecentlyUsedFetch
    );
  },
  handleClickJobBtn: () => {
    const employeeId =
      ownProps.expReport.employeeBaseId || stateProps.employeeId;
    dispatchProps.onClickJobButton(
      ownProps.expReport.accountingDate,
      employeeId,
      stateProps.isSkipRecentlyUsedFetch
    );
  },
  onClickVendorSearch: async () =>
    dispatchProps.openVendorLookupDialog(
      stateProps.employeeId,
      stateProps.vendorTypes,
      stateProps.isSkipRecentlyUsedFetch
    ),
  onClickLookupEISearch: async (item: EISearchObj) =>
    dispatchProps.openEILookupDialog(
      item,
      stateProps.employeeId,
      stateProps.isSkipRecentlyUsedFetch
    ),
  onClickPrintPageButton: () => {
    const { reportId, expReportTypeId, employeeBaseId } =
      stateProps.selectedExpReport;
    const empId = employeeBaseId || stateProps.employeeId; // newly saved report do not have employeeBaseId
    const url = `/apex/ExpenseReportPrintV2?empId=${empId}&reportId=${reportId}&endDate=2101-01-01&reportTypeId=${expReportTypeId}`;
    window.open(url);
  },
  onClickCloneButton: () => {
    const { selectedExpReport, reportTypeList, employeeId } = stateProps;
    const selectedReportType =
      find(reportTypeList, ['id', selectedExpReport.expReportTypeId]) || {};
    const isRequestRequired = selectedReportType.requestRequired;
    const isFromPreRequest = !!selectedExpReport.preRequestId;
    const isCloneConfirmNeeded = !isRequestRequired && isFromPreRequest;

    if (ownProps.isExpense && !isRequestRequired) {
      dispatchProps
        .cloneReport(
          selectedExpReport.reportId,
          reportTypeList,
          employeeId,
          selectedExpReport.isCostCenterChangedManually
        )
        .then(() => ownProps.validateForm());
    } else if (ownProps.isFinanceApproval && isCloneConfirmNeeded) {
      dispatchProps.openCloneConfirmDialog();
    } else if (ownProps.isFinanceApproval && isRequestRequired) {
      dispatchProps.cloneReportInFA(
        selectedExpReport.preRequestId,
        employeeId,
        false
      );
    } else if (ownProps.isFinanceApproval && !isFromPreRequest) {
      dispatchProps.cloneReportInFA(
        selectedExpReport.reportId,
        employeeId,
        true
      );
    } else if (isRequestRequired) {
      dispatchProps.cloneReportAsRequest(
        selectedExpReport.preRequestId,
        employeeId,
        ownProps.isFinanceApproval || false
      );
    }
  },
  openRequestReportPage: (id) => {
    if (!id) {
      return;
    }
    const params = { id };
    UrlUtil.openApp('requests-pc', params);
  },
  openCustomRequestPage: (id) => {
    if (!id) {
      return;
    }
    const url = `${window.origin}/lightning/r/ComGeneralRequest__c/${id}/view`;
    window.open(url);
  },
  openCustomRequestDialog: () => {
    dispatchProps.openCustomRequestDialog();
  },
  openReceiptLibraryDialog: () => {
    dispatchProps.openReceiptLibraryDialog(false, ATTACHMENT_MAX_COUNT);
  },
  openClonedReportTab: () => {
    const { reportCloneLink = {} } = stateProps;
    const module = get(reportCloneLink, 'isExpenseReport')
      ? appName.EXPENSES
      : appName.REQUESTS;
    UrlUtil.openApp(module, {
      id: reportCloneLink.reportId,
      isCloned: 'true',
      isFromFA: 'true',
    });
  },
  closeReportCloneToaster: () => {
    dispatchProps.clearReportCloneToaster();
  },
  isNotDefaultCostCenter: async (
    costCenterCode: string,
    accountingDate: string
  ) => {
    const { defaultCostCenter, employeeId } = stateProps;
    dispatchProps.clearLatestCostCenter();
    return await dispatchProps.isNotDefaultCostCenter(
      costCenterCode,
      accountingDate,
      defaultCostCenter,
      employeeId
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ReportSummaryView) as React.ComponentType<Record<string, any>>;
