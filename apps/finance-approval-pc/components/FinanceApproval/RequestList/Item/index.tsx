import React from 'react';

import classNames from 'classnames';

import MultiColumnsGrid from '../../../../../commons/components/MultiColumnsGrid';
import DateUtil from '../../../../../commons/utils/DateUtil';
import FormatUtil from '../../../../../commons/utils/FormatUtil';

import { RequestItem } from '../../../../../domain/models/exp/FinanceApproval';

import { getStatusText } from '../../../../../domain/modules/exp/report';

import { CommonProps } from '..';

import './index.scss';

const ROOT = 'ts-finance-approval__requests-item';

export type Props = CommonProps & {
  idx: number;
  item: RequestItem;
};

export default class RequestListItem extends React.Component<Props> {
  render() {
    const { item, idx } = this.props;
    const totalAmount = FormatUtil.formatNumber(
      item.totalAmount || 0,
      Number(this.props.baseCurrencyDecimal)
    );

    const handleListItemClick = () => {
      // to be implemented after get API is completed
      this.props.onClickRequestItem(item.requestId);
    };

    const formattedLocalAmount = `${this.props.baseCurrencySymbol} ${totalAmount}`;
    // const isSelected =
    //   (this.props.selectedExpReportId &&
    //     this.props.selectedExpReportId === item.reportId) ||
    //   false;

    const listItemClassNames = classNames({
      // [`${ROOT}--active`]: isSelected,
      [`${ROOT}`]: true,
    });

    const CELL_CLASS = `${ROOT}-cell ${ROOT}`;

    return (
      <div
        onClick={handleListItemClick}
        className={listItemClassNames}
        data-testid={`${ROOT}-${idx}`}
      >
        <MultiColumnsGrid sizeList={[1, 1, 1, 2, 2, 1, 1, 2, 1]}>
          <div className={`${CELL_CLASS}-reportId`}>{item.reportNo}</div>

          <div className={`${ROOT}-status`}>
            <div className={`${CELL_CLASS}-status-text`}>
              {getStatusText(item.status)}
            </div>
          </div>

          <div className={`${CELL_CLASS}-date`}>
            {DateUtil.format(item.requestDate)}
          </div>

          <div className={`${ROOT}-main`}>
            <div className={`${ROOT}-text`}>
              <div className={`${CELL_CLASS}-text__subject`}>
                {item.subject}
              </div>
            </div>
          </div>

          <div className={`${CELL_CLASS}-report-type`}>
            {item.reportTypeName}
          </div>
          <div className={`${CELL_CLASS}-amount`}>{formattedLocalAmount}</div>

          <div className={`${CELL_CLASS}-cost-center`}>
            {item.costCenterName}
          </div>

          <div className={`${CELL_CLASS}-emp-name`}>{item.employeeName}</div>

          <div className={`${CELL_CLASS}-dep-name`}>{item.departmentName}</div>
        </MultiColumnsGrid>
      </div>
    );
  }
}
