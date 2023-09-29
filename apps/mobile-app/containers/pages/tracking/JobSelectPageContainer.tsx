import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouterProps } from 'react-router';
import { match as Match } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import isNil from 'lodash/isNil';

import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';
import { showAlert } from '../../../modules/commons/alert';

import { Job } from '../../../../domain/models/time-tracking/Job';

import { State } from '../../../modules';
import { actions as JobSelectHistory } from '../../../modules/tracking/ui/jobs/history';

import { AppDispatch } from '../../../action-dispatchers/AppThunk';
import { selectJob } from '../../../action-dispatchers/tracking/DailyTaskJob';
import {
  abort,
  clear,
  initialize,
  resume,
} from '../../../action-dispatchers/tracking/JobSelect';

import JobSelectPage from '../../../components/pages/tracking/JobSelectPage';

type OwnProps = {
  match: Match;
  history: RouterProps['history'];
  date: string;
  parentJobId?: string;
};

const useLazyLoading = (targetDate: string, parentJobId = '') => {
  const jobTable = useSelector((state: State) => state.tracking.entity.jobs);
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  const { stream, isDone, isAborted } = React.useMemo(() => {
    const defaultValue = { stream: null, isDone: false, isAborted: false };
    if (jobTable) {
      return jobTable[parentJobId] || defaultValue;
    } else {
      return defaultValue;
    }
  }, [jobTable, parentJobId]);

  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    if (isNil(stream)) {
      dispatch(initialize(targetDate, parentJobId));
    } else {
      const next = async () => {
        const done = await dispatch(resume(stream, parentJobId));
        if (!done) {
          setTimeout(next, 0);
        }
      };
      const timerId = setTimeout(next, 0);

      return () => {
        clearTimeout(timerId);
      };
    }
  }, [stream, targetDate, parentJobId, isDone, isAborted, dispatch]);

  React.useEffect(() => {
    if (isDone) {
      const length = jobTable[parentJobId]?.items?.length;
      if (!isNil(length) && length === 0) {
        dispatch(showAlert(msg().Trac_Lbl_NoAvailableJob));
      }
    }
  }, [isDone]);
};

const JobSelectPageContainer = (ownProps: OwnProps) => {
  const { parent, prev } = useSelector(
    (state: State) => state.tracking.ui.jobs.history
  );
  const dispatch = useDispatch();

  const onClickBack = React.useCallback(() => {
    const parentId = prev?.id || '';
    ownProps.history.replace(
      `/tracking/tracking-daily/${DateUtil.formatISO8601Date(
        ownProps.date
      )}/jobs/${parentId}`
    );
    (dispatch as (dispatch: AppDispatch) => void)(abort(parentId));
    dispatch(JobSelectHistory.goBack());
  }, [ownProps.history, prev]);
  const onClickCancel = React.useCallback(() => {
    ownProps.history.replace(
      `/tracking/tracking-daily/${DateUtil.formatISO8601Date(
        ownProps.date
      )}/task`
    );
    (dispatch as (dispatch: AppDispatch) => void)(clear());
    dispatch(JobSelectHistory.clear());
  }, [ownProps.history, ownProps.date, dispatch]);
  const onClickChildJob = React.useCallback(
    (job: Job) => {
      ownProps.history.replace(
        `/tracking/tracking-daily/${DateUtil.formatISO8601Date(
          ownProps.date
        )}/jobs/${job.id}`
      );
      if (parent) {
        (dispatch as (dispatch: AppDispatch) => void)(abort(parent.id));
      }
      dispatch(JobSelectHistory.push(job));
    },
    [ownProps.history, parent, dispatch]
  );
  const onClickJob = React.useCallback(
    (job: Job) => {
      (dispatch as (dispatch: AppDispatch) => void)(
        selectJob(ownProps.date, job.id)
      );
      ownProps.history.replace(
        `/tracking/tracking-daily/${DateUtil.formatISO8601Date(
          ownProps.date
        )}/task`
      );
      if (parent) {
        (dispatch as (dispatch: AppDispatch) => void)(abort(parent.id));
      }
      dispatch(JobSelectHistory.clear());
    },
    [ownProps, parent, dispatch]
  );

  useLazyLoading(ownProps.date, ownProps.parentJobId);

  React.useEffect(() => {
    // GENIE-15494 GENIE-15496
    // Avoid layout broken by TimeSelect
    //
    //  TimeSelect component used internally by JobSelectPage modifies
    // style attribute of body tag. This modification set
    // overflow property 'hidden' during to prevent an undesirable scroll of
    // entire content during the menu of TimeSelect is shown,
    // and after the menu is closed it set '' (empty string) overflow
    // to reset style. This behavior affects repaint (layout calculation)
    // across multiple pages because body tag is not managed by React.
    // At least, on iOS, elements styled as `position: fixed` is rendered
    // in an unexpected position.
    //
    //  To avoid this, style should be restored to the value
    // before which TimeSelect updated.
    // In production env, the style of body is set to
    // "height: 100%; overflow: auto;".
    // Therefore restoring "auto" is required. However, unfortunately,
    // there is no way to do it by TimeSelect.
    // So, here restoring "auto" is executed.
    if (document.body) {
      document.body.style.overflow = 'auto';
    }
  }, []);

  return (
    <JobSelectPage
      isRoot={isNil(ownProps.parentJobId)}
      onClickBack={onClickBack}
      onClickCancel={onClickCancel}
      onClickChildJob={onClickChildJob}
      onClickJob={onClickJob}
    />
  );
};

export default JobSelectPageContainer;
