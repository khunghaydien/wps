import React from 'react';

import classNames from 'classnames';
import get from 'lodash/get';

import { Record } from '../../../../../../domain/models/exp/Record';

import DateUtil from '../../../../../utils/DateUtil';
import FormatUtil from '../../../../../utils/FormatUtil';

import imgIconDoneCircle from '../../../../../images/iconDoneCircle.png';
import msg from '../../../../../languages';
import MessageBoard from '../../../../MessageBoard';

const ROOT = 'ts-expenses-modal-record-link__table';

export type RecordDisplayInfo = {
  amount: number;
  baseAmount?: number;
  detailDisplay: string;
  expenseType: string;
  recordDate: string;
};

type Props = {
  accountingPeriod: {
    endDate?: string;
    startDate?: string;
  };
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  filteredRecords: Array<Record>;
  selectedIds: Array<string>;
  toggleSelection: (arg0: string, arg1: boolean) => void;
};

const RecordsTable = (props: Props) => {
  const {
    baseCurrencySymbol,
    baseCurrencyDecimal,
    toggleSelection,
    selectedIds,
    filteredRecords,
  } = props;

  const renderHeader = () => (
    <div className={`${ROOT}__header-row`}>
      <div className={classNames(`${ROOT}__header`, 'checkbox')} />
      <div className={classNames(`${ROOT}__header`, 'date')}>
        {msg().Exp_Clbl_Date}
      </div>
      <div className={classNames(`${ROOT}__header`, 'expense-type')}>
        {msg().Exp_Clbl_ExpenseType}
      </div>
      <div className={classNames(`${ROOT}__header`, 'amount')}>
        {msg().Exp_Clbl_Amount}
      </div>
      <div className={classNames(`${ROOT}__header`, 'remark')}>
        {msg().Exp_Lbl_Detail}
      </div>
    </div>
  );

  const onToggleSelection = (isDateInRange, recordId, isChecked) => {
    if (isDateInRange) {
      toggleSelection(recordId, isChecked);
    }
  };

  const renderCheckbox = (
    recordId: string,
    isDateInRange: boolean,
    isChecked: boolean
  ) => (
    <div className={classNames(`${ROOT}__item`, 'checkbox')}>
      <input
        type="checkbox"
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onChange={() => onToggleSelection(isDateInRange, recordId, isChecked)}
        checked={isChecked}
        disabled={!isDateInRange}
      />
    </div>
  );

  const renderDate = (recordDate: string, isDateInRange: boolean) => (
    <div className={classNames(`${ROOT}__item`, 'date')}>
      {DateUtil.dateFormat(recordDate)}
      {!isDateInRange && (
        <div className={`${ROOT}__item date-invalid`}>
          {msg().Exp_Warn_DateNotInRange}
        </div>
      )}
    </div>
  );

  const renderAmount = (record: Record) => {
    const isForeignCurrency = get(record, 'items.0.useForeignCurrency');
    const baseAmount = FormatUtil.formatNumber(
      record.amount,
      baseCurrencyDecimal
    );
    let foreignAmount = null;
    if (isForeignCurrency) {
      const fcSymbol = get(record, 'items.0.currencyInfo.symbol') || '';
      const fcDecimal = get(record, 'items.0.currencyInfo.decimalPlaces', 0);
      const fcAmount = FormatUtil.formatNumber(
        record.items[0].localAmount,
        fcDecimal
      );
      foreignAmount = (
        <div className={classNames(`${ROOT}__item`, 'foreign-amount')}>
          {fcSymbol}
          {fcAmount}
        </div>
      );
    }
    return (
      <div className={classNames(`${ROOT}__item`, 'amount')}>
        <div className={classNames(`${ROOT}__item`, 'base-amount')}>
          {baseCurrencySymbol}
          {baseAmount}
        </div>
        {foreignAmount}
      </div>
    );
  };

  const renderExpType = (expTypeName: string) => (
    <div className={classNames(`${ROOT}__item`, 'expense-type')}>
      {expTypeName}
    </div>
  );

  const renderDetail = (detail?: string) => (
    <div className={classNames(`${ROOT}__item`, 'detail')}>{detail}</div>
  );

  const renderRecord = (record: Record) => {
    const { startDate, endDate } = props.accountingPeriod;
    const isDateInRange =
      startDate && endDate
        ? DateUtil.inRange(record.recordDate, startDate, endDate)
        : true;
    const recordId = record.recordId || '';
    const expType = get(record, 'items.0.expTypeName');
    const remark = get(record, 'items.0.remarks');
    const isChecked = selectedIds.includes(recordId);
    return (
      <div
        key={recordId}
        tabIndex={Number(recordId)}
        role="row"
        className={classNames(`${ROOT}__item-row`, { selected: isChecked })}
        onClick={() => onToggleSelection(isDateInRange, recordId, isChecked)}
      >
        {renderCheckbox(recordId, isDateInRange, isChecked)}
        {renderDate(record.recordDate, isDateInRange)}
        {renderExpType(expType)}
        {renderAmount(record)}
        {renderDetail(remark)}
      </div>
    );
  };

  const renderRecords = (records: Array<Record>) => (
    <div className={`${ROOT}__records`}>
      {records.length > 0 ? (
        records.map((record) => renderRecord(record))
      ) : (
        <MessageBoard
          message={msg().Cmn_Lbl_SuggestNoResult}
          iconSrc={imgIconDoneCircle}
        />
      )}
    </div>
  );

  return (
    <div className={ROOT}>
      {renderHeader()}
      {renderRecords(filteredRecords)}
    </div>
  );
};

export default RecordsTable;
