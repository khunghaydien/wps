import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import isNil from 'lodash/isNil';
import mapValues from 'lodash/mapValues';

import lifecycle from '../../../concerns/lifecycle';

import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';
import { showAlert } from '../../../modules/commons/alert';

import {
  calculateTotalRatio,
  includesNonDirectInput,
} from '../../../../domain/models/time-tracking/Task';

import { State } from '../../../modules';
import {
  State as DailyTaskState,
  taskTimes,
  toggleInputMode,
} from '../../../modules/tracking/entity/dailyTask';
import {
  deleteTask,
  toggleEditing,
} from '../../../modules/tracking/ui/dailyTask';

import { AppDispatch } from '../../../action-dispatchers/AppThunk';
import {
  editTask,
  initialize,
  saveTask,
} from '../../../action-dispatchers/tracking/DailyTask';

import Component, {
  Props,
} from '../../../components/pages/tracking/DailyTaskPage';

import DailyTaskHeaderContainer from '../../organisms/tracking/DailyTaskHeaderContainer';

const returnVoid = (f: (...args: Array<any>) => any) => {
  return (...args) => {
    f(...args);
  };
};

type DispatchProps = {
  dispatch: AppDispatch;
  bindActions: (arg0: { [key: string]: any }) => {
    [key: string]: any;
  };
};

const mapStateToProps = (state: State): State => state;
const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
  dispatch,
  bindActions: (actions) =>
    mapValues(bindActionCreators(actions, dispatch), returnVoid),
});

const mergeProps = (
  state: State,
  { bindActions, dispatch }: DispatchProps,
  ownProps
): Props => {
  const listEditing = state.tracking.ui.dailyTask.isEditing;
  const dailyTask: DailyTaskState = listEditing
    ? state.tracking.ui.dailyTask.dailyTask
    : state.tracking.entity.dailyTask;
  const totalRatio = calculateTotalRatio(dailyTask.taskList);

  return {
    // State
    listEditing,
    today: ownProps.date,
    taskList: dailyTask.taskList,
    // @ts-ignore
    isTemporaryWorkTime: dailyTask.isTemporaryWorkTime,
    realWorkTime: dailyTask.realWorkTime,
    taskTimes: taskTimes(dailyTask),
    hasMultipleRatios:
      state.tracking.entity.dailyTask.taskList.filter(
        (task) => !task.isDirectInput
      ).length > 1,
    disabled: isNil(dailyTask.targetDate) || dailyTask.targetDate === '',
    requestStatus: dailyTask.status,
    totalRatio,

    // Actions
    ...bindActions({
      toggleDirectInput: (id, _isDirectInput) => toggleInputMode(id),
      editTaskTime: (id, taskTime) => editTask(id, { taskTime }),
      editRatio: (id, ratio) => editTask(id, { ratio }),
      deleteTask: (id) => deleteTask(id),
      save: () => saveTask(dailyTask),
      onToggleEditing: () => toggleEditing(dailyTask),
    }),

    // Routing actions
    onChangeDate: (date: string) => {
      ownProps.history.replace(
        `/tracking/tracking-daily/${DateUtil.formatISO8601Date(date)}`
      );
    },
    onClickAddJob: () => {
      if (includesNonDirectInput(dailyTask.taskList) && totalRatio !== 100) {
        dispatch(showAlert(msg().Trac_Lbl_CanNotAddJob));
      } else {
        ownProps.history.replace(
          `/tracking/tracking-daily/${DateUtil.formatISO8601Date(
            ownProps.date
          )}/task`
        );
      }
    },
    onClickPrevDate: () => {
      const prevDate = DateUtil.addDays(ownProps.date, -1);
      ownProps.history.replace(
        `/tracking/tracking-daily/${DateUtil.formatISO8601Date(prevDate)}`
      );
    },
    onClickNextDate: () => {
      const nextDate = DateUtil.addDays(ownProps.date, 1);
      ownProps.history.replace(
        `/tracking/tracking-daily/${DateUtil.formatISO8601Date(nextDate)}`
      );
    },
    onClickRefresh: () => {
      ownProps.history.replace(
        `/tracking/tracking-daily/${DateUtil.formatISO8601Date(ownProps.date)}`
      );
    },
  };
};

export default compose(
  lifecycle({
    componentDidMount: (dispatch: AppDispatch, props) => {
      if (props.willFetchData) {
        dispatch(initialize({ targetDate: props.date }));
      }
    },
  }),
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  (WrappedComponent) => (props) =>
    (
      <WrappedComponent
        {...props}
        renderDailyTaskHeader={<DailyTaskHeaderContainer />}
      />
    )
)(Component) as React.ComponentType<{
  [key: string]: any;
}>;
