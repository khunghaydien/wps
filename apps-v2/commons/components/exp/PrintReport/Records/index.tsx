import React from 'react';

import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import MultiColumnsGrid from '@apps/commons/components/MultiColumnsGrid';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import FormatUtil from '@apps/commons/utils/FormatUtil';

import { ExpenseReportType } from '@apps/domain/models/exp/expense-report-type/list';
import { getLabelValueFromEIs } from '@apps/domain/models/exp/ExtendedItem';
import { isUseMerchant } from '@apps/domain/models/exp/Merchant';
import {
  isIcRecord,
  isItemizedRecord,
  Record,
  RecordItem,
} from '@apps/domain/models/exp/Record';
import { Report } from '@apps/domain/models/exp/Report';
import { getDetailDisplay } from '@apps/domain/models/exp/TransportICCard';
import { UserSetting } from '@apps/domain/models/UserSetting';

import './index.scss';

export type Props = {
  report: Report;
  selectedReportType: ExpenseReportType | null | undefined;
  userSetting: UserSetting;
};

type CssClass = {
  'without-cost-center'?: boolean;
};

const ROOT = 'expenses-pc-print-print-report-records';

export default class Records extends React.Component<Props> {
  // Logic for display of extended item is similar to report header
  renderExtendedItems = (record) => {
    const ROOT_EI = `${ROOT}-extended-item`;
    const extendedItems = getLabelValueFromEIs(record, true);
    const eiRows = [];
    for (let i = 0; i < extendedItems.length; i += 4) {
      eiRows.push(extendedItems.slice(i, i + 4));
    }
    const eiFields = [];
    eiRows.forEach((eiRow, idx) => {
      const child = (
        <MultiColumnsGrid
          key={`eiRow_${idx}`}
          className={`${ROOT_EI}__row`}
          sizeList={[3, 3, 3, 3]}
        >
          {eiRow.map((o) => (
            <>
              <div className={`${ROOT_EI}__label`}>{o.label} </div>
              <div className={`${ROOT_EI}__value`}>
                {o.code ? o.value.split(`${o.code} - `) : o.value}
              </div>
              <div className={`${ROOT_EI}__code`}>{o.code}</div>
            </>
          ))}
        </MultiColumnsGrid>
      );
      eiFields.push(child);
    });
    return <div className={ROOT_EI}>{eiFields}</div>;
  };

  renderDate = (recordDate: string, ccCssClass: CssClass, itemIdx: number) => {
    const indentation = (
      <span className={`${ROOT}__record-content-row-indentation`}>-</span>
    );

    return (
      <div
        className={classNames(`${ROOT}__record-content`, 'date', ccCssClass)}
      >
        {itemIdx > 0 && indentation}
        {DateUtil.dateFormat(recordDate)}
      </div>
    );
  };

  renderExpType = (expTypeName: string, ccCssClass: CssClass) => (
    <div
      className={classNames(
        `${ROOT}__record-content`,
        'expense-type',
        ccCssClass
      )}
    >
      {expTypeName}
    </div>
  );

  renderTax = (
    record: RecordItem,
    isItemized: boolean,
    itemIdx: number,
    ccCssClass: CssClass
  ) => {
    const { gstVat, taxTypeName, taxRate, useForeignCurrency } = record;

    const isShownTaxType = !isItemized || itemIdx > 0;

    const content = useForeignCurrency ? (
      <>&mdash;</>
    ) : (
      <>
        <div>
          {this.props.userSetting.currencySymbol}
          {FormatUtil.formatNumber(
            gstVat,
            this.props.userSetting.currencyDecimalPlaces
          )}
        </div>
        {isShownTaxType && (
          <div className={classNames(`${ROOT}__record-content`, 'tax-type')}>
            {`${taxTypeName || ''} ${FormatUtil.convertToDisplayingPercent(
              taxRate || 0
            )}`}
          </div>
        )}
      </>
    );

    return (
      <div className={classNames(`${ROOT}__record-content`, 'tax', ccCssClass)}>
        {content}
      </div>
    );
  };

  renderTaxExclAmount = (record: RecordItem, ccCssClass: CssClass) => {
    const { withoutTax, useForeignCurrency } = record;
    return (
      <div
        className={classNames(
          `${ROOT}__record-content`,
          'excl-tax',
          ccCssClass
        )}
      >
        {useForeignCurrency ? (
          <>&mdash;</>
        ) : (
          <>
            {this.props.userSetting.currencySymbol}
            {FormatUtil.formatNumber(
              withoutTax,
              this.props.userSetting.currencyDecimalPlaces
            )}
          </>
        )}
      </div>
    );
  };

  renderAmount = (record: RecordItem, ccCssClass: CssClass) => {
    const { amount, useForeignCurrency, currencyInfo, localAmount } = record;

    const foreignSymbol =
      (useForeignCurrency && get(currencyInfo, 'symbol')) || '';
    const foreignDecimal =
      (useForeignCurrency && get(currencyInfo, 'decimalPlaces')) || 0;
    const foreignAmount = FormatUtil.formatNumber(localAmount, foreignDecimal);

    return (
      <div
        className={classNames(`${ROOT}__record-content`, 'amount', ccCssClass)}
      >
        <div>
          {this.props.userSetting.currencySymbol}
          {FormatUtil.formatNumber(
            amount,
            this.props.userSetting.currencyDecimalPlaces
          )}
        </div>
        {foreignAmount !== '0' && (
          <div
            className={classNames(
              `${ROOT}__record-content`,
              'amount-foreign-currency',
              ccCssClass
            )}
          >
            {foreignSymbol} {foreignAmount}
          </div>
        )}
      </div>
    );
  };

  renderMerchant = (name: string) => (
    <div className={`${ROOT}__merchant`}>
      <div className={`${ROOT}__merchant-label`}>{msg().Exp_Clbl_Merchant}</div>
      <div>{name || ''}</div>
    </div>
  );

  renderCostCenter = (name: string, code: string) => (
    <div className={classNames(`${ROOT}__record-content`, 'cost-center')}>
      <div>{name || ''}</div>
      <div
        className={classNames(`${ROOT}__record-content`, 'cost-center-code')}
      >
        {code || ''}
      </div>
    </div>
  );

  renderDetail = (record: Record, remarks: string, ccCssClass: CssClass) => {
    /* change to recordItem for routeInfo after itemization for record type Transportation */
    const { routeInfo, recordType, transitIcRecordInfo } = record;
    return (
      <div
        className={classNames(`${ROOT}__record-content`, 'detail', ccCssClass)}
      >
        {routeInfo && routeInfo.origin && routeInfo.arrival && (
          <div>
            {routeInfo.origin.name}
            {' - '}
            {routeInfo.arrival.name}
          </div>
        )}
        {isIcRecord(recordType) && transitIcRecordInfo && (
          <div>{getDetailDisplay(transitIcRecordInfo)}</div>
        )}
        <div>{remarks}</div>
      </div>
    );
  };

  renderReport = (report: Report, ccCssClass: CssClass) => (
    <div>
      {report.records.map((record) => {
        const isItemized = isItemizedRecord(record.items.length);
        return record.items.map((item, itemIdx) => {
          const showHorLine = itemIdx === record.items.length - 1;
          const recordDate =
            itemIdx === 0 ? record.recordDate : item.recordDate;
          const isItemizedParent = isItemized && itemIdx === 0;
          const displayMerchant =
            itemIdx === 0 && isUseMerchant(record.merchantUsage);

          return (
            <div
              key={`${record.recordId}_${item.itemId}`}
              className={`${ROOT}__record-content-row`}
            >
              {this.renderDate(recordDate, ccCssClass, itemIdx)}
              {this.renderExpType(item.expTypeName, ccCssClass)}
              {this.renderTaxExclAmount(item, ccCssClass)}
              {this.renderTax(item, isItemized, itemIdx, ccCssClass)}
              {this.renderAmount(item, ccCssClass)}
              {isEmpty(ccCssClass) &&
                this.renderCostCenter(
                  item.costCenterName || report.costCenterName,
                  item.costCenterCode || report.costCenterCode
                )}
              {this.renderDetail(record, item.remarks, ccCssClass)}
              {displayMerchant && this.renderMerchant(item.merchant)}
              {!isItemizedParent && this.renderExtendedItems(item)}
              {showHorLine && <hr />}
            </div>
          );
        });
      })}
    </div>
  );

  render() {
    const { selectedReportType } = this.props;
    const ccRequirement =
      selectedReportType && selectedReportType.isCostCenterRequired;
    const isCostCenterVisible = ccRequirement && ccRequirement !== 'UNUSED';
    const ccCssClass = isCostCenterVisible
      ? {}
      : { 'without-cost-center': true };

    return (
      <div className={ROOT}>
        <div className={`${ROOT}__record-header`}>
          <div
            className={classNames(`${ROOT}__record-header`, 'date', ccCssClass)}
          >
            {msg().Exp_Clbl_Date}
          </div>
          <div
            className={classNames(
              `${ROOT}__record-header`,
              'expense-type',
              ccCssClass
            )}
          >
            {msg().Exp_Clbl_ExpenseType}
          </div>
          <div
            className={classNames(
              `${ROOT}__record-header`,
              'excl-tax',
              ccCssClass
            )}
          >
            {msg().Exp_Lbl_ExclTax}
          </div>
          <div
            className={classNames(`${ROOT}__record-header`, 'tax', ccCssClass)}
          >
            {msg().Exp_Lbl_TaxAmount}
          </div>
          <div
            className={classNames(
              `${ROOT}__record-header`,
              'amount',
              ccCssClass
            )}
          >
            {msg().Exp_Clbl_Amount}
          </div>
          {isCostCenterVisible && (
            <div
              className={classNames(`${ROOT}__record-header`, 'cost-center')}
            >
              {msg().Exp_Clbl_CostCenter}
            </div>
          )}
          <div
            className={classNames(
              `${ROOT}__record-header`,
              'detail',
              ccCssClass
            )}
          >
            {msg().Exp_Lbl_Detail}
          </div>
        </div>
        <hr />
        <div className={`${ROOT}__record-content`}>
          {this.renderReport(this.props.report, ccCssClass)}
        </div>
      </div>
    );
  }
}
