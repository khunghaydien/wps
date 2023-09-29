import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { actions as requestDetailActions } from '@commons/modules/customRequest/entities/requestDetail';

import { isShowFileSection } from '@apps/domain/models/customRequest';
import {
  CUSTOM_REQUEST_APPROVAL_COLUMNS,
  CUSTOM_REQUEST_ID_FIELD_KEY,
} from '@apps/domain/models/customRequest/consts';

import { State } from '../../modules';
import { actions as sideFileActions } from '../../modules/ui/sideFilePreview';

import {
  approve,
  approveSingle,
  reject,
  rejectSingle,
} from '../../action-dispatchers/CustomRequest';

import EditFormContainer from '@apps/approvals-pc/containers/CustomRequest/Dialog/EditFormContainer';

import Detail from '../../components/CustomRequest/Detail';

const DetailContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;
  const { currencySymbol, photoUrl } = useSelector(
    (state: State) => state.userSetting
  );
  const layoutConfigList = useSelector(
    (state: State) => state.ui.customRequest.layoutConfigList
  );
  const requestDetail = useSelector(
    (state: State) => state.common.customRequest.entities.requestDetail
  );
  const isShowSidePanel = useSelector(
    (state: State) => !isEmpty(state.ui.sideFilePreview)
  );
  const isApexView = useSelector((state: State) => state.ui.isApexView);
  const showLoading = useSelector(
    (state: State) => state.common.app.loadingDepth > 0
  );

  const selectedReportTypeId = get(
    requestDetail,
    'customRequest.RecordTypeId',
    ''
  );
  const layoutConfigObj = layoutConfigList.find(
    ({ recordTypeId: layoutRecordTypeId }) =>
      layoutRecordTypeId === selectedReportTypeId
  );
  const layoutConfig = get(layoutConfigObj, 'config', []);
  const layoutRelatedList = get(layoutConfigObj, 'relatedList', []);
  const isShowFile = isShowFileSection(layoutRelatedList);
  const fieldsToSelect = [
    ...layoutConfig.map(({ field }) => field),
    ...Object.values(CUSTOM_REQUEST_APPROVAL_COLUMNS),
    CUSTOM_REQUEST_ID_FIELD_KEY,
  ];

  const Actions = bindActionCreators(
    {
      onApprove: approve,
      onReject: reject,
      onApproveSingle: approveSingle,
      onRejectSingle: rejectSingle,
      setSideFile: sideFileActions.set,
      hideSideFile: sideFileActions.clear,
    },
    dispatch
  );

  const onApprove = (comment: string, requestIdList: string[]) => {
    if (isApexView) {
      Actions.onApproveSingle(
        comment,
        requestIdList,
        fieldsToSelect,
        isShowFile
      );
    } else {
      Actions.onApprove(comment, requestIdList);
    }
  };

  const onReject = (comment: string, requestIdList: string[]) => {
    if (isApexView) {
      Actions.onRejectSingle(
        comment,
        requestIdList,
        fieldsToSelect,
        isShowFile
      );
    } else {
      Actions.onReject(comment, requestIdList);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(requestDetailActions.clear());
      Actions.hideSideFile();
    };
  }, []);

  return (
    <Detail
      currencySymbol={currencySymbol}
      editFormContainer={EditFormContainer}
      isShowFile={isShowFile}
      isShowSidePanel={isShowSidePanel}
      layoutConfig={layoutConfig}
      requestDetail={requestDetail}
      userPhotoUrl={photoUrl}
      isApexView={isApexView}
      showLoading={showLoading}
      setSideFile={Actions.setSideFile}
      hideSideFile={Actions.hideSideFile}
      onApprove={onApprove}
      onReject={onReject}
    />
  );
};

export default DetailContainer;
