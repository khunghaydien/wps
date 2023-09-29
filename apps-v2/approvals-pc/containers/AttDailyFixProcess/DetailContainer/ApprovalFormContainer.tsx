import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import RequestRepository from '@apps/repositories/approval/RequestRepository';

import { State } from '@apps/approvals-pc/modules';

import Component from '@apps/approvals-pc/components/DetailParts/ApproveForm';

import LocalEvents from '../events';

const ApprovalFormContainer: React.FC<{
  requestId: string;
}> = ({ requestId }) => {
  const [comment, setComment] = React.useState<string>('');
  const dispatch = useDispatch();
  const userPhotoUrl = useSelector(
    (state: State) => state.common.userSetting.photoUrl
  );
  const onClickApproveButton = React.useCallback(async () => {
    dispatch(loadingStart());
    try {
      await RequestRepository.approve({
        ids: [].concat(requestId),
        comment,
      });
      LocalEvents.approved.publish(requestId);
    } catch (e) {
      dispatch(catchApiError(e));
    } finally {
      dispatch(loadingEnd());
    }
  }, [comment, dispatch, requestId]);
  const onClickRejectButton = React.useCallback(async () => {
    dispatch(loadingStart());
    try {
      await RequestRepository.reject({
        ids: [].concat(requestId),
        comment,
      });
      LocalEvents.rejected.publish(requestId);
    } catch (e) {
      dispatch(catchApiError(e));
    } finally {
      dispatch(loadingEnd());
    }
  }, [comment, dispatch, requestId]);

  if (!requestId) {
    return null;
  }

  return (
    <Component
      comment={comment}
      userPhotoUrl={userPhotoUrl}
      onClickApproveButton={onClickApproveButton}
      onClickRejectButton={onClickRejectButton}
      onChangeApproveComment={setComment}
    />
  );
};

export default ApprovalFormContainer;
