import React from 'react';

import { Form } from 'formik';
import { cloneDeep, some } from 'lodash';

import msg from '../../../../../../commons/languages';
import { ErrorInfo } from '../../../../../../commons/utils/AppPermissionUtil';
import EmptyImageIcon from '../../../../molecules/commons/EmptyImageIcon';
import Navigation from '../../../../molecules/commons/Navigation';
import WrapperWithPermission from '../../../../organisms/commons/WrapperWithPermission';

import {
  ALLOWED_MIME_TYPES,
  BASE_FILE_SIZE,
  Base64FileList,
  MAX_FILE_SIZE,
} from '../../../../../../domain/models/exp/Receipt';

import Button from '../../../../atoms/Button';
import Input from '../../../../atoms/Fields/Input';
import Preview from './Preview';

import './index.scss';

const ROOT = 'mobile-app-pages-expense-page-receipt-upload';

type Props = {
  values: { files: Base64FileList; rawFiles: File[] };
  hasPermissionError: ErrorInfo | null;
  useReceiptScan: boolean;
  setFieldValue: (key: string, value: any) => void;
  handleSubmit: () => void;
  getBase64files: (
    e: React.FormEvent<HTMLInputElement>
  ) => Promise<Base64FileList>;
};

const ReceiptUploadPage = (props: Props) => {
  const { values, handleSubmit } = props;
  const hasImage = values.files[0];

  const maxFileSize = props.useReceiptScan ? BASE_FILE_SIZE : MAX_FILE_SIZE;

  const maxFileErrorMsg = props.useReceiptScan
    ? msg().Common_Err_MaxOCRFileSize
    : msg().Common_Err_MaxFileSize;

  const maxFileLimitMsg = props.useReceiptScan
    ? msg().Exp_Lbl_MaxOCRFileSize
    : msg().Exp_Lbl_MaxFileSize;

  // methods
  const handleChange = () => (e: React.ChangeEvent<HTMLInputElement>) => {
    const addRawFiles = Array.from(e.currentTarget.files);
    const { files, rawFiles } = props.values;
    props.getBase64files(e).then((addFiles) => {
      Array.prototype.push.apply(addFiles, files);
      Array.prototype.push.apply(addRawFiles, rawFiles);
      props.setFieldValue('files', addFiles);
      props.setFieldValue('rawFiles', addRawFiles);
    });
    e.target.value = '';
  };

  const remove = (index: number) => {
    const files = cloneDeep(props.values.files);
    const rawFiles = cloneDeep(props.values.rawFiles);
    files.splice(index, 1);
    rawFiles.splice(index, 1);
    props.setFieldValue('files', files);
    props.setFieldValue('rawFiles', rawFiles);
  };

  const renderFileSizeMsg = (isLargeFile: boolean) => {
    return isLargeFile ? (
      <div className={`${ROOT}__error`}>{maxFileErrorMsg}</div>
    ) : (
      <div>{maxFileLimitMsg}</div>
    );
  };

  // This validation will be removed when accept=".pdf,image/*" works fine for mobile
  const isInvalidType = some(
    values.files,
    (file) => ALLOWED_MIME_TYPES.indexOf(file.type) === -1
  );
  const isLargeFile = some(values.files, (file) => {
    return file.size > maxFileSize;
  });

  const isCantSubmitButton = !hasImage || isInvalidType || isLargeFile;

  return (
    <WrapperWithPermission
      className={ROOT}
      hasPermissionError={props.hasPermissionError}
    >
      <Navigation title={msg().Exp_Lbl_AddReceipt} />
      <Form className="main-content">
        <div className={`${ROOT}-preview`}>
          {hasImage ? (
            <Preview images={values.files} onClickRemoveButton={remove} />
          ) : (
            <EmptyImageIcon className={`${ROOT}__empty`} />
          )}
        </div>
        {msg().Exp_Lbl_UploadReceiptImage}
        {renderFileSizeMsg(isLargeFile)}
        {isInvalidType && (
          <div className={`${ROOT}__error`}>{msg().Common_Err_InvalidType}</div>
        )}
        <div className={`${ROOT}__buttons`}>
          <label className={`${ROOT}__label`}>
            <Input
              className={`${ROOT}__input`}
              type="file"
              accept="image/*"
              capture="camera"
              onChange={handleChange()}
              multiple
            />
            {msg().Exp_Btn_AddReceipt}
          </label>
          <Button
            priority="primary"
            variant="neutral"
            type="submit"
            className={`${ROOT}__submit`}
            disabled={isCantSubmitButton}
            onClick={handleSubmit}
          >
            {msg().Exp_Btn_SubmitReceipt}
          </Button>
        </div>
      </Form>
    </WrapperWithPermission>
  );
};

export default ReceiptUploadPage;
