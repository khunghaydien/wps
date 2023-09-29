import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { UserSetting } from '@apps/domain/models/UserSetting';

import { State } from '../modules';

import { Options } from '../action-dispatchers/Request';

import RequestDialog from '../components/RequestDialog';

import useRequest from './hooks/useRequest';

const mapStateToProps = (state: State) => ({
  status: state.entities.summary.content.request.status,
  userPhotoUrl: (state.userSetting as UserSetting).photoUrl,
  comment: state.ui.request.comment,
});

const RequestDialogContainer = (ownProps: Options) => {
  const props = useSelector(mapStateToProps);
  const isOpen = useSelector<State, boolean>(
    (state) => state.ui.request.isOpen
  );
  const targetDate = useSelector<State, string>(
    (state) => state.entities.request.targetDate
  );
  const requestId = useSelector<State, string>(
    (state) => state.entities.summary.content.request.requestId
  );
  const request = useRequest({
    source: ownProps.source || undefined,
  });

  const onChangeComment = useCallback(
    (value: string) => request.editComment(value),
    [request, props.comment]
  );
  const onClickClose = useCallback(() => request.close(), [request, isOpen]);
  const onClickSubmit = useCallback(async () => {
    await request.applyForTimeTrackReport({
      status: props.status,
      comment: props.comment,
      targetDate,
      requestId,
    });
  }, [request, props.status, props.comment, targetDate, requestId]);

  return (
    <>
      {isOpen && (
        <RequestDialog
          {...props}
          onChangeComment={onChangeComment}
          onClickClose={onClickClose}
          onClickSubmit={onClickSubmit}
        />
      )}
    </>
  );
};

export default RequestDialogContainer;
