import React, { useRef } from 'react';

import { useFormikContext } from 'formik';
import get from 'lodash/get';

import styled from 'styled-components';

import Button from '@apps/commons/components/buttons/Button';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import msg from '@apps/commons/languages';
import IconAttach from '@commons/images/icons/attach.svg';

import { isFieldDisabled } from '@apps/custom-request-pc/models';
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
} from '@apps/domain/models/exp/Receipt';

import {
  CheckBox,
  Currency,
  Date,
  DateTime,
  FileAttachment,
  MultiPickList,
  PickList,
  RichTextEditor,
  TextField,
} from '../Fields';
import { StyledFrame } from './RecordTypeSelect';
import { AUTO_SET_FIELDS, typeName } from '@apps/custom-request-pc/consts';
import { LayoutItem, Mode } from '@apps/custom-request-pc/types';

export type Props = {
  mode: Mode;
  recordTypeName: string;
  configList: Array<LayoutItem>;
  isShownFile: boolean;
  currencySymbol: string;
  title: string;
  uploadFiles: (files: File[]) => Promise<any>;
  onHideAll: () => void;
};

const S = {
  InnerFrame: styled.div`
    margin: 0 16px;
    padding-bottom: 4px;
    width: calc(100% - 32px) !important;
  `,
  AttachLabel: styled.span`
    color: #2782ed;
    padding-left: 4px;
    cursor: pointer;
  `,
};

const getFieldComp = (x: LayoutItem, formikProps: any, props: Props) => {
  const { mode, currencySymbol } = props;
  const { values, errors, handleChange } = formikProps;
  const fieldProps = {
    label: x.label,
    name: x.field,
    required: x.required,
    value: values[x.field],
    onChange: handleChange,
    error: errors[x.field],
    disabled: isFieldDisabled(x, mode),
  };

  if (AUTO_SET_FIELDS.includes(x.field)) {
    return null;
  }

  switch (x.typeName) {
    case typeName.BOOLEAN:
      return <CheckBox checked={fieldProps.value} {...fieldProps} />;
    case typeName.CURRENCY:
      return (
        <Currency
          {...fieldProps}
          currencySymbol={currencySymbol}
          fractionDigits={x.fractionDigits}
        />
      );
    case typeName.DATE:
      return <Date {...fieldProps} />;
    case typeName.DATETIME:
      return <DateTime {...fieldProps} />;
    case typeName.DOUBLE:
      return <TextField type="number" {...fieldProps} placeholder="" />;
    case typeName.MULTIPICKLIST:
      return <MultiPickList {...fieldProps} options={x.picklistValues} />;
    case typeName.PICKLIST:
      let options = x.picklistValues.map(({ value, label }) => {
        return { value, text: label };
      });
      options = [{ value: '', text: '' }, ...options];
      return <PickList {...fieldProps} options={options} />;
    case typeName.REFERENCE:
      return null;
    case typeName.STRING:
      return <TextField {...fieldProps} placeholder="" />;
    case typeName.TEXTAREA:
      return <RichTextEditor {...fieldProps} />;
    default:
      return null;
  }
};

const FormDialog = (props: Props) => {
  const inputFile = useRef(null);
  const { submitForm, ...formikProps } = useFormikContext();
  const renderHeaderSub = () => {
    if (!props.isShownFile) {
      return null;
    }
    const onButtonClick = () => {
      // `current` points to the mounted file input element
      inputFile.current.click();
    };

    const onAttachFile = async (e) => {
      event.stopPropagation();
      event.preventDefault();
      const formikKey = 'attachedFileList';
      const files = e.target.files;
      if (files[0].size > MAX_FILE_SIZE) {
        formikProps.setFieldError(formikKey, msg().Common_Err_MaxFileSize);
      } else {
        const currentFiles = get(formikProps.values, formikKey, []);
        const file = await props.uploadFiles(files);
        formikProps.setFieldValue(formikKey, [...currentFiles, file]);
      }
      formikProps.setFieldTouched(formikKey, true, false);
    };

    const icon = <IconAttach />;
    return (
      <div onClick={onButtonClick}>
        <input
          type="file"
          multiple={false}
          accept={ALLOWED_MIME_TYPES.join()}
          ref={inputFile}
          style={{ display: 'none' }}
          onChange={onAttachFile}
        />
        {icon} <S.AttachLabel>{msg().Exp_Lbl_AddFile}</S.AttachLabel>
      </div>
    );
  };
  return (
    <StyledFrame.Dialog
      title={props.title}
      hide={props.onHideAll}
      headerSub={renderHeaderSub()}
      footer={
        <DialogFrame.Footer>
          <Button onClick={props.onHideAll}>{msg().Com_Btn_Close}</Button>
          <Button type={'primary'} onClick={submitForm}>
            {msg().Com_Btn_Save}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <StyledFrame.Header> {props.recordTypeName}</StyledFrame.Header>
      <StyledFrame.Form>
        {props.configList.map((x) => (
          <S.InnerFrame>{getFieldComp(x, formikProps, props)}</S.InnerFrame>
        ))}
        {props.isShownFile && (
          <FileAttachment
            label={msg().Exp_Custom_Lbl_FileAttachment}
            uploadFiles={props.uploadFiles}
            name="attachedFileList"
            values={formikProps.values}
            errors={formikProps.errors}
          />
        )}
      </StyledFrame.Form>
    </StyledFrame.Dialog>
  );
};

export default FormDialog;
