import { actions as customRequestApprovalListActions } from '@commons/modules/customRequest/entities/approvalList';
import { actions as requestDetailActions } from '@commons/modules/customRequest/entities/requestDetail';
import { catchApiError } from '@mobile/modules/commons/error';
import { endLoading, startLoading } from '@mobile/modules/commons/loading';

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

import { State } from '@mobile/modules';
import { actions as layoutConfigActions } from '@mobile/modules/approval/ui/customRequest/layoutConfigList';

import { AppDispatch } from '../AppThunk';

export const fetchCustomRequestList = () => async (dispatch: AppDispatch) => {
  const loadingId = dispatch(startLoading());
  try {
    await dispatch(customRequestApprovalListActions.list());
  } finally {
    dispatch(endLoading(loadingId));
  }
};

export const getCustomRequestDetail =
  (requestId: string, recordTypeId: string) =>
  async (dispatch: AppDispatch, getState: () => State) => {
    const loadingId = dispatch(startLoading());
    try {
      const { layoutConfigList } = getState().approval.ui.customRequest;
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
      dispatch(endLoading(loadingId));
    }
  };
