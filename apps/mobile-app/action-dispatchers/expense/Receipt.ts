import { FormEvent } from 'react';

import get from 'lodash/get';

import { endLoading, startLoading } from '../../modules/commons/loading';
import msg from '@apps/commons/languages';
import { showToast } from '@apps/commons/modules/toast';
import FileUtil from '@apps/commons/utils/FileUtil';

import {
  Base64FileList,
  DOC_MIME_TYPE,
  OCR_STATUS,
  XLS_MIME_TYPE,
} from '@apps/domain/models/exp/Receipt';

import { AppDispatch } from '../../modules/expense/AppThunk';
import { actions as receiptLibraryAction } from '@apps/domain/modules/exp/receiptLibrary/list';

export const getBase64files =
  (e: FormEvent<HTMLInputElement>) => (dispatch: AppDispatch) => {
    const newFiles = e.currentTarget.files;
    const loadingId = dispatch(startLoading());
    const promise = Array.from(newFiles).map((file) =>
      FileUtil.getBase64(file).then((data) => ({
        name: file.name,
        data,
        size: file.size,
        type: file.type,
      }))
    );
    return Promise.all(promise).then((files: Base64FileList) => {
      dispatch(endLoading(loadingId));
      return files;
    });
  };

/**
 *
 * Upload receipts in record, report, receipt upload tab
 *
 * @param {Base64FileList} base64FileList
 * @param {boolean} [useReceiptScan]
 */
export const uploadReceipts =
  (
    base64FileList: Base64FileList,
    useReceiptScan?: boolean,
    withLoading = true,
    noInfoToast?: boolean,
    prefix?: string
  ) =>
  async (dispatch: AppDispatch) => {
    const { uploadReceipt, getDocumentId, executeOcr } = receiptLibraryAction;
    let loadingId;
    if (withLoading) {
      loadingId = dispatch(startLoading());
    }
    let res;
    try {
      const resUploadReceipt = await dispatch(
        uploadReceipt(base64FileList, prefix)
      );
      if (useReceiptScan) {
        const receiptFileIds =
          (resUploadReceipt && resUploadReceipt.payload) || [];
        receiptFileIds.forEach(
          (x, i) =>
            ![...XLS_MIME_TYPE, ...DOC_MIME_TYPE].includes(
              base64FileList[i].type
            ) && dispatch(executeOcr(x))
        );
      }
      const contentVersionIds = resUploadReceipt.payload;
      const resGetDocumentIds = await dispatch(
        getDocumentId(contentVersionIds)
      );
      const contentDocumentIds = resGetDocumentIds.payload;
      const infoArray = contentVersionIds.map((contentVersionId, index) => {
        return {
          contentVersionId,
          contentDocumentId: contentDocumentIds[index],
        };
      });
      res = infoArray;
      if (!noInfoToast) {
        dispatch(showToast(msg().Exp_Lbl_ReceiptUploadSuccess));
        return res;
      }
    } catch (err) {
      const errMsg =
        (err.message && ` (${err.message})`) ||
        (err.event && ` (${err.event.message})`) ||
        '';
      dispatch(showToast(`${msg().Exp_Lbl_ReceiptUploadFailed}${errMsg}`));
    } finally {
      if (withLoading) {
        dispatch(endLoading(loadingId));
      }
    }
    return res;
  };

export const getReceipts =
  (withOcrInfo?: boolean, withLoading = true) =>
  async (dispatch: AppDispatch) => {
    let loadingId;
    if (withLoading) {
      loadingId = dispatch(startLoading());
    }
    try {
      await dispatch(
        receiptLibraryAction.list(withOcrInfo, false, !withOcrInfo)
      );
    } catch (err) {
      const errMsg =
        (err.message && ` (${err.message})`) ||
        (err.event && ` (${err.event.message})`) ||
        '';
      dispatch(showToast(errMsg));
    } finally {
      if (withLoading) {
        dispatch(endLoading(loadingId));
      }
    }
  };

export const deleteReceipt =
  (receiptId: string) => async (dispatch: AppDispatch) => {
    const loadingId = dispatch(startLoading());
    try {
      await dispatch(receiptLibraryAction.delete(receiptId));
    } catch (err) {
      const errMsg =
        (err.message && ` (${err.message})`) ||
        (err.event && ` (${err.event.message})`) ||
        '';
      dispatch(showToast(errMsg));
    } finally {
      dispatch(endLoading(loadingId));
    }
  };

export const keepGettingStatus =
  (taskId: string, receiptFileId: string) => (dispatch: AppDispatch) => {
    try {
      dispatch(receiptLibraryAction.getOcrStatus(taskId, receiptFileId)).then(
        (res) => {
          if (res.payload.ocrInfo.status !== OCR_STATUS.COMPLETED) {
            setTimeout(
              () => dispatch(keepGettingStatus(taskId, receiptFileId)),
              3000
            );
          }
        }
      );
    } catch (err) {
      const errMsg =
        (err.message && ` (${err.message})`) ||
        (err.event && ` (${err.event.message})`) ||
        '';
      dispatch(showToast(errMsg));
    }
  };

export const executeOcr =
  (receiptFileId: string) => (dispatch: AppDispatch) => {
    try {
      dispatch(receiptLibraryAction.executeOcr(receiptFileId)).then(
        (ocrExecuteRes) => {
          dispatch(
            keepGettingStatus(
              get(ocrExecuteRes, 'payload.taskId'),
              receiptFileId
            )
          );
        }
      );
    } catch (err) {
      const errMsg =
        (err.message && ` (${err.message})`) ||
        (err.event && ` (${err.event.message})`) ||
        '';
      dispatch(showToast(errMsg));
    }
  };
