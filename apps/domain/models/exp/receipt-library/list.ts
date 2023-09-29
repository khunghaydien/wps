import Api from '../../../../commons/api';

import { OcrPage, OcrStatusInfo } from '../Receipt';

export type Receipt = {
  contentDocumentId: string;
  contentVersionId: string;
  createdDate?: string;
  fileExtension?: string;
  fileType?: string;
  ocrInfo?: Record<string, any>;
  pages: OcrPage[];
  receiptData?: string;
  receiptFileId: string;
  title?: string;
};
export type ReceiptList = Array<Receipt>;

export type FilePreview = {
  fileBody: string;
  fileType: string;
  receiptId: string;
  title: string;
};

export type Base64Receipt = {
  contentDocumentId: string;
  fileBody: string; // base64 encoded
  fileType: string;
  title: string;
  uploadedDate: string;
};

export type OcrStatusRes = {
  ocrInfo: OcrStatusInfo;
  pages: OcrPage[];
};

export const getOCRStatus = (taskId: string): Promise<OcrStatusRes> => {
  return Api.invoke({
    path: '/exp/receipt/ocr/get-status',
    param: {
      taskId,
    },
  });
};

export const getReceipts = (withOcrInfo?: boolean): Promise<ReceiptList> => {
  return Api.invoke({
    path: '/exp/receipt/list',
    param: {
      type: 'Receipt',
      withOcrInfo,
    },
  }).then((res) => {
    return res.files;
  });
};

export const getBase64Receipt = (
  contentVersionId: string,
  getFileBody = true
): Promise<Base64Receipt> => {
  return Api.invoke({
    path: '/exp/receipt/get',
    param: { contentVersionId, getFileBody },
  });
};

export const deleteReceipt = (
  receiptIdList: string[]
): Promise<ReceiptList> => {
  return Api.invoke({
    path: '/exp/receipt/delete',
    param: { contentDocumentIds: receiptIdList },
  });
};

export const executeOcr = (
  receiptId: string,
  pdfPageId?: string,
  pdfPageNum?: number
): Promise<string> => {
  return Api.invoke({
    path: '/exp/receipt/ocr/execute',
    param: { receiptId, pdfPageId, pdfPageNum },
  });
};
