import * as React from 'react';

import classNames from 'classnames';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';

import ImgIconAttention from '../../../../commons/images/icons/attention.svg';
import transitIcon from '../../../../commons/images/transit-icon.png';
import DateUtil from '../../../../commons/utils/DateUtil';
import Highlight from '@apps/commons/components/exp/Highlight';
import msg from '@commons/languages';

import { Record, RECORD_TYPE } from '../../../../domain/models/exp/Record';
import { ExpRequestRecord } from '@apps/domain/models/exp/request/Report';

import Amount from '../../atoms/Amount';
import Icon from '../../atoms/Icon';
import JorudanRouteInfoSummary from './JorudanRouteInfoSummary';

import './RecordSummary.scss';

const ROOT = 'mobile-app-molecules-expense-record-summary';

export type Props = Readonly<{
  isHighlightDiff?: boolean;
  className?: string;
  record: Record;
  itemIdx?: number;
  preExpRecord?: ExpRequestRecord;
  currencyDecimalPlaces: number;
  currencySymbol: string;
}>;

export default class RecordSummary extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    const {
      record,
      itemIdx = 0,
      currencyDecimalPlaces,
      currencySymbol,
      isHighlightDiff,
      preExpRecord,
    } = this.props;
    const item =
      !isNil(record.items) && !isNil(record.items[itemIdx])
        ? record.items[itemIdx]
        : null;
    const preItem =
      preExpRecord &&
      !isNil(preExpRecord.items) &&
      !isNil(preExpRecord.items[itemIdx])
        ? preExpRecord.items[itemIdx]
        : null;
    let isLocalAmtDiff = false;
    if (preItem) {
      const localAmt = get(item, 'localAmount');
      const preLocalAmt = get(preItem, 'localAmount');
      isLocalAmtDiff = !isEqual(localAmt, preLocalAmt);
    }
    const isForeignCurrency = get(
      record,
      `items.${itemIdx}.useForeignCurrency`
    );
    const foreignCurrencyClass = classNames({
      'foreign-currency': isForeignCurrency,
    });
    const { ocrAmount, ocrDate, remarks = '' } = record;
    const { amount, recordDate } = record.items[itemIdx];
    const isParentItem = itemIdx === 0;

    const showAmountWarning =
      isParentItem && !isNil(ocrAmount) && ocrAmount !== amount;
    const showDateWarning =
      isParentItem && !isNil(ocrDate) && ocrDate !== recordDate;
    const totalAmount = isForeignCurrency ? get(item, 'localAmount') : amount;
    const showNegativeAmountWarning =
      isParentItem && !isNil(totalAmount) && totalAmount < 0;

    const isHighlight = (key: string) => {
      if (!isHighlightDiff) return false;
      const value = get(record, `items.${itemIdx}.${key}`);
      const preValue = get(preExpRecord, `items.${itemIdx}.${key}`);
      return !isEqual(value, preValue);
    };

    const renderExpTypeName = () => {
      const expTypeName = get(item, 'expTypeName');
      const invalidLabel = !get(item, 'expTypeId')
        ? `(${msg().Exp_Lbl_Invalid})`
        : '';
      return isParentItem ? (
        expTypeName
      ) : (
        <Highlight highlight={isHighlight('expTypeName')}>
          {`${expTypeName} ${invalidLabel}`}
        </Highlight>
      );
    };

    return (
      <div className={className}>
        <div className={`${ROOT}__subject ${foreignCurrencyClass}`}>
          {renderExpTypeName()}
          {record.recordType === RECORD_TYPE.TransitJorudanJP && (
            <div className={`${ROOT}__subject__transit-proof`}>
              <img src={transitIcon} alt="transit" />
            </div>
          )}
          {record.recordType === RECORD_TYPE.FixedAllowanceMulti &&
            ` : ${record.items[itemIdx].fixedAllowanceOptionLabel || ''}`}
        </div>
        <div className={`${ROOT}__content`}>
          {record.routeInfo ? (
            <JorudanRouteInfoSummary routeInfo={record.routeInfo} />
          ) : (
            isParentItem && remarks
          )}
        </div>
        <div className={`${ROOT}__bottom`}>
          <Highlight highlight={isHighlight('recordDate')}>
            <div className={`${ROOT}__bottom__date`}>
              <div className={`${ROOT}__bottom__date-icon`}>
                <Icon type="event-copy" size="small" />
              </div>
              {DateUtil.dateFormat(recordDate)}
              {showDateWarning && (
                <ImgIconAttention
                  className={`${ROOT}__bottom__alert__appear`}
                />
              )}
            </div>
          </Highlight>
          <div className={`${ROOT}__bottom-right ${foreignCurrencyClass}`}>
            <div className={`${ROOT}__bottom__amount-warning`}>
              <Highlight highlight={isHighlight('amount')}>
                <Amount
                  className={`${ROOT}__bottom__amount`}
                  amount={amount}
                  decimalPlaces={currencyDecimalPlaces}
                  symbol={currencySymbol}
                />
              </Highlight>
              {showNegativeAmountWarning && (
                <div className={`${ROOT}__bottom__alert__container`}>
                  <ImgIconAttention
                    className={`${ROOT}__bottom__warning__appear`}
                  />
                </div>
              )}
              {showAmountWarning && (
                <div className={`${ROOT}__bottom__alert__container`}>
                  <ImgIconAttention
                    className={`${ROOT}__bottom__alert__appear`}
                  />
                </div>
              )}
            </div>
            {isForeignCurrency && (
              <Highlight highlight={isLocalAmtDiff}>
                <Amount
                  className={`${ROOT}__bottom__local-amount`}
                  amount={get(item, 'localAmount')}
                  decimalPlaces={get(item, 'currencyInfo.decimalPlaces') || 0}
                  symbol={get(item, 'currencyInfo.symbol') || ''}
                />
              </Highlight>
            )}
          </div>
        </div>
      </div>
    );
  }
}
