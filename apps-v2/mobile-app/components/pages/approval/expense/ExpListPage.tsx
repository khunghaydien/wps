import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { $Values } from 'utility-types';

import { EXPENSE_APPROVAL_REQUEST } from '@mobile/constants/approvalRequest';

import TSInfiniteScroll from '../../../../../commons/components/TSInifinteScroll';
import msg from '../../../../../commons/languages';
import { ErrorInfo } from '../../../../../commons/utils/AppPermissionUtil';
import EmptyIcon from '../../../molecules/commons/EmptyIcon';
import Navigation from '../../../molecules/commons/Navigation';
import WrapperWithPermission from '../../../organisms/commons/WrapperWithPermission';
import GlobalFooter, {
  PAGE,
} from '@apps/mobile-app/containers/organisms/commons/GlobalFooterContainer';

import {
  ExpRequestList,
  ExpRequestListItem,
} from '../../../../../domain/models/exp/request/Report';

import Icon from '../../../atoms/Icon';
import TextButton from '../../../atoms/TextButton';
import ReportSummaryListItem from '../../../molecules/approval/ReportSummaryListItem';

import './ExpListPage.scss';

const ROOT = 'mobile-app-pages-approval-page-expense-list';

type TagInfo = {
  key: string;
  value: string;
  count: number;
  label: string;
};

type Props = {
  history: RouteComponentProps['history'];
  activeModule: $Values<typeof EXPENSE_APPROVAL_REQUEST>;
  list: ExpRequestList;
  idList: string[];
  currencySymbol: string;
  currencyDecimalPlaces: number;
  employeeId: string;
  hasPermissionError?: ErrorInfo;
  tags: TagInfo[];
  isExpense: boolean;
  onClickReportSummary: (requestId: string) => void;
  onRefresh: () => Promise<ExpRequestList>;
  resetSearchConditon: () => Promise<void>;
  onClickFilterItem: (key: string) => void;
  fetchExpRequestList: (
    ids: string[],
    empId: string,
    isExpense: boolean,
    isUpdate: boolean
  ) => Promise<ExpRequestList>;
  handleModuleChange: (string) => void;
} & React.ComponentProps<typeof ReportSummaryListItem>;

const filterTag = ({ key, label, value, count }, onClickFilterItem) => (
  <div
    key={key}
    className={classnames([`${ROOT}__filter-tag`], {
      highlight: !!count,
    })}
    onClick={() => {
      onClickFilterItem(key);
    }}
  >
    <span className={`${ROOT}__filter-tag-label`}>
      {count === 1 ? value : label}
    </span>
    {count > 1 && <span className={'count-icon'}>{count}</span>}
    <Icon type="down" size="small" />
  </div>
);

export const REPORT_PER_PAGE = 10;

const ExpListPage = (props: Props) => {
  const {
    list,
    idList,
    currencyDecimalPlaces,
    currencySymbol,
    employeeId,
    fetchExpRequestList,
  } = props;

  const fetchData = () => {
    const noOfLoaded = list.length;
    const fetchReportIds = idList.slice(
      noOfLoaded,
      noOfLoaded + REPORT_PER_PAGE
    );
    if (!isEmpty(fetchReportIds)) {
      fetchExpRequestList(fetchReportIds, employeeId, props.isExpense, false);
    }
  };

  const renderSearchArea = (tags: TagInfo[]) => (
    <div className={`${ROOT}__search-area`}>
      {tags.map((tag) => filterTag(tag, props.onClickFilterItem))}
      <TextButton
        className={`${ROOT}__search-area-reset`}
        type="submit"
        onClick={props.resetSearchConditon}
      >
        {msg().Com_Lbl_ResetAll}
      </TextButton>
    </div>
  );

  const requestList = list.map((item: ExpRequestListItem) => (
    <ReportSummaryListItem
      key={item.reportNo}
      requestType="expense"
      // @ts-ignore
      report={item}
      className={`${ROOT}__item`}
      onClick={() => props.onClickReportSummary(item.requestId)}
      decimalPlaces={currencyDecimalPlaces}
      symbol={currencySymbol}
    />
  ));

  return (
    <WrapperWithPermission
      className={ROOT}
      hasPermissionError={props.hasPermissionError}
    >
      <Navigation title={msg().Appr_Lbl_Approval} />
      <div className="main-content">
        {renderSearchArea(props.tags)}
        <div className={`${ROOT}__count`}>
          <div className={`${ROOT}__num`}>
            {`${idList.length} ${msg().Appr_Lbl_RecordCount}`}
          </div>
        </div>
        <div className={`${ROOT}__list`} id="scrollableDiv">
          <TSInfiniteScroll
            totalCount={idList.length}
            fetchedCount={list.length}
            fetchData={fetchData}
            endMsg={msg().Com_Lbl_NoMoreRecord}
            isRefreshEnabled
            refreshData={props.onRefresh}
            scrollableTargetId="scrollableDiv"
            child={requestList}
          />
          {isEmpty(idList) && (
            <EmptyIcon
              className={`${ROOT}__empty`}
              message={msg().Appr_Msg_EmptyRequestList}
            />
          )}
        </div>
      </div>
      <GlobalFooter
        history={props.history}
        activeTab={props.activeModule}
        handleTabChange={props.handleModuleChange}
        page={PAGE.expenseApproval}
      />
    </WrapperWithPermission>
  );
};

export default ExpListPage;
