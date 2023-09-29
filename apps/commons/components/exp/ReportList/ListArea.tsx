import React from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import ReportListSearchContainer from '@apps/commons/containers/exp/ReportListAdvSearchContainer';
import { KEYS } from '@commons/modules/exp/ui/reportList/advSearch/detail';

import {
  expenseListArea,
  Report,
  ReportList,
} from '../../../../domain/models/exp/Report';

import TextUtil from '../../../utils/TextUtil';

import msg from '../../../languages';
// Pagination
import PagerInfo from '../../PagerInfo';
import Pagination from '../../Pagination';
import withLoadingHOC from '../../withLoading';
import ListHeader from './ListHeader';
import ListItem from './ListItem';

import './index.scss';

const ROOT = 'ts-expenses__reports';

export type PaginationProps = {
  currentPage: number;
  maxPageNo: number;
  maxSearchNo: number;
  pageSize: number;
  requestTotalNum: number;
  onClickPagerLink: (arg0: number) => void;
};

export type AdvSearchProps = {
  onClickAdvSearchButton: () => void;
  onClickInputValueSubmitDate: () => void;
};

type Props = (PaginationProps & {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  expReportList: ReportList;
  isApproved: boolean;
  isLoading: boolean;
  isRequest?: boolean;
  loadingAreas: string[];
  selectedExpReport: Report;
  onClickReportItem: () => void;
}) &
  AdvSearchProps;

const Lists = ({
  expReportList,
  baseCurrencySymbol,
  baseCurrencyDecimal,
  onClickReportItem,
  selectedExpReport,
  isApproved,
  isRequest,
  isLoading,
}) => {
  const selectedTab = isRequest
    ? msg().Exp_Lbl_RequestTarget
    : msg().Exp_Lbl_Report;
  const loadingMsg = isApproved
    ? TextUtil.template(msg().Exp_Lbl_LoadingApproved, selectedTab)
    : TextUtil.template(msg().Exp_Lbl_LoadingActive, selectedTab);
  if (isNil(expReportList)) {
    return;
  }
  if (isLoading) {
    return <div className={`${ROOT}-list__loading-msg`}>{loadingMsg}</div>;
  }
  if (isEmpty(expReportList)) {
    return isApproved ? (
      <div className={`${ROOT}-list__empty--approved`}>
        {msg().Exp_Msg_NoPassedReportFound}
      </div>
    ) : (
      <div className={`${ROOT}-list__empty--notapproved`}>
        {isRequest
          ? msg().Exp_Msg_CreateNewRequest
          : msg().Exp_Msg_CreateNewReport}
      </div>
    );
  }
  return expReportList.map((item) => (
    <ListItem
      item={item}
      key={item.reportId}
      baseCurrencySymbol={baseCurrencySymbol}
      baseCurrencyDecimal={baseCurrencyDecimal}
      onClickReportItem={onClickReportItem}
      selectedExpReportId={selectedExpReport.reportId}
    />
  ));
};
Lists.displayName = expenseListArea;
const ListWithLoading = withLoadingHOC(Lists);

const ListArea = ({
  baseCurrencyDecimal,
  baseCurrencySymbol,
  currentPage,
  expReportList,
  isApproved,
  isLoading,
  loadingAreas,
  maxPageNo,
  onClickPagerLink,
  onClickReportItem,
  pageSize,
  requestTotalNum,
  selectedExpReport,
  isRequest,
  onClickInputValueSubmitDate,
  onClickAdvSearchButton,
}: Props) => {
  return (
    <div className={ROOT}>
      {!isEmpty(expReportList) && (
        <div className={`${ROOT}-list-pagination`}>
          <Pagination
            className={`${ROOT}-list-pager`}
            currentPage={currentPage}
            totalNum={requestTotalNum}
            displayNum={5}
            pageSize={pageSize}
            onClickPagerLink={(num) => onClickPagerLink(num)}
            maxPageNum={maxPageNo}
            havePagerInfo
          />
        </div>
      )}
      {isApproved && (
        <ReportListSearchContainer
          isRequest={isRequest}
          baseCurrencyDecimal={baseCurrencyDecimal}
          onClickInputValueSubmitDate={onClickInputValueSubmitDate}
          onClickAdvSearchButton={onClickAdvSearchButton}
          baseConditions={[
            KEYS.requestDateRange,
            KEYS.reportType,
            KEYS.title,
            KEYS.amount,
            KEYS.extraConditions,
          ]}
          extraConditions={[KEYS.accountingDate, KEYS.reportNo, KEYS.vendor]}
        />
      )}
      <ListHeader isRequest={isRequest} />
      <div
        className={classNames([`${ROOT}-list`], {
          'empty-list': isEmpty(expReportList) && !isLoading,
        })}
        data-testid={`${ROOT}-list`}
      >
        <ListWithLoading
          isLoading={isLoading}
          loadingAreas={loadingAreas}
          isLoaderOverride
          expReportList={expReportList}
          baseCurrencySymbol={baseCurrencySymbol}
          baseCurrencyDecimal={baseCurrencyDecimal}
          onClickReportItem={onClickReportItem}
          selectedExpReport={selectedExpReport}
          isApproved={isApproved}
          isRequest={isRequest}
        />
        {!isLoading && !isEmpty(expReportList) && (
          <div className={`${ROOT}-list-footer`}>
            <PagerInfo
              className={`${ROOT}-page-info`}
              currentPage={currentPage}
              totalNum={requestTotalNum}
              pageSize={pageSize}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ListArea;
