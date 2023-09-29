import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import get from 'lodash/get';

import { actions as customRequestApprovalListActions } from '@commons/modules/customRequest/entities/approvalList';
import { actions as requestDetailActions } from '@commons/modules/customRequest/entities/requestDetail';

import { State } from '../../modules';
import { actions as layoutConfigListActions } from '../../modules/ui/customRequest/layoutConfigList';

import { AppDispatch } from '../../action-dispatchers/AppThunk';
import { getCustomRequestDetail } from '../../action-dispatchers/CustomRequest';

import List from '../../components/CustomRequest/List';

const ListContainer = () => {
  const dispatch = useDispatch() as AppDispatch;
  const customRequestApprovalList = useSelector(
    (state: State) => state.common.customRequest.entities.approvalList
  );
  const requestDetail = useSelector(
    (state: State) => state.common.customRequest.entities.requestDetail
  );

  const browseId = get(requestDetail, 'customRequest.Id', '');

  useEffect(() => {
    dispatch(customRequestApprovalListActions.list());

    return () => {
      dispatch(customRequestApprovalListActions.clear());
      dispatch(layoutConfigListActions.clear());
    };
  }, []);

  const Actions = bindActionCreators(
    {
      clearRequestDetail: requestDetailActions.clear,
      getCustomRequestDetail: getCustomRequestDetail,
    },
    dispatch
  );

  const onClickRow = (requestId: string) => {
    const selectedRequest = customRequestApprovalList.find(
      ({ Id }) => Id === requestId
    );
    if (selectedRequest) {
      Actions.getCustomRequestDetail(requestId, selectedRequest.RecordTypeId);
    }
  };

  return (
    <List
      browseId={browseId}
      customRequestList={customRequestApprovalList}
      onClickRow={onClickRow}
      {...Actions}
    />
  );
};

export default ListContainer;
