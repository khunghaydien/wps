import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import styled from 'styled-components';

import '@commons/components/Lightbox.scss';
import { NAMESPACE_PREFIX } from '@commons/api';
import Attachment from '@commons/components/Attachment';
import LightboxModal from '@commons/components/LightboxModal';
import MultiColumnsGrid from '@commons/components/MultiColumnsGrid';
import msg from '@commons/languages';
import DateUtil from '@commons/utils/DateUtil';

import { groupLayoutItemsBySectionAndRow } from '@apps/domain/models/customRequest';
import {
  CUSTOM_REQUEST_FIELD_SECTION_LABEL,
  FILE_PREFIX,
  labelMapping,
  RECORD_ACCESS_FIELD_NAME,
  typeName as TYPE_NAME,
} from '@apps/domain/models/customRequest/consts';
import {
  LayoutItem,
  RequestDetail,
} from '@apps/domain/models/customRequest/types';
import { previewUrl } from '@apps/domain/models/exp/Receipt';

import { getAlignTooltip } from './Dialogs/Form';
import { Currency, Link, TextArea, TextField } from './Fields';

import './Detail.scss';

type Props = {
  layoutConfig: LayoutItem[];
  requestDetail: RequestDetail;
  isApproval?: boolean;
  isShownFile: boolean;
  isShownHistory: boolean;
  currencySymbol: string;
  title?: string;
};

const ROOT = 'ts-commons-custom-request-detail';
const STATUS_FIELD_NAME = NAMESPACE_PREFIX + 'Status__c';

const getChunkedArray = (
  arr: Array<any>,
  chunkSize: number
): Array<Array<any>> => {
  const result = arr.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);
  return result;
};

const DetailView = (props: Props) => {
  const { layoutConfig, requestDetail, isApproval } = props;
  const [imgPreviewUrl, setImgPreviewUrl] = useState('');

  const convertToField = ({
    label,
    field,
    value,
    typeName,
    fractionDigits,
    picklistValues = [],
    referenceFieldValue,
    helpMsg,
    sectionColumns,
    columnIndex,
  }) => {
    const alignTooltip = getAlignTooltip(columnIndex, sectionColumns);
    let displayValue;
    switch (typeName) {
      case TYPE_NAME.TEXTAREA:
        if (value) {
          return (
            <TextArea
              key={value}
              label={label}
              value={value}
              readOnly
              error={''}
              name={field}
              helpMsg={helpMsg}
            />
          );
        }
        break;
      case TYPE_NAME.REFERENCE:
        if (field === RECORD_ACCESS_FIELD_NAME) {
          return null;
        }
        displayValue = referenceFieldValue;
        break;
      case TYPE_NAME.CURRENCY:
        return (
          <Currency
            label={label}
            value={value}
            disabled
            currencySymbol={props.currencySymbol}
            fractionDigits={fractionDigits}
            helpMsg={helpMsg}
            alignTooltip={alignTooltip}
          />
        );
      case TYPE_NAME.DATE:
        displayValue = DateUtil.formatYMD(value);
        break;
      case TYPE_NAME.DATETIME:
        displayValue = value && DateUtil.formatYMDhhmm(value);
        break;
      case TYPE_NAME.PICKLIST:
        if (field === STATUS_FIELD_NAME) {
          displayValue = msg()[labelMapping[value]];
        } else {
          const option =
            picklistValues.find((option) => option.value === value) || {};
          displayValue = option.label || value;
        }

        break;
      case TYPE_NAME.DOUBLE:
        displayValue = value && value.toLocaleString();
        break;
      case TYPE_NAME.STRING:
      case TYPE_NAME.MULTIPICKLIST:
        displayValue = value;
        break;
      case TYPE_NAME.BOOLEAN:
        displayValue = String(value);
        break;
      case TYPE_NAME.URL:
        return <Link value={value} label={label} />;
      default:
        displayValue = '';
        break;
    }
    return (
      <TextField
        key={field}
        label={label}
        disabled
        value={isNil(displayValue) ? '' : displayValue}
        placeholder=""
        helpMsg={helpMsg}
        alignTooltip={alignTooltip}
      />
    );
  };

  const renderInformation = () => {
    const formattedList = groupLayoutItemsBySectionAndRow(layoutConfig);

    return Object.entries(formattedList).map(
      ([
        sectionId,
        {
          label: sectionLabel,
          list: sectionList,
          rows: sectionRows,
          columns: sectionColumns,
        },
      ]) => {
        const rows = [...Array(sectionRows).keys()].map((rowIndex) => {
          const columns = [...Array(sectionColumns).keys()].map(
            (columnIndex) => {
              const column = sectionList?.[rowIndex]?.[columnIndex];

              const field = (() => {
                if (!column) {
                  return null;
                }

                if (!column.label) {
                  return <BlankSpace />;
                }

                let value = '';
                let referenceFieldValue = '';
                const customRequest = requestDetail.customRequest || {};
                const labelMap = customRequest.labelMap || {};

                if (!isEmpty(customRequest)) {
                  value = customRequest[column.field];
                  referenceFieldValue = labelMap[column.field];
                }

                return convertToField({
                  ...column,
                  value,
                  referenceFieldValue,
                  sectionColumns,
                  columnIndex,
                });
              })();

              return (
                <GridCell
                  key={`${rowIndex}-${columnIndex}`}
                  $width={100 / sectionColumns}
                >
                  {field}
                </GridCell>
              );
            }
          );

          return <GridRow key={rowIndex}>{columns}</GridRow>;
        });

        return (
          <Section key={sectionId} isApproval={isApproval}>
            {(!isApproval ||
              sectionLabel !== CUSTOM_REQUEST_FIELD_SECTION_LABEL) && (
              <SectionHeading>{sectionLabel}</SectionHeading>
            )}
            <SectionContent>
              <Grid>{rows}</Grid>
            </SectionContent>
          </Section>
        );
      }
    );
  };

  const handlePreview = (fileVerId) => {
    const imageUrl = previewUrl(fileVerId);
    setImgPreviewUrl(imageUrl);
  };

  const renderFileAttachement = () => {
    const { attachedFileList } = requestDetail;
    let res = null;
    let className = 'file-attachment';
    if (isEmpty(attachedFileList)) {
      res = <span>{msg().Exp_Lbl_NoFileAttachment}</span>;
      className = className.concat('-empty');
    } else {
      const files = attachedFileList.map((file) => (
        <Attachment
          key={file.attachedFileId}
          className={`${ROOT}__attachment-item`}
          {...file}
          handlePreview={handlePreview}
          isPreview
          prefix={FILE_PREFIX}
        />
      ));
      const filesInRow = getChunkedArray(files, 4);
      res = filesInRow.map((row, idx) => (
        <MultiColumnsGrid
          className={isApproval ? 'slds-wrap' : ''}
          key={idx}
          sizeList={isApproval ? [12, 12, 12, 12] : [3, 3, 3, 3]}
        >
          {row}
        </MultiColumnsGrid>
      ));
    }
    return renderSession(msg().Exp_Custom_Lbl_FileAttachment, res, className);
  };

  const renderHistory = () => {
    const { approvalHistoryList } = requestDetail;
    let res = null;
    if (!isEmpty(approvalHistoryList)) {
      const rows = approvalHistoryList.map(
        ({ approveTime, status, actorName, comment }, idx) => (
          <div className={`${ROOT}__history-row`} key={idx}>
            <div>{approveTime}</div>
            <div>{msg()[labelMapping[status]]}</div>
            <div>{actorName}</div>
            <div>{comment}</div>
          </div>
        )
      );
      res = (
        <div className={`${ROOT}__history-table`}>
          <div className={`${ROOT}__history-header`}>
            <div>{msg().Exp_Lbl_DateAndTime}</div>
            <div>{msg().Exp_Lbl_Status}</div>
            <div>{msg().Exp_Lbl_ActionBy}</div>
            <div>{msg().Exp_Lbl_Comments}</div>
          </div>
          {rows}
        </div>
      );
    }
    return renderSession(msg().Exp_Lbl_History, res, 'history');
  };

  const renderSession = (title: string, child: JSX.Element[], key?: string) => {
    return (
      <div className={`${ROOT}__section ${key || ''}`}>
        <div className={`${ROOT}__section-header`}>{title}</div>
        <Detail isApproval={isApproval}>{child}</Detail>
      </div>
    );
  };

  return (
    <div className={`${ROOT}__body`}>
      <section>
        {renderSession(
          props.title || msg().Com_Lbl_Information,
          renderInformation()
        )}
      </section>

      {props.isShownFile && <section>{renderFileAttachement()}</section>}
      {props.isShownHistory && <section>{renderHistory()}</section>}

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
    </div>
  );
};

export default DetailView;

const Detail = styled.div<{
  isApproval: boolean;
}>`
  padding: 16px;
  background: ${({ isApproval }) => (isApproval ? '#fff' : 'transparent')};
`;

const Section = styled.div<{
  isApproval: boolean;
}>`
  display: flex;
  flex-direction: column;
  margin: ${({ isApproval }) =>
    isApproval ? '0 0 25px 0' : '15px 15px 25px 15px'};
`;

const SectionHeading = styled.div`
  font-weight: bold;
  background-color: #ebf3f7;
  min-height: 41px;
  line-height: 41px;
  padding-left: 16px;
`;

const SectionContent = styled.div`
  display: flex;
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
