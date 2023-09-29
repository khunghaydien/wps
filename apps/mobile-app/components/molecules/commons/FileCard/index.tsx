import React from 'react';

import IconDOC from '../../../../../commons/images/icons/doc.svg';
import IconIMG from '../../../../../commons/images/icons/image.svg';
import IconPDF from '../../../../../commons/images/icons/pdf.svg';
import IconXLS from '../../../../../commons/images/icons/xls.svg';
import FileUtil from '../../../../../commons/utils/FileUtil';

import {
  fileDownloadUrl,
  isDOC,
  isPDF,
  isXLS,
  VALID_EXTENSIONS,
} from '../../../../../domain/models/exp/Receipt';
import { AttachedFile } from '@apps/domain/models/common/AttachedFile';

import IconButton from '../../../atoms/IconButton';

import './index.scss';

const ROOT = 'mobile-app-molecules-commons-file-card';

type Props = {
  file: AttachedFile;
  removable?: boolean;
  onClickRemove?: (arg0: AttachedFile) => void;
};

const FileCard = (props: Props) => {
  const {
    attachedFileName: fileName,
    attachedFileDataType: dataType,
    attachedFileId: fileId,
    attachedFileExtension: extension,
  } = props.file;

  const renderTypeIcon = () => {
    const cssClass = `${ROOT}__type-icon`;
    if (isDOC(dataType)) {
      return <IconDOC className={cssClass} aria-hidden="true" />;
    } else if (isXLS(dataType)) {
      return <IconXLS className={cssClass} aria-hidden="true" />;
    } else if (isPDF(dataType)) {
      return <IconPDF className={cssClass} aria-hidden="true" />;
    } else {
      return <IconIMG className={cssClass} aria-hidden="true" />;
    }
  };

  const handleRemove = () =>
    props.onClickRemove && props.onClickRemove(props.file);

  const renderFileName = () => {
    let name = fileName || '';
    const ext = String(FileUtil.getFileExtension(name));
    const hasExtension = VALID_EXTENSIONS.includes(ext);
    if (name) {
      name = FileUtil.getOriginalFileNameWithoutPrefix(fileName);
      // unify name display for attach from local device & receipt library
      if (!hasExtension) {
        const fileExt = extension || dataType;
        name = `${name}.${fileExt.toLowerCase()}`;
      }
    }
    const url = fileDownloadUrl(fileId);

    return (
      <a href={url} download={fileName} className={`${ROOT}__name`}>
        {name}
      </a>
    );
  };

  const removeBtn = (
    <IconButton
      className={`${ROOT}__remove`}
      icon="close-copy"
      onClick={handleRemove}
    />
  );

  return (
    <div className={ROOT}>
      {renderTypeIcon()}
      {renderFileName()}
      {props.removable && removeBtn}
    </div>
  );
};

export default FileCard;
