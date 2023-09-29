import React from 'react';

import classNames from 'classnames';

import MultiColumnsGrid from '../../../../../commons/components/MultiColumnsGrid';
import iconArrowDown from '../../../../../commons/images/iconArrowDown2.png';
import msg from '../../../../../commons/languages';

import {
  ORDER_BY,
  OrderBy,
  SORT_BY,
  SortBy,
} from '../../../../../domain/models/exp/FinanceApproval';

import './index.scss';

export type Props = {
  isCheckedAll?: boolean;
  isRequestTab: boolean;
  orderBy: OrderBy;
  showCheckboxAll?: boolean;
  sortBy: SortBy;
  onChangeRowSelection?: (arg0: { id: string; checked: boolean }) => void;
  onClickSortKey: (sortKey: SortBy) => void;
};

const ROOT = 'ts-finance-approval__requests-header';

export default class RequestListHeader extends React.Component<Props> {
  onChangeCheckboxAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChangeRowSelection({
      id: '',
      checked: e.target.checked,
    });
  };

  renderSortIcon = (sortKey: SortBy) => {
    // Display just sort icon which search condition currently
    // Else, display when only hover
    const iconCssName = classNames({
      [`${ROOT}__icon`]: true,
      [`${ROOT}__icon--unvisible`]: sortKey !== this.props.sortBy,
      [`${ROOT}__icon--isSorted`]:
        sortKey === this.props.sortBy && this.props.orderBy === ORDER_BY.Desc,
    });

    return <img className={iconCssName} src={iconArrowDown} alt="sortIcon" />;
  };

  renderSelectAll() {
    return (
      <div className={`${ROOT}__checkbox`}>
        <label className={`${ROOT}__input-wrapper`}>
          <input
            type="checkbox"
            onChange={this.onChangeCheckboxAll}
            checked={this.props.isCheckedAll}
          />
        </label>
      </div>
    );
  }

  render() {
    const { isRequestTab, onClickSortKey, showCheckboxAll } = this.props;
    const SortableButton = (props) => {
      let customClass = '';
      if (props.children === msg().Exp_Clbl_Amount) {
        customClass = `${ROOT}__amount`;
      }

      return (
        <button
          className={`${ROOT}__sort-button ${customClass}`}
          onClick={() => onClickSortKey(props.sortKey)}
        >
          {props.children} {this.renderSortIcon(props.sortKey)}
        </button>
      );
    };

    return (
      <div className={`${ROOT}__container`}>
        {showCheckboxAll && this.renderSelectAll()}
        <MultiColumnsGrid
          className={`${ROOT}`}
          sizeList={[2, 2, 1, 1, 1, 3, 1, 1]}
        >
          <MultiColumnsGrid sizeList={[7, 5]}>
            <SortableButton
              sortKey={isRequestTab ? SORT_BY.RequestNo : SORT_BY.ReportNo}
            >
              {isRequestTab
                ? msg().Appr_Lbl_TAndERequestNumber
                : msg().Exp_Lbl_ReportNo}
            </SortableButton>

            <SortableButton sortKey={SORT_BY.Status}>
              {msg().Exp_Lbl_Status}
            </SortableButton>
          </MultiColumnsGrid>
          <MultiColumnsGrid sizeList={[5, 7]}>
            <SortableButton sortKey={SORT_BY.RequestDate}>
              {msg().Exp_Lbl_DateSubmitted}
            </SortableButton>

            <div className={`${ROOT}-subject`}>
              {msg().Exp_Clbl_ReportTitle}
            </div>
          </MultiColumnsGrid>
          <SortableButton sortKey={SORT_BY.EmployeeName}>
            {msg().Exp_Clbl_ReportType}
          </SortableButton>
          <SortableButton sortKey={SORT_BY.TotalAmount}>
            {msg().Exp_Clbl_Amount}
          </SortableButton>
          <SortableButton sortKey={SORT_BY.EmployeeName}>
            {msg().Exp_Clbl_CostCenterHeader}
          </SortableButton>
          <MultiColumnsGrid sizeList={[8, 4]}>
            <div className={`${ROOT}__vendor`}>{msg().Exp_Clbl_Vendor}</div>

            <div className={`${ROOT}__payment-due-date`}>
              {msg().Exp_Lbl_PaymentDate}
            </div>
          </MultiColumnsGrid>
          <SortableButton sortKey={SORT_BY.EmployeeName}>
            {msg().Com_Lbl_EmployeeName}
          </SortableButton>
          <SortableButton sortKey={SORT_BY.DepartmentName}>
            {msg().Com_Lbl_DepartmentName}
          </SortableButton>
        </MultiColumnsGrid>
      </div>
    );
  }
}
