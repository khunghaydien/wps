import * as React from 'react';
import { connect } from 'react-redux';
// @ts-ignore
import { Match, RouterHistory, withRouter } from 'react-router-dom';
import { bindActionCreators, compose, Dispatch } from 'redux';

import lifecycle from '../../../concerns/lifecycle';

import { withLoading } from '../../../modules/commons/loading';

import ApprovalRequestHistoryRepository from '../../../../repositories/ApprovalRequestHistoryRepository';

import { State } from '../../../modules';
import { actions as EntitiesApprovalHistoriesActions } from '../../../modules/attendance/dailyRequest/entities/approvalHistories';
import * as selector from '../../../modules/attendance/dailyRequest/ui/selector';

import * as actions from '../../../action-dispatchers/attendance/dailyRequest';

import Component from '../../../components/organisms/attendance/DailyRequestDetailLayout';

const goBack = (
  history: RouterHistory,
  targetDate: string | null | undefined
): void => {
  history.replace(`/attendance/daily-requests/${targetDate || ''}`);
};

const reload = (history: RouterHistory, match: Match): void => {
  history.replace(match.url);
};

const mapStateToProps = (
  state: State,
  ownProps: Readonly<{
    match: {
      params: {
        targetDate: string;
      };
    };
  }>
) => {
  const timesheet = state.attendance.timesheet.entities;
  const detail = state.attendance.dailyRequest.ui.detail;
  const approvalHistories =
    state.attendance.dailyRequest.entities.approvalHistories;
  const target = selector.targetRequest(state.attendance.dailyRequest.ui);
  const record =
    timesheet.recordsByRecordDate[ownProps.match.params.targetDate];
  return {
    isLocked: timesheet.isLocked,
    isEditing: detail.isEditing,
    target,
    record,
    editAction: detail.editAction,
    disableAction: detail.disableAction,
    approvalHistories,
  };
};

const mapDispatchToProps = {
  startEditingHandler: actions.startEditing,
  createHandler: actions.create,
  modifyHandler: actions.modify,
  reapplyHandler: actions.reapply,
  cancelRequestHandler: actions.cancelRequest,
  cancelApprovalHandler: actions.cancelApproval,
  removeHandler: actions.remove,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps,
  ownProps: {
    children: React.ReactNode;
    history: RouterHistory;
    match: Match;
  }
) => ({
  id: ownProps.match.params.id || null,
  isLocked: stateProps.isLocked,
  isEditing: stateProps.isEditing,
  editAction: stateProps.editAction,
  disableAction: stateProps.disableAction,
  approvalHistories: stateProps.approvalHistories,
  target: stateProps.target,
  children: ownProps.children,
  onClickBack: () => goBack(ownProps.history, ownProps.match.params.targetDate),
  onClickCancelEditing: () => {
    reload(ownProps.history, ownProps.match);
  },
  onClickStartEditing: () => {
    if (!stateProps.target) {
      return;
    }
    dispatchProps.startEditingHandler(stateProps.target, stateProps.record);
  },
  onClickCreate: () => {
    if (!stateProps.target) {
      return;
    }
    dispatchProps
      .createHandler(stateProps.target, ownProps.match.params.targetDate)
      .then((result) => {
        if (result) {
          goBack(ownProps.history, ownProps.match.params.targetDate);
        }
      });
  },
  onClickModify: () => {
    if (!stateProps.target) {
      return;
    }
    dispatchProps
      .modifyHandler(stateProps.target, ownProps.match.params.targetDate)
      .then((result) => {
        if (result) {
          reload(ownProps.history, ownProps.match);
        }
      });
  },
  onClickReapply: () => {
    if (!stateProps.target) {
      return;
    }
    dispatchProps
      .reapplyHandler(stateProps.target, ownProps.match.params.targetDate)
      .then((result) => {
        if (result) {
          goBack(ownProps.history, ownProps.match.params.targetDate);
        }
      });
  },
  onClickCancelRequest: () => {
    if (!stateProps.target) {
      return;
    }
    dispatchProps
      .cancelRequestHandler(
        stateProps.target.id,
        ownProps.match.params.targetDate
      )
      .then((result) => {
        if (result) {
          reload(ownProps.history, ownProps.match);
        }
      });
  },
  onClickCancelApproval: () => {
    if (!stateProps.target) {
      return;
    }
    dispatchProps
      .cancelApprovalHandler(
        stateProps.target.id,
        ownProps.match.params.targetDate
      )
      .then((result) => {
        if (result) {
          reload(ownProps.history, ownProps.match);
        }
      });
  },
  onClickRemove: () => {
    if (!stateProps.target) {
      return;
    }
    dispatchProps
      .removeHandler(stateProps.target.id, ownProps.match.params.targetDate)
      .then((result) => {
        if (result) {
          goBack(ownProps.history, ownProps.match.params.targetDate);
        }
      });
  },
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  lifecycle({
    componentDidMount: (
      dispatch: Dispatch<any>,
      props: ReturnType<typeof mergeProps>
    ) => {
      const appService = bindActionCreators(
        {
          withLoading,
        },
        dispatch
      );
      const approvalHistoriesService = bindActionCreators(
        EntitiesApprovalHistoriesActions,
        dispatch
      );
      const { id } = props;

      approvalHistoriesService.initialize();

      if (id === null) {
        return;
      }

      appService.withLoading(() =>
        ApprovalRequestHistoryRepository.fetch(id).then((result) =>
          approvalHistoriesService.initialize(result)
        )
      );
    },
  })
)(Component);
