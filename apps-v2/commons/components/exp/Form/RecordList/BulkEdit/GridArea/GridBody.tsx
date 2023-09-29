import React, { ChangeEvent } from 'react';

import classNames from 'classnames';
import get from 'lodash/get';

import googleMapsApiKey, {
  GOOGLE_MAP_SCRIPT_ID,
} from '@apps/commons/config/exp/googleMapKey';
import { CheckBox } from '@apps/core';
import { useScript } from '@apps/core/hooks';
import QuickSearch, { Option } from '@commons/components/exp/Form/QuickSearch';
import RecordIcon from '@commons/components/exp/Form/RecordList/Icon';
import DateField from '@commons/components/fields/DateField';
import withLoadingHOC from '@commons/components/withLoading';
import msg from '@commons/languages';
import { buildColumnCss, Column } from '@commons/utils/exp/BulkEditUtil';
import FormatUtil from '@commons/utils/FormatUtil';
import TextUtil from '@commons/utils/TextUtil';

import { MileageUnit } from '@apps/domain/models/exp/Mileage';
import {
  BULK_EDIT_GRID_BODY_LOADING_AREA,
  calculateTotalTaxes,
  isCCRecord,
  isIcRecord,
  Record,
  RECORD_TYPE,
} from '@apps/domain/models/exp/Record';

import { AMOUNT_MATCH_VALUE_LABEL } from '../../List';
import GridDetailCell from './GridDetailCell/GridDetailCell';
import ActiveDialogProvider from './GridProofCell/ActiveDialogProvider';

import { COLUMNS, ContainerProps } from '.';

type Props = ContainerProps & {
  columns: Column[];
  errors: {
    records?: Record[];
  };
  expMileageUnit?: MileageUnit;
  parentClass: string;
  records: Record[];
  selected: number[];
  touched: {
    records?: Record[];
  };
  onChangeCheckBox: (id: number) => void;
  onChangeEditingExpReport: (
    field: string,
    value: string | Record,
    touched?: boolean,
    shouldValidate?: boolean
  ) => void;
  onChangeRecordDate: (idx: number, recordDate: string) => void;
};

const ERROR_REQUIRED_KEY_NAMES = {
  amount: msg().Exp_Clbl_Amount,
  expTypeId: msg().Exp_Clbl_ExpenseType,
};
const REQUIRED_VALUE_LABEL = 'Common_Err_Required';

const getFieldErrMessage = (errorKey: string, errorValue: string) => {
  const errorMessage = msg()[errorValue];
  return errorValue === REQUIRED_VALUE_LABEL
    ? `${ERROR_REQUIRED_KEY_NAMES[errorKey]} ${errorMessage.toLowerCase()}`
    : errorMessage;
};

const getErrorMessages = (
  recordError: Record,
  totalAmount?: number,
  baseCurrencySymbol?: string,
  baseCurrencyDecimal?: number
) => {
  const recordErrorLabelList = Object.keys(recordError)
    .map((errorKey: string) => {
      const errorValue: string | [] | { [key: string]: string } =
        recordError[errorKey];
      if (!errorValue) return '';

      // record item level error
      if (Array.isArray(errorValue)) {
        return errorValue.map((obj: { [key: string]: string }, idx: number) => {
          if (!obj) return '';
          const label = Object.values(obj)[0];
          const key = Object.keys(obj)[0];

          if (idx === 0) return msg()[label];

          const itemisationLabel = `${msg().Exp_Lbl_Itemization} ${idx}: `;
          const errMessage = getFieldErrMessage(key, label);
          return itemisationLabel.concat(errMessage);
        });
      }
      // record level error
      if (typeof errorValue === 'string') {
        if (errorKey === 'amount' && errorValue === AMOUNT_MATCH_VALUE_LABEL) {
          return TextUtil.template(
            msg()[errorValue],
            `${baseCurrencySymbol}${FormatUtil.formatNumber(
              totalAmount,
              baseCurrencyDecimal
            )}`
          );
        }
        return getFieldErrMessage(errorKey, errorValue);
      } else {
        const label = Object.values(errorValue)[0];
        if (Array.isArray(label)) {
          // mileage destination error
          const routeFromErrLabel = get(label, '0.name');
          const routeToErrLabel = get(label, '1.name');
          const errLabel = routeFromErrLabel || routeToErrLabel;
          return errLabel ? msg()[errLabel] : '';
        }
        if (typeof label === 'string') {
          // jorudan route, mileage estimated distance error
          return msg()[label];
        }
      }
      return '';
    })
    .flat();
  const hasRecordError = recordErrorLabelList.length > 0;
  return hasRecordError
    ? recordErrorLabelList
        .filter((errorMessage: string) => errorMessage)
        .join('\n')
    : '';
};

const getCellClass = (
  isActive: boolean,
  key: string,
  recordType: string,
  ROOT: string
) => {
  const tdClass = `${ROOT}-td`;
  const activeClass = isActive ? 'active' : 'inactive';
  const isRouteDetailCell =
    [
      RECORD_TYPE.TransitJorudanJP,
      RECORD_TYPE.TransportICCardJP,
      RECORD_TYPE.Mileage,
    ].includes(recordType) && key === COLUMNS.details;
  const isProofCell = key === COLUMNS.receiptList;
  return classNames(tdClass, `${tdClass}-${activeClass}`, {
    'padding-sm': !isRouteDetailCell && !isProofCell,
    'cell-focused': !isRouteDetailCell && isActive,
  });
};

const GridBody = ({
  baseCurrencyAmountCellContainer: BaseCurrencyAmountCellContainer,
  baseCurrencyDecimal,
  baseCurrencySymbol,
  columns,
  errors,
  expMileageUnit,
  foreignCurrencyAmountCellContainer: ForeignCurrencyAmountCellContainer,
  gridProofCellContainer: GridProofCellContainer,
  isRequest,
  parentClass,
  records,
  selected,
  touched,
  getExpenseTypeSearchResult,
  getRecentlyUsedExpenseType,
  onChangeCheckBox,
  onChangeRecordDate,
  onSelectExpenseType,
  onChangeEditingExpReport,
  openSearchExpenseTypeDialog,
}: Props) => {
  const ROOT = `${parentClass}__tbody`;

  useScript(
    `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`,
    GOOGLE_MAP_SCRIPT_ID
  );
  const getContent = (
    key: string,
    idx: number,
    isActive: boolean,
    record: Record
  ) => {
    const value = get(record, key);
    const { expTypeId, useForeignCurrency } = record.items[0];

    switch (key) {
      case COLUMNS.recordDate:
        const hasDateError = !!get(errors, `records.${idx}.${key}`);
        const isDisabled =
          !isRequest && (isCCRecord(record) || isIcRecord(record.recordType));
        return (
          <div className={hasDateError ? `${parentClass}__date-error` : ''}>
            <DateField
              className="ts-date-picker-input"
              disabled={isDisabled}
              fixedHeight
              onChange={(value: string) => onChangeRecordDate(idx, value)}
              value={value}
            />
          </div>
        );
      case COLUMNS.details:
        return (
          <GridDetailCell
            record={record}
            expMileageUnit={expMileageUnit}
            className={parentClass}
            onChangeEditingExpReport={onChangeEditingExpReport}
            recordIdx={idx}
          />
        );
      case COLUMNS.expTypeName:
        const { recordDate } = record;
        const placeholder = TextUtil.template(
          msg().Com_Lbl_PressEnterToSearch,
          msg().Exp_Clbl_ExpenseType
        );
        const recordError = get(errors, `records.${idx}`, {});
        const hasExpTypeError = !!get(recordError, 'items.0.expTypeId');
        const taxItems = get(record, 'items.0.taxItems') || [];
        const { totalAmountInclTax } = calculateTotalTaxes(
          taxItems,
          baseCurrencyDecimal
        );
        const errorMessages = expTypeId
          ? getErrorMessages(
              recordError,
              totalAmountInclTax,
              baseCurrencySymbol,
              baseCurrencyDecimal
            )
          : getFieldErrMessage('expTypeId', REQUIRED_VALUE_LABEL);
        const expTypeClass = `${parentClass}__expense-type`;

        return (
          <div className={expTypeClass}>
            {errorMessages && (
              <RecordIcon
                className={`${expTypeClass}-error-icon`}
                idx={idx}
                errors={errors}
                touched={touched}
                tooltip={errorMessages}
              />
            )}
            <div
              className={classNames(`${expTypeClass}-field`, {
                [`${expTypeClass}-error`]: hasExpTypeError,
              })}
            >
              <QuickSearch
                displayValue={value}
                isGetRecentlyUsedOnClick
                isSkipRecentlyUsed
                // @ts-ignore
                getRecentlyUsedItems={(targetDate: string) =>
                  getRecentlyUsedExpenseType(targetDate)
                }
                // @ts-ignore
                getSearchResult={(keyword: string) =>
                  getExpenseTypeSearchResult(idx, keyword)
                }
                onSelect={(option: Option) => onSelectExpenseType(idx, option)}
                openSearchDialog={() => openSearchExpenseTypeDialog(idx)}
                placeholder={placeholder}
                selectedId={expTypeId}
                targetDate={recordDate || ''}
              />
            </div>
          </div>
        );
      case COLUMNS.amount:
        const CurrencyAmountContainer = useForeignCurrency
          ? ForeignCurrencyAmountCellContainer
          : BaseCurrencyAmountCellContainer;
        const hasAmountError =
          !!get(errors, `records.${idx}.${key}`, '') && !!expTypeId;

        return (
          <CurrencyAmountContainer
            className={parentClass}
            hasAmountError={hasAmountError}
            isActive={isActive}
            record={record}
            recordIdx={idx}
            onChangeEditingExpReport={onChangeEditingExpReport}
          />
        );
      case COLUMNS.receiptList:
        return (
          <GridProofCellContainer
            record={record}
            recordIdx={idx}
            onChangeEditingExpReport={onChangeEditingExpReport}
          />
        );
      case COLUMNS.gstVat:
        return (
          <span>
            {`${baseCurrencySymbol} ${FormatUtil.formatNumber(
              value,
              baseCurrencyDecimal
            )}`}
          </span>
        );
    }
  };

  const isCellActive = (key: string, record: Record) => {
    const { recordType } = record;
    const { useForeignCurrency } = record.items[0];
    const isAmountCell = key === COLUMNS.amount;
    const isNotGstCell = key !== COLUMNS.gstVat;
    const isDateCell = key === COLUMNS.recordDate;

    if (isDateCell) {
      return isRequest || (!isCCRecord(record) && !isIcRecord(recordType));
    }

    if (isAmountCell) {
      const isEditableRecordType =
        !isCCRecord(record) &&
        [
          RECORD_TYPE.FixedAllowanceMulti,
          RECORD_TYPE.Mileage,
          RECORD_TYPE.General,
        ].includes(recordType);
      const isRequestICRecord = isRequest && isIcRecord(recordType);
      return isEditableRecordType || isRequestICRecord || useForeignCurrency;
    }
    return isNotGstCell;
  };

  const onChangeCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const selectedIndex = Number(value);
    onChangeCheckBox(selectedIndex);
  };

  const renderCell = (column: Column, record: Record, idx: number) => {
    const { key } = column;
    const { recordType } = record;
    const isActive = isCellActive(key, record);
    const cellClass = getCellClass(isActive, key, recordType, ROOT);
    return (
      <td className={cellClass} key={key} style={buildColumnCss(column)}>
        {getContent(column.key, idx, isActive, record)}
      </td>
    );
  };

  return (
    <ActiveDialogProvider enableActiveDialog>
      <tbody className={ROOT}>
        {records.map((record: Record, idx: number) => (
          <tr className={`${ROOT}-tr`}>
            <td className={`${ROOT}-td`}>
              <CheckBox
                checked={selected.includes(idx)}
                onChange={onChangeCheckbox}
                value={idx}
              />
            </td>
            {columns.map((column: Column) => renderCell(column, record, idx))}
          </tr>
        ))}
      </tbody>
    </ActiveDialogProvider>
  );
};

GridBody.displayName = BULK_EDIT_GRID_BODY_LOADING_AREA;
export default withLoadingHOC(GridBody);
