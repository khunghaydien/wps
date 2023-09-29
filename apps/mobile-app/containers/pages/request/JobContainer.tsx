import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { cloneDeep, get } from 'lodash';

import {
  goBack,
  pushHistoryWithPrePage,
} from '@mobile/concerns/routingHistory';

import msg from '../../../../commons/languages';
import LevelList from '../../../components/pages/expense/commons/LevelList';

import { DEFAULT_LIMIT_NUMBER, Job } from '../../../../domain/models/exp/Job';

import { State } from '../../../modules';
import { actions as formValueRecordAction } from '../../../modules/expense/ui/general/formValues';
import { actions as formValueReportAction } from '../../../modules/expense/ui/report/formValues';

import { getJobList, searchJob } from '../../../action-dispatchers/expense/Job';

type OwnProps = RouteComponentProps & {
  type: string;
  keyword?: string;
  reportId?: string;
  targetDate: string;
  parentId: string;
  backType: string;
};

const JobContainer = (ownProps: OwnProps) => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  const formValuesReport = useSelector(
    (state: State) => state.expense.ui.report.formValues
  );
  const formValuesRecord = useSelector(
    (state: State) => state.expense.ui.general.formValues
  );
  const list = useSelector((state: State) => state.expense.entities.job);
  const userSetting = useSelector((state: State) => state.userSetting);

  const title = msg().Exp_Lbl_Job;
  const limitNumber = DEFAULT_LIMIT_NUMBER;

  useEffect(() => {
    const { companyId, employeeId }: { companyId: string; employeeId: string } =
      userSetting;

    const { targetDate, parentId = null, keyword = '' } = ownProps;

    if (ownProps.type === 'list') {
      dispatch(getJobList(employeeId, parentId, targetDate, limitNumber));
    } else {
      dispatch(
        searchJob(
          companyId,
          employeeId,
          targetDate,
          keyword === 'null' ? '' : decodeURIComponent(keyword),
          limitNumber,
          'REQUEST'
        )
      );
    }
  }, []);

  const onClickBack = () => {
    goBack(ownProps.history);
  };

  const onClickSearchButton = (keyword: string) => {
    if (keyword === null) {
      return;
    }
    const { targetDate, reportId, backType, history } = ownProps;
    // Special handling of % because it could not be sanitized with react router.
    const sanitizedKeyword =
      encodeURIComponent(keyword.replace(/%/g, '%25')) || null;
    const url = `/request/job/search/backType=${backType}/targetDate=${targetDate}/reportId=${
      reportId || 'null'
    }/keyword=${!sanitizedKeyword ? 'null' : sanitizedKeyword}`;
    pushHistoryWithPrePage(history, url, {
      target: get(ownProps.history, 'location.state.target'),
    });
  };

  const onClickRow = useCallback(
    (selectedJob: Job) => {
      let newFormValues;
      if (ownProps.backType === 'report') {
        newFormValues = cloneDeep(formValuesReport);
        newFormValues.jobName = selectedJob.name;
        newFormValues.jobId = selectedJob.id;
        dispatch(formValueReportAction.save(newFormValues));
      } else {
        newFormValues = cloneDeep(formValuesRecord);
        newFormValues.items[0].jobName = selectedJob.name;
        newFormValues.items[0].jobId = selectedJob.id;
        dispatch(formValueRecordAction.save(newFormValues));
      }
      // redirect
      let url;
      const reportId = ownProps.reportId;
      const recordId = formValuesRecord.recordId;
      if (ownProps.backType === 'report') {
        if (ownProps.reportId && ownProps.reportId !== 'null') {
          url = `/request/report/edit/${ownProps.reportId}`;
        } else {
          url = '/request/report/new';
        }
      } else if (ownProps.backType === 'record') {
        url = `/request/record/detail/${reportId}/${recordId}`;
        if (!recordId) {
          url = '/request/report/record/new/general';
        }
      } else if (ownProps.backType === 'existingJorudan') {
        if (reportId && recordId) {
          url = `/request/record/jorudan-detail/${recordId}/${reportId}`;
        }
      } else {
        url = `/request/report/route/list/item/${ownProps.backType}`;
      }
      pushHistoryWithPrePage(ownProps.history, url, {
        target: get(ownProps.history, 'location.state.target'),
      });
    },
    [
      formValuesReport,
      formValuesRecord,
      ownProps.backType,
      ownProps.reportId,
      dispatch,
      ownProps.history,
    ]
  );

  const onClickIcon = useCallback(
    (selectedJob: Job) => {
      const url = `/request/job/list/backType=${ownProps.backType}/targetDate=${
        ownProps.targetDate
      }/reportId=${
        ownProps.reportId || ownProps.reportId === 'null'
          ? ownProps.reportId
          : 'null'
      }/parentId=${selectedJob.id}`;
      pushHistoryWithPrePage(ownProps.history, url, {
        target: get(ownProps.history, 'location.state.target'),
      });
    },
    [
      ownProps.backType,
      ownProps.reportId,
      ownProps.targetDate,
      ownProps.history,
    ]
  );

  return (
    <LevelList
      list={list}
      keyword={ownProps.keyword}
      title={title}
      limitNumber={limitNumber}
      onClickBack={onClickBack}
      onClickSearchButton={onClickSearchButton}
      onClickRow={onClickRow}
      onClickIcon={onClickIcon}
    />
  );
};

export default JobContainer;
