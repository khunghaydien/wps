import React from 'react';

import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';

import '@apps/commons/components/Lightbox.scss';
import Button from '@apps/commons/components/buttons/Button';
import msg from '@apps/commons/languages';
import { NAMESPACE_PREFIX } from '@commons/api';
import CustomRequestDetail from '@commons/components/customRequest/Detail';

import {
  labelMapping,
  status as STATUS,
} from '@apps/domain/models/customRequest/consts';
import {
  LayoutItem,
  RequestDetail,
} from '@apps/domain/models/customRequest/types';

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

const DetailView = (props: Props) => {
  const { layoutConfig, requestDetail, isShowClone } = props;

  const formatRequestDetail = () => {
    const formattedRequestDetail = cloneDeep(requestDetail);
    const status = get(requestDetail, 'customRequest.' + STATUS_FIELD_NAME, '');
    if (!status) {
      set(
        formattedRequestDetail,
        'customRequest.' + STATUS_FIELD_NAME,
        STATUS.NOT_REQUESTED
      );
    }

    return formattedRequestDetail;
  };

  const formattedRequestDetail = formatRequestDetail();
  const status =
    get(formattedRequestDetail, 'customRequest.' + STATUS_FIELD_NAME) || '';

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

  return (
    <div className={ROOT}>
      <div className={`${ROOT}__header`}>
        {renderNavigation()}
        {renderActionBtn()}
      </div>
      <hr />
      <CustomRequestDetail
        currencySymbol={props.currencySymbol}
        isShownFile={props.isShownFile}
        isShownHistory={props.isShownHistory}
        layoutConfig={layoutConfig}
        requestDetail={formattedRequestDetail}
      />
    </div>
  );
};

export default DetailView;
