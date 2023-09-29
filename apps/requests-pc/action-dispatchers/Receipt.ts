import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import FileUtil from '../../commons/utils/FileUtil';

import { Base64FileList } from '../../domain/models/exp/Receipt';

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
  (base64FileList: Base64FileList, loadInBackground: boolean) =>
  async (dispatch: AppDispatch) => {
    const { uploadReceipt, getDocumentId } = receiptLibraryAction;
    if (!loadInBackground) {
      dispatch(loadingStart());
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
        dispatch(loadingEnd());
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
