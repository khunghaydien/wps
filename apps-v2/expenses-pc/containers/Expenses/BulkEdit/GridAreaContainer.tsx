import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';

import { getLatestCostCenter } from '@commons/action-dispatchers/CostCenter';
import { Option } from '@commons/components/exp/Form/QuickSearch';
import GridArea, {
  GridAreaContainerProps,
} from '@commons/components/exp/Form/RecordList/BulkEdit/GridArea';
import usePrevious from '@commons/hooks/usePrevious';
import {
  calculateBCChildItemListAmount,
  updateChildItemExpType,
} from '@commons/utils/exp/ItemizationUtil';

import { LatestCostCenter } from '@apps/domain/models/exp/CostCenter';
import { ExpenseReportType } from '@apps/domain/models/exp/expense-report-type/list';
import { ExpenseTypeList } from '@apps/domain/models/exp/ExpenseType';
import {
  isItemizedRecord,
  Record,
  RECORD_TYPE,
} from '@apps/domain/models/exp/Record';

import { State } from '../../../modules';
import { AppDispatch } from '../../../modules/AppThunk';
import { setAvailableExpType } from '@apps/domain/modules/exp/expense-type/availableExpType';
import { actions as expenseTypeActions } from '@apps/domain/modules/exp/expense-type/list';
import { actions as searchRouteActions } from '@apps/domain/modules/exp/jorudan/routeOption';
import { dialogTypes } from '@apps/expenses-pc/modules/ui/expenses/dialog/activeDialog';

import { updateRecordInfo } from '../../../action-dispatchers/BulkEdit';
import { openExpenseTypeDialog } from '../../../action-dispatchers/Dialog';
import { searchChildItemTaxTypeList } from '@apps/expenses-pc/action-dispatchers/Currency';
import {
  endBulkEditLoading,
  startBulkEditLoading,
} from '@apps/expenses-pc/action-dispatchers/Expenses';
import { searchExpTypesByParentRecord } from '@apps/expenses-pc/action-dispatchers/ExpenseType';
import { resetRouteForm } from '@apps/expenses-pc/action-dispatchers/Route';

import BaseCurrencyAmountCellContainer from './BaseCurrencyAmountCellContainer';
import ForeignCurrencyAmountCellContainer from './ForeignCurrencyAmountCellContainer';
import GridProofCellContainer from './GridProofCellContainer';

const FORMIK_TARGET_FIELD = 'report.records';

const GridAreaContainer = (props: GridAreaContainerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { bulkRecordIdx, report, onChangeEditingExpReport } = props;

  const activeDialogList = useSelector(
    (state: State) => state.ui.expenses.dialog.activeDialog
  );
  const activeDialog = get(activeDialogList, '0', '');
  const isSkipRecentlyUsedFetch = !isEmpty(
    useSelector(
      (state: State) => state.ui.expenses.delegateApplicant.selectedEmployee
    )
  );
  const reportTypeList = useSelector(
    (state: State) => state.entities.exp.expenseReportType.list.active
  );
  const subroleId = useSelector(
    (state: State) => state.ui.expenses.subrole.selectedRole
  );
  const availableExpTypeList = useSelector(
    (state: State) => state.entities.exp.expenseType.availableExpType
  );
  const userSetting = useSelector((state: State) => state.userSetting);
  const {
    companyId,
    currencyDecimalPlaces,
    employeeId,
    expMileageUnit,
    expTaxRoundingSetting,
    jctInvoiceManagement,
  } = userSetting;
  const records = report.records;

  const selectedRecordReceiptList = get(
    report,
    `records.${bulkRecordIdx}.receiptList`,
    []
  );
  const prevActiveDialog = usePrevious(activeDialog);
  const prevSelectedReceiptList = usePrevious(selectedRecordReceiptList);
  useEffect(() => {
    // clear selected idx on dialog close
    const isReceiptDialogOpenWithFileAttached =
      prevActiveDialog === dialogTypes.RECEIPTS &&
      prevSelectedReceiptList.length > 0;
    if (!activeDialog && !isReceiptDialogOpenWithFileAttached) {
      if (bulkRecordIdx > -1) onChangeEditingExpReport('ui.bulkRecordIdx', -1);
    }
  }, [activeDialog]);

  // get/set default values
  // run once for all records
  useEffect(() => {
    dispatch(resetRouteForm());
    dispatch(searchRouteActions.search(companyId));
  }, []);

  const updateRecord = (
    recordIdx: number,
    updateObj: {
      [key: string]: boolean | number | string;
    }
  ) => {
    const { onChangeEditingExpReport } = props;
    const tmpRecordList = cloneDeep(records[recordIdx]);

    Object.keys(updateObj).forEach((key) => {
      set(tmpRecordList, key, updateObj[key]);
    });
    onChangeEditingExpReport(
      `${FORMIK_TARGET_FIELD}.${recordIdx}`,
      tmpRecordList,
      true
    );
  };

  const onChangeRecordDate = async (idx: number, recordDate: string) => {
    const selectedRecord = records[idx] || ({} as Record);
    const {
      amountInputMode,
      items,
      recordDate: originalRecordDate,
    } = selectedRecord;

    if (recordDate !== originalRecordDate) {
      const updateObj = {
        recordDate,
        'items.0.recordDate': recordDate,
      };

      if (isItemizedRecord(items.length)) {
        const [parentItem, ...childItemList] = items;

        const taxTypeObj = await dispatch(
          searchChildItemTaxTypeList(childItemList, recordDate)
        );
        const updateChildItemObj = calculateBCChildItemListAmount(
          amountInputMode,
          currencyDecimalPlaces,
          childItemList,
          recordDate,
          expTaxRoundingSetting,
          taxTypeObj
        );
        Object.assign(updateObj, updateChildItemObj);

        const expTypList = await dispatch(
          searchExpTypesByParentRecord(recordDate, parentItem.expTypeId)
        );
        const updateExpTypeObj = updateChildItemExpType(
          childItemList,
          expTypList
        );
        Object.assign(updateObj, updateExpTypeObj);
      }

      // search for cc revised name
      const isCcUsedInReport = reportTypeList.find(
        (reportType: ExpenseReportType) =>
          reportType.id === report.expReportTypeId &&
          reportType.isCostCenterRequired !== 'UNUSED'
      );
      const currentHistoryId =
        report.records[idx].items[0].costCenterHistoryId ||
        report.costCenterHistoryId;
      if (isCcUsedInReport && currentHistoryId) {
        const latestCostCenter = await dispatch(
          getLatestCostCenter(currentHistoryId, recordDate)
        );
        const {
          baseCode = null,
          id = null,
          name = null,
        } = (latestCostCenter || {}) as LatestCostCenter;
        const costCenter = {
          'items.0.costCenterCode': baseCode,
          'items.0.costCenterHistoryId': id,
          'items.0.costCenterName': name,
        };
        Object.assign(updateObj, costCenter);
      }
      updateRecord(idx, updateObj);
    }
  };

  const getRecentlyUsedExpenseType = (targetDate: string) => {
    const { report } = props;
    const { expReportTypeId } = report;
    const _ = undefined;
    return dispatch(
      expenseTypeActions.getRecentlyUsed(
        employeeId,
        companyId,
        targetDate,
        _,
        expReportTypeId,
        'REPORT',
        [RECORD_TYPE.TransportICCardJP]
      )
    ).then((res: { payload: ExpenseTypeList; type: string }) => res.payload);
  };
  const getExpenseTypeSearchResult = (idx: number, keyword: string) => {
    const { report } = props;
    const { recordDate } = records[idx];
    const { expReportTypeId } = report;
    const _ = undefined;
    return dispatch(
      expenseTypeActions.searchExpenseType(
        companyId,
        keyword,
        recordDate,
        'REPORT',
        expReportTypeId,
        _,
        employeeId,
        100,
        [RECORD_TYPE.TransportICCardJP],
        subroleId
      )
    ).then((res: { records: ExpenseTypeList }) => res.records);
  };
  const onSelectExpenseType = async (idx: number, option: Option) => {
    const { onChangeEditingExpReport, report } = props;
    dispatch(startBulkEditLoading());
    try {
      const expType = await dispatch(
        expenseTypeActions.getExpenseTypeById(option.id, 'REPORT', subroleId)
      );
      const record = await dispatch(
        updateRecordInfo(companyId, report, idx, expType, jctInvoiceManagement)
      );

      const isUpdateAvailableExpType = !availableExpTypeList.includes(
        option.id
      );
      if (isUpdateAvailableExpType) {
        const newAvailableExpType = availableExpTypeList.concat([option.id]);
        dispatch(setAvailableExpType(newAvailableExpType));
        onChangeEditingExpReport('ui.availableExpType', newAvailableExpType);
      }

      onChangeEditingExpReport(`${FORMIK_TARGET_FIELD}.${idx}`, record);
    } finally {
      dispatch(endBulkEditLoading());
    }
  };
  const openSearchExpenseTypeDialog = (idx: number) => {
    const { onChangeEditingExpReport, report } = props;
    const { expReportTypeId } = report;
    const { recordDate } = records[idx];
    onChangeEditingExpReport('ui.bulkRecordIdx', idx);
    dispatch(
      openExpenseTypeDialog(
        employeeId,
        companyId,
        recordDate,
        '',
        expReportTypeId,
        isSkipRecentlyUsedFetch,
        [RECORD_TYPE.TransportICCardJP]
      )
    );
  };

  const ownProps = {
    ...props,
    expMileageUnit,
    records,
    baseCurrencyAmountCellContainer: BaseCurrencyAmountCellContainer,
    foreignCurrencyAmountCellContainer: ForeignCurrencyAmountCellContainer,
    gridProofCellContainer: GridProofCellContainer,
    onChangeRecordDate,
    getRecentlyUsedExpenseType,
    getExpenseTypeSearchResult,
    onSelectExpenseType,
    openSearchExpenseTypeDialog,
  };

  return <GridArea {...ownProps} />;
};

export default GridAreaContainer;
