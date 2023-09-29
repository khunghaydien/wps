import { bindActionCreators } from 'redux';

import { get } from 'lodash';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import msg from '@commons/languages';
import { actions as customRequestListAction } from '@commons/modules/customRequest/entities/customRequestList';
import { actions as requestDetailActions } from '@commons/modules/customRequest/entities/requestDetail';
import { showToast, showToastWithType } from '@commons/modules/toast';

import { AttachedFiles } from '@apps/domain/models/common/AttachedFile';
import {
  createCustomRequest,
  deleteCustomRequests,
  generateLayoutItems,
  getHelpMsgLabelField,
  getLayout,
  recallCustomRequest,
  submitCustomRequest,
} from '@apps/domain/models/customRequest';
import {
  CustomRequest,
  CustomRequests,
  FieldTypeMap,
  LayoutItem,
} from '@apps/domain/models/customRequest/types';

import { AppDispatch } from '@custom-request-pc/modules/AppThunk';
import { actions as defaultRequestActions } from '@custom-request-pc/modules/entities/defaultRequest';
import { actions as recordTypeListActions } from '@custom-request-pc/modules/entities/recordTypeList';
import { actions as buttonsConfigActions } from '@custom-request-pc/modules/ui/buttonsConfig';
import { actions as layoutConfigDialogUIActions } from '@custom-request-pc/modules/ui/dialog/layoutConfig';
import { actions as layoutConfigUIActions } from '@custom-request-pc/modules/ui/layoutConfig';
import { actions as layoutDetailUIActions } from '@custom-request-pc/modules/ui/layoutDetailInfo';
import { actions as selectedIdUIAction } from '@custom-request-pc/modules/ui/selectedId';
import { actions as selectedRecordTypeIdUIActions } from '@custom-request-pc/modules/ui/selectedRecordTypeId';

const App = (dispatch: AppDispatch) =>
  bindActionCreators({ loadingStart, loadingEnd, catchApiError }, dispatch);

const generateLayout =
  (sObjName: string, layoutItems: Array<LayoutItem>, isDialog?: boolean) =>
  (dispatch: AppDispatch) => {
    const configAction = isDialog
      ? layoutConfigDialogUIActions
      : layoutConfigUIActions;
    dispatch(configAction.set(layoutItems, sObjName));
  };

export const initRecordTypes = () => async (dispatch: AppDispatch) => {
  const app = App(dispatch);
  try {
    app.loadingStart();
    const res = await dispatch(recordTypeListActions.get());
    const recordTypeId = get(res, 'records[0].id');
    dispatch(selectedRecordTypeIdUIActions.set(recordTypeId));
  } catch (err) {
    app.catchApiError(err);
  } finally {
    app.loadingEnd();
  }
};

export const initialize =
  (recordTypeId: string, objectName: string) =>
  async (dispatch: AppDispatch) => {
    const app = App(dispatch);
    try {
      app.loadingStart();
      const [layout, hintList] = await Promise.all([
        getLayout(recordTypeId, objectName),
        getHelpMsgLabelField(),
      ]);
      dispatch(
        layoutDetailUIActions.set({
          relatedLists: layout.relatedLists,
        })
      );
      dispatch(
        generateLayout(objectName, generateLayoutItems(layout, hintList))
      );
      const buttonsConfig =
        get(layout, 'buttonLayoutSection.detailButtons') || [];
      const buttons = buttonsConfig.map(({ name }) => name);
      dispatch(buttonsConfigActions.set(buttons));
    } catch (err) {
      app.catchApiError(err);
    } finally {
      app.loadingEnd();
    }
  };

export const initializeDialog =
  (recordTypeId?: string, objectName?: string) =>
  async (dispatch: AppDispatch) => {
    const app = App(dispatch);
    try {
      app.loadingStart();
      const [layout, hintList] = await Promise.all([
        getLayout(recordTypeId, objectName),
        getHelpMsgLabelField(),
      ]);
      dispatch(
        layoutDetailUIActions.set({
          relatedLists: layout.relatedLists,
        })
      );
      dispatch(
        generateLayout(objectName, generateLayoutItems(layout, hintList), true)
      );
      await dispatch(defaultRequestActions.get(recordTypeId));
    } catch (err) {
      app.catchApiError(err);
    } finally {
      app.loadingEnd();
    }
  };

export const createNewRequest =
  (
    valueMapList: CustomRequests,
    fieldTypeMap: FieldTypeMap,
    sObjName: string,
    fieldsToSelect: Array<string>,
    recordTypeId: string,
    userId: string,
    attachedFileList: AttachedFiles
  ) =>
  async (dispatch: AppDispatch) => {
    const app = App(dispatch);
    try {
      app.loadingStart();
      const { recordId } = await createCustomRequest(
        valueMapList,
        fieldTypeMap,
        attachedFileList
      );
      dispatch(selectedRecordTypeIdUIActions.set(recordTypeId));
      dispatch(
        customRequestListAction.list(
          sObjName,
          fieldsToSelect,
          userId,
          recordTypeId
        )
      );
      return recordId;
    } catch (err) {
      app.catchApiError(err);
    } finally {
      app.loadingEnd();
    }
  };

export const cloneMultiRequest =
  (
    infoArray: Array<{ value: CustomRequest; fieldTypeMap: FieldTypeMap }>,
    sObjName: string,
    fieldsToSelect: Array<string>,
    recordTypeId: string,
    userId: string
  ) =>
  async (dispatch: AppDispatch) => {
    const app = App(dispatch);
    try {
      app.loadingStart();
      const promises = infoArray.map(({ value, fieldTypeMap }) =>
        createCustomRequest([value], fieldTypeMap, [])
      );
      // allSettled not exist for current tsconfig
      const res = await (Promise as any).allSettled(promises);
      await dispatch(
        customRequestListAction.list(
          sObjName,
          fieldsToSelect,
          userId,
          recordTypeId
        )
      );
      const failedNames = [];
      res.forEach(({ status }, idx) => {
        if (status !== 'fulfilled') {
          const CR = infoArray[idx].value;
          const originalName = CR.Name.replace(
            msg().Exp_Lbl_ReportClonePrefix,
            ''
          );
          failedNames.push(originalName);
        }
      });
      if (failedNames.length === 0) {
        dispatch(showToast(msg().Com_Msg_RequestsCloned));
      } else {
        const errMsg = `${msg().Com_Msg_CloneFailedFor} ${failedNames.join()}`;
        dispatch(showToastWithType(errMsg, 4000, 'error'));
      }
    } catch (err) {
      app.catchApiError(err);
    } finally {
      app.loadingEnd();
    }
  };

export const cloneRequest =
  (
    valueMapList: CustomRequests,
    fieldTypeMap: FieldTypeMap,
    sObjName: string,
    fieldsToSelect: Array<string>,
    recordTypeId: string,
    userId: string
  ) =>
  async (dispatch: AppDispatch) => {
    const app = App(dispatch);
    try {
      app.loadingStart();
      const { recordId } = await createCustomRequest(
        valueMapList,
        fieldTypeMap,
        []
      );
      dispatch(showToast(msg().Com_Msg_RequestCloned));
      dispatch(
        customRequestListAction.list(
          sObjName,
          fieldsToSelect,
          userId,
          recordTypeId
        )
      );
      dispatch(selectedIdUIAction.set(recordId));
    } catch (err) {
      app.catchApiError(err);
    } finally {
      app.loadingEnd();
    }
  };

export const deleteRequests =
  (
    recordIds: string[],
    sObjName: string,
    fieldsToSelect: string[],
    recordTypeId: string,
    userId: string
  ) =>
  async (dispatch: AppDispatch) => {
    const app = App(dispatch);
    try {
      app.loadingStart();
      await deleteCustomRequests(recordIds);
      dispatch(
        customRequestListAction.list(
          sObjName,
          fieldsToSelect,
          userId,
          recordTypeId
        )
      );
    } catch (err) {
      app.catchApiError(err);
    } finally {
      app.loadingEnd();
    }
  };

export const recallRequest =
  (
    recordId: string,
    comment: string,
    fieldsToSelect: Array<string>,
    isShownFile: boolean,
    isShownHistory: boolean,
    sObjName: string,
    recordTypeId: string,
    userId: string
  ) =>
  async (dispatch: AppDispatch) => {
    const app = App(dispatch);
    try {
      app.loadingStart();
      await recallCustomRequest(recordId, comment);
      dispatch(
        requestDetailActions.get(
          recordId,
          fieldsToSelect,
          isShownFile,
          isShownHistory
        )
      );
      dispatch(
        customRequestListAction.list(
          sObjName,
          fieldsToSelect,
          userId,
          recordTypeId,
          true
        )
      );
      return true;
    } catch (err) {
      app.catchApiError(err);
    } finally {
      app.loadingEnd();
    }
  };

export const submitRequest =
  (
    recordId: string,
    comment: string,
    fieldsToSelect: Array<string>,
    isShownFile: boolean,
    isShownHistory: boolean,
    sObjName: string,
    recordTypeId: string,
    userId: string
  ) =>
  async (dispatch: AppDispatch) => {
    const app = App(dispatch);
    try {
      app.loadingStart();
      await submitCustomRequest(recordId, comment);
      dispatch(
        requestDetailActions.get(
          recordId,
          fieldsToSelect,
          isShownFile,
          isShownHistory
        )
      );
      dispatch(
        customRequestListAction.list(
          sObjName,
          fieldsToSelect,
          userId,
          recordTypeId,
          true
        )
      );
      return true;
    } catch (err) {
      app.catchApiError(err);
    } finally {
      app.loadingEnd();
    }
  };

export const getSelectedRecordTypeLayout =
  (recordTypeId: string, objectName: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(loadingStart());
      const [layout, hintList] = await Promise.all([
        getLayout(recordTypeId, objectName),
        getHelpMsgLabelField(),
      ]);
      dispatch(
        layoutDetailUIActions.set({
          relatedLists: layout.relatedLists,
        })
      );
      dispatch(
        generateLayout(objectName, generateLayoutItems(layout, hintList))
      );
    } catch (err) {
      dispatch(catchApiError(err));
    } finally {
      dispatch(loadingEnd());
    }
  };
