import React, { ChangeEvent, ReactElement } from 'react';

import { Option } from '@commons/components/exp/Form/QuickSearch';
import msg from '@commons/languages';
import { Column } from '@commons/utils/exp/BulkEditUtil';

import { AccountingPeriod } from '@apps/domain/models/exp/AccountingPeriod';
import { ExpenseTypeList } from '@apps/domain/models/exp/ExpenseType';
import { MileageUnit } from '@apps/domain/models/exp/Mileage';
import { MAX_BULK_EDIT_RECORDS, Record } from '@apps/domain/models/exp/Record';
import { Report } from '@apps/domain/models/exp/Report';

import { ContainerProps as BaseCurrencyAmountCellContainerProps } from './GridAmountCell/BaseCurrencyAmountCell';
import { ContainerProps as ForeignCurrencyAmountCellContainerProps } from './GridAmountCell/ForeignCurrencyAmountCell';
import GridBody from './GridBody';
import GridHead from './GridHead';
import { ContainerProps as GridProofCellContainerProps } from './GridProofCell';

import './index.scss';

// props from recordList
type GridAreaCommonProps = {
  checkboxes: number[];
  classRoot: string;
  errors: {
    records?: Record[];
  };
  isLoading: boolean;
  loadingAreas: string[];
  loadingHint: string;
  touched: {
    records?: Record[];
  };
  onChangeCheckBox: (id: number) => void;
  onChangeCheckBoxes: (ids: number[]) => void;
};

export type GridAreaContainerProps = GridAreaCommonProps & {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  bulkRecordIdx: number;
  report: Report;
  onChangeEditingExpReport: (
    field: string,
    value: boolean | string | string[] | number | Record | AccountingPeriod,
    touched?: boolean,
    shouldValidate?: boolean
  ) => void;
};

export type GridAreaContainerType = (
  props: GridAreaContainerProps
) => ReactElement;

// props from container
export type ContainerProps = {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  expMileageUnit?: MileageUnit;
  isRequest?: boolean;
  records: Record[];
  baseCurrencyAmountCellContainer: (
    props: BaseCurrencyAmountCellContainerProps
  ) => ReactElement;
  foreignCurrencyAmountCellContainer: (
    props: ForeignCurrencyAmountCellContainerProps
  ) => ReactElement;
  getExpenseTypeSearchResult: (
    idx: number,
    keyword: string
  ) => Promise<ExpenseTypeList>;
  getRecentlyUsedExpenseType: (targetDate: string) => Promise<ExpenseTypeList>;
  gridProofCellContainer: (props: GridProofCellContainerProps) => ReactElement;
  onChangeEditingExpReport: (
    field: string,
    value: string | Record,
    touched?: boolean,
    shouldValidate?: boolean
  ) => void;
  onChangeRecordDate: (idx: number, recordDate: string) => void;
  onSelectExpenseType: (idx: number, option: Option) => void;
  openSearchExpenseTypeDialog: (idx: number) => void;
};

type Props = GridAreaCommonProps & ContainerProps;

export const COLUMNS = {
  recordDate: 'recordDate',
  expTypeName: 'items.0.expTypeName',
  details: 'details',
  gstVat: 'items.0.gstVat',
  amount: 'amount',
  receiptList: 'receiptList',
};

const columns = [
  {
    key: COLUMNS.recordDate,
    name: msg().Exp_Clbl_Date,
    width: 140,
  },
  {
    key: COLUMNS.expTypeName,
    name: msg().Exp_Clbl_ExpenseType,
    width: 220,
  },
  {
    key: COLUMNS.details,
    fullData: true,
    name: msg().Exp_Lbl_Details,
    shrink: true,
    grow: true,
  },
  {
    key: COLUMNS.gstVat,
    name: msg().Exp_Clbl_GstAmount,
    align: 'right',
    width: 170,
  },
  {
    key: COLUMNS.amount,
    name: msg().Exp_Clbl_Amount,
    align: 'right',
    width: 170,
  },
  {
    key: COLUMNS.receiptList,
    name: msg().Exp_Lbl_Evidence,
    align: 'center',
    width: 65,
  },
] as Column[];

const GridArea = ({
  baseCurrencyAmountCellContainer,
  baseCurrencyDecimal,
  baseCurrencySymbol,
  checkboxes: selected,
  classRoot,
  errors,
  foreignCurrencyAmountCellContainer,
  gridProofCellContainer,
  isLoading,
  isRequest,
  loadingAreas,
  loadingHint,
  touched,
  expMileageUnit,
  records,
  getExpenseTypeSearchResult,
  getRecentlyUsedExpenseType,
  onChangeCheckBox,
  onChangeCheckBoxes,
  onChangeRecordDate,
  onSelectExpenseType,
  onChangeEditingExpReport,
  openSearchExpenseTypeDialog,
}: Props) => {
  const ROOT = `${classRoot}__grid-area`;

  const onChangeSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    const newSelected = checked ? [...Array(records.length).keys()] : [];
    onChangeCheckBoxes(newSelected);
  };

  return (
    <table className={ROOT}>
      <GridHead
        columns={columns}
        data={records}
        onChangeSelectAll={onChangeSelectAll}
        maxSelection={records.length || MAX_BULK_EDIT_RECORDS}
        parentClass={ROOT}
        selected={selected}
      />
      <GridBody
        baseCurrencyAmountCellContainer={baseCurrencyAmountCellContainer}
        baseCurrencyDecimal={baseCurrencyDecimal}
        baseCurrencySymbol={baseCurrencySymbol}
        className={`${ROOT}-loading`}
        columns={columns}
        errors={errors}
        foreignCurrencyAmountCellContainer={foreignCurrencyAmountCellContainer}
        gridProofCellContainer={gridProofCellContainer}
        getExpenseTypeSearchResult={getExpenseTypeSearchResult}
        getRecentlyUsedExpenseType={getRecentlyUsedExpenseType}
        isLoading={isLoading}
        isRequest={isRequest}
        isLoaderOverride
        loadingAreas={loadingAreas}
        loadingHint={loadingHint}
        onChangeCheckBox={onChangeCheckBox}
        onChangeRecordDate={onChangeRecordDate}
        onSelectExpenseType={onSelectExpenseType}
        openSearchExpenseTypeDialog={openSearchExpenseTypeDialog}
        onChangeEditingExpReport={onChangeEditingExpReport}
        parentClass={ROOT}
        records={records}
        selected={selected}
        touched={touched}
        expMileageUnit={expMileageUnit}
      />
    </table>
  );
};

export default GridArea;
