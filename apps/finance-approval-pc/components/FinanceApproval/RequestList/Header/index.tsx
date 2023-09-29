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
  orderBy: OrderBy;
  sortBy: SortBy;
  onClickSortKey: (sortKey: SortBy) => void;
};

const ROOT = 'ts-finance-approval__requests-header';

export default class RequestListHeader extends React.Component<Props> {
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

  render() {
    const { onClickSortKey } = this.props;
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
      <MultiColumnsGrid
        className={`${ROOT}`}
        sizeList={[1, 1, 1, 2, 2, 1, 1, 2, 1]}
      >
        <SortableButton sortKey={SORT_BY.ReportNo}>
          {msg().Exp_Lbl_ReportNo}
        </SortableButton>

        <SortableButton sortKey={SORT_BY.Status}>
          {msg().Exp_Lbl_Status}
        </SortableButton>

        <SortableButton sortKey={SORT_BY.RequestDate}>
          {msg().Exp_Lbl_DateSubmitted}
        </SortableButton>

        <div className={`${ROOT}-subject`}>{msg().Exp_Clbl_ReportTitle}</div>

        <SortableButton sortKey={SORT_BY.EmployeeName}>
          {msg().Exp_Clbl_ReportType}
        </SortableButton>

        <SortableButton sortKey={SORT_BY.TotalAmount}>
          {msg().Exp_Clbl_Amount}
        </SortableButton>

        <SortableButton sortKey={SORT_BY.EmployeeName}>
          {msg().Exp_Clbl_CostCenterHeader}
        </SortableButton>

        <SortableButton sortKey={SORT_BY.EmployeeName}>
          {msg().Com_Lbl_EmployeeName}
        </SortableButton>

        <SortableButton sortKey={SORT_BY.DepartmentName}>
          {msg().Com_Lbl_DepartmentName}
        </SortableButton>

        <div />
      </MultiColumnsGrid>
    );
  }
}
