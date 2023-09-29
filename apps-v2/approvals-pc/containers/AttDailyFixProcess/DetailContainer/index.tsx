import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import FixDailyRequestRepository from '@attendance/repositories/approval/FixDailyRequestRepository';

import { State } from '@apps/approvals-pc/modules';
import { actions } from '@apps/approvals-pc/modules/ui/attFixDaily/request';

import Component from '@apps/approvals-pc/components/attendance/AttDailyFixProcess/Detail';

import ApprovalForm from './ApprovalFormContainer';
import Content from './ContentContainer';
import Header from './HeaderContainer';
import HistoryTable from './HistoryTableContainer';

const DetailContainer: React.FC = () => {
  const dispatch = useDispatch();
  const selectedId = useSelector(
    (state: State) => state.ui.attFixDaily.selectedId
  );
  const request = useSelector((state: State) => state.ui.attFixDaily.request);

  React.useEffect(() => {
    if (!selectedId) {
      return;
    }
    dispatch(loadingStart());
    FixDailyRequestRepository.fetch(selectedId)
      .then((result) => {
        dispatch(actions.set(result));
      })
      .catch((err) => {
        dispatch(catchApiError(err));
      })
      .finally(() => {
        dispatch(loadingEnd());
      });

    return () => {
      dispatch(actions.unset());
    };
  }, [dispatch, selectedId]);

  if (!selectedId || !request) {
    return null;
  }

  return (
    <Component
      requestId={selectedId}
      Header={Header}
      Content={Content}
      HistoryTable={() => <HistoryTable requestId={selectedId} />}
      ApprovalForm={() => <ApprovalForm requestId={selectedId} />}
    />
  );
};

export default DetailContainer;
