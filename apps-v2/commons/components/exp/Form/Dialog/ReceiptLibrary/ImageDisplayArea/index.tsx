import React, { useEffect, useState } from 'react';

import classNames from 'classnames';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

import {
  fileDownloadUrl,
  getDisplayStatus,
  isDOC,
  isNotImage,
  isPDF,
  isUnknownType,
  isXLS,
  OCR_STATUS,
  SelectedReceipt,
} from '../../../../../../../domain/models/exp/Receipt';

import DateUtil from '../../../../../../utils/DateUtil';
import FileUtil from '../../../../../../utils/FileUtil';
import TextUtil from '../../../../../../utils/TextUtil';

import useInfiniteScroll from '../../../../../../hooks/useInfiniteScroll';
import IconDOC from '../../../../../../images/icons/doc.svg';
import IconDonwload from '../../../../../../images/icons/download.svg';
import IconIMG from '../../../../../../images/icons/image.svg';
import IconPDF from '../../../../../../images/icons/pdf.svg';
import IconTrash from '../../../../../../images/icons/trash.svg';
import IconXLS from '../../../../../../images/icons/xls.svg';
import iconZoom from '../../../../../../images/iconZoom.png';
import msg from '../../../../../../languages';
import Lightbox from '../../../../../Lightbox';
import SFFilePreview from '../../../../../SFFilePreview';
import Skeleton from '../../../../../Skeleton';
import Spinner from '../../../../../Spinner';

import './index.scss';

const ROOT = 'ts-expenses-modal-receipt-library-image-display';

type Props = {
  dropZoneArea: any;
  imageUrlList: Array<Record<string, any>>;
  isLoading: boolean;
  isMaxCountSelected?: boolean;
  isReportReceipt?: boolean;
  maxSelectionCount: number;
  selectedReceipt: Array<SelectedReceipt>;
  executeOcr: (arg0: string) => void;
  executePdfSubPageOcr: (pdfContentVerId: string) => void;
  onClickDeleteButton: (receiptId: string, dataType: string) => Function;
  onSelectImage: () => Function;
};

const getStatus = (ocrInfo) => {
  return (ocrInfo && ocrInfo.status) || OCR_STATUS.NOT_PROCESSED;
};

const renderStatus = (item) => {
  const status = getStatus(item.ocrInfo);
  return (
    <div className={`${ROOT}__status ${ROOT}__status-${status}`}>
      {getDisplayStatus(status)}
    </div>
  );
};

const getAmount = (ocrInfo) => {
  return ocrInfo && ocrInfo.result && ocrInfo.result.amount;
};

const getRecordDate = (ocrInfo) => {
  return ocrInfo && ocrInfo.result && ocrInfo.result.recordDate;
};

const ocrData = (receiptFileId, ocrInfo, executeOcr) => {
  const amount = getAmount(ocrInfo);
  const recordDate = getRecordDate(ocrInfo);
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
          onClick={() => executeOcr(receiptFileId)}
        >
          {msg().Exp_Lbl_ScanReceipt}
        </div>
      );
    default:
      return null;
  }
};

const getDisplayFileName = (title: string) => {
  const originalFileName =
    FileUtil.getOriginalFileNameWithoutPrefix(title) || '';
  return originalFileName.length > 20
    ? originalFileName.substring(0, 20).concat('...')
    : originalFileName;
};

const renderSVG = (Component, className) => (
  <Component className={className} aria-hidden="true" />
);

const renderEnlargeIcon = (item) => {
  const withAnchor = (children) => (
    <div className={`${ROOT}__download-btn`}>
      <a href={fileDownloadUrl(item.contentDocumentId)} download={item.title}>
        {children}
      </a>
    </div>
  );

  if (
    isDOC(item.dataType) ||
    isXLS(item.dataType) ||
    isUnknownType(item.dataType)
  ) {
    return withAnchor(renderSVG(IconDonwload, `${ROOT}__download-icon`));
  } else if (isPDF(item.dataType)) {
    return withAnchor(<img alt="zoom" src={iconZoom} />);
  } else {
    return (
      // @ts-ignore
      <Lightbox className={`${ROOT}__lightbox`}>
        <img className="receipt-library" src={item.fileBody} alt="File" />
      </Lightbox>
    );
  }
};

const renderOverlay = (
  item,
  onClickDeleteButton,
  executeOcr,
  isReportReceipt
) => {
  const { ocrInfo, receiptFileId, uploadedDate = '' } = item;
  const overlayInfo = isReportReceipt
    ? getDisplayFileName(item.title)
    : ocrData(receiptFileId, ocrInfo, executeOcr);
  return (
    <div className="after">
      <div className={`${ROOT}__ocrInfo`}>{overlayInfo}</div>
      <div className={`${ROOT}__upload-date`}>
        {DateUtil.dateFormat(uploadedDate, 'DD-MM-YYYY hh:mm:ss', true)}
      </div>
      {renderEnlargeIcon(item)}
      <IconTrash
        aria-hidden="true"
        className={`${ROOT}__delete`}
        onClick={onClickDeleteButton(item.contentDocumentId, item.dataType)}
      />
    </div>
  );
};

const renderPreview = (
  { receiptId, receiptFileId, uploadedDate, title, dataType, fileBody },
  isSelected: boolean
) => {
  const imgClassName = classNames(`${ROOT}__img`, {
    selected: isSelected,
  });

  return isNotImage(dataType) ? (
    <SFFilePreview
      fileType={dataType}
      receiptId={receiptId}
      receiptFileId={receiptFileId}
      uploadedDate={uploadedDate}
      fileName={title}
      selected={isSelected}
      classes={`${ROOT}__pdf-preview`}
    />
  ) : (
    <img className={imgClassName} src={fileBody} alt={title} />
  );
};

const renderDataType = (dataType) => {
  const className = `${ROOT}__data-type-icon`;
  if (isDOC(dataType)) {
    return renderSVG(IconDOC, className);
  } else if (isXLS(dataType)) {
    return renderSVG(IconXLS, className);
  } else if (isPDF(dataType)) {
    return renderSVG(IconPDF, className);
  } else {
    return renderSVG(IconIMG, className);
  }
};

const ImageDisplayArea = ({
  imageUrlList,
  onSelectImage,
  onClickDeleteButton,
  dropZoneArea,
  selectedReceipt,
  executeOcr,
  executePdfSubPageOcr,
  isReportReceipt,
  maxSelectionCount,
  isMaxCountSelected,
  isLoading,
}: Props) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loaderRef, containerRef, page] = useInfiniteScroll({
    hasMore,
  });

  const [loadedImages, setLoadedImages] = useState(imageUrlList);

  useEffect(() => {
    if (isEmpty(imageUrlList)) {
      setLoadedImages([]);
      return;
    }

    setIsLoadingMore(true);
    const IMAGE_PER_PAGE = 15;
    // one for file drop area
    const noOfLoaded = Math.max(IMAGE_PER_PAGE * Number(page) - 1, 0);
    const loaded = imageUrlList.slice(0, noOfLoaded);
    const hasMore = noOfLoaded < imageUrlList.length;
    setHasMore(hasMore);
    setIsLoadingMore(false);

    setLoadedImages(loaded);
  }, [page, imageUrlList]);

  const showInputButton = (item) =>
    isReportReceipt ||
    (item.ocrInfo && item.ocrInfo.status === OCR_STATUS.COMPLETED) ||
    (item.pages.length > 1 && item.ocrInfo.status === OCR_STATUS.IN_PROGRESS);
  const isSingleSelection = maxSelectionCount === 1;
  const inputType = isSingleSelection ? 'radio' : 'checkbox';
  let inputName = 'receipt';

  const list = (
    <>
      {dropZoneArea}
      {loadedImages.map((item) => {
        const selectedItem = find(selectedReceipt, [
          'receiptFileId',
          item.receiptFileId,
        ]);
        if (isSingleSelection) {
          inputName = `receipts_${item.receiptFileId}`;
        }
        // Hide unselected input box when it reaches the max count of multiple selection
        const isHideInput =
          !isSingleSelection && isMaxCountSelected && !selectedItem;
        return (
          <div className={`${ROOT}__img-area`} key={item.contentDocumentId}>
            {(item.contentDocumentId && (
              <div className={`${ROOT}__labels`}>
                <label className={`${ROOT}__first`}>
                  {!isReportReceipt && renderStatus(item)}
                  {renderDataType(item.dataType)}
                  {renderPreview(item as any, !!selectedItem)}
                  {showInputButton(item) && !isHideInput && (
                    <input
                      className={`${ROOT}__input`}
                      type={inputType}
                      name={inputName}
                      value={item.receiptFileId}
                      // @ts-ignore TODO: remove () and test
                      onClick={onSelectImage()}
                      checked={!!selectedItem}
                    />
                  )}
                </label>
                {renderOverlay(
                  item,
                  onClickDeleteButton,
                  isPDF(item.dataType) ? executePdfSubPageOcr : executeOcr,
                  isReportReceipt
                )}
              </div>
            )) || (
              <div className={`${ROOT}__loading`}>
                <div className={`${ROOT}__loading-spinner`}>
                  {msg().Exp_Lbl_LoadingPreview}
                  <Spinner loading priority="low" />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );

  return (
    // @ts-ignore
    <div className={`${ROOT}__msg`} ref={containerRef}>
      {isSingleSelection
        ? msg().Exp_Lbl_SelectReceiptLibrary
        : TextUtil.template(
            msg().Exp_Lbl_SelectMultipleFiles,
            maxSelectionCount
          )}

      <div className={`${ROOT}__list`}>
        {isLoading ? (
          <Skeleton
            noOfRow={3}
            noOfCol={5}
            colWidth="140px"
            className={`${ROOT}__skeleton`}
            rowHeight="100px"
            margin="30px"
          />
        ) : (
          list
        )}

        {/*
        // @ts-ignore */}
        <div className={`${ROOT}__loader`} ref={loaderRef}>
          {isLoadingMore && msg().Com_Lbl_Loading}
        </div>
      </div>
    </div>
  );
};

export default ImageDisplayArea;
