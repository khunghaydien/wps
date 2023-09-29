import React, { useState } from 'react';

import get from 'lodash/get';

import msg from '../../../../../../../commons/languages';
import TextUtil from '../../../../../../../commons/utils/TextUtil';
import FileCard from '../../../../../molecules/commons/FileCard/index';

import { ATTACHMENT_MAX_COUNT } from '../../../../../../../domain/models/exp/Report';
import {
  AttachedFile,
  AttachedFiles,
} from '@apps/domain/models/common/AttachedFile';

import Label from '../../../../../atoms/Label';
import UploadOptionsModal from '../../../../../organisms/expense/UploadOptionsModal';

import './index.scss';

type Props = {
  attachedFileList?: AttachedFiles;
  openReceiptLibrary: () => void;
  handleAttachFile: (arg0: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteFile: (arg0: AttachedFile) => void;

  // errors
  isExceedNumber: boolean;
  largeFiles: string[];
  invalidFiles: string[];
  isRequired: boolean;
  formikError: any;
};

const ROOT = 'mobile-app-pages-expense-page-report-edit-attachment';

const Attachment = (props: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    isExceedNumber,
    largeFiles,
    invalidFiles,
    attachedFileList,
    formikError,
    isRequired,
  } = props;

  const label = (
    <Label
      className={`${ROOT}__title`}
      text={msg().Exp_Lbl_AttachedFile}
      marked={isRequired || false}
    />
  );

  const showUploadBtn = (attachedFileList || []).length < ATTACHMENT_MAX_COUNT;

  const uploadBtn = (
    <label
      className={`${ROOT}__upload-btn`}
      onClick={() => {
        setIsModalOpen(true);
      }}
    >
      {msg().Exp_Btn_UploadFile}
    </label>
  );

  const fileCardList = (attachedFileList || []).map((file) => (
    <FileCard
      key={file.attachedFileVerId}
      file={file}
      removable
      onClickRemove={props.handleDeleteFile}
    />
  ));

  const modal = (
    <UploadOptionsModal
      className={ROOT}
      multiple
      handleAttachFile={props.handleAttachFile}
      openReceiptLibrary={props.openReceiptLibrary}
      closeModal={() => {
        setIsModalOpen(false);
      }}
    />
  );

  const renderErrorMsgs = () => {
    const numberLimitErr = isExceedNumber && (
      <div className={`${ROOT}__error`}>
        {TextUtil.template(
          msg().Exp_Lbl_SelectMultipleFiles,
          ATTACHMENT_MAX_COUNT
        )}
      </div>
    );
    const largeFileErr = largeFiles.map((fileName) => (
      <div className={`${ROOT}__error`}>
        {fileName}: {msg().Common_Err_MaxFileSize}
      </div>
    ));
    const invalidFileErr = invalidFiles.map((fileName) => (
      <div className={`${ROOT}__error`}>
        {fileName}: {msg().Common_Err_InvalidType}
      </div>
    ));
    const requiredErrMsg = get(formikError, 0);
    const requiredErr = requiredErrMsg && (
      <div className={`${ROOT}__error`}>{msg()[requiredErrMsg]}</div>
    );

    return (
      <>
        {numberLimitErr}
        {largeFileErr}
        {invalidFileErr}
        {requiredErr}
      </>
    );
  };

  return (
    <div className={ROOT}>
      {label}
      {fileCardList}
      <div className={`${ROOT}__wrapper`}>
        {showUploadBtn && uploadBtn}
        {renderErrorMsgs()}
      </div>
      {isModalOpen && modal}
    </div>
  );
};

export default Attachment;
