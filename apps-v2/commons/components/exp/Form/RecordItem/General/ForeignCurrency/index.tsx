import React from 'react';

import classNames from 'classnames';
import { Field } from 'formik';
import { get, isNil } from 'lodash';

import Highlight from '@apps/commons/components/exp/Highlight';
import {
  convertDifferenceValues,
  DifferenceValues,
  isDifferent,
} from '@apps/commons/utils/exp/RequestReportDiffUtils';
import LabelWithHint from '@commons/components/fields/LabelWithHint';

// model
import { CurrencyList } from '../../../../../../../domain/models/exp/foreign-currency/Currency';
import { exchangeRateField } from '../../../../../../../domain/models/exp/foreign-currency/ExchangeRate';
import {
  isItemizedRecord,
  Record,
} from '../../../../../../../domain/models/exp/Record';
import { CustomHint } from '@apps/domain/models/exp/CustomHint';

import FormatUtil from '../../../../../../utils/FormatUtil';
import StringUtil from '../../../../../../utils/StringUtil';

import withLoadingHOC from '../../../../../../components/withLoading';

import ImgEditOff from '../../../../../../images/btnEditOff.svg';
import ImgEditOn from '../../../../../../images/btnEditOn.svg';
// common components
import msg from '../../../../../../languages';
import IconButton from '../../../../../buttons/IconButton';
import MultiColumnsGrid from '../../../../../MultiColumnsGrid';
import Tooltip from '../../../../../Tooltip';
import { Errors } from '../../..';
import { Touched } from '../..';
import LocalAmount from './LocalAmount';

import './index.scss';

export type ContainerProps = {
  baseCurrencyCode: string;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  customHint?: CustomHint;
  expPreRecord: Record;
  expRecord: Record;
  fixedAmountMessage: string;
  formikErrors: Errors;
  isChildItem?: boolean;
  isFixedAllowance: boolean;
  isHideLocalAmount?: boolean;
  isHighlightDiff?: boolean;
  isHighlightNewRecord?: boolean;
  readOnly: boolean;
  recordItemIdx: number;
  targetRecord: string;
  touched: Touched;
  onChangeEditingExpReport: (
    key: string,
    value: string | number | boolean | Record,
    recalc?: boolean,
    isTouched?: boolean
  ) => void;
};

export type Props = {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  currencyRecord: CurrencyList;
  customHint?: CustomHint;
  expPreRecord?: Record;
  expRecord: Record;
  fixedAmountMessage?: string;
  // Formik
  formikErrors: any;
  isChildItem?: boolean;
  isFixedAllowance: boolean;
  isHideLocalAmount?: boolean;
  isHighlightDiff?: boolean;
  isHighlightNewRecord?: boolean;
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

const highlightBg = 'highlight-bg';

const ROOT = 'ts-expenses-requests__contents__amount';

const ExchangeRate = ({
  className,
  disabled,
  isShowTooltip,
  onChange,
  onBlur,
  onFocus,
}): React.ReactElement<any> => {
  const field = (
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
  return isShowTooltip ? (
    <Tooltip
      id={`${ROOT}-exchange-rate`}
      align="top"
      content={msg().Exp_Hint_FixedExchangeRateChild}
    >
      <div>{field} </div>
    </Tooltip>
  ) : (
    field
  );
};
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
      (record.useFixedForeignCurrency
        ? record.fixedForeignCurrencyId
        : record.currencyId) || propRecord.id;
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

    this.props.expRecord.items.forEach((_, idx) => {
      this.props.onChangeEditingExpReport(
        `${this.props.targetRecord}.items.${idx}.exchangeRateManual`,
        !exchangeRateManual,
        false
      );
    });
  };

  getDiffValues = (): DifferenceValues => {
    const {
      expRecord,
      expPreRecord,
      isHighlightDiff,
      isHighlightNewRecord,
      recordItemIdx = 0,
    } = this.props;
    let diffValues = {};
    if (!isHighlightNewRecord && isHighlightDiff && expPreRecord) {
      const diffMapping = {
        amount: 'amount',
        exchangeRate: 'exchangeRate',
        'currencyInfo.code': 'currencyInfo.code',
      };
      diffValues = convertDifferenceValues(
        diffMapping,
        expRecord.items[recordItemIdx],
        expPreRecord.items[recordItemIdx]
      );
    }
    return diffValues;
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

    if ((!isEditable && readOnly) || this.props.isChildItem) {
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
      recordItemIdx = 0,
    } = this.props;
    const isFixedForeignCurrency = expRecord.items[0].useFixedForeignCurrency;
    const isChildItem = recordItemIdx > 0;

    const selectField = (
      <Field
        className={`slds-input ${ROOT}__foreign-currency-input`}
        component="select"
        name="currencySelector"
        onChange={this.handleCurrencySelectorChange}
        disabled={readOnly || isChildItem || isFixedForeignCurrency}
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
      expPreRecord,
      expRecord,
      readOnly,
      baseCurrencySymbol,
      formikErrors,
      baseCurrencyDecimal,
      isFixedAllowance,
      isHideLocalAmount = false,
      isHighlightDiff,
      isHighlightNewRecord,
      fixedAmountMessage,
      recordItemIdx = 0,
      isLoading,
    } = this.props;

    const isParentItem = recordItemIdx === 0;
    const isEditable =
      get(expRecord, `items.${recordItemIdx}.exchangeRateManual`) &&
      isParentItem;
    const amount = FormatUtil.formatNumber(
      expRecord.items[recordItemIdx].amount,
      baseCurrencyDecimal
    );
    const amountError = get(formikErrors, `items.${recordItemIdx}.amount`);
    const modifiedClass = readOnly && isEditable ? 'ts-currency-modified' : '';

    const symbol = get(expRecord.items[0], 'currencyInfo.symbol');

    const diffValues = this.getDiffValues();

    const preItem = get(expPreRecord, `items.${recordItemIdx}`, {});
    const isItemizedParent =
      isItemizedRecord(expRecord.items.length) && recordItemIdx === 0;

    return (
      <div className={`${ROOT}`}>
        <MultiColumnsGrid sizeList={isHideLocalAmount ? [12] : [6, 6]}>
          {!isHideLocalAmount && (
            <LocalAmount
              currencySymbol={symbol}
              customHintStr={this.props.customHint.recordLocalAmount}
              errors={formikErrors}
              fixedAmountMessage={fixedAmountMessage}
              isFixedAllowance={isFixedAllowance}
              isHighlightDiff={isHighlightDiff}
              isHighlightNewRecord={isHighlightNewRecord}
              isItemizedParent={isItemizedParent}
              item={expRecord.items[recordItemIdx]}
              itemIdx={recordItemIdx}
              preItem={preItem}
              readOnly={readOnly}
              record={expRecord}
              onChangeAmountField={this.props.onChangeAmountField}
            />
          )}

          <div className={`${ROOT}__currency-selector`}>
            <LabelWithHint
              text={msg().Exp_Clbl_Currency}
              hintMsg={this.props.customHint.recordCurrency}
            />
            <div className="ts-text-field-container">
              {readOnly ? (
                <Highlight
                  highlight={
                    isHighlightNewRecord ||
                    isDifferent('currencyInfo.code', diffValues)
                  }
                >
                  {expRecord.items[0].currencyInfo.code}
                </Highlight>
              ) : (
                this.renderCurrencySelectField()
              )}
            </div>
          </div>
        </MultiColumnsGrid>
        <MultiColumnsGrid sizeList={[6, 6]} alignments={['top', 'top']}>
          <div className={`${ROOT}__amount`}>
            <div className="key">{msg().Exp_Clbl_Amount}</div>
            <input
              type="text"
              className={classNames(
                'slds-input input_disabled_no-border input_disabled_no-background input_disabled_right-aligned',
                {
                  [highlightBg]:
                    isHighlightNewRecord || isDifferent('amount', diffValues),
                }
              )}
              data-testid={`${ROOT}-field`}
              disabled
              value={`${baseCurrencySymbol} ${amount}`}
            />
            {amountError && (
              <div className="input-feedback">{msg()[amountError]}</div>
            )}
          </div>

          <div className={`${ROOT}__exchange-rate`}>
            <div className={`${ROOT}__exchange-rate-area`}>
              <LabelWithHint
                text={msg().Exp_Clbl_ExchangeRate}
                hintMsg={this.props.customHint.recordExchangeRate}
              />
              <ExchangeRateWithLoading
                className={classNames(
                  `${modifiedClass} ${ROOT}__exchange-rate-field`,
                  {
                    [highlightBg]:
                      isHighlightNewRecord ||
                      isDifferent('exchangeRate', diffValues),
                  }
                )}
                disabled={readOnly || !isEditable || isLoading}
                isShowTooltip={this.props.isChildItem}
                onChange={this.handleExchangeRateChange}
                onBlur={this.handleExchangeRateBlur}
                onFocus={this.handleExchangeRateFocus}
                isLoading={isLoading}
                loadingAreas={this.props.loadingAreas}
                isDotLoader
                isLoaderOverride
              />
            </div>
            {this.renderEditImage(isEditable, readOnly, isLoading)}
          </div>
        </MultiColumnsGrid>
      </div>
    );
  }
}
