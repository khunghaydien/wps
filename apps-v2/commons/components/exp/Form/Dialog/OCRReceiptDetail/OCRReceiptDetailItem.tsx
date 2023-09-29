import React, { FC, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { isEmpty } from 'lodash';
import get from 'lodash/get';

import Lightbox from '@commons/components/Lightbox';
import SFFilePreview from '@commons/components/SFFilePreview';
import Spinner from '@commons/components/Spinner';

import {
  isNotImage,
  isPDF,
  OCR_STATUS,
  previewUrl,
} from '@apps/domain/models/exp/Receipt';

import { State } from '@apps/expenses-pc/modules';
import { actions as ocrDetailActions } from '@apps/expenses-pc/modules/ui/expenses/receiptLibrary/ocrDetail';

import Form, { FormProps } from './Form';
import MetadataDisplay from './MetadataDisplay';
import OCRPdfPreview from './OCRPdfPreview';

import './index.scss';

const ROOT = 'ts-expenses-modal-ocr-receipt-detail';

type Props = {
  receiptIndex: number;
  useImageQualityCheck: boolean;
  uploadAndExecuteOcrImg: (
    base64Url: string,
    pageNum: number,
    pdfContentDocId: string
  ) => Promise<void>;
} & Pick<FormProps, 'baseCurrencyDecimal'>;

const OCRReceiptDetailItem: FC<Props> = (props) => {
  const {
    receiptIndex,
    useImageQualityCheck,
    baseCurrencyDecimal,
    uploadAndExecuteOcrImg,
  } = props;
  const { selectedReceipt: selectedReceipts, ocrDetail: ocrDetails } =
    useSelector((state: State) => state.ui.expenses.receiptLibrary);
  const selectedReceipt = selectedReceipts[receiptIndex];
  const contentDocumentId = selectedReceipt.receiptId;
  const selectedMetadata = useSelector((state: State) =>
    state.common.exp.entities.fileMetadata.find(
      (data) => data.contentDocumentId === contentDocumentId
    )
  );
  // const useJctRegistrationNumber = useSelector(
  //   (state: State) => state.userSetting.jctInvoiceManagement
  // );
  // const isLoading = useSelector(
  //   (state: State) => state.common.app.loadingDepth > 0
  // );
  // const loadingAreas = useSelector(
  //   (state: State) => state.common.app.loadingAreas
  // );
  const receiptList = useSelector(
    (state: State) => state.entities.exp.receiptLibrary.list.receipts
  );

  const [isExecuteOcr, setIsExecuteOcr] = useState(false);

  const ocrDetail = ocrDetails[receiptIndex];
  const { receiptId, receiptFileId, uploadedDate, title, dataType } =
    selectedReceipt;
  const isNotImageType = isNotImage(dataType);
  const fileUrl = previewUrl(receiptFileId, isNotImageType);

  // get receipt ocr status
  const receipt = receiptList.find(
    (receipt) => receipt.contentVersionId === receiptFileId
  );
  const selectedReceiptStatus = get(receipt, 'ocrInfo.status');
  const isOcrInProgress = [OCR_STATUS.IN_PROGRESS, OCR_STATUS.QUEUED].includes(
    selectedReceiptStatus
  );
  const isExecutingOcr = isExecuteOcr || isOcrInProgress;

  const dispatch = useDispatch();

  const setOCRDetail = useCallback(
    (ocrDetail) => {
      dispatch(ocrDetailActions.setOne(ocrDetail, receiptIndex));
    },
    [receiptIndex]
  );

  if (isEmpty(selectedReceipt) || isEmpty(ocrDetail)) {
    return null;
  }

  return (
    <div className={`${ROOT}__inner`}>
      <div className={`${ROOT}__form-wrapper`}>
        {isExecutingOcr && (
          <div className={`${ROOT}__spinner`}>
            <Spinner loading />
          </div>
        )}
        <Form
          className={`${ROOT}__form`}
          ocrDetail={ocrDetail}
          baseCurrencyDecimal={baseCurrencyDecimal}
          setOCRDetail={setOCRDetail}
          originalOCRDetail={get(selectedReceipt, 'ocrInfo.result') || {}}
          // useJctRegistrationNumber={useJctRegistrationNumber}
          // isLoading={isLoading}
          // loadingAreas={loadingAreas}
        />
      </div>
      <div className={`${ROOT}__right`}>
        {isPDF(dataType) ? (
          <OCRPdfPreview
            isExecutingOcr={isExecutingOcr}
            pdfContentDocId={selectedReceipt.receiptId}
            pdfScannedImgList={selectedReceipt.pages || []}
            setIsExecuteOcr={setIsExecuteOcr}
            uploadAndExecuteOcrImg={uploadAndExecuteOcrImg}
          />
        ) : (
          <>
            <MetadataDisplay
              metadata={selectedMetadata}
              useImageQualityCheck={useImageQualityCheck}
            />
            <div className={`${ROOT}__preview`}>
              {isNotImage(dataType) ? (
                <SFFilePreview
                  fileType={dataType}
                  receiptId={receiptId}
                  receiptFileId={receiptFileId}
                  uploadedDate={uploadedDate}
                  fileName={title}
                  withDownloadLink
                />
              ) : (
                <Lightbox>
                  <img src={fileUrl} alt={title} />
                </Lightbox>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OCRReceiptDetailItem;
