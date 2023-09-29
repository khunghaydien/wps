import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import DateUtil from '@apps/commons/utils/DateUtil';
import FileUtil from '@commons/utils/FileUtil';

import {
  getOriginalOCRInfo,
  newRecord,
  Record,
} from '@apps/domain/models/exp/Record';

import { ExpenseType } from './ExpenseType';
import { RoundingType } from './foreign-currency/Currency';
import { isUseJctNo, JCT_NUMBER_INVOICE } from './JCTNo';
import { isUseMerchant } from './Merchant';
import {
  Base64FileList,
  batchUpload,
  buildCompositeRequestItem,
  OcrInfo,
  pdfLib,
  SelectedReceipt,
  UPLOAD_RECEIPT_PREFIX,
} from './Receipt';
import { calculateTax, ExpTaxByDate, ExpTaxType } from './TaxType';

export const isBulkRecordUsingDiffReceipts = (ocrDetail: OcrInfo[]) =>
  ocrDetail.length > 1;

/**
 * if multi receipt is selected for bulk record, return the latest date
 */
export const getLatestOCRDate = (ocrDetail: OcrInfo[]) => {
  if (isBulkRecordUsingDiffReceipts) {
    // bulk record using different receipts uses latest date to fetch expense type
    return ocrDetail.reduce(
      (acc, { recordDate }) => (recordDate > acc ? recordDate : acc),
      ''
    );
  }

  return ocrDetail[0]?.recordDate;
};

/**
 * Build multiple records from multiple ocr transactions
 *
 * @returns Record[]
 */
export const generateRecordsFromOCRReceipts = (
  isMobile: boolean,
  selectedReceiptsArr: SelectedReceipt[],
  ocrDetail: OcrInfo[],
  expenseType: ExpenseType,
  empId: string,
  reportId: string,
  taxTypesByDates: ExpTaxByDate,
  taxRoundingSetting: RoundingType,
  baseCurrencyDecimal: number,
  useCashAdvance = false,
  expReportTypeId: string,
  allowNegativeAmount = false,
  useJctRegistrationNumber = false
): Record[] => {
  const isMultipleTax = expenseType?.displayMultipleTaxEntryForm;

  const newRecs = selectedReceiptsArr.map(
    (
      {
        receiptId,
        receiptFileId,
        dataType,
        ocrInfo: originalOCR,
        title,
        receiptFileExtension,
      },
      index
    ) => {
      const ocrInfo = ocrDetail[index];
      const selectedInfo = !isEmpty(ocrInfo) && ocrInfo;
      const amount = get(selectedInfo, 'amount') || 0;
      const recordDate = ocrInfo.recordDate || DateUtil.getToday();
      const {
        originalOCRAmount,
        originalOCRDate,
        originalOCRMerchant,
        originalOCRJctRegistrationNumber,
      } = getOriginalOCRInfo(originalOCR, isMobile);

      if (isMultipleTax) {
        const taxItemsSkeleton = taxTypesByDates?.[recordDate]?.map(
          (
            {
              baseId: taxTypeBaseId,
              historyId: taxTypeHistoryId,
              name: taxTypeName,
              rate: taxRate,
            },
            taxItemIndex
          ) => {
            const amtInclTax = amount ?? 0;

            const commonProps = {
              taxTypeBaseId,
              taxTypeHistoryId,
              taxTypeName,
              taxRate,
              taxManual: false,
            };

            // only populate the first tax item child to tally with the total amount
            // e.g. total = 100, child tax item 1 = 100, child tax item 2 = 0, etc.
            if (taxItemIndex === 0) {
              const { gstVat, amountWithoutTax } = calculateTax(
                taxRate,
                amtInclTax,
                baseCurrencyDecimal,
                taxRoundingSetting
              );

              return {
                ...commonProps,
                amount: amtInclTax,
                withoutTax: Number(amountWithoutTax),
                gstVat: Number(gstVat),
              };
            }

            return {
              ...commonProps,
              amount: 0,
              withoutTax: 0,
              gstVat: 0,
            };
          }
        );

        expenseType.taxItems = taxItemsSkeleton;
      }

      const newRec = newRecord(
        expenseType.id,
        expenseType.name,
        expenseType.recordType,
        expenseType.useForeignCurrency,
        expenseType,
        false,
        expenseType.fileAttachment,
        expenseType.fixedForeignCurrencyId,
        expenseType.foreignCurrencyUsage,
        amount,
        recordDate,
        originalOCRAmount,
        originalOCRDate,
        expenseType.merchant,
        expenseType.withholdingTaxUsage,
        [
          {
            receiptId,
            receiptFileId,
            receiptDataType: dataType,
            receiptTitle: title,
            receiptFileExtension,
          },
        ]
      );

      // build tax info
      const tax = get(
        taxTypesByDates,
        `${ocrInfo.recordDate}.0`,
        {}
      ) as ExpTaxType;
      const taxRate = tax.rate || 0;
      const taxRes = calculateTax(
        taxRate,
        ocrInfo.amount || 0,
        baseCurrencyDecimal,
        taxRoundingSetting
      );
      const recordTax = {
        withoutTax: taxRes.amountWithoutTax,
        gstVat: taxRes.gstVat,
      };
      const itemTax = {
        withoutTax: taxRes.amountWithoutTax,
        gstVat: taxRes.gstVat,
        taxTypeBaseId: tax.baseId || null,
        taxTypeHistoryId: tax.historyId || null,
        taxTypeName: tax.name || null,
        taxRate,
      };

      if (isUseMerchant(expenseType.merchant)) {
        const merchant = ocrInfo.merchant || '';
        (newRec as Record).items[0].merchant = merchant;
      }

      (newRec as Record).items[0].ocrMerchant = originalOCRMerchant; // original scanned data

      if (expenseType.jctRegistrationNumberUsage && useJctRegistrationNumber) {
        (newRec as Record).jctRegistrationNumberUsage =
          expenseType.jctRegistrationNumberUsage;
        if (isUseJctNo(expenseType.jctRegistrationNumberUsage)) {
          (newRec as Record).items[0].jctInvoiceOption =
            JCT_NUMBER_INVOICE.Invoice;
          (newRec as Record).items[0].jctRegistrationNumber =
            originalOCRJctRegistrationNumber; // original scanned data
        }
      }

      newRec.items[0] = {
        ...newRec.items[0],
        ...itemTax,
        amountPayable: amount,
        allowNegativeAmount,
      };

      return {
        ...newRec,
        ...recordTax,
        empId,
        reportId,
        reportTypeId: expReportTypeId,
        useCashAdvance,
      };
    }
  );

  return newRecs;
};

type PdfViewport = {
  height: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  scale: number;
  transform: number[];
  viewBox: number[];
  width: number;
};
type PdfRenderProp = {
  canvasContext: CanvasRenderingContext2D | null;
  viewport: PdfViewport;
};
type PdfGetPage = (pageNum: number) => Promise<{
  _destroy: () => void;
  cleanup: () => void;
  getViewport: (obj: { scale: number }) => PdfViewport;
  render: (renderProp: PdfRenderProp) => { promise: Promise<void> };
}>;
export type OcrPdfDoc = {
  getPage: PdfGetPage;
  numPages: number;
};
export const OCR_PDF_IMG_TYPE = 'image/jpg';
const UPLOAD_PDF_IMG_PEFIX = 'PdfPage_';

/**
 * Get PDF Doc data
 * @param base64Url data:application/pdf;base64,${base64EncodedStr}
 * @returns
 */
export const getPdfDoc = async (base64Url: string) => {
  const base64Data = base64Url.split(',')[1];
  return pdfLib()
    .getDocument({
      data: Buffer.from(base64Data, 'base64'),
    })
    .promise.then((pdf) => pdf)
    .catch((err) => {
      throw err;
    });
};

export const renderPdfPage = async (
  canvas: HTMLCanvasElement,
  pageNum: number,
  pdfDoc: OcrPdfDoc,
  scale = 1
): Promise<undefined> => {
  let page = null;
  try {
    page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const context = canvas.getContext('2d');

    return await page.render({
      canvasContext: context,
      viewport,
    }).promise;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (page) {
      // cleans up resources allocated by the page
      page.cleanup();
    }
  }
};

export const generateBase64File = (
  dataUrl: string,
  pdfFileName: string,
  pageNum?: number
) => {
  const pdfFileNameNoExtension =
    FileUtil.getFileNameWithoutExtension(pdfFileName);
  const imgFileName = pageNum
    ? `${pdfFileNameNoExtension}_${pageNum}.jpg`
    : pdfFileName;
  const data = dataUrl.split(',')[1];
  return {
    data: dataUrl,
    name: imgFileName,
    size: window.atob(data).length,
    type: OCR_PDF_IMG_TYPE,
  };
};

/**
 * Upload PDF & first page image, or image to be scanned
 * @param files [Pdf, First Page Image] or [Second Page Image]
 * @param isOnlySubPage determine if sub page is being uploaded
 */
export const uploadPdfReceipt = async (
  files: Base64FileList,
  isOnlySubPage?: boolean
): Promise<any> => {
  const compositeRequest = files.map((file, idx) => {
    const isSubPage = isOnlySubPage || idx > 0;
    const prefix = isSubPage ? UPLOAD_PDF_IMG_PEFIX : UPLOAD_RECEIPT_PREFIX;
    return buildCompositeRequestItem(prefix, idx, file.name, file.data);
  });
  return batchUpload(files, compositeRequest);
};
