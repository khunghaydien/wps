import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { useFormikContext } from 'formik';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import styled from 'styled-components';

import Attachment from '@commons/components/Attachment';
import Dropzone from '@commons/components/fields/Dropzone';
import LightboxModal from '@commons/components/LightboxModal';
import msg from '@commons/languages';

import { AttachedFile } from '@apps/domain/models/common/AttachedFile';
import { FILE_PREFIX } from '@apps/domain/models/customRequest/consts';
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  previewUrl,
} from '@apps/domain/models/exp/Receipt';

import Error from './Error';

const ROOT = 'custom-request-pc-file-attachment';

type Props = {
  label: string;
  errors: Record<string, any>;
  name: string;
  values: Record<string, any>;
  required?: boolean;
  uploadFiles: (files: File[]) => Promise<AttachedFile>;
};

const S = {
  Wrapper: styled.div`
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    margin: 16px;
  `,
  UploadArea: styled(Dropzone)`
    margin-top: 20px;
    height: 200px !important;
  `,
  Header: styled.div`
    line-height: 40px;
    height: 40px;
    background: #ebf3f7;
    padding-left: 16px;
    border-bottom: 1px solid #d9d9d9;
    color: #666;
    font-weight: 700;
  `,
  Body: styled.div`
    padding: 8px 16px 18px;
  `,
};

const Component = (props: Props) => {
  const [imgPreviewUrl, setImgPreviewUrl] = useState('');

  const { label, values, name } = props;
  const { setFieldValue, setFieldError, setFieldTouched } = useFormikContext();
  const currentFiles = get(values, name, []);

  const handleDropAccepted = async (files: File[]) => {
    const file = await props.uploadFiles(files);
    if (file) {
      setFieldValue(props.name, [...currentFiles, file]);
    }
  };

  const handleDropRejected = (rejectedFiles: File[]) => {
    const rejectedFile = rejectedFiles[0];
    let error = msg().Common_Err_Required;

    if (rejectedFile.size > MAX_FILE_SIZE) {
      error = msg().Common_Err_MaxFileSize;
    }

    setFieldError(props.name, error);
    setFieldTouched(props.name, true, false);
  };

  const handleDelete = (id: string) => {
    const updatedFiles = currentFiles.filter(
      ({ attachedFileVerId }) => attachedFileVerId !== id
    );
    setFieldValue(props.name, updatedFiles);
    setFieldTouched(props.name, true, false);
  };

  const handlePreview = (fileVerId) => {
    const imageUrl = previewUrl(fileVerId);
    setImgPreviewUrl(imageUrl);
  };

  const error = get(props.errors, props.name);

  const fileList = currentFiles.map((file) => (
    <Attachment
      key={file.attachedFileId}
      {...file}
      handlePreview={handlePreview}
      isPreview
      isEdit
      prefix={FILE_PREFIX}
      handleDelete={handleDelete}
    />
  ));

  return (
    <S.Wrapper className={ROOT}>
      <S.Header>{label}</S.Header>
      <S.Body>
        {error && <Error text={error} />}
        {fileList}
        <S.UploadArea
          accept={ALLOWED_MIME_TYPES.join()}
          onDropAccepted={handleDropAccepted}
          onDropRejected={handleDropRejected}
          multiple={false}
          maxSize={MAX_FILE_SIZE}
        >
          <div>
            <p>{msg().Exp_Lbl_DragAndDrop}</p>
            <button type="button">{msg().Exp_Lbl_ChooseFile}</button>
          </div>
        </S.UploadArea>
      </S.Body>

      {!isEmpty(imgPreviewUrl) && (
        <CSSTransition
          in
          timeout={500}
          classNames={`${ROOT}__modal-container`}
          unmountOnExit
        >
          <LightboxModal
            src={imgPreviewUrl}
            toggleLightbox={() => setImgPreviewUrl('')}
          />
        </CSSTransition>
      )}
    </S.Wrapper>
  );
};

export default Component;
