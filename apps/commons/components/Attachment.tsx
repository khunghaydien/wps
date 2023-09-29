import React from 'react';

import IconDelete from '@commons/images/icons/close.svg';
import IconDOC from '@commons/images/icons/doc.svg';
import IconDownload from '@commons/images/icons/download.svg';
import IconIMG from '@commons/images/icons/image.svg';
import IconPDF from '@commons/images/icons/pdf.svg';
import IconXLS from '@commons/images/icons/xls.svg';
import IconZoom from '@commons/images/icons/zoom.svg';
import FileUtil from '@commons/utils/FileUtil';

import { AttachedFile } from '@apps/domain/models/common/AttachedFile';
import {
  fileDownloadUrl,
  isDOC,
  isPDF,
  isUnknownType,
  isXLS,
} from '@apps/domain/models/exp/Receipt';

import './Attachment.scss';

type Props = AttachedFile & {
  className?: string;
  isApexView?: boolean;
  prefix?: string; // file prefix to remove for name display
  handlePreview?: (string) => void;
  isEdit?: boolean;
  allowPdfPreview?: boolean;
  isPreview?: boolean;
  handleDelete?: (string) => void;
};

const renderSVG = (Component, className, callback?: Function) => (
  <Component className={className} aria-hidden="true" onClick={callback} />
);

const renderPreviewIcon = (dataType, className) => {
  const classNames = `${className}__preview-icon`;
  if (isDOC(dataType) || isXLS(dataType) || isUnknownType(dataType)) {
    return renderSVG(IconDownload, classNames);
  } else {
    return renderSVG(IconZoom, classNames.concat(' zoomIcon'));
  }
};

const renderFileTypeIcon = (dataType, className) => {
  const renderTypeIcon = (type) =>
    renderSVG(type, `${className}__file-type-icon`);
  if (isDOC(dataType)) {
    return renderTypeIcon(IconDOC);
  } else if (isXLS(dataType)) {
    return renderTypeIcon(IconXLS);
  } else if (isPDF(dataType)) {
    return renderTypeIcon(IconPDF);
  } else {
    return renderTypeIcon(IconIMG);
  }
};

const ROOT = 'attachment';

// TODO integrate with report attachment text display format
const Attachment = ({
  attachedFileDataType: fileType,
  attachedFileName: fileName,
  attachedFileId: fileId,
  attachedFileVerId,
  attachedFileExtension: extension,
  isApexView,
  className: parentClass,
  isPreview,
  isEdit,
  prefix,
  handlePreview,
  handleDelete,
  allowPdfPreview,
}: Props) => {
  const className = `${ROOT} ${parentClass}`;
  const downloadUrl = fileDownloadUrl(fileId);
  const originName =
    FileUtil.getOriginalFileNameWithoutPrefix(fileName, prefix) || '';
  const children = (
    <>
      {renderFileTypeIcon(fileType, ROOT)}
      <span className={`${ROOT}__file-name`}>
        {`${originName}.${extension || fileType.toLowerCase()}`}
      </span>
      {isPreview && renderPreviewIcon(fileType, ROOT)}
      {isEdit &&
        renderSVG(IconDelete, `${ROOT}__delete`, (e) => {
          e.stopPropagation();
          e.preventDefault();
          handleDelete(attachedFileVerId);
        })}
    </>
  );

  const isDownloadPdf = isPDF(fileType) && !allowPdfPreview;
  if (
    isDOC(fileType) ||
    isXLS(fileType) ||
    isDownloadPdf ||
    isUnknownType(fileType)
  ) {
    const linkObj = isApexView
      ? {
          onClick: () => {
            window.open(downloadUrl, '_blank');
          },
        }
      : { href: downloadUrl };
    return (
      <div className={className}>
        <a {...linkObj} download={fileName}>
          {children}
        </a>
      </div>
    );
  } else {
    return (
      <div
        className={className}
        onClick={(e) => {
          e.stopPropagation();
          handlePreview(attachedFileVerId);
        }}
      >
        {children}
      </div>
    );
  }
};

export default Attachment;
