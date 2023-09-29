import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import classNames from 'classnames';
import { get, isEmpty, isNil } from 'lodash';

import '@apps/commons/components/Lightbox.scss';
import Button from '@apps/commons/components/buttons/Button';
import MultiColumnsGrid from '@apps/commons/components/MultiColumnsGrid';
import msg from '@apps/commons/languages';
import { NAMESPACE_PREFIX } from '@commons/api';
import Attachment from '@commons/components/Attachment';
import LightboxModal from '@commons/components/LightboxModal';
import DateUtil from '@commons/utils/DateUtil';

import { previewUrl } from '@apps/domain/models/exp/Receipt';

import { Currency, RichTextEditor, TextField } from '../Fields';
import {
  FILE_PREFIX,
  labelMapping,
  status as STATUS,
  typeName as TYPE_NAME,
} from '@apps/custom-request-pc/consts';
import { LayoutItem, RequestDetail } from '@custom-request-pc/types';

import './index.scss';

type Props = {
  layoutConfig: LayoutItem[];
  requestDetail: RequestDetail;
  isShownFile: boolean;
  isShownHistory: boolean;
  isShowClone: boolean;
  currencySymbol: string;
  onClickList: () => void;
  onClickDelete: () => void;
  onClickClone: () => void;
  onClickEdit: () => void;
  onClickSubmit: () => void;
  openRecallDialog: () => void;
};

const ROOT = 'ts-custom-request-detail';
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
  const { layoutConfig, requestDetail, isShowClone } = props;
  const [imgPreviewUrl, setImgPreviewUrl] = useState('');
  const status = get(requestDetail, 'customRequest.' + STATUS_FIELD_NAME) || '';

  const handleEdit = () => {
    props.onClickEdit();
  };

  const renderNavigation = () => {
    const statusLabel = msg()[labelMapping[status]];
    return (
      <div>
        <div className={`${ROOT}__navigation`}>
          <span
            className={`${ROOT}__navigation-back`}
            onClick={props.onClickList}
          >
            {msg().Exp_Lbl_CustomRequestList}
          </span>
          <span className={`${ROOT}__navigation-detail`}>
            {msg().Exp_Lbl_CustomRequestDetails}
          </span>
        </div>
        <div className={`${ROOT}_title`}>
          {msg().Exp_Lbl_CustomRequestDetails}
          <span
            className={`${ROOT}__${status
              .toLowerCase()
              .replace(' ', '')} ${ROOT}__label`}
          >
            {statusLabel}
          </span>
        </div>
      </div>
    );
  };

  const renderActionBtn = () => {
    const status = get(requestDetail, 'customRequest.' + STATUS_FIELD_NAME, '');
    const isActionDisabled = [STATUS.PENDING, STATUS.APPROVED].includes(status);
    const isRecallDisabled = status !== STATUS.PENDING;
    return (
      <div className={`${ROOT}__buttons`}>
        <Button
          className={classNames(`${ROOT}__recall`, {
            disabled: isRecallDisabled,
          })}
          onClick={props.openRecallDialog}
          disabled={isRecallDisabled}
        >
          {msg().Exp_Lbl_Recall}
        </Button>
        <Button
          className={classNames(`${ROOT}__delete`, {
            disabled: isActionDisabled,
          })}
          onClick={props.onClickDelete}
          disabled={isActionDisabled}
        >
          {msg().Exp_Lbl_DeleteFile}
        </Button>
        {isShowClone && (
          <Button className={`${ROOT}__clone`} onClick={props.onClickClone}>
            {msg().Exp_Lbl_Clone}
          </Button>
        )}
        <Button
          className={`${ROOT}__edit`}
          onClick={handleEdit}
          disabled={isActionDisabled}
        >
          {msg().Com_Btn_Edit}
        </Button>
        <Button
          className={`${ROOT}__submit`}
          onClick={props.onClickSubmit}
          disabled={isActionDisabled}
        >
          {msg().Exp_Btn_Submit}
        </Button>
      </div>
    );
  };

  const convertToField = ({
    label,
    field,
    value,
    typeName,
    fractionDigits,
    picklistValues = [],
  }) => {
    let displayValue;
    switch (typeName) {
      case TYPE_NAME.TEXTAREA:
        if (value) {
          return (
            <RichTextEditor
              label={label}
              value={value}
              readOnly
              error={''}
              name={field}
            />
          );
        }
        break;
      case TYPE_NAME.REFERENCE:
        // TODO Reference field not supported yet
        return null;
      case TYPE_NAME.CURRENCY:
        return (
          <Currency
            label={label}
            value={value}
            disabled
            currencySymbol={props.currencySymbol}
            fractionDigits={fractionDigits}
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
      case TYPE_NAME.BOOLEAN:
        displayValue = value;
        break;
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
      />
    );
  };

  const renderInformation = () => {
    const fields = layoutConfig
      .map((o) => {
        const value = isEmpty(requestDetail.customRequest)
          ? ''
          : requestDetail.customRequest[o.field];
        return convertToField({ ...o, value });
      })
      .filter((x) => !!x);
    const fieldsInRow = getChunkedArray(fields, 2);
    const res = fieldsInRow.map((row, idx) => {
      return (
        <MultiColumnsGrid key={idx} sizeList={[6, 6]}>
          {row}
        </MultiColumnsGrid>
      );
    });
    return renderSession(msg().Exp_Lbl_Details, res);
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
        <MultiColumnsGrid key={idx} sizeList={[3, 3, 3, 3]}>
          {row}
        </MultiColumnsGrid>
      ));
    }
    return renderSession(msg().Exp_Lbl_FileAttachment, res, className);
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
        <div className={`${ROOT}__section-body`}>{child}</div>
      </div>
    );
  };

  return (
    <div className={ROOT}>
      <div className={`${ROOT}__header`}>
        {renderNavigation()}
        {renderActionBtn()}
      </div>
      <hr />
      <div className={`${ROOT}__body`}>
        <section>{renderInformation()}</section>
        {props.isShownFile && <section>{renderFileAttachement()}</section>}
        {props.isShownHistory && <section>{renderHistory()}</section>}
      </div>
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
