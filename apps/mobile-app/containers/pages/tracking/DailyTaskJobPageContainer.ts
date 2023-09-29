import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import mapValues from 'lodash/mapValues';

import DateUtil from '../../../../commons/utils/DateUtil';

import { State } from '../../../modules';
import {
  selectedJob,
  workCategoryOptionList,
} from '../../../modules/tracking/selector';

import { AppDispatch } from '../../../action-dispatchers/AppThunk';
import {
  discard,
  editTaskTime,
  save,
  selectWorkCategory,
} from '../../../action-dispatchers/tracking/DailyTaskJob';
import { clear } from '../../../action-dispatchers/tracking/JobSelect';

import Component, {
  Props,
} from '../../../components/pages/tracking/DailyTaskJobPage';

const mergeProps = (stateProps, dispatchProps, ownProps): Props => ({
  workCategories: workCategoryOptionList(stateProps.tracking),
  selectedJob: selectedJob(stateProps.tracking),
  selectedWorkCategoryId:
    stateProps.tracking.ui.dailyTaskJob.workCategoryId || '',
  taskTime: stateProps.tracking.ui.dailyTaskJob.taskTime || '',

  // Actions
  ...dispatchProps.bindActionCreators({
    onSelectWorkCategory: (e: React.SyntheticEvent<HTMLSelectElement>) =>
      selectWorkCategory(e.currentTarget.value),
    onChangeTaskTime: (taskTime?: number) => editTaskTime(taskTime),
  }),
  onClickDiscard: () => {
    dispatchProps.dispatch(discard());
    ownProps.history.replace(
      `/tracking/tracking-daily/${DateUtil.formatISO8601Date(
        ownProps.date
      )}?mode=1`
    );
  },
  onClickJob: () => {
    dispatchProps.dispatch(clear());
    ownProps.history.replace(
      `/tracking/tracking-daily/${DateUtil.formatISO8601Date(
        ownProps.date
      )}/jobs`
    );
  },
  onClickSave: () => {
    dispatchProps
      .dispatch(
        save(
          stateProps.tracking.ui.dailyTaskJob,
          stateProps.tracking.entity.dailyTask
        )
      )
      .then(() => {
        ownProps.history.replace(
          `/tracking/tracking-daily/${DateUtil.formatISO8601Date(
            ownProps.date
          )}`
        );
      });
  },
});

export default connect(
  (state: State) => state,
  (dispatch: AppDispatch) => ({
    dispatch,
    bindActionCreators: (actions) => {
      // eslint-disable-next-line no-undef
      return mapValues(
        bindActionCreators(actions, dispatch),
        (f) =>
          (...args) => {
            f(...args);
          }
      );
    },
  }),
  mergeProps
)(Component);
