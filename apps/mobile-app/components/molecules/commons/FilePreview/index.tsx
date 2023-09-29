import React, { useCallback } from 'react';

import classNames from 'classnames';
import get from 'lodash/get';

import IconDOC from '../../../../../commons/images/icons/doc.svg';
import IconIMG from '../../../../../commons/images/icons/image.svg';
import IconPDF from '../../../../../commons/images/icons/pdf.svg';
import IconXLS from '../../../../../commons/images/icons/xls.svg';
import msg from '../../../../../commons/languages';
import Spinner from '@apps/commons/components/Spinner';
import CurrencyUtil from '@apps/commons/utils/CurrencyUtil';
import DateUtil from '@apps/commons/utils/DateUtil';

import {
  getDisplayStatus,
  isDOC,
  isNotImage,
  isPDF,
  isXLS,
  OCR_STATUS,
  previewUrl,
} from '../../../../../domain/models/exp/Receipt';

import ViewItem from '../ViewItem';
import SFPreview from './SFPreview';

import './index.scss';

const ROOT = 'mobile-app-molecules-commons-file-preview';
export type Props = {
  label?: string | null | undefined;
  fileId?: string | null | undefined;
  id?: string | null | undefined;
  dataType?: string | null | undefined;
  title?: string | null | undefined;
  className?: string;
  uploadedDate?: string | null | undefined;
  onClickImage?: () => void;
  openExternal?: boolean;
  fullScreenPreview?: boolean;
  withOCR?: boolean; // File is in OCR mode
  ocrInfo?: any; // File's OCR info
  showOverlay?: boolean; // Overlay is displayed on selection
  executeOcr?: (arg0: string) => void; // For not scanned files in OCR mode
  decimalPlaces?: number; // To display OCR amount in full screen mode
  currencySymbol?: string; // To display OCR amount in full screen mode
  imgAltText?: string; // To display alt text for image
};

const getStatus = (ocrInfo) => get(ocrInfo, 'status', OCR_STATUS.NOT_PROCESSED);

const renderStatus = (ocrInfo) => {
  const status = getStatus(ocrInfo);
  return (
    <div className={`${ROOT}__status ${ROOT}__status-${status}`}>
      {getDisplayStatus(status)}
    </div>
  );
};

const ocrData = (receiptFileId, ocrInfo, executeOcr) => {
  const amount = get(ocrInfo, 'result.amount');
  const recordDate = get(ocrInfo, 'result.recordDate');
  const status = getStatus(ocrInfo);
  switch (status) {
    case OCR_STATUS.COMPLETED:
      return (
        <>
          <div className={`${ROOT}__record-date`}>
            {msg().Exp_Clbl_Date}: {DateUtil.dateFormat(recordDate)}
          </div>
          <div className={`${ROOT}__amount`}>
            {msg().Exp_Clbl_Amount}: {amount}
          </div>
        </>
      );
    case OCR_STATUS.QUEUED:
    case OCR_STATUS.IN_PROGRESS:
      return (
        <div className={`${ROOT}__scan-spinner`}>
          <Spinner loading priority="low" />
        </div>
      );
    case OCR_STATUS.NOT_PROCESSED:
      return (
        <div
          className={`${ROOT}__scan-msg`}
          onClick={(e) => {
            executeOcr(receiptFileId);
            e.stopPropagation();
          }}
        >
          {msg().Exp_Lbl_ScanReceipt}
        </div>
      );
    default:
      return null;
  }
};

const FilePreview = (props: Props) => {
  const {
    dataType,
    fileId,
    id,
    title,
    className = '',
    uploadedDate = '',
    onClickImage = () => {},
    openExternal,
    fullScreenPreview,
    ocrInfo,
    executeOcr,
    withOCR,
    showOverlay,
    imgAltText = msg().Exp_Lbl_Receipt,
  } = props;

  const ROOT = 'mobile-app-molecules-commons-file-preview';

  const isNotImageType = isNotImage(dataType);
  const fileUrl = previewUrl(fileId, isNotImageType);
  const cssClass = classNames(ROOT, className, {
    [`${ROOT}__img-container`]: fullScreenPreview || openExternal,
  });

  let attachmentContainer = null;

  const renderSVG = (Component) => (
    <Component className={`${ROOT}__icon`} aria-hidden="true" />
  );

  const renderOverlay = useCallback(() => {
    if (!showOverlay) {
      return <></>;
    }
    const overlayInfo = ocrData(id, ocrInfo, executeOcr);
    return (
      <div className={`${ROOT}__overlay`} onClick={onClickImage}>
        <div className={`${ROOT}__ocrInfo`}>{overlayInfo}</div>
        <div className={`${ROOT}__upload-date`}>
          {DateUtil.dateFormat(uploadedDate, 'DD-MM-YYYY hh:mm:ss', true)}
        </div>
      </div>
    );
  }, [showOverlay, ocrData]);

  const renderFullPreviewOCRInfo = () => {
    const amount = get(ocrInfo, 'result.amount') || '';
    const status = get(ocrInfo, 'status', '');
    if (status === OCR_STATUS.IN_PROGRESS) {
      return <Spinner loading priority="low" />;
    }
    const recordDate = get(ocrInfo, 'result.recordDate', '');
    return (
      <>
        <ViewItem
          label={msg().Exp_Clbl_Date}
          className={`${ROOT}__full-record-date`}
        >
          {DateUtil.dateFormat(recordDate)}
        </ViewItem>
        <ViewItem
          label={msg().Exp_Clbl_Amount}
          className={`${ROOT}__full-amount`}
        >
          <div className={`${ROOT}__amount-container`}>
            <div className={`${ROOT}__amount-container__symbol`}>
              {props.currencySymbol}
            </div>
            <div className={`${ROOT}__amount-container__text`}>
              {CurrencyUtil.convertToCurrency(amount)}
            </div>
          </div>
        </ViewItem>
      </>
    );
  };

  const isReceiptLibrary = fullScreenPreview !== undefined;

  if (id) {
    attachmentContainer = (
      <>
        <ViewItem label={props.label || ''} className={cssClass}>
          {withOCR && renderStatus(ocrInfo)}
          {withOCR && renderOverlay()}
          {isNotImageType ? (
            <>
              <SFPreview
                dataType={dataType}
                fileId={fileId}
                id={id}
                title={title}
                uploadedDate={uploadedDate}
                onClickImage={onClickImage}
                openExternal={openExternal}
                fullScreenPreview={fullScreenPreview}
              />
              {isPDF(dataType) && renderSVG(IconPDF)}
              {isDOC(dataType) && renderSVG(IconDOC)}
              {isXLS(dataType) && renderSVG(IconXLS)}
            </>
          ) : (
            <>
              <img
                alt={imgAltText}
                className={`${ROOT}__img lightbox-img-thumbnail`}
                src={fileUrl}
                onClick={onClickImage}
              />
              {renderSVG(IconIMG)}
            </>
          )}
          {withOCR && fullScreenPreview && renderFullPreviewOCRInfo()}
        </ViewItem>
      </>
    );
  } else if (isReceiptLibrary) {
    attachmentContainer = (
      <ViewItem label={''} className={`${ROOT}__inner-spinner ${cssClass}`}>
        <Spinner loading priority="low" />
      </ViewItem>
    );
  }
  return attachmentContainer;
};

export default FilePreview;
