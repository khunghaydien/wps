import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
import { actions as vendorIdActions } from '../../modules/ui/expenses/dialog/vendor/id';
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
  openPrintWindow,
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

  if (state.ui.expenses.tab.tabIdx) {
    reportTypeList.concat(inactiveReportTypeList);
  }

  const { useCompanyVendor, usePersonalVendor } = state.userSetting;

  const showVendorFilter = !(useCompanyVendor ^ usePersonalVendor);

  const subroleId = get(state, 'ui.expenses.subrole.selectedRole');
  const subroleIds = get(state, 'ui.expenses.subrole.ids');

  const vendorTypes = generateVendorTypes(
    state.userSetting,
    ownProps.isFinanceApproval
  );

  let alwaysDisplaySettlementAmount = get(
    state,
    'userSetting.alwaysDisplaySettlementAmount'
  );
  if (ownProps.isFinanceApproval && ownProps.selectedCompanyId) {
    const companyList = state.entities.companyList;
    const companySetting = find(companyList, {
      value: ownProps.selectedCompanyId,
    });
    if (companySetting) {
      alwaysDisplaySettlementAmount =
        companySetting.alwaysDisplaySettlementAmount;
    }
  }

  return {
    showVendorFilter,
    usePersonalVendor,
    isBulkEditMode: state.common.exp.ui.bulkEditRecord.isEnabled,
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
    subroleId,
    subroleIds,
    isSkipRecentlyUsedFetch:
      !isEmpty(state.ui.expenses.delegateApplicant.selectedDelegator) ||
      ownProps.isFinanceApproval,
    reportCloneLink:
      ownProps.isFinanceApproval && state.ui.FinanceApproval.reportCloneLink,
    removedVendors: state.ui.expenses.dialog.vendor.personal.removed,
    ...ownProps,
    // selectedCompanyId from FA cross Company
    selectedCompanyId:
      ownProps.selectedCompanyId || state.userSetting.companyId,
    useJctRegistrationNumber: state.userSetting.jctInvoiceManagement,
    alwaysDisplaySettlementAmount,
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
    openPrintWindow,
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
    const reportDate = get(ownProps.expReport, 'accountingDate');
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
      targetDate,
      stateProps.selectedCompanyId
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
  onClickBackBtn: () => {
    dispatchProps.moveBackToReport();
  },
  isNotDefaultCostCenter: async (
    costCenterCode: string,
    accountingDate: string
  ) => {
    const { defaultCostCenter, employeeId, subroleId } = stateProps;
    dispatchProps.clearLatestCostCenter();
    return await dispatchProps.isNotDefaultCostCenter(
      costCenterCode,
      accountingDate,
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
      const reportDate = get(ownProps.expReport, 'accountingDate');
      const currentCC = get(ownProps.expReport, 'costCenterCode');
      const isUpdateDefaultCC =
        !get(ownProps.expReport, 'isCostCenterChangedManually') ||
        isEmpty(currentCC);
      if (reportDate && isUpdateDefaultCC) {
        const fetchedDefaultCC = find(stateProps.defaultCostCenter, {
          date: reportDate,
          empHistoryId: stateProps.subroleId,
        });
        if (!fetchedDefaultCC) {
          const updateValue = await dispatchProps.getDefaultCostCenter(
            stateProps.employeeId,
            reportDate,
            stateProps.subroleId
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
      useFileAttachment:
        (newReportType && newReportType.useFileAttachment) || false,
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
      expReportTypeId: newReportType.id,
      expReportTypeName: newReportType.name,
    };
    await dispatchProps.updateReport(
      {
        ...resetVendorData,
        ...resetJobData,
        ...resetCostCenterData,
        ...updateReceiptData,
        ...customRequestData,
        ...updateExtendedData,
        ...updatedReportType,
      },
      isEditTouched
    );

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
      stateProps.selectedCompanyId,
      stateProps.isSkipRecentlyUsedFetch
    );
  },
  handleClickJobBtn: () => {
    const employeeId =
      ownProps.expReport.employeeBaseId || stateProps.employeeId;
    dispatchProps.onClickJobButton(
      ownProps.expReport.accountingDate,
      employeeId,
      stateProps.selectedCompanyId,
      stateProps.isSkipRecentlyUsedFetch
    );
  },
  onClickVendorSearch: async () =>
    dispatchProps.openVendorLookupDialog(
      stateProps.employeeId,
      stateProps.selectedCompanyId,
      stateProps.vendorTypes,
      stateProps.isSkipRecentlyUsedFetch
    ),
  onClickLookupEISearch: async (item: EISearchObj) =>
    dispatchProps.openEILookupDialog(
      item,
      stateProps.employeeId,
      stateProps.companyId,
      stateProps.isSkipRecentlyUsedFetch
    ),
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
        selectedReportType?.printPageLayoutForReportDetail?.layoutName || '';

      if (customPrintPageEndPoint) {
        return `c__${customPrintPageEndPoint}`;
      }

      return 'ExpenseReportPrintV2';
    })();

    const url =
      `/apex/${printPageEndPoint}?empId=${empId}&reportId=${reportId}&endDate=2101-01-01&reportTypeId=${expReportTypeId}&isRequest=false` +
      (!isEmpty(historyId) ? `&empHistoryId=${historyId}` : '');
    window.open(url);
  },
  onClickCloneButton: () => {
    const { selectedExpReport, reportTypeList, employeeId, subroleId } =
      stateProps;
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
          selectedExpReport.isCostCenterChangedManually,
          subroleId,
          !isEmpty(stateProps.subroleIds)
            ? { empHistoryIds: stateProps.subroleIds }
            : undefined
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
        ownProps.isFinanceApproval || false,
        subroleId
      );
    }
  },
  openRequestReportPage: (id) => {
    if (!id) {
      return;
    }
    const { subroleId, selectedExpReport } = stateProps;
    const empHistoryId = selectedExpReport.empHistoryId || subroleId;
    const employeeId =
      selectedExpReport.employeeBaseId || stateProps.employeeId;
    const params = { id, empHistoryId, employeeId };
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
    UrlUtil.openApp(module);
  },
  closeReportCloneToaster: () => {
    dispatchProps.clearReportCloneToaster();
  },
  toggleVendorDetail: (toOpen: boolean) => {
    if (toOpen) {
      const vendorId = get(ownProps, 'expReport.vendorId', null);
      dispatchProps.setVendorIdDialog(vendorId);
      dispatchProps.openVendorDetailModal();
    } else {
      dispatchProps.hideAllDialogs();
      dispatchProps.clearVendorIdDialog();
    }
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ReportSummaryView) as React.ComponentType<Record<string, any>>;
