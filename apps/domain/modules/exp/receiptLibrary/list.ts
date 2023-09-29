import { Reducer } from 'redux';

import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

import {
  Base64FileList,
  DOC_MIME_TYPE,
  getDocumentId,
  OCR_STATUS,
  OcrPage,
  UNKNOWN_TYPE,
  uploadReceipt,
  XLS_MIME_TYPE,
} from '../../../models/exp/Receipt';
import {
  deleteReceipt,
  executeOcr,
  FilePreview,
  getOCRStatus,
  getReceipts,
  OcrStatusRes,
  ReceiptList,
} from '../../../models/exp/receipt-library/list';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  GET: 'MODULES/ENTITIES/EXP/RECEIPT_LIBRARY/GET',
  GET_OCR_STATUS: 'MODULES/ENTITIES/EXP/RECEIPT_LIBRARY/GET_OCR_STATUS',
  SET_OCR_STATUS: 'MODULES/ENTITIES/EXP/RECEIPT_LIBRARY/SET_OCR_STATUS',
  GET_DOCUMENT_ID: 'MODULES/ENTITIES/EXP/RECEIPT_LIBRARY/GET_DOCUMENT_ID',
  LIST: 'MODULES/ENTITIES/EXP/RECEIPT_LIBRARY/LIST',
  DELETE: 'MODULES/ENTITIES/EXP/RECEIPT_LIBRARY/DELETE',
  SAVE: 'MODULES/ENTITIES/EXP/RECEIPT_LIBRARY/SAVE',
  OCR_SUCCESS: 'MODULES/ENTITIES/EXP/RECEIPT_LIBRARY/OCR_SUCCESS',
  CLEAR: 'MODULES/EXPENSES/DIALOG/CLEAR',
  UPDATE_PAGES: 'MODULES/ENTITIES/EXP/RECEIPT_LIBRARY/UPDATE_PAGES',
};

const listSuccess = (res: ReceiptList, isNewUpload?: boolean) => ({
  type: ACTIONS.LIST,
  payload: { result: res, isNewUpload },
});

const getOCRStatusSuccess = (res: OcrStatusRes, receiptFileId?: string) => ({
  type: ACTIONS.GET_OCR_STATUS,
  payload: { ...res, receiptFileId },
});

const getDocumentIdSuccess = (res: string[]) => ({
  type: ACTIONS.GET_DOCUMENT_ID,
  payload: res,
});

export const setOCRStatusSuccess = (receiptFileId: string, status?: string) => {
  return {
    type: ACTIONS.SET_OCR_STATUS,
    payload: { receiptFileId, status },
  };
};

const saveSuccess = (res: string) => {
  return {
    type: ACTIONS.SAVE,
    payload: res,
  };
};
const deleteSuccess = (res: string) => {
  return {
    type: ACTIONS.DELETE,
    payload: res,
  };
};
const ocrSuccess = (res: string) => {
  return {
    type: ACTIONS.OCR_SUCCESS,
    payload: res,
  };
};

export const actions = {
  list:
    (withOcrInfo?: boolean, isNewUpload?: boolean, showAllFiles = true) =>
    (dispatch: AppDispatch): void | any => {
      return getReceipts(withOcrInfo)
        .then((res: ReceiptList) => {
          const filteredOCRReceipts = !showAllFiles
            ? res.filter(
                (x) =>
                  ![...DOC_MIME_TYPE, ...XLS_MIME_TYPE, UNKNOWN_TYPE].includes(
                    x.fileType
                  )
              )
            : res;
          return dispatch(listSuccess(filteredOCRReceipts, isNewUpload));
        })
        .catch((err) => {
          throw err;
        });
    },
  getOcrStatus:
    (taskId: string, receiptFileId?: string) =>
    (dispatch: AppDispatch): void | any =>
      getOCRStatus(taskId)
        .then((res: OcrStatusRes) => {
          return dispatch(getOCRStatusSuccess(res, receiptFileId));
        })
        .catch((err) => {
          throw err;
        }),
  executeOcr:
    (receiptFileId: string) =>
    (dispatch: AppDispatch): void | any => {
      dispatch(setOCRStatusSuccess(receiptFileId, OCR_STATUS.IN_PROGRESS));
      return executeOcr(receiptFileId)
        .then((res) => dispatch(ocrSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },
  executePdfOcr:
    (receiptFileId: string, pdfPageId: string, pdfPageNum: number) =>
    (dispatch: AppDispatch): void | any => {
      dispatch(setOCRStatusSuccess(receiptFileId, OCR_STATUS.IN_PROGRESS));
      return executeOcr(receiptFileId, pdfPageId, pdfPageNum)
        .then((res) => dispatch(ocrSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },
  delete:
    (receiptId: string) =>
    (dispatch: AppDispatch): void | any => {
      return deleteReceipt([receiptId])
        .then(() => dispatch(deleteSuccess(receiptId)))
        .catch((err) => {
          throw err;
        });
    },
  uploadReceipt:
    (base64FileList: Base64FileList, prefix?: string) =>
    (dispatch: AppDispatch): void | any => {
      return uploadReceipt(base64FileList, prefix)
        .then((res) => dispatch(saveSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },
  getDocumentId:
    (ids: string[]) =>
    (dispatch: AppDispatch): Promise<{ payload: string[]; type: string }> =>
      getDocumentId(ids)
        .then((res) => dispatch(getDocumentIdSuccess(res)))
        .catch((err) => {
          throw err;
        }),
  updatePages: (receiptFileId: string, pages: OcrPage[]) => ({
    type: ACTIONS.UPDATE_PAGES,
    payload: { receiptFileId, pages },
  }),
};

type State = {
  receiptPreview: Array<FilePreview>;
  receipts: ReceiptList;
  totalSize: number;
};
const initialState = {
  receipts: [],
  totalSize: 0,
  receiptPreview: [],
};

/* Reducer */

export default ((state = initialState, action) => {
  let receipts = cloneDeep(state.receipts);
  switch (action.type) {
    case ACTIONS.LIST:
      receipts = action.payload.result.reverse();

      if (receipts && action.payload.isNewUpload) {
        set(receipts[0], 'ocrInfo.status', OCR_STATUS.IN_PROGRESS);
      }

      return { ...state, receipts };
    case ACTIONS.GET:
    case ACTIONS.GET_OCR_STATUS:
      const receiptFileId = action.payload.receiptFileId;
      const updatedReceipts = receipts.map((x) => {
        return {
          ...x,
          ocrInfo:
            x.contentVersionId === receiptFileId
              ? action.payload.ocrInfo
              : x.ocrInfo,
        };
      });
      return {
        ...state,
        receipts: updatedReceipts,
      };
    case ACTIONS.SET_OCR_STATUS:
      const idx = receipts.findIndex(
        (x) => x.contentVersionId === action.payload.receiptFileId
      );

      if (idx > -1) {
        set(receipts[idx], 'ocrInfo.status', action.payload.status);
      }

      return {
        ...state,
        receipts,
      };
    case ACTIONS.DELETE:
      receipts.splice(
        receipts.findIndex((item) => item.contentDocumentId === action.payload),
        1
      );
      return { ...state, receipts };
    case ACTIONS.OCR_SUCCESS:
      return { ...state, ...action.payload };
    case ACTIONS.UPDATE_PAGES:
      const { receiptFileId: updatePageFileId, pages } = action.payload;
      const updatePageIdx = receipts.findIndex(
        (x) => x.contentVersionId === updatePageFileId
      );
      if (updatePageIdx > -1) {
        set(receipts[updatePageIdx], 'pages', pages);
      }
      return {
        ...state,
        receipts,
      };
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<State, any>;
