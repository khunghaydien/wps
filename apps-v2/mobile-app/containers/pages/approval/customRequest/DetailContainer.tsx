import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import get from 'lodash/get';

import { isShowFileSection } from '@apps/domain/models/customRequest';

import { State } from '@mobile/modules';

import { approve } from '@mobile/action-dispatchers/approval/Approve';
import { getCustomRequestDetail } from '@mobile/action-dispatchers/approval/CustomRequest';
import { reject } from '@mobile/action-dispatchers/approval/Reject';

import DetailPage from '@mobile/components/pages/approval/customRequest/DetailPage';

type Props = {
  history: RouteComponentProps['history'];
  recordTypeId: string;
  requestId: string;
};

const DetailContainer = ({ history, recordTypeId, requestId }: Props) => {
  const dispatch = useDispatch() as ThunkDispatch<State, unknown, AnyAction>;

  const currencySymbol = useSelector(
    (state: State) => state.userSetting.currencySymbol
  );
  const requestDetail = useSelector(
    (state: State) => state.common.customRequest.entities.requestDetail
  );
  const layoutConfigList = useSelector(
    (state: State) => state.approval.ui.customRequest.layoutConfigList
  );

  useEffect(() => {
    dispatch(getCustomRequestDetail(requestId, recordTypeId));
  }, []);

  const onClickApproveReject = async (
    requestIdList: string[],
    comment: string,
    isClickApprove?: boolean
  ) => {
    const approveRejectAction = isClickApprove ? approve : reject;
    await dispatch(approveRejectAction(requestIdList, comment));
    onClickBack();
  };

  const onClickBack = () => {
    history.push('/approval/custom-request/list');
  };

  const selectedReportTypeId = get(
    requestDetail,
    'customRequest.RecordTypeId',
    ''
  );
  const layoutConfigObj = layoutConfigList.find(
    ({ recordTypeId: layoutRecordTypeId }) =>
      layoutRecordTypeId === selectedReportTypeId
  );
  const layoutItemConfigList = get(layoutConfigObj, 'config', []);
  const layoutRelatedList = get(layoutConfigObj, 'relatedList', []);
  const isShowFile = isShowFileSection(layoutRelatedList);

  return (
    <DetailPage
      currencySymbol={currencySymbol}
      isShowFile={isShowFile}
      layoutItemConfigList={layoutItemConfigList}
      requestDetail={requestDetail}
      onClickApproveReject={onClickApproveReject}
      onClickBack={onClickBack}
    />
  );
};

export default DetailContainer;
