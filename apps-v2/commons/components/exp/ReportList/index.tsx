import React from 'react';

import isEqual from 'lodash/isEqual';

import {
  Report,
  ReportList,
  SearchConditions,
  status,
} from '../../../../domain/models/exp/Report';

// Pagination
import { Props as PagerInfoProps } from '../../PagerInfo';
import { Props as PagerProps } from '../../Pagination';
import ListArea, { AdvSearchProps, PaginationProps } from './ListArea';

import './index.scss';

type Props = (PaginationProps & {
  advSearchCondition: SearchConditions;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  employeeId?: string;
  expReportList: ReportList;
  filter?: string;
  isLoading: boolean;
  isRequest?: boolean;
  loadingAreas: string[];
  selectedExpReport: Report;
  subroleIds?: Array<string>;
  tabCompanyId?: string;
  isProxyMode?: boolean;
  fetchExpReportIdList: (
    isApproved: boolean,
    searchConditions: SearchConditions,
    initialize?: boolean
  ) => void;
  onClickReportItem: () => void;
}) &
  PagerProps &
  PagerInfoProps &
  AdvSearchProps;

export default class ExpensesReportList extends React.Component<Props> {
  componentDidUpdate(prevProps: Props) {
    const { filter, advSearchCondition, subroleIds } = this.props;
    const isApproved = filter === status.APPROVED;
    if (
      (filter && filter !== prevProps.filter) ||
      (!isEqual(subroleIds, prevProps.subroleIds) && !this.props.isProxyMode) ||
      !isEqual(this.props.employeeId, prevProps.employeeId)
    ) {
      this.props.fetchExpReportIdList(
        isApproved,
        advSearchCondition,
        this.props.tabCompanyId !== prevProps.tabCompanyId
      );
    }
  }

  render() {
    const {
      filter,
      requestTotalNum,
      maxPageNo,
      maxSearchNo,
      onClickPagerLink,
      isLoading,
      isRequest,
      loadingAreas,
    } = this.props;

    const isApproved = filter === status.APPROVED;

    return (
      <ListArea
        isLoading={isLoading}
        loadingAreas={loadingAreas}
        baseCurrencyDecimal={this.props.baseCurrencyDecimal}
        baseCurrencySymbol={this.props.baseCurrencySymbol}
        currentPage={this.props.currentPage}
        expReportList={this.props.expReportList}
        isApproved={isApproved}
        maxPageNo={maxPageNo}
        maxSearchNo={maxSearchNo}
        onClickPagerLink={onClickPagerLink}
        onClickReportItem={this.props.onClickReportItem}
        pageSize={this.props.pageSize}
        requestTotalNum={requestTotalNum}
        selectedExpReport={this.props.selectedExpReport}
        isRequest={isRequest}
        onClickInputValueSubmitDate={this.props.onClickInputValueSubmitDate}
        onClickAdvSearchButton={this.props.onClickAdvSearchButton}
      />
    );
  }
}
