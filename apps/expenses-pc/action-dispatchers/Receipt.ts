import get from 'lodash/get';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import FileUtil from '../../commons/utils/FileUtil';
import { SelectedPdfIdsList } from '@commons/components/exp/Form/Dialog/ReceiptLibrary';
import msg from '@commons/languages';
import { actions as fileMetadataActions } from '@commons/modules/exp/entities/fileMetadata';
import { actions as ocrPdfDocsActions } from '@commons/modules/exp/ui/ocrPdfDocs';
import { toFixedNumber } from '@commons/utils/NumberUtil';

import {
  generateBase64File,
  getPdfDoc,
  OCR_PDF_IMG_TYPE,
  OcrPdfDoc,
  renderPdfPage,
  uploadPdfReceipt,
} from '../../domain/models/exp/OCR';
import {
  Base64File,
  Base64FileList,
  FileMetadata,
  getMetadataFromPdf,
  OCR_STATUS,
  SelectedReceipt,
} from '../../domain/models/exp/Receipt';
import {
  Base64Receipt,
  getBase64Receipt,
  OcrStatusRes,
} from '@apps/domain/models/exp/receipt-library/list';

import {
  ACTIONS,
  actions as receiptLibraryAction,
  setOCRStatusSuccess,
} from '../../domain/modules/exp/receiptLibrary/list';
import { State } from '../modules';
import { AppDispatch } from '../modules/AppThunk';
import { dialogTypes } from '../modules/ui/expenses/dialog/activeDialog';
import { actions as ocrDetailActions } from '../modules/ui/expenses/receiptLibrary/ocrDetail';
import { actions as selectedReceiptActions } from '../modules/ui/expenses/receiptLibrary/selectedReceipt';

export const uploadReceipts =
  (base64FileList: Base64FileList, loadInBackground: boolean) =>
  async (dispatch) => {
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

export const deleteReceipt =
  (receiptId: string) =>
  (dispatch: AppDispatch): Promise<boolean | void> => {
    dispatch(loadingStart());
    return dispatch(receiptLibraryAction.delete(receiptId))
      .then(() => {
        dispatch(loadingEnd());
        return true;
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
  };

export const executeOcr =
  (receiptFileId: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    return dispatch(receiptLibraryAction.executeOcr(receiptFileId))
      .then((res) => res)
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(dispatch(loadingEnd()));
  };

export const getBase64File =
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

/**
 * Refresh ocr status untill it’s processed
 *
 * @param {string} taskId
 * @param {string} receiptFileId
 */
export const keepGettingStatus =
  (taskId: string, receiptFileId: string) =>
  (dispatch: AppDispatch, getState: () => State) => {
    return dispatch(
      receiptLibraryAction.getOcrStatus(taskId, receiptFileId)
    ).then((res) => {
      const state = getState();
      const activeDialog = get(state, 'ui.expenses.dialog.activeDialog', []);
      const isOCROpen = activeDialog.includes(dialogTypes.OCR_RECEIPTS);
      if (isOCROpen && res.payload.ocrInfo.status !== OCR_STATUS.COMPLETED) {
        setTimeout(
          () => dispatch(keepGettingStatus(taskId, receiptFileId)),
          3000
        );
      }
    });
  };

type OcrStatus = {
  payload: OcrStatusRes;
  type: typeof ACTIONS.GET_OCR_STATUS;
};
/**
 * Refresh PDF status that is scanned in OCR_RECEIPT_DETAIL,
 * and update redux state with scanned data
 * @param {string} taskId
 * @param {string} receiptFileId
 * @param {number} selectedIdx
 * @param {SelectedReceipt} selectedReceipt
 */
export const keepGettingPdfStatus =
  (taskId: string, receiptFileId: string, selectedReceipt?: SelectedReceipt) =>
  (dispatch: AppDispatch, getState: () => State) => {
    return dispatch(
      receiptLibraryAction.getOcrStatus(taskId, receiptFileId)
    ).then((res: OcrStatus) => {
      const { status } = res.payload.ocrInfo;
      const state = getState();
      const selectedReceiptList = get(
        state,
        'ui.expenses.receiptLibrary.selectedReceipt',
        []
      );
      const activeDialog = get(state, 'ui.expenses.dialog.activeDialog', []);
      const isOCROpen =
        activeDialog.includes(dialogTypes.OCR_RECEIPTS) ||
        activeDialog.includes(dialogTypes.OCR_RECEIPT_DETAIL);
      const idx = selectedReceiptList.findIndex(
        (receipt: SelectedReceipt) => receipt.receiptFileId === receiptFileId
      );

      // update scanned pages for when user navigates between receipt & receipt detail dialogs
      const pages = get(res, 'payload.pages');
      const selectedPages = get(selectedReceipt, 'pages');
      if (pages && selectedPages && selectedPages.length !== pages.length) {
        dispatch(selectedReceiptActions.updatePages(idx, null, pages));
        dispatch(receiptLibraryAction.updatePages(receiptFileId, pages));
      }

      // update redux state with scanned data
      if (status === OCR_STATUS.COMPLETED) {
        const ocrInfoResult = get(res, 'payload.ocrInfo.result');
        if (idx > -1 && ocrInfoResult && pages) {
          // update ocr info result with converted amount based on decimal places
          const copyOcrInfoResult = { ...ocrInfoResult };
          const decimalPlaces = get(
            state,
            'userSetting.currencyDecimalPlaces',
            0
          );
          copyOcrInfoResult.amount = toFixedNumber(
            ocrInfoResult.amount,
            decimalPlaces
          );
          dispatch(ocrDetailActions.setOne(copyOcrInfoResult, idx));
          // update original ocr info result
          dispatch(selectedReceiptActions.updatePages(idx, ocrInfoResult));
        }
      } else if (isOCROpen) {
        setTimeout(
          () => dispatch(keepGettingPdfStatus(taskId, receiptFileId)),
          3000
        );
      }
    });
  };

/**
 * Get PDF Doc for rendering & first page base64File for uploading
 * @param base64File
 * @param pageNum
 * @returns { imgBase64File, pdfDoc }
 */
const getPdfbase64List = async (
  base64File: Base64File,
  pageNum: number
): Promise<{
  imgBase64File: Base64File | null;
  pdfDoc: OcrPdfDoc;
}> => {
  let pdfDoc = null;
  try {
    const { data, name } = base64File;
    let imgBase64File = null;
    pdfDoc = await getPdfDoc(data);

    if (pdfDoc) {
      const canvas = document.createElement('canvas');

      await renderPdfPage(canvas, pageNum, pdfDoc);

      const dataUrl = canvas.toDataURL(OCR_PDF_IMG_TYPE);
      const base64File = generateBase64File(dataUrl, name, pageNum);
      imgBase64File = base64File;
      canvas.remove();
    }
    return {
      imgBase64File,
      pdfDoc,
    };
  } catch (err) {
    const error = {
      errorCode: 'PDF_CONVERT_FAILED',
      message: `PDF ${msg().Exp_Lbl_ReceiptUploadFailed}`,
    };
    throw error;
  } finally {
    if (pdfDoc) {
      // cleans up resources allocated by the document on main and worker threads
      pdfDoc.cleanup();
    }
  }
};

/**
 * Upload PDF and first page, execute OCR for first page
 * @param pdfBase64File
 * @param uploadedPdfContentDocId passed when scanning an existing PDF (upload first page only)
 * @param uploadedPdfContentVerId passed when scanning an existing PDF (upload first page only)
 * @returns {receiptId,receiptFileId,receiptData,ocrInfo}
 */
export const uploadAndExecuteOcrPdf =
  (
    pdfBase64File: Base64File,
    uploadedPdfContentDocId?: string,
    uploadedPdfContentVerId?: string
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const pageNum = 1;
      const { imgBase64File, pdfDoc } = await getPdfbase64List(
        pdfBase64File,
        pageNum
      );

      const isUploadPdf = !uploadedPdfContentDocId;
      const base64UploadList = isUploadPdf ? [pdfBase64File] : [];
      if (imgBase64File) base64UploadList.push(imgBase64File);

      // upload
      const contentVerIdList = await uploadPdfReceipt(
        base64UploadList,
        !isUploadPdf // upload subpage only
      );
      const pdfContentVerId = isUploadPdf
        ? contentVerIdList[0]
        : uploadedPdfContentVerId;
      const firstPageContentVerId = contentVerIdList[isUploadPdf ? 1 : 0];

      // execute ocr for first image
      const ocrExecuteRes = await (dispatch(
        receiptLibraryAction.executePdfOcr(
          pdfContentVerId,
          firstPageContentVerId,
          pageNum
        )
      ) || {});
      const ocrExecuteObj = ocrExecuteRes.payload || {};
      dispatch(keepGettingStatus(ocrExecuteObj.taskId, pdfContentVerId));

      // store pdf object for rendering images in confirm dialog
      let pdfContentDocId = uploadedPdfContentDocId;
      if (isUploadPdf) {
        const getDocIdres = await dispatch(
          receiptLibraryAction.getDocumentId(contentVerIdList)
        );
        pdfContentDocId = getDocIdres.payload[0];
      }
      if (pdfContentDocId) {
        dispatch(ocrPdfDocsActions.add(pdfDoc, pdfContentDocId));
      }

      // retrieve metdata if pdf has one image, inclu. 2 pages with 1 image
      if (isUploadPdf) {
        const metadata = await getMetadataFromPdf(undefined, pdfDoc);
        if (metadata) {
          dispatch(
            fileMetadataActions.save({
              ...metadata,
              contentDocumentId: pdfContentDocId,
            })
          );
        }
      }

      // return pdf data
      return {
        receiptId: pdfContentDocId,
        receiptFileId: pdfContentVerId,
        receiptData: pdfBase64File.data,
        ocrInfo: { status: OCR_STATUS.IN_PROGRESS },
      };
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
      return {};
    }
  };

export const fetchBase64Receipt =
  (contentVerId: string) =>
  async (dispatch: AppDispatch): Promise<Base64Receipt> => {
    try {
      return await getBase64Receipt(contentVerId);
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    }
  };

/**
 * Execute OCR for PDF first page on 'Scan the Receipt Information' click
 * @param pdfContentVerId
 * @param fileMetadata
 * @returns null
 */
export const executePdfSubPageOcr =
  (pdfContentVerId: string, fileMetadataList: FileMetadata[]) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setOCRStatusSuccess(pdfContentVerId, OCR_STATUS.IN_PROGRESS));

      const base64Pdf = await dispatch(fetchBase64Receipt(pdfContentVerId))
        // @ts-ignore
        .then((res) => res);

      const {
        contentDocumentId: pdfContentDocId,
        fileBody,
        fileType,
        title,
      } = base64Pdf;

      const pdfFileType = fileType.toLowerCase();
      const dataUrl = `data:application/${pdfFileType};base64,${fileBody}`;
      const pdfTitle = `${FileUtil.getOriginalFileNameWithoutPrefix(
        title
      )}.${pdfFileType}`;
      const pdfBase64File = generateBase64File(dataUrl, pdfTitle);

      await dispatch(
        uploadAndExecuteOcrPdf(pdfBase64File, pdfContentDocId, pdfContentVerId)
      );

      const pdfMetadata = fileMetadataList.find(
        (metadata) => metadata.contentDocumentId === pdfContentDocId
      );
      if (!pdfMetadata) {
        dispatch(fileMetadataActions.fetch([pdfContentDocId]));
      }
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
      dispatch(setOCRStatusSuccess(pdfContentVerId, OCR_STATUS.NOT_PROCESSED));
    } finally {
      dispatch(loadingEnd());
    }
  };

/**
 * Fetch base64 data url for previewing PDF
 * @param selectedPdfIdsList an array of selected pdf content document and version ids
 * @returns null
 */
export const getScannedPdf =
  (selectedPdfIdsList: SelectedPdfIdsList) =>
  async (dispatch: AppDispatch, getState: () => State) => {
    let pdfDoc = null;
    try {
      dispatch(loadingStart());
      const contentVerIdList = selectedPdfIdsList.map(
        ({ receiptFileId }) => receiptFileId
      );
      const promiseList = contentVerIdList.map(async (contentVerId) => {
        const base64Pdf = await dispatch(fetchBase64Receipt(contentVerId));
        if (base64Pdf) {
          const { contentDocumentId, fileBody } = base64Pdf;
          const dataUrl = `data:application/pdf;base64,${fileBody}`;
          pdfDoc = await getPdfDoc(dataUrl);
          if (pdfDoc) {
            dispatch(ocrPdfDocsActions.add(pdfDoc, contentDocumentId));
          }
        }
      });
      await Promise.all(promiseList);

      // fetch metdata
      const fileMetadata = getState().common.exp.entities.fileMetadata;
      const metadataContentDocIdList = fileMetadata.map(
        (metadata) => metadata.contentDocumentId
      );
      const contentDocIdList = selectedPdfIdsList.map(
        ({ receiptId }) => receiptId
      );
      const fetchDocIdList = contentDocIdList.filter(
        (id) => !metadataContentDocIdList.includes(id)
      );

      if (fetchDocIdList.length > 0) {
        dispatch(fileMetadataActions.fetch(fetchDocIdList));
      }
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
    } finally {
      if (pdfDoc) {
        // cleans up resources allocated by the document on main and worker threads
        pdfDoc.cleanup();
      }
      dispatch(loadingEnd());
    }
  };
