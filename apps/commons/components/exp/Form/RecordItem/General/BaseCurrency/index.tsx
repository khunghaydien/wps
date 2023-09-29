import React, { useEffect, useMemo } from 'react';

import classNames from 'classnames';
import { get, isNil } from 'lodash';

import { Text } from '../../../../../../../core';
import usePrevious from '@commons/hooks/usePrevious';
import CheckActive from '@commons/images/icons/check-active.svg';

import {
  isCCRecord,
  isIcRecord,
  Record as TypeRecord,
  RECORD_TYPE,
} from '../../../../../../../domain/models/exp/Record';
import {
  AmountInputMode,
  ExpTaxTypeList,
} from '../../../../../../../domain/models/exp/TaxType';
import {
  AMOUNT_MATCH_STATUS,
  generateOCRAmountMsg,
} from '@apps/domain/models/exp/Receipt';

import msg from '../../../../../../languages';
import Button from '../../../../../buttons/Button';
import AmountField from '../../../../../fields/AmountField';
import MultiColumnsGrid from '../../../../../MultiColumnsGrid';
import Tooltip from '../../../../../Tooltip';
import Tax from './Tax';
import TaxRateArea from './Tax/TaxRateArea';

type Props = {
  allowTaxAmountChange: boolean;
  allowTaxExcludedAmount: boolean;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  errors: { items?: Array<Record<string, any>> };
  expRecord: TypeRecord;
  fixedAmountMessage?: string;
  isExpenseRequest: boolean;
  isFinanceApproval?: boolean;
  isFixedAllowance: boolean;
  isItemized: boolean;
  isLoading: boolean;
  loadingAreas: string[];
  readOnly: boolean;
  recordItemIdx: number;
  tax: {
    [key: string]: {
      [key: string]: ExpTaxTypeList;
    };
  };
  calcTaxFromGstVat: (arg0: number) => void;
  onChangeAmountOrTaxType: (
    amount: number,
    isTaxIncluded: boolean,
    baseId?: string,
    taxName?: string
  ) => void;
  onClickEditButton: () => void;
  searchTaxTypeList: (loadInBackground) => void;
  toggleInputMode: () => void;
};

const ROOT = 'ts-expenses-requests__contents__amount';

const BaseCurrency = (props: Props) => {
  const thisExpRecord: TypeRecord = usePrevious(props.expRecord);
  useEffect(() => {
    props.searchTaxTypeList(true);
  }, []);

  useEffect(() => {
    if (!props.readOnly) {
      if (!thisExpRecord) {
        return;
      }
      const { recordId, amount } = thisExpRecord;
      const { recordId: nextId, amount: nextAmount } = props.expRecord;
      const isSameRecord = recordId === nextId;
      const isAmountChange = amount !== nextAmount;

      if (
        props.isFixedAllowance &&
        isSameRecord &&
        isAmountChange &&
        !isNil(nextAmount)
      ) {
        props.onChangeAmountOrTaxType(nextAmount, true);
      }

      const isChild = props.recordItemIdx > 0;
      const isCreateNew = !props.expRecord.recordId;
      if (isChild || props.isItemized || isCreateNew) {
        return;
      }
      const thisItem = thisExpRecord.items[0];
      const nextItem = props.expRecord.items[0];

      const isExpTypeChanged = thisItem.expTypeId !== nextItem.expTypeId;
      const hasNoTaxWithDate = !get(
        props,
        `tax[${nextItem.expTypeId}][${props.expRecord.recordDate}]`
      );

      if (isExpTypeChanged || hasNoTaxWithDate) {
        props.searchTaxTypeList(!isSameRecord);
      }
    }
  }, [props]);

  const {
    readOnly,
    baseCurrencyDecimal,
    tax,
    expRecord,
    recordItemIdx = 0,
    isFixedAllowance,
    isFinanceApproval,
    fixedAmountMessage,
    isExpenseRequest,
    allowTaxExcludedAmount,
    allowTaxAmountChange,
    baseCurrencySymbol,
    isItemized,
    toggleInputMode,
  } = props;

  const { expTypeId } = expRecord.items[recordItemIdx];
  const isHotelFee = expRecord.recordType === RECORD_TYPE.HotelFee;
  const isHotelFeeUnderFA = isHotelFee && isFinanceApproval;
  const recordDate =
    expRecord.items[recordItemIdx].recordDate || expRecord.recordDate;

  const expenseTaxTypeList =
    tax[expTypeId] && tax[expTypeId][recordDate]
      ? tax[expTypeId][recordDate]
      : [];

  const isRecordTypeIc = isIcRecord(expRecord.recordType);
  const isExpenseIcRecord = !isExpenseRequest && isRecordTypeIc;
  const isRecordCC = isCCRecord(expRecord);
  const isTaxExcludedMode =
    expRecord.amountInputMode === AmountInputMode.TaxExcluded;
  const val = expRecord.items[recordItemIdx].amount;
  const ocrAmount = expRecord.ocrAmount;
  const { status, message } = generateOCRAmountMsg(
    ocrAmount,
    val,
    baseCurrencyDecimal,
    'Exp_Clbl_IncludeTax'
  );

  const disabledAmountField =
    readOnly ||
    isFixedAllowance ||
    isExpenseIcRecord ||
    isTaxExcludedMode ||
    isRecordCC;
  const amountField = useMemo(
    () => (
      <>
        <AmountField
          className={
            readOnly
              ? 'input_right-aligned input_disabled_no-border input_disabled_no-background'
              : 'input_right-aligned'
          }
          disabled={disabledAmountField}
          fractionDigits={baseCurrencyDecimal}
          value={val}
          onBlur={(value: number | null) =>
            props.onChangeAmountOrTaxType(value, true)
          }
          data-testid={ROOT}
        />
        {!isNil(ocrAmount) && (
          <div className={`input-feedback ${status.toLowerCase()}`}>
            {status === AMOUNT_MATCH_STATUS.OK && (
              <CheckActive className="input-feedback-icon-ok" />
            )}
            {message}
          </div>
        )}
      </>
    ),
    [status, val, readOnly, baseCurrencyDecimal, disabledAmountField, message]
  );
  const isEditButtonShown =
    allowTaxExcludedAmount || (!allowTaxExcludedAmount && isTaxExcludedMode);
  const containerClass = classNames({
    [ROOT]: true,
    'is-ic-record': isRecordTypeIc,
  });

  return (
    <div className={containerClass}>
      <MultiColumnsGrid sizeList={[6, 6]}>
        <div className={`${ROOT}__amount`}>
          <div className="ts-text-field-container">
            <div className="title">
              <div className="key">{msg().Exp_Clbl_IncludeTax}</div>
              {recordItemIdx === 0 &&
              !isHotelFeeUnderFA &&
              !isFixedAllowance &&
              !isRecordTypeIc &&
              !isRecordCC &&
              isEditButtonShown ? (
                <Button
                  type="text"
                  className={`${ROOT}__edit-button`}
                  data-testid={`${ROOT}__edit-button`}
                  disabled={readOnly || !isTaxExcludedMode}
                  onClick={toggleInputMode}
                >
                  <Text
                    size="large"
                    color={
                      isTaxExcludedMode && !readOnly ? 'action' : 'disable'
                    }
                  >
                    {msg().Com_Btn_Edit}
                  </Text>
                </Button>
              ) : null}
            </div>
            {(isFixedAllowance && !readOnly && (
              <Tooltip id={ROOT} align="top" content={fixedAmountMessage}>
                <div>{amountField}</div>
              </Tooltip>
            )) ||
              amountField}
          </div>
        </div>

        {!isItemized && !isRecordTypeIc && (
          <TaxRateArea
            readOnly={readOnly}
            expRecordItem={expRecord.items[recordItemIdx]}
            recordItemIdx={recordItemIdx}
            expenseTaxTypeList={expenseTaxTypeList}
            isTaxIncluded={!isTaxExcludedMode}
            onChangeAmountOrTaxType={props.onChangeAmountOrTaxType}
            errors={props.errors}
            isLoading={props.isLoading}
            loadingAreas={props.loadingAreas}
            isLoaderOverride
            isDotLoader
          />
        )}
      </MultiColumnsGrid>

      {!isRecordTypeIc && (
        <Tax
          baseCurrencySymbol={baseCurrencySymbol}
          baseCurrencyDecimal={baseCurrencyDecimal}
          expRecord={expRecord}
          readOnly={readOnly}
          isItemized={isItemized}
          isFinanceApproval={isHotelFeeUnderFA}
          isFixedAllowance={isFixedAllowance}
          expenseTaxTypeList={expenseTaxTypeList}
          onClickEditButton={props.onClickEditButton}
          calcTaxFromGstVat={props.calcTaxFromGstVat}
          recordItemIdx={recordItemIdx}
          allowTaxAmountChange={allowTaxAmountChange}
          allowTaxExcludedAmount={allowTaxExcludedAmount}
          toggleInputMode={props.toggleInputMode}
          onChangeAmountOrTaxType={props.onChangeAmountOrTaxType}
        />
      )}
    </div>
  );
};

export default BaseCurrency;
