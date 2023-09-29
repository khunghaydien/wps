import React from 'react';

import classNames from 'classnames';

import { ExpenseReportType } from '../../../../../../../domain/models/exp/expense-report-type/list';
import { Report } from '../../../../../../../domain/models/exp/Report';

import msg from '../../../../../../languages';
import Button from '../../../../../buttons/Button';
import IconButton from '../../../../../buttons/IconButton';
import iconTitleToggle from '../../../../images/iconTitleToggle.png';
import CustomRequestField, { CustomRequestProps } from '../CustomRequest';
import ReportAttachment from '../ReportAttachment';

import './index.scss';

const ROOT = 'ts-expenses__form-report-summary__actions';

type Props = CustomRequestProps & {
  disabled?: boolean;
  expReport: Report;
  isEditMode: boolean;
  isEdited: boolean;
  reportTypeList: Array<ExpenseReportType>;
  onClickApprovalHistoryButton: () => void;
  onClickApproveButton: (arg0: string) => void;
  onClickBackButton: () => void;
  onClickCloneButton: (arg0: boolean) => void;
  onClickEditButton: () => void;
  onClickEditHistoryButton: () => void;
  onClickPrintPageButton: () => void;
  onClickRejectButton: (arg0: string) => void;
  onClickSaveButton: () => void;
};

type State = {
  isMenuOpen: boolean;
};

export default class ActionButtonsFA extends React.Component<Props, State> {
  state = {
    isMenuOpen: false,
  };

  toggleMenu = () => {
    this.setState((prevState) => ({
      isMenuOpen: !prevState.isMenuOpen,
    }));
  };

  renderApproveReject = () => {
    const menuClass = classNames(`${ROOT}__toggle`, {
      active: this.state.isMenuOpen,
    });
    const { expReport, reportTypeList } = this.props;
    const hasPreRequestId = !!expReport.preRequestId;
    const currentReportType =
      reportTypeList.find((reportType) => {
        return reportType.id === expReport.expReportTypeId;
      }) || {};
    const requestRequired =
      hasPreRequestId && !!(currentReportType as any).requestRequired;

    return (
      <div className={ROOT}>
        <div className={`${ROOT}__main`}>
          <CustomRequestField
            expReport={expReport}
            isFinanceApproval
            openCustomRequestPage={this.props.openCustomRequestPage}
          />
          <ReportAttachment expReport={expReport} isFinanceApproval />
          <Button
            disabled={this.props.disabled}
            className={`${ROOT}__reject`}
            data-testid={`${ROOT}__reject`}
            onClick={this.props.onClickRejectButton}
          >
            {msg().Appr_Btn_Reject}
          </Button>
          <Button
            disabled={this.props.disabled}
            className={`${ROOT}__edit`}
            data-testid={`${ROOT}__edit`}
            onClick={this.props.onClickEditButton}
          >
            {msg().Appr_Btn_Edit}
          </Button>
          <Button
            disabled={this.props.disabled}
            className={`${ROOT}__approve`}
            data-testid={`${ROOT}__approve`}
            onClick={this.props.onClickApproveButton}
          >
            {msg().Appr_Btn_Approve}
          </Button>
          <IconButton
            src={iconTitleToggle}
            className={menuClass}
            onClick={this.toggleMenu}
            data-testid={`${ROOT}__toggle`}
          />
        </div>
        {this.state.isMenuOpen && (
          <div className={`${ROOT}__submenu`}>
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
            >
              {msg().Com_Btn_ApprovalHistory}
            </button>
            <button
              className={classNames(
                `${ROOT}__submenu-item-button`,
                `${ROOT}__modification-history`
              )}
              data-testid={`${ROOT}__modification-history`}
              onClick={(event: React.SyntheticEvent<HTMLButtonElement>) => {
                event.preventDefault();
                event.stopPropagation();
                this.props.onClickEditHistoryButton();
              }}
            >
              {msg().Exp_Lbl_EditHistory}
            </button>
            <button
              className={`${ROOT}__submenu-item-button`}
              data-testid={`${ROOT}__print`}
              onClick={(event: React.SyntheticEvent<HTMLButtonElement>) => {
                event.preventDefault();
                event.stopPropagation();
                this.props.onClickPrintPageButton();
              }}
            >
              {msg().Com_Btn_PrintPage}
            </button>
            <button
              className={`${ROOT}__submenu-item-button`}
              data-testid={`${ROOT}__clone`}
              onClick={(event: React.SyntheticEvent<HTMLButtonElement>) => {
                event.preventDefault();
                event.stopPropagation();
                this.props.onClickCloneButton(requestRequired);
              }}
            >
              {msg().Exp_Lbl_Clone}
            </button>
          </div>
        )}
      </div>
    );
  };

  renderCancelSave = () => {
    return (
      <div className={`${ROOT}__main`}>
        <Button
          className={`${ROOT}__close`}
          data-testid={`${ROOT}__close`}
          onClick={this.props.onClickBackButton}
        >
          {msg().Com_Btn_Cancel}
        </Button>
        <Button
          className={`${ROOT}__save is-fa`}
          data-testid={`${ROOT}__save`}
          onClick={this.props.onClickSaveButton}
          disabled={!this.props.isEdited}
        >
          {msg().Com_Btn_Save}
        </Button>
      </div>
    );
  };

  render() {
    return (
      <div className={ROOT}>
        {this.props.isEditMode
          ? this.renderCancelSave()
          : this.renderApproveReject()}
      </div>
    );
  }
}
