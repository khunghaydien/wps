import React, { useEffect, useState } from 'react';

import get from 'lodash/get';
import inRange from 'lodash/inRange';
import isEmpty from 'lodash/isEmpty';
import without from 'lodash/without';

import { AccountingPeriod } from '../../../../../../domain/models/exp/AccountingPeriod';
import { ExpenseTypeList } from '../../../../../../domain/models/exp/ExpenseType';
import { Record } from '../../../../../../domain/models/exp/Record';

import DateUtil from '../../../../../utils/DateUtil';
import TextUtil from '../../../../../utils/TextUtil';

import msg from '../../../../../languages';
import Button from '../../../../buttons/Button';
import DialogFrame from '../../../../dialogs/DialogFrame';
import { AmountRangeOption } from '../../../../fields/DropdownAmountRange';
import Skeleton from '../../../../Skeleton';
import SearchFields, { FILTER_TYPE } from '../../../SearchFields';
import Table from './Table';

import './index.scss';

const ROOT = 'ts-expenses-modal-record-link';

type Props = {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  // For VRT only
  initialState?: {
    detail: string;
    endDate: string;
    startDate: string;
  };
  isLoading: boolean;
  records: Array<Record>;
  selectedAccountingPeriod: AccountingPeriod | { [key: string]: never };
  fetchExpenseType: () => Promise<ExpenseTypeList>;
  getRecordList: () => void;
  onClickConfirmButton: (arg0: Array<string>) => Promise<void>;
  onClickHideDialogButton: () => void;
  toggleIsLoading: (boolean) => void;
};

const MONTH_DAYS = 30;

// flowlint sketchy-null-number:off
const numberInRange = (value: number, min?: number, max?: number) => {
  const isEqualMax = max && value === max;
  const maxVal = max || Number.MAX_SAFE_INTEGER - 1;
  const minVal = min || 0;
  return inRange(value, minVal, maxVal) || isEqualMax;
};

/*
 * filter records based on date range, expense type, amount range and detail search conditions
 */
const filterRecords = (
  startDate: string,
  endDate: string,
  amountRange: AmountRangeOption,
  selectedExpTypeId: Array<string>,
  detail: string,
  records: Array<Record>
) => {
  const filtered = [];
  const { minAmount, maxAmount } = amountRange;
  records.forEach((record) => {
    const { amount: recordAmont } = record;
    const remark = get(record, 'items.0.remarks');
    const isInRange = DateUtil.inRange(record.recordDate, startDate, endDate);
    const isAmountInRange = numberInRange(recordAmont, minAmount, maxAmount);
    const isSelectedExpType =
      isEmpty(selectedExpTypeId) ||
      selectedExpTypeId.includes(record.items[0].expTypeId);
    const isDetailMatch =
      isEmpty(detail) ||
      (remark && remark.toLowerCase().includes(detail.toLowerCase()));
    if (isInRange && isAmountInRange && isSelectedExpType && isDetailMatch) {
      filtered.push(record);
    }
  });
  return filtered;
};

/*
 * get updated record's selection result based on new filtered record
 * If previously selected row not in the new filtered results, reset the selected info
 * Otherwise, keep it as selected
 */
const getUpdatedSelection = (
  updateRecords: Array<Record>,
  selectedRecordIds: Array<string>
) => {
  const filteredIds = updateRecords.map((o) => o.recordId);
  const newSelectedIds = selectedRecordIds.filter((o) =>
    filteredIds.includes(o)
  );
  return newSelectedIds;
};

const RecordListDialog = (props: Props) => {
  const defaultTo = DateUtil.getToday();
  const defaultFrom = DateUtil.addDays(defaultTo, -MONTH_DAYS);
  const {
    records = [],
    selectedAccountingPeriod,
    initialState = {
      startDate: defaultFrom,
      endDate: defaultTo,
      detail: '',
    },
    toggleIsLoading,
  } = props;
  const [selectedRecordIds, setSelectedRecordIds] = useState([]);
  const [startDate, setStartDate] = useState(
    initialState.startDate || defaultFrom
  );
  const [endDate, setEndDate] = useState(initialState.endDate || defaultTo);
  const [selectedExpTypeId, setSelectedExpTypeId] = useState([]);
  const [amountRange, setAmountRange] = useState({
    minAmount: null,
    maxAmount: null,
  });
  const [detail, setDetail] = useState(initialState.detail || '');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [expTypeOption, setExpTypeOption] = useState([]);
  const validDateFrom = get(selectedAccountingPeriod, 'validDateFrom', null);
  const validDateTo = get(selectedAccountingPeriod, 'validDateTo', null);

  useEffect(() => {
    if (validDateFrom && validDateTo) {
      setStartDate(initialState.startDate || validDateFrom);
      setEndDate(initialState.endDate || validDateTo);
    }
    toggleIsLoading(true);
    Promise.all([props.fetchExpenseType(), props.getRecordList()]).then(
      (expTypeRes) => {
        const expTypeOptions = expTypeRes[0].map((expType) => ({
          label: expType.name,
          value: expType.id,
        }));
        setExpTypeOption(expTypeOptions);
        toggleIsLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    const filteredRc = filterRecords(
      startDate,
      endDate,
      amountRange,
      selectedExpTypeId,
      detail,
      records
    );
    setFilteredRecords(filteredRc);
  }, [records, startDate, endDate, selectedExpTypeId, amountRange, detail]);

  useEffect(() => {
    const updatedSelection = getUpdatedSelection(
      filteredRecords,
      selectedRecordIds
    );
    setSelectedRecordIds(updatedSelection);
  }, [filteredRecords]);

  const toggleExpTypeSelection = (id: string) => {
    let updatedSelection;
    if (selectedExpTypeId.includes(id)) {
      updatedSelection = without(selectedExpTypeId, id);
    } else {
      updatedSelection = [...selectedExpTypeId, id];
    }
    setSelectedExpTypeId(updatedSelection);
  };

  const onChangeAmount = (value: AmountRangeOption) => {
    const updateAmount = Object.assign({}, amountRange, value);
    updateAmount.minAmount = updateAmount.minAmount || 0;
    setAmountRange(updateAmount);
  };

  const onChangeStartDate = (value: string) => {
    if (value === startDate || !value) {
      return;
    }
    setStartDate(value);
  };

  const onChangeEndDate = (value: string) => {
    if (value === endDate || !value) {
      return;
    }
    setEndDate(value);
  };

  const onInputDetail = (value: string) => {
    setDetail(value);
  };

  /*
   * So far only supports single record linkage
   * If one record is linked, when user clicks another record, previous one will auto unchecked
   * User can unchecked the selected record
   */
  const toggleRecordSelection = (id: string, checked: boolean) => {
    let updatedSelection = [...selectedRecordIds];
    if (!checked) {
      updatedSelection = [id];
    }
    if (checked) {
      updatedSelection = without(selectedRecordIds, id);
    }
    setSelectedRecordIds(updatedSelection);
  };

  const accountingPeriod = {
    startDate: validDateFrom,
    endDate: validDateTo,
  };

  return (
    <DialogFrame
      title={msg().Exp_Lbl_ExpenseRecordList}
      hide={props.onClickHideDialogButton}
      className={`${ROOT}__dialog-frame`}
      footer={
        <DialogFrame.Footer>
          <Button
            type="primary"
            onClick={() => props.onClickConfirmButton(selectedRecordIds)}
            disabled={isEmpty(selectedRecordIds)}
          >
            {msg().Com_Btn_Confirm}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <div className={`${ROOT}__inner`}>
        <SearchFields
          className={`${ROOT}__search-area`}
          filters={[
            {
              type: FILTER_TYPE.DATE_RANGE,
              appendedClass: 'date-range',
              startDate,
              endDate,
              onChangeStartDate,
              onChangeEndDate,
            },
            {
              type: FILTER_TYPE.SELECTION,
              appendedClass: 'expense-type',
              label: msg().Exp_Clbl_ExpenseType,
              placeHolder: TextUtil.template(
                msg().Exp_Lbl_SearchConditionPlaceholder,
                msg().Exp_Clbl_ExpenseType
              ),
              selectedStringValues: selectedExpTypeId,
              data: expTypeOption,
              onSelectInput: toggleExpTypeSelection,
              optionLimit: 100,
            },
            {
              type: FILTER_TYPE.AMOUNT_RANGE,
              appendedClass: 'amount',
              label: msg().Exp_Clbl_Amount,
              amountRange,
              onChangeAmount,
              currencyDecimalPlaces: props.baseCurrencyDecimal,
            },
            {
              type: FILTER_TYPE.TEXT_INPUT,
              appendedClass: 'detail',
              label: msg().Exp_Btn_SearchConditionDetail,
              inputValue: detail,
              onInput: onInputDetail,
            },
          ]}
        />
        {props.isLoading ? (
          <Skeleton
            noOfRow={6}
            colWidth="100%"
            className={`${ROOT}__skeleton`}
            rowHeight="25px"
            margin="30px"
          />
        ) : (
          <Table
            filteredRecords={filteredRecords}
            baseCurrencySymbol={props.baseCurrencySymbol}
            baseCurrencyDecimal={props.baseCurrencyDecimal}
            selectedIds={selectedRecordIds}
            toggleSelection={toggleRecordSelection}
            accountingPeriod={accountingPeriod}
          />
        )}
      </div>
    </DialogFrame>
  );
};

export default RecordListDialog;
