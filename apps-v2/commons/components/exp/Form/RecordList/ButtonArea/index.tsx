import React from 'react';

import classNames from 'classnames';

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
  isBulkEditMode: boolean;
  isExpenseRequest?: boolean;
  isFinanceApproval?: boolean;
  isLoading?: boolean;
  isMaxBulkEditRecord: boolean;
  isPrimaryCompany: boolean;
  isShowCCOption: boolean;
  isShowICOption: boolean;
  isSummaryMode: boolean;
  isUseBulkEdit: boolean;
  readOnly: boolean;
  showToolTip: boolean;
  useReceiptScan: boolean;
  useTransitManager: boolean;
  onClickBulkCancelButton: () => void;
  onClickBulkCloneButton: (cloneMode: string) => void;
  onClickBulkDeleteButton: () => void;
  onClickBulkEditButton: () => void;
  onClickBulkNewRecordButton: () => void;
  onClickBulkSaveButton: () => void;
  onClickCloneRecordButton: (arg0?: string) => void;
  onClickCreditCardButton: () => void;
  onClickDeleteRecordItem: () => void;
  onClickIcCardButton: () => void;
  onClickNewRecordButton: () => void;
  onClickOpenLibraryButton: () => void;
  toggleMode: () => void;
};

type State = {
  isDropdownOpen: boolean;
};

export default class RecordListButtonArea extends React.Component<
  Props,
  State
> {
  state = {
    isDropdownOpen: false,
  };

  createRecord = (isBulkEditMode: boolean, value: string) => {
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
        if (isBulkEditMode) this.props.onClickBulkNewRecordButton();
        else this.props.onClickNewRecordButton();
    }
  };

  render() {
    const {
      checkboxes,
      isBulkEditMode,
      isExpenseRequest,
      isLoading,
      isMaxBulkEditRecord,
      isShowCCOption,
      isShowICOption,
      useReceiptScan,
      showToolTip,
      isUseBulkEdit,
      onClickBulkCancelButton,
      onClickBulkCloneButton,
      onClickBulkDeleteButton,
      onClickBulkEditButton,
      onClickBulkSaveButton,
      onClickCloneRecordButton,
      useTransitManager,
    } = this.props;
    const { isDropdownOpen } = this.state;
    const isBulkEditLoading = isBulkEditMode && isLoading;
    const hasNoFocusClass = isBulkEditMode && !isDropdownOpen;
    const isDeleteDisabled =
      this.props.readOnly || isBulkEditLoading || !checkboxes.length;
    const isCloneDisabled =
      this.props.readOnly ||
      isBulkEditLoading ||
      !checkboxes.length ||
      checkboxes.length > 10;
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
    if (isShowCCOption) {
      newRecordDropDownOptions.push({
        label: msg().Exp_Lbl_CreateRecordFromCreditCard,
        value: NEW_RECORD_OPTIONS.CREDIT_CARD,
      });
    }
    if (useTransitManager && isShowICOption) {
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

    const toggleDropdown = () =>
      this.setState(({ isDropdownOpen }) => ({
        isDropdownOpen: !isDropdownOpen,
      }));

    const isSimpleButton =
      isExpenseRequest || newRecordDropDownOptions.length <= 1;
    const newButtonClass = isSimpleButton ? `${ROOT}__btn-new-request` : ``;
    const disabledButtonClass =
      readOnly || isBulkEditLoading
        ? `${ROOT}__btn-new--isDisabledWithToolTip`
        : ``;
    const newButtonArea = (
      <React.Fragment>
        <div className={`${ROOT}__btn-new-area`}>
          <Button
            type="secondary"
            data-testid={`${ROOT}__btn-new`}
            onClick={
              isBulkEditMode
                ? this.props.onClickBulkNewRecordButton
                : this.props.onClickNewRecordButton
            }
            className={`${ROOT}__btn-new ${disabledButtonClass} ${newButtonClass}`}
          >
            {msg().Exp_Btn_NewRecord}
          </Button>
        </div>

        {!isSimpleButton && !this.props.isFinanceApproval && (
          <DropDown
            className={classNames(`${ROOT}__dropdown-new`, {
              [`${ROOT}__dropdown-new-no-focus`]: hasNoFocusClass,
            })}
            data-testid={`${ROOT}__dropdown-new`}
            onSelect={(item) => this.createRecord(isBulkEditMode, item.value)}
            options={newRecordDropDownOptions}
            label=""
            disabled={readOnly || isBulkEditLoading}
            onClose={toggleDropdown}
            onOpen={toggleDropdown}
          />
        )}
      </React.Fragment>
    );

    const bulkEditButtonArea =
      !readOnly && !this.props.isFinanceApproval && isUseBulkEdit ? (
        <>
          {isBulkEditMode ? (
            <>
              <Button
                className={`${ROOT}__bulk-edit-btns`}
                disabled={isBulkEditLoading}
                onClick={onClickBulkCancelButton}
                type="default"
              >
                {msg().Com_Btn_Cancel}
              </Button>
              <Button
                className={`${ROOT}__bulk-edit-btns`}
                disabled={isMaxBulkEditRecord || isBulkEditLoading}
                onClick={onClickBulkSaveButton}
                type="primary"
              >
                {msg().Com_Btn_Save}
              </Button>
            </>
          ) : (
            <Button
              className={`${ROOT}__bulk-edit-btns`}
              onClick={onClickBulkEditButton}
              type="default"
            >
              {msg().Com_Btn_Edit}
            </Button>
          )}
        </>
      ) : null;

    const onClickCloneButton = isBulkEditMode
      ? onClickBulkCloneButton
      : onClickCloneRecordButton;

    return (
      <div className={ROOT}>
        <div className={`${ROOT}__contents`}>
          <div className={`${ROOT}__title`}>
            <Text size="xxl" color="secondary" bold>
              {msg().Exp_Lbl_RecordsList}
            </Text>
          </div>

          <div className={`${ROOT}__actions`}>
            {!isBulkEditMode && (
              <div className={`${ROOT}__display-summary`}>
                <input
                  type="checkbox"
                  onChange={this.props.toggleMode}
                  checked={this.props.isSummaryMode}
                />
                <span>{msg().Exp_Lbl_DisplaySummaryPerExpType}</span>
              </div>
            )}
            <div className={`${ROOT}__btn-delete`}>
              {!this.props.isFinanceApproval && (
                <Button
                  type="destructive"
                  data-testid={`${ROOT}__btn-delete`}
                  onClick={
                    isBulkEditMode
                      ? onClickBulkDeleteButton
                      : this.props.onClickDeleteRecordItem
                  }
                  disabled={isDeleteDisabled}
                >
                  {msg().Com_Btn_Delete}
                </Button>
              )}
            </div>
            <div className={`${ROOT}__btn-clone`}>
              {!this.props.isFinanceApproval && (
                <>
                  <Button
                    type="default"
                    data-testid={`${ROOT}__clone`}
                    onClick={() =>
                      onClickCloneButton(CLONE_RECORD_OPTIONS.SPECIFIED_CLONE)
                    }
                    disabled={isCloneDisabled}
                  >
                    {msg().Exp_Lbl_Clone}
                  </Button>
                  <DropDown
                    className={classNames(`${ROOT}__dropdown-clone`, {
                      [`${ROOT}__dropdown-clone-no-focus`]: hasNoFocusClass,
                    })}
                    data-testid={`${ROOT}__dropdown-clone`}
                    onClose={toggleDropdown}
                    onOpen={toggleDropdown}
                    onSelect={(item) => onClickCloneButton(item.value)}
                    options={cloneRecordDropDownOptions}
                    label=""
                    disabled={isCloneDisabled}
                  />
                </>
              )}
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
            {bulkEditButtonArea}
          </div>
        </div>
        {isMaxBulkEditRecord && (
          <div className="input-feedback">
            {msg().Exp_Err_CannotSaveWhenThereAreMoreThan30Records}
          </div>
        )}
      </div>
    );
  }
}
