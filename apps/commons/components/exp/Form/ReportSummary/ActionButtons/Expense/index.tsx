import React from 'react';

import classNames from 'classnames';
import find from 'lodash/find';

import { ExpenseReportType } from '../../../../../../../domain/models/exp/expense-report-type/list';
import {
  FILE_ATTACHMENT_TYPE,
  Report,
  status,
} from '../../../../../../../domain/models/exp/Report';

import { modes } from '../../../../../../../requests-pc/modules/ui/expenses/mode';

import msg from '../../../../../../languages';
import Button from '../../../../../buttons/Button';
import IconButton from '../../../../../buttons/IconButton';
import iconTitleToggle from '../../../../images/iconTitleToggle.png';
import CustomRequestField, { CustomRequestProps } from '../CustomRequest';
import ReportAttachment, { ReportAttachmentProps } from '../ReportAttachment';

import './index.scss';

const ROOT = 'ts-expenses__form-report-summary__actions';

type Props = CustomRequestProps &
  ReportAttachmentProps & {
    errors?: Record<string, any>;
    expReport: Report;
    isExpense?: boolean;
    isExpenseRequest?: boolean;
    isFinanceApproval?: boolean;
    isPartialLoading: boolean;
    isReadOnlyApexPage?: boolean;
    mode: string;
    readOnly: boolean;
    reportTypeList: Array<ExpenseReportType>;
    onClickApprovalHistoryButton: () => void;
    onClickBackButton: () => void;
    onClickCancelRequestButton: () => void;
    onClickCloneButton: (arg0: boolean) => void;
    onClickDeleteButton: () => void;
    onClickDiscardButton: () => void;
    onClickEditHistoryButton: () => void;
    onClickPrintPageButton: () => void;
    onClickSaveButton: () => void;
    onClickSubmitButton: () => void;
  };

type State = {
  isMenuOpen: boolean;
};

export default class ActionButtonsExpense extends React.Component<
  Props,
  State
> {
  state = {
    isMenuOpen: false,
  };

  isMode(mode: string) {
    return this.props.mode === modes[mode];
  }

  toggleMenu = () => {
    this.setState((prevState) => ({
      isMenuOpen: !prevState.isMenuOpen,
    }));
  };

  isSubmittableStatus = (currentStatus?: string) => {
    switch (currentStatus) {
      case status.NOT_REQUESTED:
      case status.REJECTED:
      case status.RECALLED:
      case status.CANCELED:
        return true;
      default:
        return false;
    }
  };

  render() {
    const {
      expReport,
      isExpense,
      reportTypeList,
      isPartialLoading,
      isReadOnlyApexPage,
      errors = {},
    } = this.props;
    const reportStatus = this.props.expReport.status;
    const isCancellable =
      reportStatus !== status.APPROVED &&
      reportStatus !== status.REJECTED &&
      reportStatus !== status.CLAIMED &&
      reportStatus !== status.DISCARDED;
    const hasReportId = expReport.reportId;
    const hasPreRequestId = expReport.preRequestId;
    const isNewPreRequest = hasPreRequestId && !hasReportId;
    const isDeleteDisabled =
      !hasReportId || !this.isSubmittableStatus(expReport.status);
    let isSaveDisabled =
      this.isMode('INITIALIZE') ||
      this.isMode('REPORT_SELECT') ||
      isPartialLoading;
    const isSubmitDisabled =
      this.isMode('INITIALIZE') ||
      this.isMode('REPORT_EDIT') ||
      !this.isSubmittableStatus(expReport.status);
    const currentReportType =
      find(reportTypeList, { id: expReport.expReportTypeId }) || {};
    const isCloneDisabled =
      this.isMode('REPORT_EDIT') ||
      (this.isMode('REPORT_SELECT') && !expReport.reportId);

    const menuClass = classNames(`${ROOT}__toggle`, {
      active: this.state.isMenuOpen,
      'is-pre-request': isNewPreRequest,
    });
    const preRequestClass = classNames({ 'is-pre-request': isNewPreRequest });

    if (isNewPreRequest) {
      // make sure the start claiming button is always enabled.
      isSaveDisabled = false;
    }

    if (isReadOnlyApexPage) {
      return (
        <div className={`${ROOT} apex-page-action-buttons`}>
          <Button
            className={`${ROOT}__btn-approval-history`}
            onClick={(event: React.SyntheticEvent<HTMLButtonElement>) => {
              event.preventDefault();
              event.stopPropagation();
              this.props.onClickApprovalHistoryButton();
            }}
            disabled={!this.props.expReport.requestId}
          >
            {msg().Com_Btn_ApprovalHistory}
          </Button>
          <ReportAttachment
            expReport={expReport}
            openReceiptLibraryDialog={this.props.openReceiptLibraryDialog}
            updateReport={this.props.updateReport}
            readOnly={this.props.readOnly}
            isReadOnlyApexPage
          />
        </div>
      );
    }

    return (
      <div className={ROOT}>
        <div className={`${ROOT}__main`}>
          <CustomRequestField
            readOnly={this.props.readOnly}
            expReport={expReport}
            isExpenseRequest={this.props.isExpenseRequest}
            openCustomRequestDialog={this.props.openCustomRequestDialog}
            updateReport={this.props.updateReport}
            customRequestLinkUsage={
              (currentReportType as any).customRequestLinkUsage
            }
            openCustomRequestPage={this.props.openCustomRequestPage}
            errors={errors}
          />
          <ReportAttachment
            isReportAttachmentRequired={
              (currentReportType as any).fileAttachment ===
              FILE_ATTACHMENT_TYPE.Required
            }
            expReport={expReport}
            errors={errors}
            openReceiptLibraryDialog={this.props.openReceiptLibraryDialog}
            updateReport={this.props.updateReport}
            readOnly={this.props.readOnly}
            isExpense={isExpense}
          />

          <Button
            className={`${ROOT}__close`}
            data-testid={`${ROOT}__close`}
            onClick={this.props.onClickBackButton}
          >
            {msg().Com_Btn_Close}
          </Button>
          <Button
            className={`${ROOT}__save ${preRequestClass}`}
            data-testid={`${ROOT}__save`}
            onClick={this.props.onClickSaveButton}
            disabled={isSaveDisabled}
          >
            {isNewPreRequest ? msg().Exp_Lbl_StartClaim : msg().Com_Btn_Save}
          </Button>
          <Button
            className={`${ROOT}__submit ${preRequestClass}`}
            data-testid={`${ROOT}__submit`}
            onClick={this.props.onClickSubmitButton}
            disabled={isSubmitDisabled}
          >
            {msg().Exp_Btn_Submit}
          </Button>
          <IconButton
            src={iconTitleToggle}
            data-testid={`${ROOT}__toggle`}
            className={menuClass}
            onClick={this.toggleMenu}
          />
        </div>
        {this.state.isMenuOpen && (
          <div className={`${ROOT}__submenu`}>
            {(!isNewPreRequest && (
              <>
                <button
                  className={classNames(
                    `${ROOT}__submenu-item-button`,
                    `${ROOT}__cancel`
                  )}
                  data-testid={`${ROOT}__cancel`}
                  onClick={(event: React.SyntheticEvent<HTMLButtonElement>) => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.props.onClickCancelRequestButton();
                  }}
                  disabled={!(this.props.readOnly && isCancellable)}
                >
                  {msg().Exp_Lbl_Recall}
                </button>
                <button
                  className={classNames(
                    `${ROOT}__submenu-item-button`,
                    `${ROOT}__approval-history`
                  )}
                  data-testid={`${ROOT}__approval-history`}
                  onClick={(event: React.SyntheticEvent<HTMLButtonElement>) => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.props.onClickApprovalHistoryButton();
                  }}
                  disabled={!this.props.expReport.requestId}
                >
                  {msg().Com_Btn_ApprovalHistory}
                </button>
                {!this.props.isExpenseRequest && (
                  <button
                    className={classNames(
                      `${ROOT}__submenu-item-button`,
                      `${ROOT}__edit-history`
                    )}
                    data-testid={`${ROOT}__edit-history`}
                    onClick={(
                      event: React.SyntheticEvent<HTMLButtonElement>
                    ) => {
                      event.preventDefault();
                      event.stopPropagation();
                      this.props.onClickEditHistoryButton();
                    }}
                    disabled={!this.props.expReport.requestId}
                  >
                    {msg().Exp_Lbl_EditHistory}
                  </button>
                )}

                <button
                  className={classNames(
                    `${ROOT}__submenu-item-button`,
                    `${ROOT}__clone`
                  )}
                  data-testid={`${ROOT}__clone`}
                  onClick={(event: React.SyntheticEvent<HTMLButtonElement>) => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.props.onClickCloneButton(
                      !!(currentReportType as any).requestRequired
                    );
                  }}
                  disabled={isCloneDisabled}
                >
                  {msg().Exp_Lbl_Clone}
                </button>

                <button
                  className={classNames(
                    `${ROOT}__submenu-item-button`,
                    `${ROOT}__delete`
                  )}
                  data-testid={`${ROOT}__delete`}
                  onClick={(event: React.SyntheticEvent<HTMLButtonElement>) => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.props.onClickDeleteButton();
                  }}
                  disabled={isDeleteDisabled}
                >
                  {msg().Com_Btn_Delete}
                </button>
                {!this.props.isExpenseRequest && !this.props.isFinanceApproval && (
                  <button
                    className={classNames(
                      `${ROOT}__submenu-item-button`,
                      `${ROOT}__print`
                    )}
                    data-testid={`${ROOT}__print`}
                    onClick={(
                      event: React.SyntheticEvent<HTMLButtonElement>
                    ) => {
                      event.preventDefault();
                      event.stopPropagation();
                      this.props.onClickPrintPageButton();
                    }}
                    disabled={!hasReportId}
                  >
                    {msg().Com_Btn_PrintPage}
                  </button>
                )}
              </>
            )) || (
              <button
                className={classNames(
                  `${ROOT}__submenu-item-button`,
                  `${ROOT}__discard`
                )}
                data-testid={`${ROOT}__discard`}
                onClick={(event: React.SyntheticEvent<HTMLButtonElement>) => {
                  event.preventDefault();
                  event.stopPropagation();
                  this.props.onClickDiscardButton();
                }}
              >
                {msg().Exp_Btn_DiscardRequest}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
}
