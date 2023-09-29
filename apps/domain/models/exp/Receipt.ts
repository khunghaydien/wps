import { get, some } from 'lodash';
import { $Values } from 'utility-types';

import Api from '../../../commons/api';
import SALESFORCE_API_VERSION from '../../../commons/config/salesforceApiVersion';
import FileUtil from '../../../commons/utils/FileUtil';
import UrlUtil from '../../../commons/utils/UrlUtil';
import msg from '@commons/languages';
import { toFixedNumber } from '@commons/utils/NumberUtil';
import TextUtil from '@commons/utils/TextUtil';

import { OcrPdfDoc } from './OCR';
import exifr from 'exifr';
import ExifReader from 'exifreader';
import pdfjsLib from 'pdfjs-dist/build/pdf.min';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min';

const pdfjsWorkerBlob = new Blob([pdfjsWorker]);
const pdfjsWorkerBlobURL = window.URL.createObjectURL(pdfjsWorkerBlob);
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerBlobURL;

export type SelectedReceipt = {
  dataType: string;
  ocrInfo: Record<string, any>;
  pages?: OcrPage[];
  receiptData: string;
  receiptFileId: string;
  receiptId: string;
  title: string;
  uploadedDate: string;
};

export type OcrStatusInfo = {
  error: ErrorResponseBody | null;
  result: OcrInfo | null;
  status: typeof OCR_STATUS[keyof typeof OCR_STATUS];
  taskId: string;
};

export type OcrPage = {
  ocrInfo: OcrStatusInfo;
  pdfPageId: string; // contentVersionId
  pdfPageNum: number;
};

export type OcrInfo = {
  amount?: number;
  jctRegistrationNumber?: string;
  merchant?: string;
  recordDate?: string;
};

export const OCR_STATUS = {
  COMPLETED: 'Completed',
  IN_PROGRESS: 'InProgress',
  NOT_PROCESSED: 'NotProcessed',
  QUEUED: 'Queued',
} as const;

export type Base64File = {
  data: string;
  name: string;
  size: number;
  type: string;
};

export type Base64FileList = Array<Base64File>;

export const IMAGE_QUALITY_STATUS = {
  NG: 'NG',
  OK: 'OK',
  NA: 'NA', // exclusively for dpi = null
};

export type FileMetadata = {
  // optional props are generated in BE
  id?: string;
  colorComponents: number;
  colorDepth: number;
  colorSpace: string;
  colorStatus?: $Values<typeof IMAGE_QUALITY_STATUS>;
  contentDocumentId: string;
  dpi: number;
  dpiStatus?: $Values<typeof IMAGE_QUALITY_STATUS>;
  imageHeight: number;
  imageWidth: number;
  resolutionStatus?: $Values<typeof IMAGE_QUALITY_STATUS>;
  resolutionUnit?: number;
};

/**
 * get warning msg based on dch status
 *
 * @param {FileMetadata} metadata
 * @param {boolean} isRequest if quotation, skip color check
 * @returns {string}
 */
export const getMetadataWarning = (
  metadata: FileMetadata,
  isRequest?: boolean
): string => {
  if (!metadata) {
    return '';
  }

  const { colorStatus, dpiStatus, resolutionStatus } = metadata;
  const isColorOk = colorStatus === IMAGE_QUALITY_STATUS.OK;
  const isColorNA = colorStatus === IMAGE_QUALITY_STATUS.NA;
  const isResolutionOk =
    dpiStatus === IMAGE_QUALITY_STATUS.OK ||
    resolutionStatus === IMAGE_QUALITY_STATUS.OK;

  const msgResoNG = TextUtil.template(
    msg().Exp_Msg_NotMeetDCH,
    msg().Exp_Lbl_Resolution
  );
  const msgBothNG = TextUtil.template(
    msg().Exp_Msg_NotMeetDCHPlural,
    msg().Exp_Lbl_Resolution,
    msg().Exp_Lbl_ColorSpace
  );
  const msgColorNG = TextUtil.template(
    msg().Exp_Msg_NotMeetDCHColor,
    msg().Exp_Lbl_ColorSpace
  );
  const msgBothNA = msg().Exp_Msg_DCHBothNA;
  const msgColorNA = msg().Exp_Msg_DCHColorNA;
  let text = '';

  // both NOT ok
  if (!isColorOk && !isResolutionOk) {
    if (isRequest) {
      text = msgResoNG;
    } else if (isColorNA) {
      text = msgBothNA;
    } else {
      text = msgBothNG;
    }

    // color ok
  } else if (isColorOk && !isResolutionOk) {
    text = msgResoNG;

    // resolution ok
  } else if (!isColorOk && isResolutionOk) {
    if (isRequest) {
      text = '';
    } else if (isColorNA) {
      text = msgColorNA;
    } else {
      text = msgColorNG;
    }
  }
  return text;
};

/**
 * for display dch data
 * @param {FileMetadata} metadata
 * @returns {string}
 */
export const getMetadataDisplay = (metadata: FileMetadata): string => {
  if (!metadata) {
    return '';
  }

  const {
    dpi,
    imageHeight,
    imageWidth,
    colorComponents,
    colorDepth,
    colorSpace,
  } = metadata;
  const dpiText = dpi ? dpi + 'dpi' : msg().Exp_Lbl_NotFound;
  const resolutionText =
    (imageHeight || 0) + 'px' + ' * ' + (imageWidth || 0) + 'px';
  const color = colorComponents * colorDepth;
  const colorText = color
    ? color + 'bit'
    : colorSpace || msg().Exp_Lbl_NotFound;

  const text =
    msg().Exp_Lbl_Resolution +
    ' : ' +
    dpiText +
    ', ' +
    resolutionText +
    ', ' +
    msg().Exp_Lbl_Color +
    ' : ' +
    colorText;

  return text;
};

export const getDisplayStatus = (status: string) => {
  const { NOT_PROCESSED, COMPLETED, IN_PROGRESS, QUEUED } = OCR_STATUS;
  switch (status) {
    case NOT_PROCESSED:
      return msg().Exp_Lbl_StatusNotScanned;
    case IN_PROGRESS:
    case QUEUED:
      return msg().Exp_Lbl_StatusProcessing;
    case COMPLETED:
      return msg().Exp_Lbl_StatusScanned;
    default:
      return msg().Exp_Lbl_StatusNotScanned;
  }
};

/**
 *
 * @param file
 * @param pdfDoc pdf object returned from pdf.js getDocument()
 * @returns image metadata
 */
export const getMetadataFromPdf = async (file?, pdfDoc?: OcrPdfDoc) => {
  try {
    let doc = null;
    if (pdfDoc) {
      doc = pdfDoc;
    } else {
      const fileUrl = window.URL.createObjectURL(file);
      doc = await pdfjsLib.getDocument({ url: fileUrl }).promise;
    }
    const promises = [];
    for (let p = 1; p <= doc.numPages; p++) {
      promises.push(doc.getPage(p));
    }

    let imgCount = 0;
    let imgKey;
    let imgPageIdx;
    const pages = await Promise.all(promises);

    await Promise.all(
      pages.map(async (page, pageIdx) => {
        const ops = await page.getOperatorList();

        ops.argsArray.every((arg, i) => {
          const t = ops.fnArray[i];
          if (
            t === pdfjsLib.OPS.paintJpegXObject ||
            t === pdfjsLib.OPS.paintImageXObject
          ) {
            imgCount++;
            imgKey = arg[0];
            imgPageIdx = pageIdx;
          }

          // only save metadata if there is one image in pdf
          if (imgCount > 1) {
            imgKey = null;
            imgPageIdx = null;
            return false;
          }
          return true;
        });
      })
    );

    if (!imgKey || imgPageIdx === undefined) {
      return null;
    }

    const page = pages[imgPageIdx];
    const img = page.objs.get(imgKey);
    let imgMetadata;

    if (img.src) {
      imgMetadata = await generateMetadata(img.src);
    } else if (img.data) {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      let array;
      switch (img.data.length) {
        case img.width * img.height * 3:
          array = new Uint8ClampedArray(img.width * img.height * 4);
          for (let index = 0; index < array.length; index++) {
            // Set alpha channel to full
            if (index % 4 === 3) {
              array[index] = 255;
            }
            // Copy RGB channel components from the original array
            else {
              const test = img.data[~~(index / 4) * 3 + (index % 4)];
              array[index] = test;
            }
          }
          break;

        case img.width * img.height * 4:
          array = img.data;
          break;

        default:
          // unsupported image
          return null;
      }

      ctx.putImageData(new ImageData(array, img.width, img.height), 0, 0);
      const dataUrl = canvas.toDataURL();
      imgMetadata = getMetadataFromPNG(dataUrl);
    }
    return imgMetadata;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// SF Rest API Response
type ErrorResponseBody = Array<{
  errorCode: string;
  fields?: Array<string>;
  message: string;
}>;

type SuccessResponseBody = {
  id: string;
  errors: Array<string>;
  success: boolean;
};

type CompositeResponseContent = {
  body: SuccessResponseBody | ErrorResponseBody;
  httpHeaders: {
    Location?: string;
  };
  httpStatusCode: number;
  referenceId: string;
};

export type CompositeResponsResponse = {
  compositeResponse: Array<CompositeResponseContent>;
};

export const VALID_OCR_EXTENSIONS = ['jpg', 'jpeg', 'png', 'pdf', 'gif'];

export const VALID_EXTENSIONS = [
  ...VALID_OCR_EXTENSIONS,
  'doc',
  'docx',
  'xls',
  'xlsx',
];

export const DOC_MIME_TYPE = [
  'WORD',
  'WORD_X',
  'msword',
  'application/msword',
  'vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const XLS_MIME_TYPE = [
  'EXCEL',
  'EXCEL_X',
  'vnd.ms-excel',
  'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
export const PDF_MIME_TYPE = ['application/pdf', 'PDF', 'pdf'];

export const IMG_MIME_TYPE = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/gif',
];

const HEIC_MIME_TYPE = ['image/heic'];

const PNG_MIME_TYPE = ['image/png'];

const GIF_MIME_TYPE = ['image/gif'];

export const UNKNOWN_TYPE = 'UNKNOWN'; // heic is UNKNOWN type in sf

export const ALLOWED_MIME_TYPES = [
  ...DOC_MIME_TYPE,
  ...XLS_MIME_TYPE,
  ...PDF_MIME_TYPE,
  ...IMG_MIME_TYPE,
  ...HEIC_MIME_TYPE,
  ...VALID_EXTENSIONS.map((x) => `.${x}`),
];

const isGIF = (fileType?: string) => GIF_MIME_TYPE.includes(fileType);

const isPNG = (fileType?: string) => PNG_MIME_TYPE.includes(fileType);

export const isPDF = (fileType?: string) => PDF_MIME_TYPE.includes(fileType);

export const isDOC = (fileType?: string) => DOC_MIME_TYPE.includes(fileType);

export const isXLS = (fileType?: string) => XLS_MIME_TYPE.includes(fileType);

export const isUnknownType = (fileType?: string) => fileType === UNKNOWN_TYPE;
const isHeic = (fileType?: string) => HEIC_MIME_TYPE.includes(fileType);

export const isNotImage = (fileType?: string) =>
  isPDF(fileType) ||
  isDOC(fileType) ||
  isXLS(fileType) ||
  isHeic(fileType) || // heic treated as non image when preview, as it's not supported in browser
  isUnknownType(fileType);

const isSupportByExifReader = (fileType?: string) =>
  (!isNotImage(fileType) && !isGIF(fileType)) ||
  isHeic(fileType) ||
  isUnknownType(fileType);

const instanceUrl = UrlUtil.getInstanceUrl();

export const SF_PREVIEW_SIZE = {
  SMALL: 'THUMB120BY90',
  MEDIUM: 'THUMB240BY180',
  LARGE: 'THUMB720BY480',
};

export const previewUrl = (
  receiptFileId?: string,
  isPdf?: boolean,
  size?: $Values<typeof SF_PREVIEW_SIZE>
): string => {
  if (!receiptFileId) {
    return '';
  }
  const previewSize = size || SF_PREVIEW_SIZE.SMALL;
  const rendition = isPdf ? previewSize : 'ORIGINAL_Png';
  return `${instanceUrl}/sfc/servlet.shepherd/version/renditionDownload?rendition=${rendition}&versionId=${receiptFileId}`;
};

export const fileDownloadUrl = (fileId?: string) => {
  return (
    fileId &&
    `${instanceUrl}/sfc/servlet.shepherd/document/download/${fileId}?operationContext=S1`
  );
};

export const SERVICE_API_PATH = `/services/data/v${SALESFORCE_API_VERSION}`;
export const UPLOAD_RECEIPT_PREFIX = 'Receipt_';

export const BASE_FILE_SIZE = 5242880;
export const MAX_FILE_SIZE = 4 * BASE_FILE_SIZE;

const requestComposite = async (compositeRequest) => {
  const res = await (Api.requestSFApi(`${SERVICE_API_PATH}/composite/`, {
    allOrNone: true,
    compositeRequest,
  }).catch((err) => {
    const error = {
      errorCode: err.errorCode,
      message: err.message,
      stackTrace: null,
    };
    throw error;
  }) as CompositeResponsResponse);
  const { compositeResponse } = res;
  if (!compositeResponse) {
    throw new Error('Some Unknown Error Happened.');
  }
  return compositeResponse;
};

export const uploadReceipt = async (
  files: Base64FileList,
  prefix = UPLOAD_RECEIPT_PREFIX
): Promise<any> => {
  const compositeRequest = files.map((file, idx) =>
    buildCompositeRequestItem(prefix, idx, file.name, file.data)
  );
  return batchUpload(files, compositeRequest);
};

export const buildCompositeRequestItem = (
  prefix: string,
  idx: number,
  fileName: string,
  fileData: string
) => ({
  method: 'POST',
  url: `${SERVICE_API_PATH}/sobjects/ContentVersion`,
  referenceId: `${prefix.toLowerCase()}${idx}`,
  body: {
    Title: `${prefix}${FileUtil.getFileNameWithoutExtension(fileName)}`,
    PathOnClient: fileName,
    VersionData: fileData.substr(fileData.indexOf(',') + 1),
  },
});

export const batchUpload = async (
  files: Base64FileList,
  compositeRequest
): Promise<any> => {
  const compositeResponse = await requestComposite(compositeRequest).catch(
    (err) => {
      throw err;
    }
  );
  if (
    // upload is rollbacked when some error happened in any one of receipt.
    some(
      compositeResponse,
      (comRes) => comRes.httpStatusCode !== 200 && comRes.httpStatusCode !== 201
    )
  ) {
    const errorMessage = compositeResponse
      .map((comRes, idx) => `${files[idx].name} : ${comRes.body[0].message}`)
      .join('\n');

    const error = {
      errorCode: 'UPLOAD_FAILED',
      message: errorMessage,
      stackTrace: null,
    };
    throw error;
  }
  return compositeResponse.map((comRes) => (comRes.body as any).id);
};

// sample
//
// SF Api success response
//
// compositeResponse: [
//   {
//     body: { id: '0687F00000U5dHOQAZ', success: true, errors: [] },
//     httpHeaders: {
//       Location:
//         '/services/data/v40.0/sobjects/ContentVersion/0687F00000U5dHOQAZ',
//     },
//     httpStatusCode: 201,
//     referenceId: 'receipt_0',
//   },
//   {
//     body: { id: '0687F00000U5dHPQAZ', success: true, errors: [] },
//     httpHeaders: {
//       Location:
//         '/services/data/v40.0/sobjects/ContentVersion/0687F00000U5dHPQAZ',
//     },
//     httpStatusCode: 201,
//     referenceId: 'receipt_1',
//   },
// ],

// SF Api error response
//
//  compositeResponse: [
//    {
//      body: [
//        {
//          message: 'Please input values: [VersionData]',
//          errorCode: 'REQUIRED_FIELD_MISSING',
//          fields: ['VersionData'],
//        },
//      ],
//      httpHeaders: {},
//      httpStatusCode: 400,
//      referenceId: 'receipt_0',
//    },
//    {
//      body: [
//        {
//          errorCode: 'PROCESSING_HALTED',
//          message:
//            'The transaction was rolled back since another operation in the same transaction failed.',
//        },
//      ],
//      httpHeaders: {},
//      httpStatusCode: 400,
//      referenceId: 'receipt_1',
//    },
//  ]

export const getDocumentId = async (ids: string[]): Promise<string[]> => {
  const compositeRequest = ids.map((id) => ({
    method: 'GET',
    url: `${SERVICE_API_PATH}/sobjects/ContentVersion/${id}`,
    referenceId: id,
  }));
  const compositeResponse = await requestComposite(compositeRequest).catch(
    (err) => {
      throw err;
    }
  );
  if (
    some(
      compositeResponse,
      (comRes) => comRes.httpStatusCode !== 200 && comRes.httpStatusCode !== 201
    )
  ) {
    const errorMessage = compositeResponse
      .map((comRes, idx) => `${ids[idx]} : ${comRes.body[0].message}`)
      .join('\n');

    const error = {
      errorCode: 'UPLOAD_FAILED',
      message: errorMessage,
      stackTrace: null,
    };
    throw error;
  }
  return compositeResponse.map(
    (comRes) => (comRes.body as any).ContentDocumentId
  );
};

export const AMOUNT_MATCH_STATUS = {
  OK: 'OK',
  ERROR: 'ERROR',
};

export const generateOCRAmountMsg = (
  originalOCRAmount = 0,
  recordAmount = 0,
  baseCurrencyDecimal: number,
  amountMsgKey = 'Exp_Clbl_Amount'
) => {
  const roundDownOCR = toFixedNumber(originalOCRAmount, baseCurrencyDecimal);
  const amount = Number(recordAmount);
  let message = '';
  let status = '';
  if (originalOCRAmount === amount) {
    message = TextUtil.template(
      msg().Exp_Msg_MatchedWithReceipt,
      msg()[amountMsgKey]
    );
    status = AMOUNT_MATCH_STATUS.OK;
    // if no scan result (ocrAmount = null,0) and amount is 0, show please verify
    if (!originalOCRAmount) {
      message = TextUtil.template(
        msg().Exp_Msg_PleaseVerifyReceipt,
        msg()[amountMsgKey]
      );
      status = AMOUNT_MATCH_STATUS.ERROR;
    }
  } else if (roundDownOCR === amount) {
    message = TextUtil.template(
      msg().Exp_Msg_PleaseVerifyReceipt,
      msg()[amountMsgKey]
    );
    status = AMOUNT_MATCH_STATUS.ERROR;
  } else {
    message = TextUtil.template(
      msg().Exp_Msg_ManuallyEntered,
      msg()[amountMsgKey]
    );
    status = AMOUNT_MATCH_STATUS.ERROR;
  }

  return { message, status };
};

const RESOLUTION_UNIT_MAP = {
  inches: 2,
  cm: 3,
};

const getMetadataFromPNG = async (file) => {
  const tags = (await exifr.parse(file)) || {};
  const imageWidth = tags.ImageWidth || 0;
  const imageHeight = tags.ImageHeight || 0;
  const colorSpace = tags.ColorType;
  const colorDepth = tags.BitDepth || null;
  const dpi = tags.XResolution || null;
  let resolutionUnit = tags.ResolutionUnit;
  resolutionUnit =
    (resolutionUnit && RESOLUTION_UNIT_MAP[resolutionUnit]) || null;
  return {
    imageWidth,
    imageHeight,
    colorSpace,
    colorDepth,
    dpi,
    resolutionUnit,
  };
};

const generateMetadata = async (file) => {
  const tags = await ExifReader.load(file);
  const imageWidth = Number(
    get(tags, 'Image Width.value') || get(tags, 'PixelXDimension.value') || 0
  );
  const imageHeight = Number(
    get(tags, 'Image Height.value') || get(tags, 'PixelYDimension.value') || 0
  );
  const csIos = get(tags, 'Color Space.description');
  const csAndroid = get(tags, 'ColorSpace.description');
  const csPc = get(tags, 'Color Type.description');
  const colorSpace = String(csIos || csAndroid || csPc || '').trim();
  const colorDepth = Number(
    get(tags, 'Bits Per Sample.value') || get(tags, 'Bit Depth.value') || null
  );
  const colorComponents = Number(get(tags, 'Color Components.value', null));
  // dpi = null -> status = NA; dpi < standard -> status = NG
  const dpi = Number(get(tags, 'XResolution.description', 0)) || null;
  const resolutionUnit = get(tags, 'ResolutionUnit.value', null);
  return {
    imageWidth,
    imageHeight,
    colorSpace,
    colorDepth,
    colorComponents,
    dpi,
    resolutionUnit,
  };
};

export const getMetadata = async (file) => {
  let metadata;
  if (isPNG(file.type)) {
    metadata = await getMetadataFromPNG(file);
  } else if (isPDF(file.type)) {
    metadata = await getMetadataFromPdf(file);
  } else if (isSupportByExifReader(file.type)) {
    metadata = await generateMetadata(file);
  }
  return metadata;
};

export const saveMetadata = (metadata: FileMetadata): Promise<FileMetadata> => {
  return Api.invoke({
    path: '/exp/file-meta/save',
    param: metadata,
  }).then((res) => res);
};

export const listMetadata = (
  contentDocumentIds: string[]
): Promise<FileMetadata[]> => {
  return Api.invoke({
    path: '/exp/file-meta/list',
    param: {
      contentDocumentIds,
    },
  }).then((res) => res.records);
};
