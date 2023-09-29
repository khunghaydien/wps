import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import find from 'lodash/find';

import AdvSearch from '@commons/components/exp/ReportList/AdvSearch';
import { FILTER_TYPE } from '@commons/components/exp/SearchFields';
import { DateRangeOption } from '@commons/components/fields/DropdownDateRange';
import msg from '@commons/languages';
import { State } from '@commons/modules';
import { actions as departmentListActions } from '@commons/modules/exp/entities/departmentList';
import { actions as employeeListActions } from '@commons/modules/exp/entities/employeeList';
import { actions as vendorListActions } from '@commons/modules/exp/entities/vendorList';
import {
  amountActions,
  costCenterActions,
  departmentActions,
  employeeActions,
  extraConditionsActions,
  FAStatusActions,
  reportDateActions,
  reportNoActions,
  reportTypeActions,
  statusListActions,
  subjectActions,
  vendorIdsActions,
} from '@commons/modules/exp/ui/reportList/advSearch';
import { KEYS } from '@commons/modules/exp/ui/reportList/advSearch/detail';
import TextUtil from '@commons/utils/TextUtil';

import STATUS from '@apps/domain/models/approval/request/Status';
import { DEPARTMENT_LIST } from '@apps/domain/models/exp/Department';
import { status } from '@apps/domain/models/exp/Report';
import { OPTION_LIMIT } from '@apps/domain/models/exp/request/Report';
import { DEFAULT_LIMIT_NUMBER as VENDOR_NUM } from '@apps/domain/models/exp/Vendor';

import { State as ApprovalState } from '@apps/approvals-pc/modules';
import { State as FAState } from '@apps/finance-approval-pc/modules';

/*
  Report List Adv Search Container for Expense, Request, FA, Approval
*/

const updatedDataList = (options, data) => {
  const isBaseData = data && find(options, ['value', data.value]);
  const newDataList = isBaseData ? options : [data].concat(options);
  return newDataList;
};

type Props = {
  baseConditions: Array<string>;
  selectedCompanyId?: string;
  baseCurrencyDecimal?: number;
  extraConditions?: Array<string>;
  isRequest?: boolean;
  isApproval?: boolean;
  onClickAdvSearchButton: () => void;
  onClickInputValueSubmitDate: (
    dateRangeOption: DateRangeOption,
    needUpdate: boolean
  ) => void;
};

type CommonState = { common: State };

const ReportListAdvSearchContainer = (props: Props) => {
  const selectedCompanyId = useSelector((state: FAState) => {
    return props.selectedCompanyId || state.userSetting.companyId;
  });

  const advSearchCondition = useSelector((state) => {
    return props.isApproval
      ? (state as ApprovalState).exp.ui.reportList.advSearch
      : (state as CommonState).common.exp.ui.reportList.advSearch;
  });

  const entities = useSelector((state) => {
    return props.isApproval
      ? (state as ApprovalState).exp.entities
      : (state as CommonState).common.exp.entities;
  });
  const {
    reportTypeList,
    vendorList,
    employeeList,
    costCenterList,
    departmentList,
  } = entities;

  const dispatch = useDispatch();

  const ReportTypeActions = useMemo(
    () => bindActionCreators(reportTypeActions, dispatch),
    [dispatch]
  );
  const SubjectActions = useMemo(
    () => bindActionCreators(subjectActions, dispatch),
    [dispatch]
  );
  const AmountActions = useMemo(
    () => bindActionCreators(amountActions, dispatch),
    [dispatch]
  );
  const ReportDateActions = useMemo(
    () => bindActionCreators(reportDateActions, dispatch),
    [dispatch]
  );
  const ExtraConditionsActions = useMemo(
    () => bindActionCreators(extraConditionsActions, dispatch),
    [dispatch]
  );
  const VendorIdsActions = useMemo(
    () => bindActionCreators(vendorIdsActions, dispatch),
    [dispatch]
  );
  const VendorListActions = useMemo(
    () => bindActionCreators(vendorListActions, dispatch),
    [dispatch]
  );
  const ReportNoActions = useMemo(
    () => bindActionCreators(reportNoActions, dispatch),
    [dispatch]
  );
  const FinanceStatusActions = useMemo(
    () => bindActionCreators(FAStatusActions, dispatch),
    [dispatch]
  );
  const StatusActions = useMemo(
    () => bindActionCreators(statusListActions, dispatch),
    [dispatch]
  );
  const EmployeeActions = useMemo(
    () => bindActionCreators(employeeActions, dispatch),
    [dispatch]
  );
  const EmployeeListActions = useMemo(
    () => bindActionCreators(employeeListActions, dispatch),
    [dispatch]
  );
  const DepartmentActions = useMemo(
    () => bindActionCreators(departmentActions, dispatch),
    [dispatch]
  );
  const DepartmentListActions = useMemo(
    () => bindActionCreators(departmentListActions, dispatch),
    [dispatch]
  );
  const CostCenterActions = useMemo(
    () => bindActionCreators(costCenterActions, dispatch),
    [dispatch]
  );

  const FAStatusOptions = [
    {
      label: msg().Exp_Btn_StatusOptionStatusApproved,
      value: status.APPROVED,
    },
    {
      label: msg().Exp_Btn_StatusOptionAccountingAuthorized,
      value: status.ACCOUNTING_AUTHORIZED,
    },
    {
      label: msg().Exp_Btn_StatusOptionAccountingRejected,
      value: status.ACCOUNTING_REJECTED,
    },
    {
      label: msg().Exp_Btn_StatusOptionJournalCreated,
      value: status.JOURNAL_CREATED,
    },
    {
      label: msg().Exp_Btn_StatusOptionPaid,
      value: status.FULLY_PAID,
    },
  ];

  const statusOptions = [
    { label: msg().Com_Status_Approved, value: STATUS.Approved },
    {
      label: msg().Com_Status_Pending,
      value: STATUS.Pending,
    },
    {
      label: msg().Com_Status_Rejected,
      value: STATUS.Rejected,
    },
  ];

  const toggleExtraCondition = (condition) => {
    const extraConditions = advSearchCondition.detail;
    // clear selected values if hide the condition
    if (extraConditions.includes(condition)) {
      switch (condition) {
        case KEYS.accountingDate:
          ReportDateActions.clear();
          break;
        case KEYS.reportNo:
          ReportNoActions.clear();
          break;
        case KEYS.vendor:
          VendorIdsActions.clear();
          break;
        case KEYS.title:
          SubjectActions.clear();
          break;
        case KEYS.amount:
          AmountActions.clear();
          break;
        case KEYS.reportType:
          ReportTypeActions.clear();
          break;
        case KEYS.costCenter:
          CostCenterActions.clear();
          break;
        default:
          break;
      }
    }
    ExtraConditionsActions.set(condition);
  };

  const onClickInputVendorId = (id, data) => {
    VendorIdsActions.set(id);
    VendorListActions.updateData(updatedDataList(vendorList, data));
  };

  const searchVendorByFetch = async (searchString) => {
    const result = await VendorListActions.fetchByQuery(
      selectedCompanyId,
      searchString || ''
    );
    // result is recognised as `Promise<VendorItem[]>` instead of `VendorItem[]`
    return (result as any).map((vendor) => ({
      label: vendor.name,
      value: vendor.id,
    }));
  };

  const onClickInputValueEmployee = (id, data) => {
    EmployeeActions.set(id);
    EmployeeListActions.updateData(updatedDataList(employeeList, data));
  };

  const searchEmployeeByFetch = async (searchString) => {
    const targetDate = advSearchCondition.requestDateRange.startDate;
    const result = await EmployeeListActions.fetch(
      selectedCompanyId,
      targetDate,
      OPTION_LIMIT + 1,
      searchString || null
    );
    return (result as any).map(({ name, id }) => ({
      label: name,
      value: id,
    }));
  };

  const onClickInputValueDepartment = (id, data) => {
    DepartmentActions.set(id);
    DepartmentListActions.updateData(updatedDataList(departmentList, data));
  };

  const searchDepartmentByFetch = async (searchString) => {
    const targetDate = advSearchCondition.requestDateRange.startDate;
    const result = await DepartmentListActions.fetchByQuery(
      selectedCompanyId,
      targetDate,
      OPTION_LIMIT + 1,
      [DEPARTMENT_LIST],
      searchString || null
    );
    return (result as any).map((department) => ({
      label: department.name,
      value: department.id,
    }));
  };

  const {
    baseConditions = [],
    extraConditions = [],
    baseCurrencyDecimal,
    onClickAdvSearchButton,
  } = props;

  const options = [
    {
      label: msg().Exp_Clbl_ReportTitle,
      value: KEYS.title,
    },
    {
      label: props.isRequest
        ? msg().Exp_Clbl_ScheduledDate
        : msg().Exp_Clbl_RecordDate,
      value: KEYS.accountingDate,
    },
    {
      label: msg().Exp_Btn_SearchConditionReportNo,
      value: KEYS.reportNo,
    },
    { label: msg().Exp_Clbl_Amount, value: KEYS.amount },
    { label: msg().Exp_Clbl_ReportType, value: KEYS.reportType },
    {
      label: msg().Exp_Clbl_CostCenterHeader,
      value: KEYS.costCenter,
    },
    {
      label: msg().Exp_Clbl_Vendor,
      value: KEYS.vendor,
    },
  ];

  const extraConditionOptions = options.filter(({ value }) =>
    extraConditions.includes(value)
  );

  const allFilters = [
    {
      key: KEYS.financeStatusList,
      type: FILTER_TYPE.SELECTION,
      appendedClass: 'field',
      label: msg().Exp_Btn_SearchConditionStatus,
      placeHolder: msg().Exp_Lbl_SearchConditionPlaceholderStatus,
      selectedStringValues: advSearchCondition.financeStatusList,
      data: FAStatusOptions,
      onSelectInput: FinanceStatusActions.set,
      selectAll: FinanceStatusActions.replace,
      clearAll: FinanceStatusActions.clear,
      showSelectionLabels: true,
      isClearable: true,
      onClickClearIcon: FinanceStatusActions.clear,
    },
    {
      key: KEYS.statusList,
      type: FILTER_TYPE.SELECTION,
      appendedClass: 'field',
      label: msg().Exp_Btn_SearchConditionStatus,
      placeHolder: msg().Exp_Lbl_SearchConditionPlaceholderStatus,
      selectedStringValues: advSearchCondition.statusList,
      data: statusOptions,
      onSelectInput: StatusActions.set,
      selectAll: StatusActions.replace,
      clearAll: StatusActions.clear,
      showSelectionLabels: true,
      isClearable: true,
      onClickClearIcon: StatusActions.clear,
    },

    {
      key: KEYS.employee,
      type: FILTER_TYPE.SELECTION,
      appendedClass: 'field',
      label: msg().Exp_Btn_SearchConditionEmployee,
      placeHolder: msg().Exp_Lbl_SearchConditionPlaceholderEmployee,
      selectedStringValues: advSearchCondition.empBaseIds,
      data: employeeList,
      onSelectInput: onClickInputValueEmployee,
      onSearchByFetching: searchEmployeeByFetch,
      optionLimit: OPTION_LIMIT,
      clearAll: EmployeeActions.clear,
      showSelectionLabels: true,
      isClearable: true,
      onClickClearIcon: EmployeeActions.clear,
    },

    {
      key: KEYS.department,
      type: FILTER_TYPE.SELECTION,
      appendedClass: 'field',
      label: msg().Exp_Btn_SearchConditionDepartment,
      placeHolder: msg().Exp_Lbl_SearchConditionPlaceholderDepartment,
      selectedStringValues: advSearchCondition.departmentBaseIds,
      data: departmentList,
      onSelectInput: onClickInputValueDepartment,
      onSearchByFetching: searchDepartmentByFetch,
      optionLimit: OPTION_LIMIT,
      clearAll: DepartmentActions.clear,
      showSelectionLabels: true,
      isClearable: true,
      onClickClearIcon: DepartmentActions.clear,
    },

    {
      key: KEYS.requestDateRange,
      type: FILTER_TYPE.DATE_DROPDOWN,
      appendedClass: 'field',
      label: msg().Exp_Btn_SearchConditionRequestDate,
      selectedDateRangeValues: advSearchCondition.requestDateRange,
      onClickUpdateDate: props.onClickInputValueSubmitDate,
    },
    {
      key: KEYS.reportType,
      type: FILTER_TYPE.SELECTION,
      appendedClass: 'field',
      label: msg().Exp_Clbl_ReportType,
      placeHolder: TextUtil.template(
        msg().Exp_Lbl_SearchConditionPlaceholder,
        msg().Exp_Clbl_ReportType
      ),
      selectedStringValues: advSearchCondition.reportTypeIds,
      data: reportTypeList,
      onSelectInput: ReportTypeActions.set,
      clearAll: ReportTypeActions.clear,
      selectAll: ReportTypeActions.replace,
      showSelectionLabels: true,
      isClearable: true,
      onClickClearIcon: ReportTypeActions.clear,
    },
    {
      key: KEYS.title,
      type: FILTER_TYPE.TEXT_INPUT,
      appendedClass: 'field',
      label: msg().Exp_Clbl_ReportTitle,
      inputValue: advSearchCondition.subject,
      onInput: SubjectActions.set,
      isClearable: true,
      onClickClearIcon: SubjectActions.clear,
    },

    {
      key: KEYS.accountingDate,
      type: FILTER_TYPE.DATE_DROPDOWN,
      appendedClass: 'field',
      label: props.isRequest
        ? msg().Exp_Clbl_ScheduledDate
        : msg().Exp_Clbl_RecordDate,
      selectedDateRangeValues: advSearchCondition.accountingDateRange,
      onClickUpdateDate: ReportDateActions.set,
    },
    {
      key: KEYS.reportNo,
      type: FILTER_TYPE.TEXT_INPUT,
      appendedClass: 'field',
      label: msg().Exp_Btn_SearchConditionReportNo,
      inputValue: advSearchCondition.reportNo,
      onInput: ReportNoActions.set,
      isClearable: true,
      onClickClearIcon: ReportNoActions.clear,
    },
    {
      key: KEYS.amount,
      type: FILTER_TYPE.AMOUNT_RANGE,
      appendedClass: 'field',
      label: msg().Exp_Clbl_Amount,
      amountRange: advSearchCondition.amountRange,
      onChangeAmount: AmountActions.set,
      currencyDecimalPlaces: baseCurrencyDecimal,
      isClearable: true,
      onClickClearIcon: AmountActions.clear,
    },
    {
      key: KEYS.costCenter,
      type: FILTER_TYPE.SELECTION,
      appendedClass: 'field',
      label: msg().Exp_Clbl_CostCenterHeader,
      placeHolder: TextUtil.template(
        msg().Exp_Lbl_SearchConditionPlaceholder,
        msg().Exp_Clbl_CostCenterHeader
      ),
      selectedStringValues: advSearchCondition.costCenterBaseIds,
      data: costCenterList,
      onSelectInput: CostCenterActions.set,
      clearAll: CostCenterActions.clear,
      selectAll: CostCenterActions.replace,
      showSelectionLabels: true,
      isClearable: true,
      onClickClearIcon: CostCenterActions.clear,
    },

    {
      key: KEYS.vendor,
      type: FILTER_TYPE.SELECTION,
      appendedClass: 'field',
      label: msg().Exp_Clbl_Vendor,
      placeHolder: TextUtil.template(
        msg().Exp_Lbl_SearchConditionPlaceholder,
        msg().Exp_Clbl_Vendor
      ),
      selectedStringValues: advSearchCondition.vendorIds,
      data: vendorList,
      onSelectInput: onClickInputVendorId,
      onSearchByFetching: searchVendorByFetch,
      optionLimit: VENDOR_NUM,
      clearAll: VendorIdsActions.clear,
      showSelectionLabels: true,
      isClearable: true,
      onClickClearIcon: VendorIdsActions.clear,
    },
    {
      key: KEYS.extraConditions,
      type: FILTER_TYPE.SELECTION,
      appendedClass: 'field extra-condition',
      label: `${'\u2795'}  ${msg().Exp_Btn_More}`,
      placeHolder: msg().Exp_Lbl_SearchConditionPlaceholderDetail,
      selectedStringValues: advSearchCondition.detail,
      isSelectedValueDisplay: true,
      data: extraConditionOptions,
      onSelectInput: toggleExtraCondition,
      clearAll: () => {
        advSearchCondition.detail.forEach((key) => {
          toggleExtraCondition(key);
        });
      },
      selectAll: toggleExtraCondition,
      showSelectionLabels: true,
    },
  ];

  const baseFilters = allFilters.filter(({ key }) =>
    baseConditions.includes(key)
  );

  const activeConditions = advSearchCondition.detail;

  const extraFilters = allFilters
    .filter(({ key }) => activeConditions.includes(key))
    .map((filter) => {
      const filterWithRemoveIcon = {
        ...filter,
        isRemovable: true,
        onClickRemoveButton: () => toggleExtraCondition(filter.key),
      };
      return filterWithRemoveIcon;
    });

  return (
    <AdvSearch
      onClickAdvSearchButton={onClickAdvSearchButton}
      baseFilters={baseFilters}
      extraFilters={extraFilters}
    />
  );
};

export default ReportListAdvSearchContainer;
