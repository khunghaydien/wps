import React from 'react';

import classNames from 'classnames';
import get from 'lodash/get';

import { ExpenseReportType } from '../../../../../domain/models/exp/expense-report-type/list';
import { Report } from '../../../../../domain/models/exp/Report';
import { FileMetadata } from '@apps/domain/models/exp/Receipt';
import { MAX_BULK_EDIT_RECORDS } from '@apps/domain/models/exp/Record';

import { Values } from '..';
import MessageArea from '../MessageArea';
import BulkEdit from './BulkEdit';
import { GridAreaContainerType } from './BulkEdit/GridArea';
import ButtonArea from './ButtonArea';
import List from './List';

const ROOT = 'ts-expenses__form-records__list';

export type GetImage = () => {
  hasEvidence: (ROOT: string, isRoute: boolean) => SVGElement;
  ic: (ROOT: string, isNotLinked: boolean) => SVGElement;
  receipt: () => SVGElement;
  routeSelected: () => SVGElement;
};

export type Props = {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  checkboxes: Array<number>;
  errors: {
    accountingDate?: string;
    records: Array<any>;
  };
  expPreRequest?: Report;
  expReport: Report;
  fileMetadata: FileMetadata[];
  getImage: GetImage;
  gridAreaContainer: GridAreaContainerType;
  isBulkEditMode: boolean;
  isErrDisplay: boolean;
  isExpenseRequest?: boolean;
  isFinanceApproval?: boolean;
  isHighlightDiff?: boolean;
  isLoading?: boolean;
  isNewReportFromPreRequest?: boolean;
  isPrimaryCompany: boolean;
  isReportPendingOrApproved?: boolean;
  isShowCCOption: boolean;
  isShowICOption: boolean;
  isUseBetaFeatures: boolean;
  loadingAreas: string[];
  loadingHint: string;
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
  ui: Values['ui'];
  useJctRegistrationNumber?: boolean;
  useReceiptScan: boolean;
  useTransitManager: boolean;
  onChangeCheckBox: (arg0: number) => void;
  onChangeCheckBoxes: (ids: number[]) => void;
  onChangeEditingExpReport: (
    field: string,
    value: boolean | string,
    touched?: boolean,
    shouldValidation?: boolean
  ) => void;
  onClickBulkCancelButton: () => void;
  onClickBulkCloneButton: (cloneMode: string) => void;
  onClickBulkDeleteButton: () => void;
  onClickBulkEditButton: () => void;
  onClickBulkNewRecordButton: () => void;
  onClickBulkSaveRecordButton: () => void;
  onClickCloneRecordButton: () => void;
  onClickDeleteRecordItem: () => void;
  onClickLinkRecordList: () => void;
  onClickNewRecordButton: () => void;
  onClickNewRecordFromCreditCard: () => void;
  onClickOpenLibraryButton: () => void;
  onClickRecord: (arg0: number) => void;
  onDropReceiptFiles: (files: File[]) => void;
  openIcTransactionDialog: () => void;
  showErrorToast: (message: string) => void;
};

type State = {
  isSummaryMode: boolean;
};

export default class RecordList extends React.Component<Props, State> {
  state = {
    isSummaryMode: false,
  };

  componentDidMount() {
    const { isBulkEditMode, onClickBulkEditButton } = this.props;
    if (isBulkEditMode) onClickBulkEditButton();
  }

  toggleMode = () => {
    this.setState((prevState) => {
      return { isSummaryMode: !prevState.isSummaryMode };
    });
  };

  renderList() {
    if (this.props.isBulkEditMode) {
      const bulkRecordIdx = get(this.props.ui, 'bulkRecordIdx', -1);
      return (
        <BulkEdit
          baseCurrencyDecimal={this.props.baseCurrencyDecimal}
          baseCurrencySymbol={this.props.baseCurrencySymbol}
          bulkRecordIdx={bulkRecordIdx}
          checkboxes={this.props.checkboxes}
          errors={this.props.errors}
          gridAreaContainer={this.props.gridAreaContainer}
          isExpenseRequest={this.props.isExpenseRequest}
          isLoading={this.props.isLoading}
          loadingAreas={this.props.loadingAreas}
          loadingHint={this.props.loadingHint}
          onChangeCheckBox={this.props.onChangeCheckBox}
          onChangeCheckBoxes={this.props.onChangeCheckBoxes}
          onChangeEditingExpReport={this.props.onChangeEditingExpReport}
          onDropReceiptFiles={this.props.onDropReceiptFiles}
          report={this.props.expReport}
          showErrorToast={this.props.showErrorToast}
          touched={this.props.touched}
        />
      );
    }

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
        selectedExpPreRequest={this.props.expPreRequest}
        reportTypeList={this.props.reportTypeList}
        isHighlightDiff={this.props.isHighlightDiff}
        useJctRegistrationNumber={this.props.useJctRegistrationNumber}
        overlap={this.props.overlap}
      />
    );
  }

  render() {
    const buttonAreaReadOnly =
      this.props.isReportPendingOrApproved ||
      this.props.overlap.record ||
      this.props.readOnly;

    const showToolTip = this.props.expReport.records.length <= 0;

    const isMaxBulkEditRecord =
      this.props.isBulkEditMode &&
      this.props.expReport.records.length > MAX_BULK_EDIT_RECORDS;

    return (
      <div
        className={classNames(ROOT, {
          [`${ROOT}__overflow-visible`]: this.props.isBulkEditMode,
        })}
      >
        <ButtonArea
          readOnly={buttonAreaReadOnly}
          checkboxes={this.props.checkboxes}
          onClickBulkCancelButton={this.props.onClickBulkCancelButton}
          onClickBulkCloneButton={this.props.onClickBulkCloneButton}
          onClickBulkDeleteButton={this.props.onClickBulkDeleteButton}
          onClickBulkEditButton={this.props.onClickBulkEditButton}
          onClickBulkNewRecordButton={this.props.onClickBulkNewRecordButton}
          onClickBulkSaveButton={this.props.onClickBulkSaveRecordButton}
          onClickNewRecordButton={this.props.onClickNewRecordButton}
          onClickDeleteRecordItem={this.props.onClickDeleteRecordItem}
          onClickCloneRecordButton={this.props.onClickCloneRecordButton}
          errors={this.props.errors}
          isBulkEditMode={this.props.isBulkEditMode}
          isFinanceApproval={this.props.isFinanceApproval}
          isExpenseRequest={this.props.isExpenseRequest}
          isLoading={this.props.isLoading}
          isMaxBulkEditRecord={isMaxBulkEditRecord}
          isUseBulkEdit={this.props.isUseBetaFeatures}
          isShowCCOption={this.props.isShowCCOption}
          isShowICOption={this.props.isShowICOption}
          onClickOpenLibraryButton={this.props.onClickOpenLibraryButton}
          onClickCreditCardButton={this.props.onClickNewRecordFromCreditCard}
          onClickIcCardButton={this.props.openIcTransactionDialog}
          useReceiptScan={this.props.useReceiptScan}
          useTransitManager={this.props.useTransitManager}
          isSummaryMode={this.state.isSummaryMode}
          toggleMode={this.toggleMode}
          showToolTip={showToolTip}
          isPrimaryCompany={this.props.isPrimaryCompany}
        />
        <div>
          {!this.props.isBulkEditMode && this.props.isErrDisplay && (
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
