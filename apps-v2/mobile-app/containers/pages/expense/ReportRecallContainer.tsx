import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import msg from '@apps/commons/languages';
import Component from '@mobile/components/pages/commons/SubmitWithCommentPage';

import { State } from '@mobile/modules';

import { recall } from '@mobile/action-dispatchers/expense/ReportDetail';

type OwnProps = RouteComponentProps;

const mapStateToProps = (state: State) => ({
  title: msg().Appr_Lbl_SubmitComment,
  submitLabel: msg().Exp_Lbl_Recall,
  avatarUrl: state.userSetting.photoUrl,
});

const ReportRecallContainer = (ownProps: OwnProps) => {
  const props = useSelector(mapStateToProps);

  const reportId = useSelector(
    (state: State) => state.expense.entities.report.reportId
  );

  const requestId = useSelector(
    (state: State) => state.expense.entities.report.requestId
  );

  const dispatch = useDispatch();

  const Actions = useMemo(
    () => bindActionCreators({ recall }, dispatch),
    [dispatch]
  );

  const onClickBack = () =>
    ownProps.history.replace(`/expense/report/detail/${reportId}`);

  const onClickSubmit = (comment: string) => {
    Actions.recall(requestId, comment)
      // @ts-ignore
      .then(() => {
        ownProps.history.replace('/expense/report/list');
      })
      .catch(() => {
        ownProps.history.replace(`/expense/report/detail/${reportId}`);
      });
  };
  return (
    <Component
      title={props.title}
      submitLabel={props.submitLabel}
      avatarUrl={props.avatarUrl}
      getBackLabel={() => msg().Exp_Lbl_Report}
      onClickSubmit={onClickSubmit}
      onClickBack={onClickBack}
    />
  );
};

export default ReportRecallContainer;
