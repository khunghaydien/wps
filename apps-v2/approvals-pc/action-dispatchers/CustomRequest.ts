import { catchApiError, loadingEnd, loadingStart } from '@commons/actions/app';
import { actions as customRequestApprovalListActions } from '@commons/modules/customRequest/entities/approvalList';
import { actions as requestDetailActions } from '@commons/modules/customRequest/entities/requestDetail';

import {
  generateLayoutItems,
  getHelpMsgLabelField,
  getLayout,
  isShowFileSection,
} from '@apps/domain/models/customRequest';
import {
  CUSTOM_REQUEST_APPROVAL_COLUMNS,
  CUSTOM_REQUEST_ID_FIELD_KEY,
  CUSTOM_REQUEST_SF_OBJECT_NAME,
} from '@apps/domain/models/customRequest/consts';

import { State } from '../modules';
import { actions as layoutConfigActions } from '../modules/ui/customRequest/layoutConfigList';
import { actions as approvalActions } from '@apps/domain/modules/approval/request/approve';
import { actions as rejectActions } from '@apps/domain/modules/approval/request/reject';

import { AppDispatch } from './AppThunk';

export const getCustomRequestDetail =
  (requestId: string, recordTypeId: string) =>
  async (dispatch: AppDispatch, getState: () => State) => {
    try {
      dispatch(loadingStart());
      const { layoutConfigList } = getState().ui.customRequest;
      const selectedLayout =
        layoutConfigList.find(
          ({ recordTypeId: layoutRecordTypeId }) =>
            layoutRecordTypeId === recordTypeId
        ) || {};
      let selectedLayoutItems = selectedLayout.config;
      let layoutRelatedList = selectedLayout.relatedList;

      if (!selectedLayoutItems) {
        const [layout, hintList] = await Promise.all([
          getLayout(recordTypeId, CUSTOM_REQUEST_SF_OBJECT_NAME),
          getHelpMsgLabelField(),
        ]);
        selectedLayoutItems = generateLayoutItems(layout, hintList);
        layoutRelatedList = layout.relatedLists || [];
        dispatch(
          layoutConfigActions.set(
            selectedLayoutItems,
            layoutRelatedList,
            recordTypeId
          )
        );
      }

      const isShowFile = isShowFileSection(layoutRelatedList);
      const fieldsToSelect = [
        ...selectedLayoutItems.map(({ field }) => field),
        ...Object.values(CUSTOM_REQUEST_APPROVAL_COLUMNS),
        CUSTOM_REQUEST_ID_FIELD_KEY,
      ];
      await dispatch(
        requestDetailActions.get(requestId, fieldsToSelect, isShowFile, true)
      );
    } catch (err) {
      dispatch(catchApiError(err));
    } finally {
      dispatch(loadingEnd());
    }
  };

export const approve =
  (comment: string, requestIdList: string[]) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(approvalActions.approve(requestIdList, comment))
      .then(() => {
        dispatch(customRequestApprovalListActions.list());
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .finally(() => dispatch(loadingEnd()));
  };

export const reject =
  (comment: string, requestIdList: string[]) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(rejectActions.reject(requestIdList, comment))
      .then(() => {
        dispatch(customRequestApprovalListActions.list());
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .finally(() => dispatch(loadingEnd()));
  };

export const approveSingle =
  (
    comment: string,
    requestIdList: string[],
    fieldsToSelect: string[],
    isShowFile: boolean
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(approvalActions.approve(requestIdList, comment))
      .then(() => {
        dispatch(
          requestDetailActions.get(
            requestIdList[0],
            fieldsToSelect,
            isShowFile,
            true
          )
        );
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .finally(() => dispatch(loadingEnd()));
  };

export const rejectSingle =
  (
    comment: string,
    requestIdList: string[],
    fieldsToSelect: string[],
    isShowFile: boolean
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(rejectActions.reject(requestIdList, comment))
      .then(() => {
        dispatch(
          requestDetailActions.get(
            requestIdList[0],
            fieldsToSelect,
            isShowFile,
            true
          )
        );
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .finally(() => dispatch(loadingEnd()));
  };
