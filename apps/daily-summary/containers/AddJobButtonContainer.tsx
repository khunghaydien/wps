import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { format } from 'date-fns';

import TimeTrackJobRepository from '../../repositories/time-tracking/TimeTrackJobRepository';

import { Job } from '../../domain/models/time-tracking/Job';

import { State } from '../modules';

import App from '../action-dispatchers/App';
import * as DailySummaryActions from '../action-dispatchers/DailySummary';

import AddJobButton from '../components/TaskCard/AddJobButton';

import { useJobSelectDialog } from '../../time-tracking/JobSelectDialog';
import { useACL } from './hooks/useACL';

type OwnProps = {
  'data-testid'?: string;
  unsort: () => void;
};

const AddJobButtonContainer = ({ unsort, ...ownProps }: OwnProps) => {
  const { editTimeTrack } = useACL();
  const empId = useSelector((state: State) => state.entities.user.id);
  const targetDate = useSelector(
    (state: State) => state.ui.dailySummary.targetDate
  );
  const formattedTargetDate = useMemo(() => {
    return format(targetDate, 'YYYY-MM-DD');
  }, [targetDate]);
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;
  const addJobToTaskList = useCallback(
    (job: Job) => {
      unsort();

      dispatch(DailySummaryActions.addJobToTaskList(formattedTargetDate, job));
    },
    [dispatch, formattedTargetDate, unsort]
  );
  const [onClickAddJob] = useJobSelectDialog({
    targetDate: formattedTargetDate,
    onOk: addJobToTaskList,
    onError: (error) => {
      App(dispatch).showErrorNotification(error);
    },
    repository: TimeTrackJobRepository,
    empId: empId === '' ? undefined : empId,
  });

  return (
    <AddJobButton
      {...ownProps}
      onClick={onClickAddJob}
      disabled={!editTimeTrack}
    />
  );
};

export default AddJobButtonContainer;
