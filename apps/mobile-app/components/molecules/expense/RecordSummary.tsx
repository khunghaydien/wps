import * as React from 'react';

import classNames from 'classnames';
import get from 'lodash/get';
import isNil from 'lodash/isNil';

import ImgIconAttention from '../../../../commons/images/icons/attention.svg';
import transitIcon from '../../../../commons/images/transit-icon.png';
import DateUtil from '../../../../commons/utils/DateUtil';

import { Record, RECORD_TYPE } from '../../../../domain/models/exp/Record';

import Amount from '../../atoms/Amount';
import Icon from '../../atoms/Icon';
import JorudanRouteInfoSummary from './JorudanRouteInfoSummary';

import './RecordSummary.scss';

const ROOT = 'mobile-app-molecules-expense-record-summary';

export type Props = Readonly<{
  className?: string;
  record: Record;
  currencyDecimalPlaces: number;
  currencySymbol: string;
}>;

export default class RecordSummary extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    const { record, currencyDecimalPlaces, currencySymbol } = this.props;
    const firstItem =
      !isNil(record.items) && !isNil(record.items[0]) ? record.items[0] : null;
    const isForeignCurrency = get(record, 'items.0.useForeignCurrency');
    const foreignCurrencyClass = classNames({
      'foreign-currency': isForeignCurrency,
    });
    const { ocrAmount, ocrDate, amount, recordDate, remarks = '' } = record;
    const showAmountWarning = !isNil(ocrAmount) && ocrAmount !== amount;
    const showDateWarning = !isNil(ocrDate) && ocrDate !== recordDate;

    return (
      <div className={className}>
        <div className={`${ROOT}__subject ${foreignCurrencyClass}`}>
          {firstItem && firstItem.expTypeName}
          {record.recordType === RECORD_TYPE.TransitJorudanJP && (
            <div className={`${ROOT}__subject__transit-proof`}>
              <img src={transitIcon} alt="transit" />
            </div>
          )}
          {record.recordType === RECORD_TYPE.FixedAllowanceMulti &&
            ` : ${record.items[0].fixedAllowanceOptionLabel || ''}`}
        </div>
        <div className={`${ROOT}__content`}>
          {record.routeInfo ? (
            <JorudanRouteInfoSummary routeInfo={record.routeInfo} />
          ) : (
            remarks
          )}
        </div>
        <div className={`${ROOT}__bottom`}>
          <div className={`${ROOT}__bottom__date`}>
            <div className={`${ROOT}__bottom__date-icon`}>
              <Icon type="event-copy" size="small" />
            </div>
            {DateUtil.dateFormat(record.recordDate)}
            {showDateWarning && (
              <ImgIconAttention className={`${ROOT}__bottom__alert__appear`} />
            )}
          </div>
          <div className={`${ROOT}__bottom-right ${foreignCurrencyClass}`}>
            <Amount
              className={`${ROOT}__bottom__amount`}
              amount={amount}
              decimalPlaces={currencyDecimalPlaces}
              symbol={currencySymbol}
            />
            {showAmountWarning && (
              <div className={`${ROOT}__bottom__alert__container`}>
                <ImgIconAttention
                  className={`${ROOT}__bottom__alert__appear`}
                />
              </div>
            )}
            {isForeignCurrency && (
              <Amount
                className={`${ROOT}__bottom__local-amount`}
                amount={get(firstItem, 'localAmount')}
                decimalPlaces={
                  get(firstItem, 'currencyInfo.decimalPlaces') || 0
                }
                symbol={get(firstItem, 'currencyInfo.symbol') || ''}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
