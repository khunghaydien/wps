import React, { useEffect, useState } from 'react';

import classNames from 'classnames';
import { find, get, isEmpty } from 'lodash';

import useInfiniteScroll from '@apps/commons/hooks/useInfiniteScroll';
import msg from '@apps/commons/languages';
import { ErrorInfo } from '@apps/commons/utils/AppPermissionUtil';
import FileUtil from '@apps/commons/utils/FileUtil';
import Alert from '@mobile/components/molecules/commons/Alert';
import FilePreview from '@mobile/components/molecules/commons/FilePreview/index';
import Navigation from '@mobile/components/molecules/commons/Navigation';
import WrapperWithPermission from '@mobile/components/organisms/commons/WrapperWithPermission';

import {
  ALLOWED_MIME_TYPES,
  Base64FileList,
  FileMetadata,
  getMetadata,
  MAX_FILE_SIZE,
  OCR_STATUS,
} from '@apps/domain/models/exp/Receipt';
import {
  Receipt,
  ReceiptList,
} from '@apps/domain/models/exp/receipt-library/list';
import { OCR_RECORD_MAX } from '@apps/domain/models/exp/Record';
import { ATTACHMENT_MAX_COUNT } from '@apps/domain/models/exp/Report';

import Button from '@mobile/components/atoms/Button';
import Input from '@mobile/components/atoms/Fields/Input';
import Icon from '@mobile/components/atoms/Icon';
import TextButton from '@mobile/components/atoms/TextButton';

import './ReceiptLibrary.scss';

const ROOT = 'mobile-app-pages-receipt-library';

type Props = {
  backType: 'report' | 'record';
  receiptList: ReceiptList;
  hasPermissionError: ErrorInfo | null;
  withOCR: boolean;
  decimalPlaces?: number;
  currencySymbol?: string;
  getBase64files: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => Promise<Base64FileList>;
  uploadReceipts: (list: Base64FileList) => Promise<ReceiptList>;
  saveFileMetadata: (fileMetadata: FileMetadata) => void;
  onClickSelectBtn: (files: ReceiptList) => void;
  backToDetailPage: () => void;
  deleteReceipt: (contentDocumentId: string) => void;
  executeOcr: (contentVersionId: string) => void;
};

const ReceiptLibrary = (props: Props) => {
  const { receiptList, withOCR } = props;
  const [attachedIds, setAttachedIds] = useState([]); // files already attached
  const [selectedIds, setSelectedIds] = useState([]);
  const [previewId, setPreviewId] = useState(null);
  const [isLargeFile, setIsLargeFile] = useState(false);
  const [isInvalidFileType, setIsInvalidFileType] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loaderRef, containerRef, page] = useInfiniteScroll({
    hasMore,
  });

  const [loadedImages, setLoadedImages] = useState(receiptList);

  useEffect(() => {
    const attachedIds = get(props, 'location.state.attachedIds') || [];
    setAttachedIds(attachedIds);
  }, []);

  useEffect(() => {
    if (isEmpty(receiptList)) {
      return;
    }

    setIsLoading(true);
    const IMAGE_PER_PAGE = 12;
    // @ts-ignore
    const noOfLoaded = IMAGE_PER_PAGE * page;
    const loaded = receiptList.slice(0, noOfLoaded);
    const hasMore = noOfLoaded < receiptList.length;
    setHasMore(hasMore);
    setIsLoading(false);

    setLoadedImages(loaded);
  }, [page, receiptList]);

  const onSelectImg = (e) => {
    const id = e.target.value;
    let updated;
    if (selectedIds.includes(id)) {
      updated = selectedIds.filter((x) => x !== id);
    } else {
      updated = [...selectedIds, id];
    }
    setSelectedIds(updated);
  };

  const handleAttachFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files[0];
    const base64Files = await props.getBase64files(e);
    const isLarge = base64Files[0].size > MAX_FILE_SIZE;
    const isInvalidType = !ALLOWED_MIME_TYPES.includes(base64Files[0].type);
    setIsLargeFile(isLarge);
    setIsInvalidFileType(isInvalidType);
    if (isLarge || isInvalidType) {
      return;
    }
    // File Accepted
    setLoadedImages((loaded) => [{} as Receipt].concat(loaded));
    const res = await props.uploadReceipts(base64Files);

    const contentDocumentId = get(res, '0.contentDocumentId');

    const metadata = await getMetadata(file);
    if (metadata) {
      props.saveFileMetadata({
        ...metadata,
        contentDocumentId,
      });
    }

    // OCR Execution
    const contentVersionId = get(res, '0.contentVersionId');
    if (props.withOCR) {
      props.executeOcr(contentVersionId);
    }
  };

  /**
   *   Render individual image/pdf
   */
  const renderImg = (file, rootClass) => {
    const img = (
      <FilePreview
        className={rootClass}
        title={file.title}
        id={file.contentDocumentId}
        fileId={file.contentVersionId}
        dataType={file.fileType}
        uploadedDate={file.createdDate}
        onClickImage={() => {
          setPreviewId(file.contentVersionId);
        }}
        fullScreenPreview={!!previewId}
        withOCR={withOCR}
        showOverlay={
          !previewId && withOCR && selectedIds.includes(file.contentVersionId)
        }
        ocrInfo={file.ocrInfo}
        decimalPlaces={props.decimalPlaces}
        currencySymbol={props.currencySymbol}
      />
    );
    return img;
  };

  /**
   *   Render image list with title & selection
   */
  const imageListDisplay = loadedImages.map((item) => {
    const isUploading = !item.contentVersionId;
    // hide image if already attached
    const shouldDisplay = !attachedIds.includes(item.contentVersionId);
    if (!isUploading && !shouldDisplay) {
      return <></>;
    }
    const ocrValid = props.withOCR
      ? get(item, 'ocrInfo.status') === OCR_STATUS.COMPLETED
      : true;
    const img = renderImg(item, ROOT);
    const isSelected = selectedIds.includes(item.contentVersionId);
    const maxNo =
      props.backType === 'report' ? ATTACHMENT_MAX_COUNT : OCR_RECORD_MAX;
    const isReachLimit = selectedIds.length >= maxNo - attachedIds.length;
    const radioBtn = !isUploading &&
      ocrValid &&
      (isSelected || !isReachLimit) && (
        <label className={`${ROOT}__img-radio radio-container`}>
          <input
            type="checkbox"
            value={item.contentVersionId}
            onClick={onSelectImg}
            checked={isSelected}
          />
          <span className="checkmark" />
        </label>
      );
    const { title = '', fileType = '', fileExtension } = item;

    const fileExt = fileExtension || fileType;
    const fileName = title
      ? `${FileUtil.getOriginalFileNameWithoutPrefix(
          title
        )}.${fileExt.toLowerCase()}`
      : '';
    const cssClass = classNames(`${ROOT}__img`, {
      selected: isSelected,
    });
    return (
      <div className={cssClass}>
        {img}
        {radioBtn}
        <div className={`${ROOT}__img-title`}>{fileName || '--'}</div>
      </div>
    );
  });

  /**
   *   Render full screen preview
   */
  const renderFullPreview = () => {
    const rootClass = `${ROOT}__preview`;
    const file =
      find(props.receiptList, {
        contentVersionId: previewId,
      }) || {};
    const img = renderImg(file, rootClass);

    return img;
  };

  const onClickSelect = () => {
    // If preview mode, target is the previewed img; otherwise target is the selected imgs
    const targetFileIds = previewId ? [previewId] : selectedIds;
    const files = props.receiptList.filter(({ contentVersionId }) =>
      targetFileIds.includes(contentVersionId)
    );
    props.onClickSelectBtn(files);
  };

  const onClickBack = () => {
    // if in preview mode, back to receipt library main page; else back to detail page
    if (previewId) {
      setPreviewId(null);
    } else {
      props.backToDetailPage();
    }
  };

  const onClickDelete = () => {
    const file =
      find(props.receiptList, {
        contentVersionId: previewId,
      }) || ({} as Receipt);
    props.deleteReceipt(file.contentDocumentId);
    // if selected file is deleted, clear check mark
    if (selectedIds.includes(previewId)) {
      const updated = selectedIds.filter((x) => x !== previewId);
      setSelectedIds(updated);
    }
    setPreviewId(null);
  };

  let actionBtns = [
    <label>
      <Input
        className={`${ROOT}__input`}
        type="file"
        accept="image/*"
        capture="camera"
        onChange={(e: any) => {
          handleAttachFile(e);
          e.target.value = '';
        }}
      />
      <Icon
        className={`${ROOT}__upload-icon`}
        type={'upload-copy'}
        size="medium"
      />
    </label>,
  ];
  if (previewId) {
    actionBtns = [
      <TextButton type="submit" disabled={!previewId} onClick={onClickDelete}>
        {msg().Com_Btn_Delete}
      </TextButton>,
    ];
  }

  const renderAlert = () => {
    const maxFileSizeError = withOCR
      ? msg().Common_Err_MaxOCRFileSize
      : msg().Common_Err_MaxFileSize;

    const alertMsg = isLargeFile
      ? maxFileSizeError
      : isInvalidFileType
      ? msg().Common_Err_InvalidType
      : '';

    return alertMsg && <Alert variant="warning" message={[alertMsg]} />;
  };

  const renderMainBtn = () => {
    const { receiptList, withOCR, executeOcr } = props;
    const file =
      find(receiptList, {
        contentVersionId: previewId,
      }) || ({} as Receipt);
    const status = get(file, 'ocrInfo.status');
    const isScannedAlready = status === OCR_STATUS.COMPLETED;
    const isListView = !previewId;
    const showScanReceipt = withOCR && previewId && !isScannedAlready;
    const btnLabel = showScanReceipt
      ? msg().Exp_Btn_ScanReceipt
      : msg().Com_Btn_Select;
    const scanDisabled =
      status === OCR_STATUS.IN_PROGRESS || status === OCR_STATUS.QUEUED;
    const selectDisabled = isListView && isEmpty(selectedIds);
    const disabled = showScanReceipt ? scanDisabled : selectDisabled;
    const btnAction = showScanReceipt
      ? () => executeOcr(file.contentVersionId)
      : onClickSelect;
    return (
      <Button
        priority="primary"
        variant="neutral"
        floating="bottom"
        className="select-btn"
        onClick={btnAction}
        disabled={disabled}
      >
        {btnLabel}
      </Button>
    );
  };

  return (
    <WrapperWithPermission
      className={ROOT}
      hasPermissionError={props.hasPermissionError}
    >
      <Navigation
        backButtonLabel={msg().Com_Lbl_Back}
        onClickBack={onClickBack}
        title={msg().Exp_Lbl_ReceiptLibrary}
        actions={actionBtns}
      />
      {/* @ts-ignore */}
      <div className={`${ROOT}__img-container`} ref={containerRef}>
        {renderAlert()}
        {imageListDisplay}
        {/* @ts-ignore */}
        <div className={`${ROOT}__loader`} ref={loaderRef}>
          {isLoading && msg().Com_Lbl_Loading}
        </div>
      </div>

      {previewId && renderFullPreview()}
      {renderMainBtn()}
    </WrapperWithPermission>
  );
};

export default ReceiptLibrary;
