import React from 'react';

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
  expReportList: ReportList;
  filter?: string;
  isLoading: boolean;
  isRequest?: boolean;
  loadingAreas: string[];
  selectedExpReport: Report;
  fetchExpReportIdList: (
    isApproved: boolean,
    searchConditions: SearchConditions
  ) => void;
  onClickReportItem: () => void;
}) &
  PagerProps &
  PagerInfoProps &
  AdvSearchProps;

export default class ExpensesReportList extends React.Component<Props> {
  componentDidUpdate(prevProps: Props) {
    const { filter, advSearchCondition } = this.props;
    const isApproved = filter === status.APPROVED;
    if (filter && filter !== prevProps.filter) {
      this.props.fetchExpReportIdList(isApproved, advSearchCondition);
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
