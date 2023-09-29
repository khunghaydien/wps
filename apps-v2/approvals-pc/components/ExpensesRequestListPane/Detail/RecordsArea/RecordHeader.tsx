import React from 'react';

import classNames from 'classnames';
import { get, isEqual, isNil } from 'lodash';

import Button from '../../../../../commons/components/buttons/Button';
import Tooltip from '../../../../../commons/components/Tooltip';
import ImgIconAttention from '../../../../../commons/images/icons/attention.svg';
import IconArrowDown from '../../../../../commons/images/icons/iconArrowDown.svg';
import InfoIcon from '../../../../../commons/images/icons/info.svg';
import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import FormatUtil from '../../../../../commons/utils/FormatUtil';
import RouteAttentionIcon from '@apps/commons/components/exp/Form/RecordItem/TransitJorudanJP/RouteMap/RouteAttentionIcon';
import Highlight from '@apps/commons/components/exp/Highlight';
import CheckActive from '@commons/images/icons/check-active.svg';
import TextUtil from '@commons/utils/TextUtil';

import {
  isFixedAllowanceMulti,
  RECORD_TYPE,
} from '../../../../../domain/models/exp/Record';
import {
  ExpRequest,
  ExpRequestRecord,
} from '../../../../../domain/models/exp/request/Report';
import {
  AMOUNT_MATCH_STATUS,
  generateOCRAmountMsg,
} from '@apps/domain/models/exp/Receipt';

import './RecordHeader.scss';

type Props = {
  isOpen: boolean;
  report: ExpRequest;
  record: ExpRequestRecord;
  preExpReport?: ExpRequest;
  preExpRecord?: ExpRequestRecord;
  showCostCenterColumn: boolean;
  baseCurrencySymbol: string;
  baseCurrencyDecimal: number;
  onClickRecordOpenButton: (arg0: string) => void;
  baseCurrencyCode?: string;
  isHighlightDiff?: boolean;
};

const ROOT =
  'approvals-pc-expenses-request-pane-detail__records-area-record__header';

const toolTipStyle = { display: 'inline-block' };

export const renderWarning = (
  wholeMsg: string,
  isMatch: boolean,
  isWarning?: boolean
) => {
  const Icon = isMatch ? CheckActive : ImgIconAttention;
  const cssClass = isMatch ? 'ok' : isWarning ? 'warning' : '';
  return (
    <div className={`${ROOT}-amount-field-input-feedback`}>
      <Tooltip
        align="top right"
        content={<div className={`${ROOT}__tooltipMsg`}>{wholeMsg}</div>}
        style={toolTipStyle}
      >
        <Icon className={`${ROOT}__appear ${cssClass}`} />
      </Tooltip>
    </div>
  );
};

export default class RecordHeader extends React.Component<Props> {
  getCostCenterName() {
    const { report, record } = this.props;
    const [recordItem] = record.items;
    return recordItem.costCenterHistoryId
      ? recordItem.costCenterName
      : report.costCenterName;
  }

  isCostCenterDiff() {
    if (!this.props.isHighlightDiff) return false;
    const ccName = this.getCostCenterName();
    const { preExpReport, preExpRecord } = this.props;
    if (!preExpRecord || !preExpReport) return false;
    const [recordItem] = preExpRecord.items;
    const preValue = recordItem.costCenterHistoryId
      ? recordItem.costCenterName
      : preExpReport.costCenterName;
    return !isEqual(preValue, ccName);
  }

  render() {
    const {
      record,
      showCostCenterColumn,
      baseCurrencySymbol,
      baseCurrencyDecimal,
      isHighlightDiff,
      preExpRecord,
    } = this.props;
    const headerClass = classNames(`${ROOT}`, {
      [`${ROOT}--is-open`]: this.props.isOpen,
    });

    const buttonClass = classNames(`${ROOT}__toggle`, {
      [`${ROOT}__toggle--is-open`]: this.props.isOpen,
    });

    const expTypeClass = classNames(`${ROOT}-exp-type`, {
      [`${ROOT}-exp-type-expand`]: !this.props.showCostCenterColumn,
    });

    const fixedAmountLabel =
      (isFixedAllowanceMulti(record.recordType) &&
        get(record, 'items[0].fixedAllowanceOptionLabel')) ||
      '';

    const expTypeAmountLabel = fixedAmountLabel && ` : ${fixedAmountLabel}`;

    const isForeignCurrency = record.items[0].useForeignCurrency;
    const preExpIsForeignCurrency =
      preExpRecord && preExpRecord.items[0].useForeignCurrency;
    let foreignTotal = null;
    let foreignTotalDiff = null;
    if (isForeignCurrency) {
      const foreignSymbol = get(record, 'items.0.currencyInfo.symbol', '');
      const foreignDecimal = get(
        record,
        'items.0.currencyInfo.decimalPlaces',
        0
      );
      const foreignAmount = FormatUtil.formatNumber(
        record.items[0].localAmount,
        foreignDecimal
      );

      if (this.props.isHighlightDiff && preExpIsForeignCurrency) {
        const preExpForeignDecimal = get(
          preExpRecord,
          'items.0.currencyInfo.decimalPlaces',
          0
        );
        foreignTotalDiff = FormatUtil.formatNumber(
          preExpRecord.items[0].localAmount,
          preExpForeignDecimal
        );
      }

      foreignTotal = (
        <div className={`${ROOT}__foreign-total`}>
          <Highlight
            className={`${ROOT}-highlight`}
            highlight={
              isHighlightDiff && !isEqual(foreignAmount, foreignTotalDiff)
            }
          >
            <div className={`${ROOT}-ellipsis`}>
              {`${foreignSymbol || ''} ${foreignAmount}`}
            </div>
          </Highlight>
        </div>
      );
    }

    const { status, message } = generateOCRAmountMsg(
      record.ocrAmount,
      record.amount,
      baseCurrencyDecimal,
      'Exp_Clbl_Amount'
    );
    const dateBaseMsg =
      record.ocrDate === record.recordDate
        ? msg().Exp_Msg_MatchedWithReceipt
        : msg().Exp_Msg_ManuallyEntered;
    const dateMsg = TextUtil.template(dateBaseMsg, msg().Exp_Clbl_Date);
    const isCheckHighlight = isHighlightDiff && preExpRecord;
    const isAmountDiff =
      isCheckHighlight &&
      preExpRecord &&
      !isEqual(record.amount, preExpRecord.amount);
    const isDateDiff =
      isCheckHighlight && !isEqual(record.recordDate, preExpRecord.recordDate);
    const isAmountWOTaxDiff =
      isCheckHighlight && !isEqual(record.withoutTax, preExpRecord.withoutTax);
    const isTaxDiff =
      isCheckHighlight &&
      !isEqual(record.items[0].gstVat, preExpRecord.items[0].gstVat);
    const isTaxTypeDiff =
      isCheckHighlight &&
      !isEqual(record.items[0].taxTypeName, preExpRecord.items[0].taxTypeName);
    const isNegative = !isNil(record.amount) && record.amount < 0;

    return (
      <header className={headerClass}>
        <Button
          type="default"
          className={buttonClass}
          data-testid={`${ROOT}__button-toggle`}
          onClick={() => this.props.onClickRecordOpenButton(record.recordId)}
          aria-expanded={this.props.isOpen}
          aria-controls={record.recordId}
        >
          <IconArrowDown aria-hidden="true" />
        </Button>
        <div className={`${ROOT}-date`}>
          <Highlight className={`${ROOT}-highlight`} highlight={isDateDiff}>
            {DateUtil.formatYMD(record.recordDate)}
          </Highlight>
          {!isNil(record.ocrDate) &&
            renderWarning(dateMsg, record.ocrDate === record.recordDate)}
        </div>
        <div className={expTypeClass}>
          <span
            className={`${ROOT}-exp-type-name`}
          >{`${record.items[0].expTypeName}${expTypeAmountLabel}`}</span>
          {record.items[0].expTypeDescription && (
            <div className={`${ROOT}-exp-type-info`}>
              <Tooltip
                align="top"
                content={`${record.items[0].expTypeDescription}`}
              >
                <InfoIcon />
              </Tooltip>
            </div>
          )}
          {record.recordType === RECORD_TYPE.TransitJorudanJP && (
            <RouteAttentionIcon
              item={record.routeInfo.selectedRoute}
              isRoundTrip={get(record, 'routeInfo.roundTrip', false)}
              isApproval
            />
          )}
          {record.routeInfo &&
            record.routeInfo.origin &&
            record.routeInfo.arrival && (
              <div className={`${ROOT}-route-from-to`}>
                {record.routeInfo.origin.name}
                &nbsp;-&nbsp;
                {record.routeInfo.arrival.name}
              </div>
            )}
        </div>

        {showCostCenterColumn && (
          <div className={`${ROOT}-cost-center`}>
            <span className={`${ROOT}-cost-center-name`}>
              <Highlight highlight={this.isCostCenterDiff()}>
                {this.getCostCenterName()}
              </Highlight>
            </span>
          </div>
        )}

        <div className={`${ROOT}-excl-tax`}>
          {isForeignCurrency ? (
            <>&mdash;</>
          ) : (
            <Highlight
              className={`${ROOT}-highlight`}
              highlight={isAmountWOTaxDiff}
            >
              <div className={`${ROOT}-ellipsis`}>
                {`${baseCurrencySymbol}
                ${FormatUtil.formatNumber(
                  record.withoutTax,
                  baseCurrencyDecimal
                )}`}
              </div>
            </Highlight>
          )}
        </div>

        <div className={`${ROOT}-tax`}>
          {(isForeignCurrency && <>&mdash;</>) || (
            <>
              {(() => {
                const recordItem = record.items[0];
                const isMultipleTax = recordItem?.taxItems?.length > 0;

                if (isMultipleTax) {
                  const preRecordItem = preExpRecord?.items?.[0];

                  return (
                    <>
                      <div className={`${ROOT}-tax-amount-container`}>
                        <Highlight
                          className={`${ROOT}-highlight`}
                          highlight={isTaxDiff}
                        >
                          <div className={`${ROOT}-ellipsis`}>
                            {`${baseCurrencySymbol} ${FormatUtil.formatNumber(
                              record.items[0].gstVat,
                              baseCurrencyDecimal
                            )}`}
                          </div>
                        </Highlight>
                      </div>
                      {recordItem?.taxItems.map((taxItem, taxItemIdx) => {
                        const {
                          taxRate: previousTaxRate,
                          gstVat: previousGstVat,
                        } = preRecordItem?.taxItems?.[taxItemIdx] || {};

                        return (
                          <div
                            className={`${ROOT}-tax-type`}
                            key={`${
                              taxItem.taxTypeHistoryId
                            }-${taxItemIdx.toString()}`}
                          >
                            <Highlight
                              className={classNames(
                                `${ROOT}-highlight`,
                                `${ROOT}-highlight-taxtype`
                              )}
                              highlight={
                                isCheckHighlight &&
                                previousTaxRate !== undefined &&
                                previousTaxRate !== taxItem.taxRate
                              }
                            >
                              {`(${FormatUtil.convertToDisplayingPercent(
                                taxItem.taxRate || 0
                              )})`}
                            </Highlight>

                            <Highlight
                              className={classNames(
                                `${ROOT}-highlight`,
                                `${ROOT}-highlight-taxtype`
                              )}
                              highlight={
                                isCheckHighlight &&
                                previousGstVat !== undefined &&
                                previousGstVat !== taxItem.gstVat
                              }
                            >
                              {`${baseCurrencySymbol} ${FormatUtil.formatNumber(
                                taxItem.gstVat,
                                baseCurrencyDecimal
                              )}`}
                            </Highlight>
                          </div>
                        );
                      })}
                    </>
                  );
                }
                return (
                  <>
                    <div className={`${ROOT}-tax-amount-container`}>
                      <Highlight
                        className={`${ROOT}-highlight`}
                        highlight={isTaxDiff}
                      >
                        <div className={`${ROOT}-ellipsis`}>
                          {`${baseCurrencySymbol} ${FormatUtil.formatNumber(
                            record.items[0].gstVat,
                            baseCurrencyDecimal
                          )}`}
                        </div>
                      </Highlight>
                    </div>
                    <Highlight
                      className={classNames(
                        `${ROOT}-highlight`,
                        `${ROOT}-highlight-taxtype`
                      )}
                      highlight={isTaxTypeDiff}
                    >
                      <div className={`${ROOT}-tax-type`}>
                        <div>{`${record.items[0].taxTypeName || ''}`}</div>
                        {`${FormatUtil.convertToDisplayingPercent(
                          record.items[0].taxRate || 0
                        )}`}
                      </div>
                    </Highlight>
                  </>
                );
              })()}
            </>
          )}
        </div>

        <div className={`${ROOT}-amount`}>
          <div className={`${ROOT}-amount-inner`}>
            <Highlight highlight={isAmountDiff} className={`${ROOT}-highlight`}>
              <div className={`${ROOT}-ellipsis`}>
                {`${baseCurrencySymbol} ${FormatUtil.formatNumber(
                  record.amount,
                  baseCurrencyDecimal
                )}`}
              </div>
            </Highlight>
          </div>
          {foreignTotal}
        </div>
        {!isNil(record.ocrAmount) &&
          renderWarning(message, status === AMOUNT_MATCH_STATUS.OK)}
        {isNegative &&
          renderWarning(
            TextUtil.template(
              msg().Exp_Lbl_NegativeAmount,
              isForeignCurrency
                ? msg().Exp_Clbl_LocalAmount
                : msg().Exp_Clbl_IncludeTax
            ),
            false,
            true
          )}
      </header>
    );
  }
}
