import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import FileUtil from '../../commons/utils/FileUtil';
import msg from '@commons/languages';
import { actions as fileMetadataActions } from '@commons/modules/exp/entities/fileMetadata';

import { Base64FileList, getMetadata } from '../../domain/models/exp/Receipt';
import { BULK_EDIT_UPLOAD_LOADING_AREA } from '@apps/domain/models/exp/Record';

import { actions as receiptLibraryAction } from '../../domain/modules/exp/receiptLibrary/list';
import { AppDispatch } from '../modules/AppThunk';

export const getBase64File =
  (file: File, loadInBackground: boolean) => (dispatch: AppDispatch) => {
    if (!loadInBackground) {
      dispatch(loadingStart());
    }

    return FileUtil.getBase64(file)
      .then((data) => ({
        name: file.name,
        data: String(data),
        size: file.size,
        type: file.type,
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
  (
    base64FileList: Base64FileList,
    loadInBackground: boolean,
    loadingArea?: string
  ) =>
  async (dispatch: AppDispatch) => {
    const { uploadReceipt, getDocumentId } = receiptLibraryAction;
    if (!loadInBackground) {
      const payload = loadingArea
        ? {
            areas: loadingArea,
          }
        : undefined;
      dispatch(loadingStart(payload));
    }

    let res;
    try {
      const resUploadReceipt = await dispatch(uploadReceipt(base64FileList));
      const contentVersionId = resUploadReceipt.payload[0];
      const resGetDocumentId = await dispatch(
        getDocumentId([contentVersionId])
      );
      const contentDocumentId = resGetDocumentId.payload[0];
      res = { contentVersionId, contentDocumentId };
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      if (!loadInBackground) {
        dispatch(loadingEnd(loadingArea));
      }
    }
    return res;
  };

export const deleteReceipt = (receiptId: string) => (dispatch: AppDispatch) => {
  dispatch(loadingStart());
  return dispatch(receiptLibraryAction.delete(receiptId))
    .then(() => {
      dispatch(loadingEnd());
      return true;
    })
    .catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
};

export const handleDropFiles =
  (files: File[]) => async (dispatch: AppDispatch) => {
    dispatch(
      loadingStart({
        areas: BULK_EDIT_UPLOAD_LOADING_AREA,
        loadingHint: msg().Exp_Msg_CreatingNewRecords,
      })
    );
    const receiptList = [];
    const metadataList = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64File = await dispatch(getBase64File(file, true));
      const uploadedFile = await dispatch(uploadReceipts([base64File], true));
      if (uploadedFile) {
        const { contentDocumentId, contentVersionId } = uploadedFile;
        const metadata = await getMetadata(file);
        if (metadata) metadataList.push({ ...metadata, contentDocumentId });
        const { name, type } = base64File;
        receiptList.push({
          receiptId: contentDocumentId,
          receiptFileId: contentVersionId,
          receiptTitle: FileUtil.getFileNameWithoutExtension(name),
          receiptDataType: type,
          receiptCreatedDate: new Date().toString(),
          receiptFileExtension: FileUtil.getFileExtension(name) as string,
        });
      }
    }
    if (metadataList.length > 0) {
      dispatch(fileMetadataActions.saveList(metadataList));
    }
    dispatch(loadingEnd(BULK_EDIT_UPLOAD_LOADING_AREA));
    return receiptList;
  };
