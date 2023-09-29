import { bindActionCreators } from 'redux';

import { get } from 'lodash';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import msg from '@commons/languages';
import { showToast, showToastWithType } from '@commons/modules/toast';
import FileUtil from '@commons/utils/FileUtil';

import { AttachedFiles } from '@apps/domain/models/common/AttachedFile';
import {
  Base64FileList,
  getDocumentId,
  uploadReceipt,
} from '@apps/domain/models/exp/Receipt';
import {
  createCustomRequest,
  deleteCustomRequests,
  generateLayoutItems,
  getLayout,
  recallCustomRequest,
  submitCustomRequest,
  updatedCustomRequest,
} from '@custom-request-pc/models';

import { AppDispatch } from '@custom-request-pc/modules/AppThunk';
import { actions as customRequestListAction } from '@custom-request-pc/modules/entities/customRequestList';
import { actions as recordTypeListActions } from '@custom-request-pc/modules/entities/recordTypeList';
import { actions as requestDetailActions } from '@custom-request-pc/modules/entities/requestDetail';
import { actions as buttonsConfigActions } from '@custom-request-pc/modules/ui/buttonsConfig';
import { actions as layoutConfigDialogUIActions } from '@custom-request-pc/modules/ui/dialog/layoutConfig';
import { actions as layoutConfigUIActions } from '@custom-request-pc/modules/ui/layoutConfig';
import { actions as layoutDetailUIActions } from '@custom-request-pc/modules/ui/layoutDetailInfo';
import { actions as selectedIdUIAction } from '@custom-request-pc/modules/ui/selectedId';
import { actions as selectedRecordTypeIdUIActions } from '@custom-request-pc/modules/ui/selectedRecordTypeId';

import { FILE_PREFIX } from '@custom-request-pc/consts';
import {
  CustomRequest,
  CustomRequests,
  FieldTypeMap,
  LayoutItem,
} from '@custom-request-pc/types';

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
      const layout = await getLayout(recordTypeId, objectName);
      dispatch(
        layoutDetailUIActions.set({
          relatedLists: layout.relatedLists,
        })
      );
      dispatch(generateLayout(objectName, generateLayoutItems(layout)));
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
      const layout = await getLayout(recordTypeId, objectName);
      dispatch(generateLayout(objectName, generateLayoutItems(layout), true));
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
    attachedFileList: AttachedFiles
  ) =>
  async (dispatch: AppDispatch) => {
    const app = App(dispatch);
    try {
      app.loadingStart();
      await createCustomRequest(valueMapList, fieldTypeMap, attachedFileList);
      dispatch(selectedRecordTypeIdUIActions.set(recordTypeId));
      dispatch(
        customRequestListAction.list(sObjName, fieldsToSelect, recordTypeId)
      );
    } catch (err) {
      app.catchApiError(err);
    } finally {
      app.loadingEnd();
    }
  };

export const updateRequest =
  (
    valueMapList: CustomRequests,
    fieldTypeMap: FieldTypeMap,
    sObjName: string,
    fieldsToSelect: Array<string>,
    recordTypeId: string,
    attachedFileList: AttachedFiles,
    isShownFile: boolean,
    isShownHistory: boolean
  ) =>
  async (dispatch: AppDispatch) => {
    const app = App(dispatch);
    try {
      app.loadingStart();
      const id = valueMapList[0].Id;
      await updatedCustomRequest(valueMapList, fieldTypeMap, attachedFileList);
      dispatch(
        customRequestListAction.list(sObjName, fieldsToSelect, recordTypeId)
      );
      dispatch(
        requestDetailActions.get(
          id,
          fieldsToSelect,
          isShownFile,
          isShownHistory
        )
      );
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
    recordTypeId: string
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
        customRequestListAction.list(sObjName, fieldsToSelect, recordTypeId)
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
    recordTypeId: string
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
        customRequestListAction.list(sObjName, fieldsToSelect, recordTypeId)
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
    recordTypeId: string
  ) =>
  async (dispatch: AppDispatch) => {
    const app = App(dispatch);
    try {
      app.loadingStart();
      await deleteCustomRequests(recordIds);
      dispatch(
        customRequestListAction.list(sObjName, fieldsToSelect, recordTypeId)
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
    recordTypeId: string
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
    recordTypeId: string
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

export const getBase64File =
  (file: File, loadInBackground?: boolean) => (dispatch: AppDispatch) => {
    const { name = '', size, type } = file;
    if (!loadInBackground) {
      dispatch(loadingStart());
    }

    return FileUtil.getBase64(file)
      .then((data) => ({
        name: name,
        data: String(data),
        size: size,
        type: type || `.${name.split('.').pop()}`,
      }))
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
        throw err;
      })
      .finally(() => {
        if (!loadInBackground) {
          dispatch(loadingEnd());
        }
      });
  };

export const uploadReceipts =
  (base64FileList: Base64FileList, loadInBackground?: boolean) =>
  async (dispatch) => {
    if (!loadInBackground) {
      dispatch(loadingStart());
    }

    let res;
    try {
      const resUploadReceipt = await uploadReceipt(base64FileList, FILE_PREFIX);
      const contentVersionId = resUploadReceipt[0];
      const resGetDocumentId = await getDocumentId([contentVersionId]);
      const contentDocumentId = resGetDocumentId[0];
      res = { contentVersionId, contentDocumentId };
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      if (!loadInBackground) {
        dispatch(loadingEnd());
      }
    }
    return res;
  };
