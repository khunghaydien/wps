import React from 'react';

import classNames from 'classnames';
import get from 'lodash/get';

import MultiColumnsGrid from '../../../../../commons/components/MultiColumnsGrid';
import DateUtil from '../../../../../commons/utils/DateUtil';
import FormatUtil from '../../../../../commons/utils/FormatUtil';
import Tooltip from '@commons/components/Tooltip';
import ImgIconAttention from '@commons/images/icons/attention.svg';

import { getStatusText } from '../../../../../domain/modules/exp/report';

import { CommonProps, Item } from '..';

import './index.scss';

const ROOT = 'ts-finance-approval__requests-item';

export type Props = CommonProps & {
  idx: number;
  isChecked?: boolean;
  isRequestTab: boolean;
  item: Item;
  showCheckbox?: boolean;
  onChangeRowSelection?: (arg0: { id: string; checked: boolean }) => void;
};

export default class RequestListItem extends React.Component<Props> {
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChangeRowSelection({
      id: this.props.item.requestId,
      checked: e.target.checked,
    });
  };

  getVendorTitle = () => {
    const { item } = this.props;
    const reportVendor = item.reportVendor ?? '';
    const recordVendor = [...new Set(item.recordVendor ?? [])];
    const title = reportVendor || recordVendor.join(', ');
    return title;
  };

  renderCheckBox() {
    return (
      <div className={`${ROOT}__checkbox`}>
        <label className={`${ROOT}__input-wrapper`}>
          <input
            type="checkbox"
            onChange={this.onChange}
            checked={this.props.isChecked}
          />
        </label>
      </div>
    );
  }

  renderErrorIcon() {
    const iconClassName = `${ROOT}-item-wrapbox-icon`;
    const errorIconImg = (
      <ImgIconAttention className={`${iconClassName}-appear`} />
    );
    const errorObj = this.props.item.error;
    const tooltip = get(errorObj, 'errors.0.message', '');

    if (!errorObj) return null;
    return (
      <div className={iconClassName}>
        <Tooltip
          id={ROOT}
          align="top left"
          content={
            <div className={`${iconClassName}-tooltip-msg`}>{tooltip}</div>
          }
          className={`${iconClassName}-tooltip`}
        >
          {errorIconImg}
        </Tooltip>
      </div>
    );
  }

  render() {
    const { item, idx, isRequestTab, showCheckbox } = this.props;
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

    const recordVendor = [...new Set(item?.recordVendor || [])];

    return (
      <div className={`${ROOT}__container`}>
        {showCheckbox && this.renderCheckBox()}
        <div
          onClick={handleListItemClick}
          className={listItemClassNames}
          data-testid={`${ROOT}-${idx}`}
        >
          <MultiColumnsGrid sizeList={[2, 2, 1, 1, 1, 3, 1, 1]}>
            <MultiColumnsGrid sizeList={[7, 5]}>
              <div
                className={`${CELL_CLASS}-reportId`}
                title={isRequestTab ? item.requestNo : item.reportNo}
              >
                {isRequestTab ? item.requestNo : item.reportNo}
                {this.renderErrorIcon()}
              </div>

              <div className={`${ROOT}-status`}>
                <div
                  className={`${CELL_CLASS}-status-text`}
                  title={getStatusText(item.status)}
                >
                  {getStatusText(item.status)}
                </div>
              </div>
            </MultiColumnsGrid>

            <MultiColumnsGrid sizeList={[5, 7]}>
              <div className={`${CELL_CLASS}-date`}>
                {DateUtil.format(item.requestDate)}
              </div>

              <div className={`${ROOT}-main`}>
                <div className={`${ROOT}-text`}>
                  <div
                    className={`${CELL_CLASS}-text__subject`}
                    title={item.subject}
                  >
                    {item.subject}
                  </div>
                </div>
              </div>
            </MultiColumnsGrid>

            <div
              className={`${CELL_CLASS}-report-type`}
              title={item.reportTypeName}
            >
              {item.reportTypeName}
            </div>
            <div
              className={`${CELL_CLASS}-amount`}
              title={formattedLocalAmount}
            >
              {formattedLocalAmount}
            </div>

            <div
              className={`${CELL_CLASS}-cost-center`}
              title={item.costCenterName}
            >
              {item.costCenterName}
            </div>
            <MultiColumnsGrid sizeList={[8, 4]}>
              <div
                className={`${CELL_CLASS}-vendor`}
                title={this.getVendorTitle()}
              >
                {item?.reportVendor || recordVendor.join(', ')}
              </div>

              <div
                className={`${CELL_CLASS}-payment-due-date`}
                title={item.paymentDueDate}
              >
                {DateUtil.format(item.paymentDueDate)}
              </div>
            </MultiColumnsGrid>

            <div
              className={`${CELL_CLASS}-emp`}
              title={`${item.employeeName}\n${item.employeeCode ?? ''}`}
            >
              <div className={`${CELL_CLASS}-emp-name`}>
                {item.employeeName}
              </div>
              {item.employeeCode && (
                <div className={`${CELL_CLASS}-emp-code`}>
                  {item.employeeCode}
                </div>
              )}
            </div>

            <div
              className={`${CELL_CLASS}-dep-name`}
              title={item.departmentName}
            >
              {item.departmentName}
            </div>
          </MultiColumnsGrid>
        </div>
      </div>
    );
  }
}
