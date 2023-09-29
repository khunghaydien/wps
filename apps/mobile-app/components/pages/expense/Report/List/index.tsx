import React, { useState } from 'react';

import isEmpty from 'lodash/isEmpty';

import TSInfiniteScroll from '../../../../../../commons/components/TSInifinteScroll';
import msg from '../../../../../../commons/languages';
import { State as UserSetting } from '../../../../../../commons/reducers/userSetting';
import { ErrorInfo } from '../../../../../../commons/utils/AppPermissionUtil';
import EmptyIcon from '../../../../molecules/commons/EmptyIcon';
import Navigation from '../../../../molecules/commons/Navigation';
import WrapperWithPermission from '../../../../organisms/commons/WrapperWithPermission';

import {
  REPORT_PER_PAGE_MOBILE,
  ReportIdList,
  ReportList,
} from '../../../../../../domain/models/exp/Report';

import {
  LIST_TYPE,
  ListType,
} from '@mobile/modules/expense/ui/report/listType';

import Button from '../../../../atoms/Button';
import IconButton from '../../../../atoms/IconButton';
import Spinner from '../../../../atoms/Spinner';
import ReportSummaryListItem from '../../../../molecules/expense/ReportSummaryListItem';
import InfoDialog from './infoDialog';

import './index.scss';

const ROOT = 'mobile-app-pages-expense-page-report-list';

type Props = {
  openDetail: (id: string, status: string, requestId?: string) => void;
  userSetting: UserSetting;
  reportList: ReportList;
  reportIdList: ReportIdList;
  hasPermissionError: ErrorInfo | null;
  reportListType: ListType;
  onClickNewReport: () => void;
  onRefresh: () => Promise<ReportList>;
  onClickApprovedList: () => void;
  onClickBack: () => void;
  getReportList: (
    reportIds: ReportIdList,
    loadInBackground: boolean
  ) => Promise<ReportList>;
  isRequest?: boolean;
};
const ReportListPage = (props: Props) => {
  const { reportList, reportIdList, userSetting, isRequest } = props;

  const [isShowInfo, setShowInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isApprovedList = props.reportListType === LIST_TYPE.Approved;

  const openDetail = (id: string, status: string, requestId?: string) => {
    return () => {
      props.openDetail(id, status, requestId);
    };
  };

  const refreshData = () => {
    setIsLoading(true);
    props.onRefresh().then(() => setIsLoading(false));
  };

  const fetchData = () => {
    const noOfLoaded = reportList.length;
    const fetchReportIds = reportIdList.slice(
      noOfLoaded,
      noOfLoaded + REPORT_PER_PAGE_MOBILE
    );
    if (!isEmpty(fetchReportIds)) {
      props.getReportList(fetchReportIds, true);
    }
  };

  const navActions = [
    ...(!isApprovedList
      ? [
          <IconButton
            className={`${ROOT}__approved`}
            icon="approved"
            onClick={props.onClickApprovedList}
          />,
        ]
      : []),
    <IconButton
      className={`${ROOT}__info`}
      icon="info_alt"
      onClick={() => setShowInfo(true)}
    />,
  ];

  const list = reportList.map((item, idx) => (
    <div key={idx} className={`${ROOT}__row`}>
      <ReportSummaryListItem
        onClick={openDetail(item.reportId, item.status, item.requestId)}
        report={item}
        decimalPlaces={userSetting.currencyDecimalPlaces}
        symbol={userSetting.currencySymbol}
      />
    </div>
  ));
  const pageTitle = isApprovedList
    ? isRequest
      ? msg().Exp_Lbl_ApprovedRequests
      : msg().Exp_Lbl_ApprovedReports
    : isRequest
    ? msg().Exp_Lbl_Requests
    : msg().Exp_Lbl_Reports;

  return (
    <WrapperWithPermission
      className={ROOT}
      hasPermissionError={props.hasPermissionError}
    >
      <Navigation
        title={pageTitle}
        actions={navActions}
        onClickBack={isApprovedList && props.onClickBack}
      />
      <div className="main-content" id="scrollableDiv">
        {isLoading && <Spinner size="medium" />}
        <TSInfiniteScroll
          totalCount={reportIdList.length}
          fetchedCount={reportList.length}
          fetchData={fetchData}
          isRefreshEnabled
          refreshData={refreshData}
          scrollableTargetId="scrollableDiv"
          marginBottom={70}
          child={list}
        />
        {!reportIdList.length && (
          <EmptyIcon
            className={`${ROOT}__empty`}
            message={msg().Exp_Msg_NoReportFound}
          />
        )}
        {!isApprovedList && (
          <div className={`${ROOT}__button-new-report`}>
            <Button
              variant="add"
              priority="secondary"
              onClick={props.onClickNewReport}
            >
              {isRequest ? msg().Att_Lbl_NewRequest : msg().Exp_Btn_NewReport}
            </Button>
          </div>
        )}
      </div>
      <InfoDialog isShowInfo={isShowInfo} setShowInfo={setShowInfo} />
    </WrapperWithPermission>
  );
};

export default ReportListPage;
