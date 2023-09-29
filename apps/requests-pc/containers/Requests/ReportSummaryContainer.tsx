import * as React from 'react';
import { connect } from 'react-redux';

import { assign, cloneDeep, find, get, isEmpty, set } from 'lodash';

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
  initialJobData,
} from '../../../domain/models/exp/Report';
import {
  generateVendorTypes,
  vendorTypes,
} from '../../../domain/models/exp/Vendor';

import { getDefaultCostCenter } from '../../../domain/modules/exp/cost-center/defaultCostCenter';
import { actions as activeDialogActions } from '../../modules/ui/expenses/dialog/activeDialog';
import { actions as personalListActions } from '../../modules/ui/expenses/dialog/vendor/personalList';
import { actions as modeActions, modes } from '../../modules/ui/expenses/mode';
import { actions as openTitleActions } from '../../modules/ui/expenses/recordListPane/summary/openTitle';
import { actions as latestCostCenterActions } from '@apps/domain/modules/exp/cost-center/latestCostCenter';

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
    isLoading: appSelectors.loadingSelector(state),
    isPartialLoading: appSelectors.loadingAreaSelector(state),
    loadingAreas: state.common.app.loadingAreas,
    reportTypeList,
    inactiveReportTypeList,
    companyId: state.userSetting.companyId,
    mode: state.ui.expenses.mode,
    expReportList: state.entities.exp.preRequest.expReportList,
    selectedExpReport: state.ui.expenses.selectedExpReport,
    baseCurrencySymbol: state.userSetting.currencySymbol,
    baseCurrencyDecimal: state.userSetting.currencyDecimalPlaces,
    employeeId: state.userSetting.employeeId,
    openTitle: state.ui.expenses.recordListPane.summary.openTitle,
    customHint: state.entities.exp.customHint,
    activeVendor: state.ui.expenses.dialog.vendor.search,
    defaultCostCenter: state.entities.exp.costCenter.defaultCostCenter,
    selectedDelegator: state.ui.expenses.delegateApplicant.selectedEmployee,
    updateReport: (updateObj) => {
      const tmpReport = cloneDeep(ownProps.expReport);
      const tmpTouched = cloneDeep(ownProps.touched);

      Object.keys(updateObj as any).forEach((key) => {
        set(tmpReport, key, updateObj[key]);
        set(tmpTouched, key, true);
      });
      ownProps.onChangeEditingExpReport('report', tmpReport, tmpTouched);
    },
    isExpenseRequest: true,
    vendorTypes,
    removedVendors: state.ui.expenses.dialog.vendor.personal.removed,
    ...ownProps,
    useJctRegistrationNumber: state.userSetting.jctInvoiceManagement,
    expDisplayTaxDetailsSetting: state.userSetting.expDisplayTaxDetailsSetting,
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
  clearLatestCostCenter: latestCostCenterActions.clear,
  isNotDefaultCostCenter,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  searchJobs: (keyword) => {
    const reportDate = get(ownProps.expReport, 'scheduledDate');
    return dispatchProps.searchJobs(
      keyword,
      reportDate,
      stateProps.employeeId,
      stateProps.companyId
    );
  },
  getRecentJobs: (targetDate) => {
    return dispatchProps.getRecentJobs(targetDate, stateProps.employeeId);
  },
  searchCostCenters: (keyword) => {
    const reportDate = get(ownProps.expReport, 'scheduledDate');
    return dispatchProps.searchCostCenters(
      stateProps.companyId,
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

    const { companyId, employeeId } = stateProps;
    const { searchVendors } = dispatchProps;
    const promisePersonal = () => searchVendors(companyId, keyword, employeeId);
    const promiseCompany = () => searchVendors(companyId, keyword);

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
      const scheduleDate = ownProps.expReport.scheduledDate;
      const currentCC = ownProps.expReport.costCenterCode;
      const isUpdateDefaultCC =
        !get(ownProps.expReport, 'isCostCenterChangedManually') ||
        isEmpty(currentCC);
      if (scheduleDate && isUpdateDefaultCC) {
        const fetchedDefaultCC = find(stateProps.defaultCostCenter, {
          date: scheduleDate,
        });
        if (!fetchedDefaultCC) {
          const updateValue = await dispatchProps.getDefaultCostCenter(
            stateProps.employeeId,
            scheduleDate
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
    const updateExtendedData = getEIsOnly(newReportType, originalReport);

    const updatedReportType = {
      expReportTypeId: reportTypeId,
      expReportTypeName: newReportType.name,
    };

    stateProps.updateReport({
      ...resetVendorData,
      ...resetCostCenterData,
      ...resetJobData,
      ...updateReceiptData,
      ...updateExtendedData,
      ...updatedReportType,
    });
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
      !isEmpty(stateProps.selectedDelegator)
    );
  },
  handleClickJobBtn: () => {
    dispatchProps.onClickJobButton(
      ownProps.expReport.scheduledDate,
      stateProps.employeeId,
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
      stateProps.vendorTypes,
      !isEmpty(stateProps.selectedDelegator)
    );
  },
  onClickLookupEISearch: (item: EISearchObj) => {
    dispatchProps.openEILookupDialog(
      item,
      stateProps.employeeId,
      !isEmpty(stateProps.selectedDelegator)
    );
  },
  onClickCloneButton: () => {
    const { selectedExpReport, reportTypeList, employeeId } = stateProps;
    dispatchProps.cloneReport(
      selectedExpReport.reportId,
      reportTypeList,
      employeeId,
      selectedExpReport.isCostCenterChangedManually
    );
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
