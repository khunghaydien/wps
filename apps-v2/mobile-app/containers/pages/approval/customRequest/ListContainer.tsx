import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { REQUEST_TYPE } from '@apps/domain/models/approval/request/Request';
import { CustomRequest } from '@apps/domain/models/customRequest/types';

import { State } from '@mobile/modules';

import { fetchCustomRequestList } from '@mobile/action-dispatchers/approval/CustomRequest';

import ListPage from '@mobile/components/pages/approval/customRequest/ListPage';

type Props = {
  history: RouteComponentProps['history'];
};

const ListContainer = ({ history }: Props) => {
  const dispatch = useDispatch() as ThunkDispatch<State, unknown, AnyAction>;
  const customRequestApprovalList = useSelector(
    (state: State) => state.common.customRequest.entities.approvalList
  );
  const customRequestList = customRequestApprovalList.map(
    (request: CustomRequest) => ({
      ...request,
      requestType: REQUEST_TYPE.CUSTOM_REQUEST,
    })
  );

  useEffect(() => {
    dispatch(fetchCustomRequestList());
  }, []);

  const onClickRequest = (requestId: string, recordTypeId: string) => {
    history.push(
      `/approval/custom-request/list/select/${requestId}/${recordTypeId}`
    );
  };

  return (
    <ListPage
      customRequestList={customRequestList}
      onClickRequest={onClickRequest}
    />
  );
};

export default ListContainer;
