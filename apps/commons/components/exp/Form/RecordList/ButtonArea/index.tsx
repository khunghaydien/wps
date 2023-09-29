import React from 'react';

import { Text } from '../../../../../../core';

import {
  CLONE_RECORD_OPTIONS,
  NEW_RECORD_OPTIONS,
} from '../../../../../../domain/models/exp/Record';

import msg from '../../../../../languages';
import Button from '../../../../buttons/Button';
import DropDown from '../../../../fields/Dropdown';
import ToolTip from '../../../../Tooltip';

import './index.scss';

const ROOT = 'ts-expenses__form-records-button-area';

type Props = {
  checkboxes: Array<number>;
  errors: {
    accountingDate?: string;
    records: Array<any>;
  };
  isExpenseRequest?: boolean;
  isFinanceApproval?: boolean;
  isSummaryMode: boolean;
  readOnly: boolean;
  showToolTip: boolean;
  useMasterCardImport: boolean;
  useReceiptScan: boolean;
  useTransitManager: boolean;
  onClickCloneRecordButton: (arg0?: string) => void;
  onClickCreditCardButton: () => void;
  onClickDeleteRecordItem: () => void;
  onClickIcCardButton: () => void;
  onClickNewRecordButton: () => void;
  onClickOpenLibraryButton: () => void;
  toggleMode: () => void;
};

export default class RecordListButtonArea extends React.Component<Props> {
  createRecord = (value: string) => {
    switch (value) {
      case NEW_RECORD_OPTIONS.IC_CARD:
        this.props.onClickIcCardButton();
        break;
      case NEW_RECORD_OPTIONS.CREDIT_CARD:
        this.props.onClickCreditCardButton();
        break;
      case NEW_RECORD_OPTIONS.OCR_RECORD:
        this.props.onClickOpenLibraryButton();
        break;
      default:
        this.props.onClickNewRecordButton();
    }
  };

  render() {
    const {
      checkboxes,
      isExpenseRequest,
      useReceiptScan,
      useTransitManager,
      showToolTip,
      useMasterCardImport,
      onClickCloneRecordButton,
    } = this.props;
    const isDeleteDisabled = this.props.readOnly || !checkboxes.length;
    const isCloneDisabled =
      this.props.readOnly || !checkboxes.length || checkboxes.length > 10;
    const readOnly = this.props.readOnly || !!this.props.errors.accountingDate;
    const newRecordDropDownOptions = [
      { label: msg().Exp_Lbl_Manual, value: NEW_RECORD_OPTIONS.MANUAL },
    ];
    if (useReceiptScan) {
      newRecordDropDownOptions.push({
        label: msg().Exp_Lbl_CreateRecordFromReceipt,
        value: NEW_RECORD_OPTIONS.OCR_RECORD,
      });
    }
    if (useMasterCardImport) {
      newRecordDropDownOptions.push({
        label: msg().Exp_Lbl_CreateRecordFromCreditCard,
        value: NEW_RECORD_OPTIONS.CREDIT_CARD,
      });
    }
    if (useTransitManager) {
      newRecordDropDownOptions.push({
        label: msg().Exp_Lbl_CreateRecordFromIcCard,
        value: NEW_RECORD_OPTIONS.IC_CARD,
      });
    }

    const cloneRecordDropDownOptions = [
      {
        label: msg().Exp_Lbl_CloneOneTime,
        value: CLONE_RECORD_OPTIONS.SINGLE_CLONE,
      },
      {
        label: msg().Exp_Lbl_CloneMultiple,
        value: CLONE_RECORD_OPTIONS.MULTIPLE_CLONE,
      },
    ];

    const isSimpleButton =
      isExpenseRequest || newRecordDropDownOptions.length <= 1;
    const newButtonClass = isSimpleButton ? `${ROOT}__btn-new-request` : ``;
    const disabledButtonClass = readOnly
      ? `${ROOT}__btn-new--isDisabledWithToolTip`
      : ``;
    const newButtonArea = (
      <React.Fragment>
        <div className={`${ROOT}__btn-new-area`}>
          <Button
            type="secondary"
            data-testid={`${ROOT}__btn-new`}
            onClick={this.props.onClickNewRecordButton}
            className={`${ROOT}__btn-new ${disabledButtonClass} ${newButtonClass}`}
          >
            {msg().Exp_Btn_NewRecord}
          </Button>
        </div>

        {!isSimpleButton && !this.props.isFinanceApproval && (
          <DropDown
            className={`${ROOT}__dropdown-new`}
            data-testid={`${ROOT}__dropdown-new`}
            onSelect={(item) => this.createRecord(item.value)}
            options={newRecordDropDownOptions}
            label=""
            disabled={readOnly}
          />
        )}
      </React.Fragment>
    );

    return (
      <div className={`${ROOT}__contents`}>
        <div className={`${ROOT}__title`}>
          <Text size="xxl" color="secondary" bold>
            {msg().Exp_Lbl_RecordsList}
          </Text>
        </div>

        <div className={`${ROOT}__display-summary`}>
          <input
            type="checkbox"
            onChange={this.props.toggleMode}
            checked={this.props.isSummaryMode}
          />
          <span>{msg().Exp_Lbl_DisplaySummaryPerExpType}</span>
        </div>

        {showToolTip && readOnly ? (
          <ToolTip
            id={ROOT}
            aling="top"
            content={msg().Exp_Msg_NewRecordButton}
          >
            <div>{newButtonArea}</div>
          </ToolTip>
        ) : (
          newButtonArea
        )}

        <div className={`${ROOT}__btn-clone`}>
          {!this.props.isFinanceApproval && (
            <>
              <Button
                type="default"
                data-testid={`${ROOT}__clone`}
                onClick={() =>
                  onClickCloneRecordButton(CLONE_RECORD_OPTIONS.SPECIFIED_CLONE)
                }
                disabled={isCloneDisabled}
              >
                {msg().Exp_Lbl_Clone}
              </Button>
              <DropDown
                className={`${ROOT}__dropdown-clone`}
                data-testid={`${ROOT}__dropdown-clone`}
                onSelect={(item) => onClickCloneRecordButton(item.value)}
                options={cloneRecordDropDownOptions}
                label=""
                disabled={isCloneDisabled}
              />
            </>
          )}
        </div>
        <div className={`${ROOT}__btn-delete`}>
          {!this.props.isFinanceApproval && (
            <Button
              type="destructive"
              data-testid={`${ROOT}__btn-delete`}
              onClick={this.props.onClickDeleteRecordItem}
              disabled={isDeleteDisabled}
            >
              {msg().Com_Btn_Delete}
            </Button>
          )}
        </div>
      </div>
    );
  }
}
