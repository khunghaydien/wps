import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import msg from '@commons/languages';
import Component from '@mobile/components/pages/commons/SubmitWithCommentPage';

import { State } from '@mobile/modules';
import { actions as ReportActions } from '@mobile/modules/expense/entities/report';

import { submit } from '@mobile/action-dispatchers/expense/ReportDetail';

type OwnProps = RouteComponentProps;

const ReportSubmitContainer = (ownProps: OwnProps) => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  const avatarUrl = useSelector((state: State) => state.userSetting.photoUrl);
  const reportId = useSelector(
    (state: State) => state.expense.entities.report.reportId
  );

  const title = msg().Appr_Lbl_SubmitComment;
  const submitLabel = msg().Appr_Lbl_Submit;

  const onClickBack = () => {
    ownProps.history.replace(`/expense/report/detail/${reportId}`);
  };

  const onClickSubmit = (comment: string) => {
    dispatch(submit(reportId, comment))
      // @ts-ignore
      .then(() => {
        ownProps.history.replace('/expense/report/list');
        dispatch(ReportActions.clear());
      })
      .catch(() => {
        ownProps.history.replace(`/expense/report/detail/${reportId}`);
      });
  };

  const getBackLabel = () => {
    return msg().Exp_Lbl_Report;
  };

  return (
    <Component
      avatarUrl={avatarUrl}
      title={title}
      submitLabel={submitLabel}
      onClickBack={onClickBack}
      onClickSubmit={onClickSubmit}
      getBackLabel={getBackLabel}
    />
  );
};

export default ReportSubmitContainer;
