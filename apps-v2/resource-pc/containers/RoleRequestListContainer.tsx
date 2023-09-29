import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { State } from '@resource/modules';
import { modes } from '@resource/modules/ui/mode';

import {
  fetchResourceRequestList,
  selectRequest,
  selectRequestAndPlan,
} from '@resource/action-dispatchers/Request';

import { formatDateRangeInFilter } from '@resource/utils';

import RoleRequestList from '@resource/components/RoleRequestList';

const RoleRequestListContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const companyId = useSelector((state: State) => state.userSetting.companyId);
  const mode = useSelector((state: State) => state.ui.mode);
  const pageNum = useSelector(
    (state: State) => state.entities.psa.request.pageNum
  );
  const pageSize = useSelector(
    (state: State) => state.entities.psa.request.pageSize
  );
  const requestList = useSelector(
    (state: State) => state.entities.psa.request.pageData
  );
  const requestSelectionFilterState = useSelector(
    (state: State) => state.ui.filter.requestSelection
  );
  const roleRequestFilterState = useSelector(
    (state: State) => state.ui.filter.roleRequest
  );
  const selectedResource = useSelector(
    (state: State) => state.ui.resourceSelection.resource
  );
  const totalRecords = useSelector(
    (state: State) => state.entities.psa.request.totalRecords
  );

  const onClickPagerLink = (num: number, listSize: number) => {
    let filterState = roleRequestFilterState;
    if (mode === modes.RESOURCE_ASSIGNMENT) {
      filterState = requestSelectionFilterState;
    }
    dispatch(
      fetchResourceRequestList(
        companyId,
        num,
        formatDateRangeInFilter({
          ...filterState,
          jobGradeIds: filterState.jobGradeIds
            ? filterState.jobGradeIds.map((jobGrade: any) => jobGrade.id)
            : null,
        }),
        listSize
      )
    );
  };
  const onClickRequestListItem = (requestId: string) => {
    const selectedRequest = requestList.find(
      (request) => request.roleId === requestId
    );
    if (mode === modes.RESOURCE_ASSIGNMENT) {
      dispatch(selectRequestAndPlan(selectedRequest, selectedResource.id));
    } else {
      dispatch(selectRequest(selectedRequest));
    }
  };

  return (
    <RoleRequestList
      onClickPagerLink={onClickPagerLink}
      onClickRequestListItem={onClickRequestListItem}
      pageNum={pageNum}
      pageSize={pageSize}
      requestList={requestList}
      totalRecords={totalRecords}
    />
  );
};

export default RoleRequestListContainer;
