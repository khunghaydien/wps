import React from 'react';

import { Field } from 'formik';
import { get, isNil } from 'lodash';

// model
import { CurrencyList } from '../../../../../../../domain/models/exp/foreign-currency/Currency';
import { exchangeRateField } from '../../../../../../../domain/models/exp/foreign-currency/ExchangeRate';
import { Record } from '../../../../../../../domain/models/exp/Record';

import FormatUtil from '../../../../../../utils/FormatUtil';
import StringUtil from '../../../../../../utils/StringUtil';

import withLoadingHOC from '../../../../../../components/withLoading';

import ImgEditOff from '../../../../../../images/btnEditOff.svg';
import ImgEditOn from '../../../../../../images/btnEditOn.svg';
// common components
import msg from '../../../../../../languages';
import IconButton from '../../../../../buttons/IconButton';
import AmountField from '../../../../../fields/AmountField';
import MultiColumnsGrid from '../../../../../MultiColumnsGrid';
import Tooltip from '../../../../../Tooltip';

import './index.scss';

export type Props = {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  currencyRecord: CurrencyList;
  expRecord: Record;
  fixedAmountMessage?: string;
  // Formik
  formikErrors: any;
  hasChildItems: boolean;
  isFixedAllowance: boolean;
  isItemized: boolean;
  isLoading: boolean;
  loadingAreas: string[];
  readOnly: boolean;
  recordItemIdx: number;
  targetRecord: string;
  calcNewRate: (exchangeRate: number) => void;
  handleChange: (e: React.SyntheticEvent<Element>) => void;
  onChangeAmountField: (localAmount: number) => void;
  onChangeEditingExpReport: (arg0: string, arg1: any, arg2: boolean) => void;
  onCurrencyChange: (
    currencyId: any,
    decimalPlaces: number,
    symbol: string,
    loadInBackground?: boolean
  ) => void;
  // Container props
  searchCurrencyList: () => void;
  setFieldValue: (arg0: string, arg1: any) => void;
  updateNewRate: (exchangeRate: number) => void;
  validateRate: (value: string) => void;
};

type State = {
  targetRecord: string;
};

const ROOT = 'ts-expenses-requests__contents__amount';

const ExchangeRate = ({
  className,
  disabled,
  onChange,
  onBlur,
  onFocus,
}): React.ReactElement<any> => (
  <Field
    type="tel"
    className={`${className} slds-input input_disabled_no-border input_disabled_no-background input_disabled_right-aligned input_right-aligned`}
    name="exchangeRate"
    disabled={disabled}
    onChange={onChange}
    onBlur={onBlur}
    onFocus={onFocus}
  />
);
ExchangeRate.displayName = exchangeRateField;
const ExchangeRateWithLoading = withLoadingHOC(ExchangeRate);

export default class ForeignCurrency extends React.Component<Props, State> {
  state = {
    targetRecord: 'records[-1]',
  };

  UNSAFE_componentWillMount() {
    if (this.props.recordItemIdx > 0) {
      return;
    }
    this.props.searchCurrencyList();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.recordItemIdx > 0) {
      return;
    }

    const record = this.props.expRecord;
    const prevRecord = prevProps.expRecord;
    const localAmount = record.items[0].localAmount;
    const isSameRecord = record.recordId === prevRecord.recordId;
    const isAmountChange = localAmount !== prevRecord.items[0].localAmount;
    if (
      this.props.isFixedAllowance &&
      isSameRecord &&
      isAmountChange &&
      !isNil(localAmount)
    ) {
      this.props.onChangeAmountField(localAmount);
    }

    const isTargetRecordChanged =
      this.state.targetRecord !== prevProps.targetRecord;

    if (isTargetRecordChanged) {
      if (!this.props.expRecord.items[0].currencyId) {
        this.setCurrencyInfo();
      }
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        targetRecord: prevProps.targetRecord,
      });
    }
  }

  setCurrencyInfo() {
    const record = this.props.expRecord.items[0];
    const propRecord = this.props.currencyRecord[0];
    if (!record.currencyId && !propRecord) {
      return;
    }

    const currencyId =
      record.currencyId || record.fixedForeignCurrencyId || propRecord.id;
    const decimal =
      record.currencyInfo.decimalPlaces || Number(propRecord.decimalPlaces);
    const symbol =
      (record.currencyInfo && record.currencyInfo.symbol) || propRecord.symbol;
    this.props.onCurrencyChange(currencyId, decimal, symbol, true);
  }

  handleCurrencySelectorChange = (e: any) => {
    const selected = e.target[e.target.selectedIndex];
    const currencyDecimal = Number(selected.getAttribute('data-decimal'));
    const currencySymbol = selected.getAttribute('data-symbol');
    this.props.onCurrencyChange(
      e.target.value,
      currencyDecimal,
      currencySymbol
    );
  };

  handleExchangeRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    // @ts-ignore
    if (this.props.validateRate(value) || value.length === 0) {
      this.props.handleChange(e);
    }
  };

  handleExchangeRateBlur = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = StringUtil.convertToHankaku(
      StringUtil.removeComma(e.target.value)
    );
    if (value === '') {
      this.props.setFieldValue('exchangeRate', '0');
    } else {
      this.props.setFieldValue(
        'exchangeRate',
        StringUtil.removeLeadingZeroes(value)
      );
    }
    this.props.updateNewRate(Number(value));
    this.props.calcNewRate(Number(value));
  };

  handleExchangeRateFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { value } = e.target;
    this.props.setFieldValue('exchangeRate', Number(value) || '');
  };

  handleEditButtonClick = () => {
    const itemIdx = this.props.recordItemIdx || 0;
    const { originalExchangeRate, exchangeRate, exchangeRateManual } =
      this.props.expRecord.items[itemIdx];

    if (exchangeRateManual) {
      this.props.calcNewRate(originalExchangeRate || exchangeRate);
    }
    this.props.onChangeEditingExpReport(
      `${this.props.targetRecord}.items.${itemIdx}.exchangeRateManual`,
      !exchangeRateManual,
      false
    );
  };

  renderEditImage(isEditable: boolean, readOnly: boolean, isLoading: boolean) {
    const itemIdx = this.props.recordItemIdx || 0;
    const originalExchangeRate = get(
      this.props.expRecord,
      `items.${itemIdx}.originalExchangeRate`
    );
    // when there is no exchange rate from master, user cannot exit edit mode
    const disabled =
      readOnly || (isEditable && !originalExchangeRate) || isLoading;
    const imgEdit = isEditable ? ImgEditOn : ImgEditOff;
    const imgEditAlt = isEditable ? 'ImgEditOn' : 'ImgEditOff';

    if (!isEditable && readOnly) {
      return null;
    }

    return (
      <div className="ts-tax-auto">
        <IconButton
          src={imgEdit}
          onClick={this.handleEditButtonClick}
          srcType="svg"
          alt={imgEditAlt}
          disabled={disabled}
        />
      </div>
    );
  }

  renderEditImageForView() {
    return (
      <div className="ts-tax-auto">
        <IconButton src={ImgEditOn} srcType="svg" />
      </div>
    );
  }

  renderCurrencySelectField() {
    const {
      currencyRecord,
      readOnly,
      expRecord,
      hasChildItems,
      isItemized,
      recordItemIdx = 0,
    } = this.props;
    const isFixedForeignCurrency = expRecord.items[0].useFixedForeignCurrency;
    const isChildItem = recordItemIdx > 0;
    const isParentHasChild = isItemized && hasChildItems;

    const selectField = (
      <Field
        className={`slds-input ${ROOT}__foreign-currency-input`}
        component="select"
        name="currencySelector"
        onChange={this.handleCurrencySelectorChange}
        disabled={
          readOnly || isChildItem || isParentHasChild || isFixedForeignCurrency
        }
      >
        {currencyRecord.map((record) => {
          return (
            <option
              key={record.id}
              value={record.id}
              data-symbol={record.symbol}
              data-decimal={record.decimalPlaces}
            >
              {record.isoCurrencyCode}
            </option>
          );
        })}
      </Field>
    );
    const fixedCurrencyHintMsg = isChildItem
      ? msg().Exp_Hint_FixedCurrencyChild
      : msg().Exp_Hint_FixedCurrency;
    return isFixedForeignCurrency ? (
      <Tooltip id={ROOT} align="top" content={fixedCurrencyHintMsg}>
        <div>{selectField} </div>
      </Tooltip>
    ) : (
      selectField
    );
  }

  render() {
    const {
      expRecord,
      readOnly,
      baseCurrencySymbol,
      formikErrors,
      baseCurrencyDecimal,
      isItemized,
      isFixedAllowance,
      fixedAmountMessage,
      recordItemIdx = 0,
      isLoading,
    } = this.props;

    const isEditable = get(
      expRecord,
      `items.${recordItemIdx}.exchangeRateManual`
    );
    const amount = FormatUtil.formatNumber(
      expRecord.items[recordItemIdx].amount,
      baseCurrencyDecimal
    );
    const amountError = get(formikErrors, `items.${recordItemIdx}.amount`);
    const modifiedClass = readOnly && isEditable ? 'ts-currency-modified' : '';

    const symbol = get(expRecord.items[0], 'currencyInfo.symbol');

    const localAmount = get(expRecord, `items.${recordItemIdx}.localAmount`, 0);

    const amountField = (
      <AmountField
        className={
          readOnly
            ? 'input_right-aligned input_disabled_no-border input_disabled_no-background'
            : 'input_right-aligned'
        }
        data-testid={`${ROOT}__amount`}
        disabled={readOnly || isFixedAllowance}
        fractionDigits={
          expRecord.items[0].currencyInfo
            ? expRecord.items[0].currencyInfo.decimalPlaces
            : 0
        }
        value={localAmount}
        onBlur={(value: number | null) => {
          if (value !== null && value !== localAmount) {
            this.props.onChangeAmountField(value);
          }
        }}
      />
    );
    const gridSize = isItemized ? [6] : [6, 6];
    return (
      <div className={`${ROOT}`}>
        <MultiColumnsGrid sizeList={[6, 6]}>
          <div className={`${ROOT}__local-amount`}>
            <div className="ts-text-field-container">
              <div className="key">
                {msg().Exp_Clbl_LocalAmount} {symbol ? `(${symbol})` : null}
              </div>
              {(isFixedAllowance && !readOnly && (
                <Tooltip id={ROOT} align="top" content={fixedAmountMessage}>
                  <div>{amountField}</div>
                </Tooltip>
              )) ||
                amountField}
            </div>
          </div>

          <div className={`${ROOT}__currency-selector`}>
            <div className="key">{msg().Exp_Clbl_Currency}</div>
            <div className="ts-text-field-container">
              {readOnly
                ? expRecord.items[0].currencyInfo.code
                : this.renderCurrencySelectField()}
            </div>
          </div>
        </MultiColumnsGrid>
        <MultiColumnsGrid sizeList={gridSize} alignments={['top', 'top']}>
          <div className={`${ROOT}__amount`}>
            <div className="key">{msg().Exp_Clbl_Amount}</div>
            <input
              type="text"
              className="slds-input input_disabled_no-border input_disabled_no-background input_disabled_right-aligned"
              data-testid={`${ROOT}-field`}
              disabled
              value={`${baseCurrencySymbol} ${amount}`}
            />
            {amountError && (
              <div className="input-feedback">{msg()[amountError]}</div>
            )}
          </div>

          {!isItemized && (
            <div className={`${ROOT}__exchange-rate`}>
              <div className={`${ROOT}__exchange-rate-area`}>
                <div className="key">{msg().Exp_Clbl_ExchangeRate}</div>
                <ExchangeRateWithLoading
                  className={`${modifiedClass} ${ROOT}__exchange-rate-field`}
                  disabled={readOnly || !isEditable || isLoading}
                  onChange={this.handleExchangeRateChange}
                  onBlur={this.handleExchangeRateBlur}
                  onFocus={this.handleExchangeRateFocus}
                  isLoading={isLoading}
                  loadingAreas={this.props.loadingAreas}
                  isDotLoader
                  isLoaderOverride
                />
              </div>
              {!isItemized &&
                this.renderEditImage(isEditable, readOnly, isLoading)}
            </div>
          )}
        </MultiColumnsGrid>
      </div>
    );
  }
}
