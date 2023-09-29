import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

import AppPermissionUtil from '../../../../commons/utils/AppPermissionUtil';
import { showToast } from '@commons/modules/toast';

import {
  REPORT_PER_PAGE_MOBILE,
  ReportIdList,
} from '../../../../domain/models/exp/Report';

import { State } from '../../../modules';
import { actions as ReportActions } from '../../../modules/expense/entities/report';
import { actions as reportIdListActions } from '../../../modules/expense/entities/reportIdList';
import { actions as reportListActions } from '../../../modules/expense/entities/reportList';
import {
  actions as listTypeUIActions,
  LIST_TYPE,
} from '@apps/mobile-app/modules/expense/ui/report/listType';

import { getReportIdList } from '../../../action-dispatchers/expense/ReportIdList';
import { getReportList } from '../../../action-dispatchers/expense/ReportList';

import ReportListPage from '../../../components/pages/expense/Report/List';

type OwnProps = RouteComponentProps;

const ReportListContainer = (ownProps: OwnProps) => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const reportListType = useSelector(
    (state: State) => state.expense.ui.report.listType
  );
  const reportList = useSelector(
    (state: State) => state.expense.entities.reportList
  );
  const reportIdList = useSelector(
    (state: State) => state.expense.entities.reportIdList
  );
  const userSetting = useSelector((state: State) => state.userSetting);
  const employeeDetails = useSelector(
    (state: State) => state.common.exp.entities.employeeDetails
  );

  const { useExpense, employeeId, currencyId } = userSetting;
  const empHistories = get(employeeDetails, 'details');

  const hasPermissionError = AppPermissionUtil.checkPermissionError(
    useExpense,
    employeeId,
    currencyId
  );

  useEffect(() => {
    if (!isEmpty(empHistories)) {
      if (reportListType === LIST_TYPE.Approved) {
        onClickApprovedList();
      } else {
        boundGetReportList(null, false, REPORT_PER_PAGE_MOBILE, true)
          .then(() => {
            dispatch(
              getReportIdList(
                false,
                employeeId,
                undefined,
                true,
                getCompanyHistories()
              )
            );
          })
          .catch((_err) => false);
      }
    }

    return () => {
      dispatch(reportIdListActions.clear());
      dispatch(reportListActions.clear());
    };
  }, [empHistories]);

  const getCompanyHistories = () => {
    if (!isEmpty(empHistories))
      return empHistories.filter((h) => h.primary).map((h) => h.id);
    return [];
  };

  const onClickNewReport = () => {
    dispatch(ReportActions.clear());
    ownProps.history.push(`/request/report/new`);
  };

  const openDetail = (reportId: string, status: string, requestId?: string) => {
    ownProps.history.push(`/request/report/detail/${reportId}/${requestId}`, {
      status,
    });
  };

  const onClickApprovedList = () => {
    dispatch(listTypeUIActions.set(LIST_TYPE.Approved));
    dispatch(
      getReportIdList(true, employeeId, false, true, getCompanyHistories())
    )
      // @ts-ignore
      .then(([ids]) => {
        if (!isEmpty(ids)) {
          const idsToPass = ids.slice(0, REPORT_PER_PAGE_MOBILE);
          return (
            boundGetReportList(idsToPass, false, null, true)
              // @ts-ignore
              .catch(() => {
                dispatch(reportIdListActions.clear());
                dispatch(reportListActions.clear());
              })
          );
        } else {
          dispatch(reportListActions.clear());
        }
      });
  };

  const onClickBack = () => {
    dispatch(listTypeUIActions.set(LIST_TYPE.Active));
    boundGetReportList(null, false, REPORT_PER_PAGE_MOBILE, true)
      .then(() => {
        dispatch(
          getReportIdList(
            false,
            employeeId,
            undefined,
            true,
            getCompanyHistories()
          )
        );
      })
      .catch((err) => {
        const errMsg =
          (err.message && ` (${err.message})`) ||
          (err.event && ` (${err.event.message})`) ||
          '';
        dispatch(showToast(errMsg));
      });
  };

  const onRefresh = () => {
    const isApprovedList = reportListType === LIST_TYPE.Approved;
    return (
      dispatch(
        getReportIdList(
          isApprovedList,
          employeeId,
          true,
          true,
          getCompanyHistories()
        )
      )
        // @ts-ignore
        .then((ids: ReportIdList) => {
          if (!isEmpty(ids)) {
            return (
              boundGetReportList(
                ids.slice(0, REPORT_PER_PAGE_MOBILE),
                true,
                null,
                true
              )
                // @ts-ignore
                .catch(() => {
                  dispatch(reportIdListActions.clear());
                  dispatch(reportListActions.clear());
                })
            );
          } else {
            dispatch(reportListActions.clear());
          }
        })
    );
  };

  const boundGetReportList = (
    reportIds: ReportIdList,
    loadInBackground: boolean,
    noOfReport?: number,
    isRefresh?: boolean
  ) =>
    dispatch(
      getReportList(
        employeeId,
        reportIds,
        loadInBackground,
        noOfReport,
        isRefresh,
        true,
        getCompanyHistories()
      )
    )
      // @ts-ignore
      .then((res: Promise<ReportList>) => res);

  return (
    <ReportListPage
      userSetting={userSetting}
      reportList={reportList}
      reportIdList={reportIdList}
      hasPermissionError={hasPermissionError}
      reportListType={reportListType}
      openDetail={openDetail}
      onClickNewReport={onClickNewReport}
      onRefresh={onRefresh}
      onClickApprovedList={onClickApprovedList}
      onClickBack={onClickBack}
      getReportList={boundGetReportList}
      isRequest
    />
  );
};

export default ReportListContainer;
