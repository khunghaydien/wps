import React from 'react';

import get from 'lodash/get';
import { $Shape } from 'utility-types';

import { STATUS_MAP } from '../../../../../../../domain/models/exp/CustomRequest';
import {
  CUSTOM_REQUEST_LINK_USAGE_TYPE,
  Report,
} from '../../../../../../../domain/models/exp/Report';

import BtnDelete from '../../../../../../images/btnDelete.svg';
import msg from '../../../../../../languages';
import Button from '../../../../../buttons/Button';

import './index.scss';

const ROOT = 'ts-expenses__form-report-summary__actions-custom-request';

export type CustomRequestProps = {
  /*
  this is false positive.
  This value is used by the component defined in the component.
   FIXME: However, in practice,
  it would be better to define this component on the outside and pass Props.
  */
  openCustomRequestDialog?: () => void; // eslint-disable-line react/no-unused-prop-types
  openCustomRequestPage: (id?: string) => void; // eslint-disable-line react/no-unused-prop-types
};

type Props = CustomRequestProps & {
  // eslint-disable-line react/no-unused-prop-types
  customRequestLinkUsage?: string;
  /*
  this is false positive.
  This value is used through lodash.get
  */
  errors?: any;
  expReport: Report;
  isExpenseRequest?: boolean;

  isFinanceApproval?: boolean;
  readOnly?: boolean;
  updateReport?: (updateReportObject: $Shape<Report>) => void;
};

const CustomRequestField = (props: Props) => {
  const isNotUsed =
    props.customRequestLinkUsage === CUSTOM_REQUEST_LINK_USAGE_TYPE.NotUsed;

  if (isNotUsed || props.isExpenseRequest) {
    return null;
  }

  const { customRequestId, customRequestName, customRequestStatus } =
    props.expReport;
  const isCleared = !customRequestId;
  const isRequired =
    props.customRequestLinkUsage === CUSTOM_REQUEST_LINK_USAGE_TYPE.Required;

  const onClickClearBtn = () => {
    if (props.updateReport) {
      const updateObj = {
        customRequestId: null,
        customRequestName: null,
      };
      props.updateReport(updateObj);
    }
  };

  /**
   * Render button to open custom request dialog
   * Together with Error Msg 'Required'
   */
  const renderSelectBtn = () => {
    const showSelectBtn =
      isCleared && !props.readOnly && !props.isFinanceApproval;
    const requireMark = isRequired ? (
      <span className="is-required">*&nbsp;</span>
    ) : null;

    const btn = (
      <Button
        type="default"
        className={`${ROOT}__select-btn`}
        onClick={props.openCustomRequestDialog}
      >
        {msg().Exp_Btn_LinkCustomRequest}
      </Button>
    );

    const errorKey = get(props.errors, 'customRequestId');
    return (
      showSelectBtn && (
        <div className={`${ROOT}__select`}>
          {requireMark}
          {btn}
          {errorKey && (
            <div className={`${ROOT}__error-message`}>{msg()[errorKey]}</div>
          )}
        </div>
      )
    );
  };

  /**
   * Render clear btn to clear linked custom request
   */
  const renderClearBtn = () => {
    const showClearBtn =
      !isCleared && !props.readOnly && !props.isFinanceApproval;
    const clearBtn = (
      <BtnDelete
        aria-hidden="true"
        className={`${ROOT}__clear slds-button__icon`}
        onClick={onClickClearBtn}
      />
    );
    return showClearBtn && clearBtn;
  };

  /**
   * Render label & clear btn
   */
  const renderField = () => {
    const statusLabel = customRequestStatus
      ? msg()[STATUS_MAP[customRequestStatus]]
      : '';

    const name = (
      <span
        className={`${ROOT}__text`}
        onClick={() => {
          props.openCustomRequestPage(customRequestId);
        }}
      >
        {customRequestName || ''}
      </span>
    );
    const status = statusLabel && (
      <span className={`${ROOT}__status`}> {`(${statusLabel})`}</span>
    );
    return (
      <>
        {name}
        {props.isFinanceApproval && status}
        {renderClearBtn()}
      </>
    );
  };

  return (
    <div className={ROOT}>
      {customRequestId && renderField()}
      {renderSelectBtn()}
    </div>
  );
};

export default CustomRequestField;
