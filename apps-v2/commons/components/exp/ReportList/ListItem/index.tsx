import React from 'react';

import classNames from 'classnames';
import get from 'lodash/get';

import msg from '@commons/languages';

// import ImgBtnDetailClose from '../../../../images/btnDetailClose.png';
import {
  ReportListItem,
  SETTLEMENT_RESULTS,
} from '../../../../../domain/models/exp/Report';

import DateUtil from '../../../../utils/DateUtil';
import FormatUtil from '../../../../utils/FormatUtil';

import MultiColumnsGrid from '../../../MultiColumnsGrid';
import StatusIcon from './StatusIcon';

import './index.scss';
// import IconButton from '../../../buttons/IconButton';

const ROOT = 'ts-expenses__reports-list-items';

type Props = {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  item: ReportListItem;
  selectedExpReportId?: string;
  onClickReportItem?: (arg0: string, arg1: string, arg2?: string) => void;
};

export default class ExpensesReportListItem extends React.Component<Props> {
  render() {
    const { baseCurrencyDecimal, baseCurrencySymbol, item, onClickReportItem } =
      this.props;
    const totalAmount = FormatUtil.formatNumber(
      item.totalAmount || 0,
      baseCurrencyDecimal
    );

    const handleListItemClick = () => {
      if (onClickReportItem) {
        onClickReportItem(item.status, item.reportId, item.empHistoryId);
      }
    };

    let formattedLocalAmount = `${baseCurrencySymbol} ${totalAmount}`;

    let isSelected =
      (this.props.selectedExpReportId &&
        this.props.selectedExpReportId === item.reportId) ||
      false;

    // if new report is clicked
    if (!item.reportId) {
      formattedLocalAmount = null;
      isSelected = true;
    }

    const listItemClassNames = classNames({
      [`${ROOT}--active`]: isSelected,
      [`${ROOT}`]: true,
    });

    const renderReversalAmount = () => {
      if (item.settResult === SETTLEMENT_RESULTS.REVERSAL) {
        const settlementAmount = get(item, 'settAmount', 0);
        const reversalAmount =
          FormatUtil.formatNumber(settlementAmount, baseCurrencyDecimal) || 0;
        return (
          <div className={`${ROOT}-reversal`}>{`${
            msg().Exp_Lbl_Reversal
          }: ${baseCurrencySymbol}${reversalAmount}`}</div>
        );
      }
      return null;
    };

    // disabling eslint rule because we need to nest IconButton inside this clickable div

    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      <div onClick={handleListItemClick} className={listItemClassNames}>
        <MultiColumnsGrid sizeList={[2, 2, 2, 4, 2]}>
          <div className={`${ROOT}-status`}>
            <StatusIcon item={item} />
          </div>

          <div className={`${ROOT}-date`}>
            {item.requestDate ? DateUtil.dateFormat(item.requestDate) : ''}
          </div>

          <div className={`${ROOT}-report-type`}>{item.expReportTypeName}</div>

          <div className={`${ROOT}-main`}>
            <div className={`${ROOT}-text`}>
              <div className={`${ROOT}-text__subject`}>{item.subject}</div>
            </div>
          </div>

          <div className={`${ROOT}-amount`}>
            <div>{formattedLocalAmount}</div>
            {renderReversalAmount()}
          </div>

          {/* temporally hidden */}
          {/* <div className={`${ROOT}-toggle`}>
           <IconButton
             className={`${ROOT}-detail-btn`}
             src={ImgBtnDetailClose}
             onClick={() => {}}
           />
          </div> */}
        </MultiColumnsGrid>
      </div>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions */
  }
}
