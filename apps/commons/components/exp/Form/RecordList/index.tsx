import React from 'react';

import { ExpenseReportType } from '../../../../../domain/models/exp/expense-report-type/list';
import { Report } from '../../../../../domain/models/exp/Report';

import MessageArea from '../MessageArea';
import ButtonArea from './ButtonArea';
import List from './List';

const ROOT = 'ts-expenses__form-records__list';

export type Props = {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  checkboxes: Array<number>;
  errors: {
    accountingDate?: string;
    records: Array<any>;
  };
  expReport: Report;
  isErrDisplay: boolean;
  isExpenseRequest?: boolean;
  isFinanceApproval?: boolean;
  isNewReportFromPreRequest?: boolean;
  isReportPendingOrApproved?: boolean;
  openEditMenu: boolean;
  overlap: { record: boolean; report: boolean };
  readOnly: boolean;
  recordIdx: number;
  reportTypeList: Array<ExpenseReportType>;
  selectedExpReport: Report;
  selectedTab: number;
  touched: {
    records: Array<any>;
  };
  useJctRegistrationNumber: boolean;
  useMasterCardImport: boolean;
  useReceiptScan: boolean;
  useTransitManager: boolean;
  getImage: () => void;
  onChangeCheckBox: (arg0: number) => void;
  onClickCloneRecordButton: () => void;
  onClickDeleteRecordItem: () => void;
  onClickLinkRecordList: () => void;
  onClickNewRecordButton: () => void;
  onClickNewRecordFromCreditCard: () => void;
  onClickOpenLibraryButton: () => void;
  onClickRecord: (arg0: number) => void;
  openIcTransactionDialog: () => void;
};

type State = {
  isSummaryMode: boolean;
};

export default class RecordList extends React.Component<Props, State> {
  state = {
    isSummaryMode: false,
  };

  toggleMode = () => {
    this.setState((prevState) => {
      return { isSummaryMode: !prevState.isSummaryMode };
    });
  };

  renderList() {
    return (
      <List
        baseCurrencyDecimal={this.props.baseCurrencyDecimal}
        baseCurrencySymbol={this.props.baseCurrencySymbol}
        checkboxes={this.props.checkboxes}
        errors={this.props.errors}
        getImage={this.props.getImage}
        isErrDisplay={this.props.isErrDisplay}
        isExpenseRequest={this.props.isExpenseRequest}
        isNewReportFromPreRequest={this.props.isNewReportFromPreRequest}
        onChangeCheckBox={this.props.onChangeCheckBox}
        onClickRecord={this.props.onClickRecord}
        readOnly={this.props.readOnly}
        recordIdx={this.props.recordIdx}
        records={this.props.expReport.records}
        report={this.props.expReport}
        touched={this.props.touched}
        isFinanceApproval={this.props.isFinanceApproval}
        isSummaryMode={this.state.isSummaryMode}
        selectedTab={this.props.selectedTab}
        selectedExpReport={this.props.selectedExpReport}
        reportTypeList={this.props.reportTypeList}
        overlap={this.props.overlap}
        useJctRegistrationNumber={this.props.useJctRegistrationNumber}
      />
    );
  }

  render() {
    const buttonAreaReadOnly =
      this.props.isReportPendingOrApproved ||
      this.props.overlap.record ||
      this.props.readOnly;

    const showToolTip = this.props.expReport.records.length <= 0;

    return (
      <div className={ROOT}>
        <ButtonArea
          readOnly={buttonAreaReadOnly}
          checkboxes={this.props.checkboxes}
          onClickNewRecordButton={this.props.onClickNewRecordButton}
          onClickDeleteRecordItem={this.props.onClickDeleteRecordItem}
          onClickCloneRecordButton={this.props.onClickCloneRecordButton}
          errors={this.props.errors}
          isFinanceApproval={this.props.isFinanceApproval}
          isExpenseRequest={this.props.isExpenseRequest}
          onClickOpenLibraryButton={this.props.onClickOpenLibraryButton}
          onClickCreditCardButton={this.props.onClickNewRecordFromCreditCard}
          onClickIcCardButton={this.props.openIcTransactionDialog}
          useMasterCardImport={this.props.useMasterCardImport}
          useReceiptScan={this.props.useReceiptScan}
          useTransitManager={this.props.useTransitManager}
          isSummaryMode={this.state.isSummaryMode}
          toggleMode={this.toggleMode}
          showToolTip={showToolTip}
        />
        <div>
          {this.props.isErrDisplay && (
            <MessageArea
              expReport={this.props.expReport}
              errors={this.props.errors}
              overlap={this.props.overlap}
            />
          )}
        </div>
        {this.renderList()}
      </div>
    );
  }
}
