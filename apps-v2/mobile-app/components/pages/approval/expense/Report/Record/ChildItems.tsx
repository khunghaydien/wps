import React from 'react';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import { Color } from '@apps/core/styles';
import Highlight from '@commons/components/exp/Highlight';
import msg from '@commons/languages';
import DateUtil from '@commons/utils/DateUtil';
import FormatUtil from '@commons/utils/FormatUtil';
import Navigation from '@mobile/components/molecules/commons/Navigation';
import ViewItem from '@mobile/components/molecules/commons/ViewItem';

import { getLabelValueFromEIs } from '@apps/domain/models/exp/ExtendedItem';
import { Record, RecordItem } from '@apps/domain/models/exp/Record';
import { ExpRequestRecord } from '@apps/domain/models/exp/request/Report';

import Amount from '@mobile/components/atoms/Amount';
import Wrapper from '@mobile/components/atoms/Wrapper';
import MultipleTaxEntriesApprovalForm from '@mobile/components/pages/expense/Record/New/General/MultipleTaxEntries/MultipleTaxEntriesApprovalForm';

const ROOT = 'mobile-app-pages-approval-page-expense-record-child-items';

type CCJobObj = {
  costCenterCode?: string;
  costCenterName?: string;
  jobCode?: string;
  jobName?: string;
};

type Props = {
  ccJobObj: CCJobObj;
  currencyDecimalPlaces: number;
  currencySymbol: string;
  isHighlightDiff: boolean;
  isMultipleTax: boolean;
  item: RecordItem;
  preCCJobObj: CCJobObj;
  preItem: RecordItem;
  preRecord: Record;
  record: Record;
  onClickBack: () => void;
};

const ChildItems = ({
  ccJobObj,
  currencyDecimalPlaces,
  currencySymbol,
  isHighlightDiff,
  isMultipleTax,
  item,
  preCCJobObj,
  preItem,
  preRecord,
  record,
  onClickBack,
}: Props) => {
  if (isEmpty(item)) return null;

  const {
    amount,
    currencyInfo,
    exchangeRate,
    expTypeName,
    gstVat,
    localAmount,
    recordDate,
    remarks,
    taxRate,
    taxTypeName,
    useForeignCurrency,
    withoutTax,
  } = item;

  const isHighlight = (key: string) => {
    if (!isHighlightDiff) return false;
    const value = get(item, key);
    const preValue = get(preItem, key);
    return !isEqual(value, preValue);
  };

  const formatNumber = (amount: number, isForeignCurrency?: boolean) => {
    const finalDecimalPlaces = isForeignCurrency
      ? foreignCurrencyDecimalPlaces
      : currencyDecimalPlaces;
    const finalSymbol = isForeignCurrency
      ? foreignCurrencySymbol
      : currencySymbol;
    const formattedAmount = FormatUtil.formatNumber(amount, finalDecimalPlaces);
    return `${finalSymbol} ${formattedAmount}`;
  };

  const renderEI = () => {
    const eiList = getLabelValueFromEIs(item, true);
    const preEIList = isHighlightDiff
      ? getLabelValueFromEIs(preItem, true)
      : [];

    return eiList.map((ei) => {
      const preEI = preEIList.find((preEI) => preEI.id === ei.id);
      const preEiValue = get(preEI, 'value', '');
      const eiValue = get(ei, 'value', '');
      const isHighlight = isHighlightDiff && preEiValue !== eiValue;

      return (
        <ViewItem key={ei.id} label={ei.label} className="block">
          <Highlight highlight={isHighlight}>{eiValue}</Highlight>
          {isHighlight && (
            <Highlight
              className={`${ROOT}__highlight-italic`}
              highlightColor={Color.bgDisabled}
            >
              {`(${preEiValue})`}
            </Highlight>
          )}
        </ViewItem>
      );
    });
  };

  const isHighlightCC =
    isHighlightDiff && ccJobObj.costCenterCode !== preCCJobObj.costCenterCode;
  const isHighlightJob =
    isHighlightDiff && ccJobObj.jobCode !== preCCJobObj.jobCode;
  const isShowCC = ccJobObj.costCenterCode || preCCJobObj.costCenterCode;
  const isShowJob = ccJobObj.jobCode || preCCJobObj.jobCode;
  const costCenter = ccJobObj.costCenterCode
    ? `${ccJobObj.costCenterCode} - ${ccJobObj.costCenterName}`
    : '';
  const job = ccJobObj.jobCode
    ? `${ccJobObj.jobCode} - ${ccJobObj.jobName}`
    : '';
  const preCC = preCCJobObj.costCenterCode
    ? `${preCCJobObj.costCenterCode} - ${preCCJobObj.costCenterName}`
    : '';
  const preJob = preCCJobObj.jobCode
    ? `${preCCJobObj.jobCode} - ${preCCJobObj.jobName}`
    : '';

  const foreignCurrencyCode = get(currencyInfo, 'code') || '';
  const foreignCurrencyDecimalPlaces = get(currencyInfo, 'decimalPlaces') || 0;
  const foreignCurrencySymbol = get(currencyInfo, 'symbol') || '';

  const gstLabel = `${taxTypeName || ''} -
  ${FormatUtil.convertToDisplayingPercent(taxRate)}`;

  return (
    <Wrapper className={ROOT}>
      <Navigation
        title={msg().Exp_Lbl_ItemizationDetail}
        onClickBack={onClickBack}
      />

      <div className="main-content">
        <div className={`${ROOT}__header`}>
          <div className={`${ROOT}__date`}>
            <Highlight highlight={isHighlight('recordDate')}>
              {DateUtil.dateFormat(recordDate)}
            </Highlight>
          </div>

          <div className={`${ROOT}__exp-type`}>
            <Highlight highlight={isHighlight('expTypeName')}>
              {expTypeName}
            </Highlight>
          </div>

          <Highlight highlight={isHighlight('amount')}>
            <>
              <Amount
                amount={amount}
                className="base-amount"
                decimalPlaces={currencyDecimalPlaces}
                symbol={currencySymbol}
              />
              {useForeignCurrency && (
                <Amount
                  amount={localAmount}
                  className="local-amount"
                  decimalPlaces={foreignCurrencyDecimalPlaces}
                  symbol={foreignCurrencySymbol}
                />
              )}
            </>
          </Highlight>
        </div>

        <div className={`${ROOT}__content`}>
          <div className={`${ROOT}__content-parent`}>
            {isMultipleTax ? (
              <MultipleTaxEntriesApprovalForm
                record={record as ExpRequestRecord}
                preRecord={preRecord as ExpRequestRecord}
                baseCurrencyDecimal={currencyDecimalPlaces}
                currencySymbol={currencySymbol}
                isHighlightDifference={isHighlightDiff}
              />
            ) : useForeignCurrency ? (
              <>
                <ViewItem label={msg().Exp_Clbl_Currency} className="block">
                  <Highlight highlight={isHighlight('currencyInfo.code')}>
                    {foreignCurrencyCode}
                  </Highlight>
                  {isHighlight('currencyInfo.code') && (
                    <Highlight
                      className={`${ROOT}__highlight-italic`}
                      highlightColor={Color.bgDisabled}
                    >
                      {`(${get(preItem, 'currencyInfo.code') || ''})`}
                    </Highlight>
                  )}
                </ViewItem>
                <ViewItem label={msg().Exp_Clbl_ExchangeRate}>
                  <Highlight highlight={isHighlight('exchangeRate')}>
                    <div className={`${ROOT}__amount`}>
                      {`${foreignCurrencySymbol} 1 = ${currencySymbol} ${exchangeRate}`}
                    </div>
                  </Highlight>
                  {isHighlight('exchangeRate') && (
                    <Highlight
                      className={`${ROOT}__highlight-italic`}
                      highlightColor={Color.bgDisabled}
                    >
                      {`(${foreignCurrencySymbol} 1 = ${currencySymbol} ${preItem.exchangeRate})`}
                    </Highlight>
                  )}
                </ViewItem>
              </>
            ) : (
              <>
                <ViewItem label={msg().Exp_Clbl_WithoutTax}>
                  <Highlight highlight={isHighlight('withoutTax')}>
                    <Amount
                      amount={withoutTax}
                      className={`${ROOT}__amount`}
                      decimalPlaces={currencyDecimalPlaces}
                      symbol={currencySymbol}
                    />
                  </Highlight>
                  {isHighlight('withoutTax') && (
                    <Highlight
                      className={`${ROOT}__highlight-italic`}
                      highlightColor={Color.bgDisabled}
                    >
                      {`(${formatNumber(preItem.withoutTax)})`}
                    </Highlight>
                  )}
                </ViewItem>
                <ViewItem label={gstLabel}>
                  <Highlight highlight={isHighlight('gstVat')}>
                    <Amount
                      amount={gstVat}
                      className={`${ROOT}__amount`}
                      decimalPlaces={currencyDecimalPlaces}
                      symbol={currencySymbol}
                    />
                  </Highlight>
                  {isHighlight('gstVat') && (
                    <Highlight
                      className={`${ROOT}__highlight-italic`}
                      highlightColor={Color.bgDisabled}
                    >
                      {`(${formatNumber(preItem.gstVat)})`}
                    </Highlight>
                  )}
                </ViewItem>
              </>
            )}
            {isShowCC && (
              <ViewItem label={msg().Exp_Clbl_CostCenter} className="block">
                <Highlight highlight={isHighlightCC}>{costCenter}</Highlight>
                {isHighlightCC && (
                  <Highlight
                    className={`${ROOT}__highlight-italic`}
                    highlightColor={Color.bgDisabled}
                  >
                    {`(${preCC})`}
                  </Highlight>
                )}
              </ViewItem>
            )}
            {isShowJob && (
              <ViewItem label={msg().Exp_Lbl_Job} className="block">
                <Highlight highlight={isHighlightJob}>{job}</Highlight>
                {isHighlightJob && (
                  <Highlight
                    className={`${ROOT}__highlight-italic`}
                    highlightColor={Color.bgDisabled}
                  >
                    {`(${preJob})`}
                  </Highlight>
                )}
              </ViewItem>
            )}
            {renderEI()}
            <ViewItem label={msg().Exp_Clbl_Summary} className="block">
              <Highlight highlight={isHighlight('remarks')}>
                {remarks}
              </Highlight>
              {isHighlight('remarks') && (
                <Highlight
                  className={`${ROOT}__highlight-italic`}
                  highlightColor={Color.bgDisabled}
                >
                  {`(${preItem.remarks || ''})`}
                </Highlight>
              )}
            </ViewItem>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ChildItems;
