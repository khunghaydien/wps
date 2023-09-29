import { catchApiError, loadingEnd, loadingStart } from '@commons/actions/app';
import { actions as customRequestListAction } from '@commons/modules/customRequest/entities/customRequestList';
import { actions as referenceLabelFieldActions } from '@commons/modules/customRequest/entities/referenceLabelField';
import { actions as referenceLayoutActions } from '@commons/modules/customRequest/entities/referenceLayout';
import { actions as referenceRecordsActions } from '@commons/modules/customRequest/entities/referenceRecords';
import { actions as requestDetailActions } from '@commons/modules/customRequest/entities/requestDetail';
import FileUtil from '@commons/utils/FileUtil';

import {
  AttachedFile,
  AttachedFiles,
} from '@apps/domain/models/common/AttachedFile';
import {
  getAllReferenceRecords,
  getCustomReferenceLayout,
  getReferenceLabelField,
  getStandardReferenceLayout,
  isCustomObject,
  searchCustomRecords,
  searchStandardRecords,
  updatedCustomRequest,
} from '@apps/domain/models/customRequest';
import { FILE_PREFIX } from '@apps/domain/models/customRequest/consts';
import {
  CustomRequests,
  FieldTypeMap,
  LayoutData,
} from '@apps/domain/models/customRequest/types';
import { getDocumentId, uploadReceipt } from '@apps/domain/models/exp/Receipt';

import { AppDispatch } from '../modules/AppThunk';

export const initializeReferenceDialog =
  (objectName: string, fieldName: string) => async (dispatch: AppDispatch) => {
    try {
      const isCustom = isCustomObject(objectName);
      dispatch(loadingStart());
      let layoutData = [];
      if (isCustom) {
        layoutData = await getCustomReferenceLayout(objectName);
      } else {
        layoutData = await getStandardReferenceLayout(objectName);
      }
      const labelField = await getReferenceLabelField(objectName);
      dispatch(referenceLabelFieldActions.set(objectName, labelField));
      dispatch(referenceLayoutActions.set(objectName, layoutData, fieldName));
      const layoutKeys = layoutData.map(({ name }) => name);
      const records = await getAllReferenceRecords(objectName, layoutKeys);
      dispatch(referenceRecordsActions.set(objectName, records));
    } catch (err) {
      dispatch(catchApiError(err));
    } finally {
      dispatch(loadingEnd());
    }
  };

export const searchReference =
  (objectName: string, layoutData: Array<LayoutData>, query: string) =>
  async (dispatch: AppDispatch) => {
    try {
      const isCustom = isCustomObject(objectName);
      dispatch(loadingStart());
      let records = [];
      const layoutKeys = layoutData.map(({ name }) => name);
      if (!query) {
        records = await getAllReferenceRecords(objectName, layoutKeys);
      } else if (isCustom) {
        records = await searchCustomRecords(objectName, layoutData, query);
      } else {
        records = await searchStandardRecords(objectName, layoutKeys, query);
      }
      dispatch(referenceRecordsActions.set(objectName, records));
    } catch (err) {
      dispatch(catchApiError(err));
    } finally {
      dispatch(loadingEnd());
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
    isShownHistory: boolean,
    isApproval?: boolean,
    userId?: string
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(loadingStart());
      const id = valueMapList[0].Id;
      const _ = undefined;
      await updatedCustomRequest(
        valueMapList,
        fieldTypeMap,
        attachedFileList,
        isApproval
      );

      if (!isApproval) {
        dispatch(
          customRequestListAction.list(
            sObjName,
            fieldsToSelect,
            userId,
            recordTypeId
          )
        );
      }
      dispatch(
        requestDetailActions.get(
          id,
          fieldsToSelect,
          isShownFile,
          isShownHistory
        )
      );
    } catch (err) {
      dispatch(catchApiError(err));
    } finally {
      dispatch(loadingEnd());
    }
  };

const getBase64File =
  (file: File, loadInBackground?: boolean) => (dispatch: AppDispatch) => {
    const { name = '', size, type } = file;
    if (!loadInBackground) {
      dispatch(loadingStart());
    }

    return FileUtil.getBase64(file)
      .then((data) => ({
        name,
        data: String(data),
        size,
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
  (file: File, loadInBackground?: boolean) =>
  async (dispatch: AppDispatch): Promise<AttachedFile | undefined> => {
    if (!loadInBackground) {
      dispatch(loadingStart());
    }

    let res;
    try {
      const base64File = await dispatch(getBase64File(file));
      const resUploadReceipt = await uploadReceipt([base64File], FILE_PREFIX);
      const contentVersionId = resUploadReceipt[0];
      const resGetDocumentId = await getDocumentId([contentVersionId]);
      const contentDocumentId = resGetDocumentId[0];
      res = {
        attachedFileId: contentDocumentId,
        attachedFileVerId: contentVersionId,
        attachedFileDataType: base64File.type,
        attachedFileName: FileUtil.getFileNameWithoutExtension(base64File.name),
        attachedFileCreatedDate: new Date(),
        attachedFileExtension: FileUtil.getFileExtension(base64File.name),
      };
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      if (!loadInBackground) {
        dispatch(loadingEnd());
      }
    }
    return res;
  };
