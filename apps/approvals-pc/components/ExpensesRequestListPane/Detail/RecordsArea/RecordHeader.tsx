import React from 'react';

import classNames from 'classnames';
import { get, isNil } from 'lodash';

import Button from '../../../../../commons/components/buttons/Button';
import Tooltip from '../../../../../commons/components/Tooltip';
import ImgIconAttention from '../../../../../commons/images/icons/attention.svg';
import IconArrowDown from '../../../../../commons/images/icons/iconArrowDown.svg';
import InfoIcon from '../../../../../commons/images/icons/info.svg';
import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import FormatUtil from '../../../../../commons/utils/FormatUtil';
import RouteAttentionIcon from '@apps/commons/components/exp/Form/RecordItem/TransitJorudanJP/RouteMap/RouteAttentionIcon';
import CheckActive from '@commons/images/icons/check-active.svg';
import TextUtil from '@commons/utils/TextUtil';

import {
  isFixedAllowanceMulti,
  isHotelFee,
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
  showCostCenterColumn: boolean;
  baseCurrencySymbol: string;
  baseCurrencyDecimal: number;
  onClickRecordOpenButton: (arg0: string) => void;
  baseCurrencyCode?: string;
};

const ROOT =
  'approvals-pc-expenses-request-pane-detail__records-area-record__header';

const toolTipStyle = { display: 'inline-block' };

const renderWarning = (wholeMsg: string, isMatch: boolean) => {
  const Icon = isMatch ? CheckActive : ImgIconAttention;
  const cssClass = isMatch ? 'ok' : '';
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

  render() {
    const {
      record,
      showCostCenterColumn,
      baseCurrencySymbol,
      baseCurrencyDecimal,
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
    let foreignTotal = null;
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

      foreignTotal = (
        <div className={`${ROOT}__foreign-total`}>
          {`${foreignSymbol || ''} ${foreignAmount}`}
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
          {DateUtil.formatYMD(record.recordDate)}
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
              {this.getCostCenterName()}
            </span>
          </div>
        )}

        <div className={`${ROOT}-excl-tax`}>
          {isForeignCurrency ? (
            <>&mdash;</>
          ) : (
            `${baseCurrencySymbol} ${FormatUtil.formatNumber(
              record.withoutTax,
              baseCurrencyDecimal
            )}`
          )}
        </div>

        <div className={`${ROOT}-tax`}>
          {(isForeignCurrency && <>&mdash;</>) || (
            <>
              <div
                className={`${ROOT}__tax-amount`}
              >{`${baseCurrencySymbol} ${FormatUtil.formatNumber(
                record.items[0].gstVat,
                baseCurrencyDecimal
              )}`}</div>
              {!isHotelFee(record.recordType) && (
                <div className={`${ROOT}-tax-type`}>
                  <div>{`${record.items[0].taxTypeName || ''}`}</div>
                  {`${FormatUtil.convertToDisplayingPercent(
                    record.items[0].taxRate || 0
                  )}`}
                </div>
              )}
            </>
          )}
        </div>

        <div className={`${ROOT}-amount`}>
          {`${baseCurrencySymbol} ${FormatUtil.formatNumber(
            record.amount,
            baseCurrencyDecimal
          )}`}
          {foreignTotal}
        </div>
        {!isNil(record.ocrAmount) &&
          renderWarning(message, status === AMOUNT_MATCH_STATUS.OK)}
      </header>
    );
  }
}
