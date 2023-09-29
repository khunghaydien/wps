import React, { useRef } from 'react';

import { useFormikContext } from 'formik';
import get from 'lodash/get';

import styled from 'styled-components';

import { IconButton, Icons } from '@apps/core';
import { Color } from '@apps/core/styles';
import Button from '@commons/components/buttons/Button';
import {
  CheckBox,
  Currency,
  Date,
  DateTime,
  FileAttachment,
  MultiPickList,
  PickList,
  ReferenceField,
  TextArea,
  TextField,
} from '@commons/components/customRequest/Fields';
import DialogFrame from '@commons/components/dialogs/DialogFrame';
import IconAttach from '@commons/images/icons/attach.svg';
import msg from '@commons/languages';

import {
  groupLayoutItemsBySectionAndRow,
  isFieldDisabled,
} from '@apps/domain/models/customRequest';
import {
  AUTO_SET_FIELDS,
  typeName,
} from '@apps/domain/models/customRequest/consts';
import {
  LabelMap,
  LayoutItem,
  Mode,
  ReferenceLabelField,
  ReferenceRecords,
} from '@apps/domain/models/customRequest/types';
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
} from '@apps/domain/models/exp/Receipt';

export type Props = {
  mode: Mode;
  recordTypeName: string;
  configList: Array<LayoutItem>;
  isShownFile: boolean;
  currencySymbol: string;
  title: string;
  labelMap: LabelMap; // map of displayLabels for reference field fetched from BE - for initial detail display
  selectedReferenceRecords: Record<string, ReferenceRecords>;
  referenceLabelField: ReferenceLabelField; // object's field used for label display
  isApexView?: boolean;
  uploadFiles: (files: File[]) => Promise<any>;
  openReferenceDialog: (objName, fieldName) => void;
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

export const getAlignTooltip = (column: number, sectionColumns: number) => {
  if (column === sectionColumns - 1 && sectionColumns > 1) {
    return 'top right';
  }
  return 'top left';
};

const getFieldComp = (
  x: LayoutItem,
  formikProps: any,
  props: Props,
  columnIndex: number,
  sectionColumns: number
) => {
  const { mode, currencySymbol } = props;
  const { values, errors, handleChange } = formikProps;
  const val = values[x.field];
  const alignTooltip = getAlignTooltip(columnIndex, sectionColumns);
  const fieldProps = {
    label: x.label,
    name: x.field,
    required: x.required,
    value: val,
    onChange: handleChange,
    error: errors[x.field],
    disabled: isFieldDisabled(x, mode),
    helpMsg: x.helpMsg,
    alignTooltip,
  };
  const openExternalLink = () => {
    window.open(fieldProps.value, '_blank');
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
    case typeName.STRING:
      return <TextField {...fieldProps} placeholder="" />;
    case typeName.TEXTAREA:
      return <TextArea {...fieldProps} readOnly={fieldProps.disabled} />;
    case typeName.URL:
      return (
        <TextField
          {...fieldProps}
          placeholder=""
          icon={
            <IconButton
              color={Color.secondary}
              type="button"
              icon={Icons.ExternalLink}
              onClick={openExternalLink}
              disabled={!fieldProps.value}
            />
          }
        />
      );
    case typeName.REFERENCE:
      let displayValue = '';
      if (val) {
        /* Initial loading: get from labelMap
         * Later update: get from referenceLabelField
         */
        const records = props.selectedReferenceRecords[x.objectName] || [];
        const record = records.find(({ Id }) => Id === val) || {};
        const field = props.referenceLabelField[x.objectName];
        const generatedLabel = get(record, field);
        displayValue = generatedLabel || props.labelMap[x.field];
      }

      return (
        <ReferenceField
          {...fieldProps}
          displayValue={displayValue}
          openReferenceDialog={props.openReferenceDialog}
          objectName={x.objectName}
        />
      );
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
        {icon}
        <S.AttachLabel>{msg().Exp_Custom_Lbl_FileAttachment}</S.AttachLabel>
      </div>
    );
  };

  const formattedList = groupLayoutItemsBySectionAndRow(props.configList);

  return (
    <StyledFrame.Dialog
      isApexView={props.isApexView}
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
        <FormContent>
          {Object.entries(formattedList).map(
            ([
              sectionId,
              {
                label: sectionLabel,
                columns: sectionColumns,
                rows: sectionRows,
                list: sectionList,
              },
            ]) => {
              const rows = [...Array(sectionRows).keys()].map((rowIndex) => {
                const columns = [...Array(sectionColumns).keys()].map(
                  (columnIndex) => {
                    const column = sectionList?.[rowIndex]?.[columnIndex];

                    return (
                      <GridCell
                        key={`${rowIndex}-${columnIndex}`}
                        $width={100 / sectionColumns}
                      >
                        {column ? (
                          getFieldComp(
                            column,
                            formikProps,
                            props,
                            columnIndex,
                            sectionColumns
                          )
                        ) : (
                          <BlankSpace />
                        )}
                      </GridCell>
                    );
                  }
                );

                return <GridRow key={rowIndex}>{columns}</GridRow>;
              });

              return (
                <Section key={sectionId}>
                  <SectionHeading>{sectionLabel}</SectionHeading>
                  <Grid>{rows}</Grid>
                </Section>
              );
            }
          )}
          {props.isShownFile && (
            <FileAttachment
              label={msg().Exp_Custom_Lbl_FileAttachment}
              uploadFiles={props.uploadFiles}
              name="attachedFileList"
              values={formikProps.values}
              errors={formikProps.errors}
            />
          )}
        </FormContent>
      </StyledFrame.Form>
    </StyledFrame.Dialog>
  );
};

export default FormDialog;

const StyledFrame = {
  Dialog: styled(DialogFrame)<{ isApexView: boolean }>`
    ${({ isApexView }) => `width: ${isApexView ? '500px' : '1000px'}`}
  `,
  Header: styled.div`
    color: #333;
    font-size: 13px;
    line-height: 17px;
    height: 30px;
    padding: 0 16px;
    background: #f4f6f9;
    font-weight: 700;
    align-items: center;
    align-content: center;
    display: flex;
  `,
  Form: styled.form`
    max-height: 65vh;
    overflow: auto;
  `,
};

const FormContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  margin: 15px 15px 25px 15px;
`;

const SectionHeading = styled.div`
  font-weight: bold;
  background-color: #ebf3f7;
  min-height: 41px;
  line-height: 41px;
  padding-left: 16px;
`;

const Grid = styled.table``;

const GridRow = styled.tr``;

const GridCell = styled.td<{ $width?: number }>`
  padding: 10px;
  width: ${({ $width = 100 }) => `${$width}%`};
  vertical-align: top;
`;

const BlankSpace = styled.div`
  height: 30px;
`;
