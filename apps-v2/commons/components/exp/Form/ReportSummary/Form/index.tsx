import React from 'react';

import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import shallowEqual from 'recompose/shallowEqual';
import shouldUpdate from 'recompose/shouldUpdate';

import {
  convertDifferenceValues,
  DifferenceValues,
  isDifferent,
} from '@apps/commons/utils/exp/RequestReportDiffUtils';
import TextField from '@commons/components/fields/TextField';

import { AccountingPeriod } from '../../../../../../domain/models/exp/AccountingPeriod';
import { CustomHint } from '../../../../../../domain/models/exp/CustomHint';
import { ExpenseReportType } from '../../../../../../domain/models/exp/expense-report-type/list';
import { initialEmptyEIs } from '../../../../../../domain/models/exp/ExtendedItem';
import {
  generateSettlementAmount,
  getDisplayOfVendorCCJob,
  Report,
  status,
} from '@apps/domain/models/exp/Report';

import { modes } from '../../../../../../requests-pc/modules/ui/expenses/mode';

import msg from '../../../../../languages';
import LabelWithHint from '../../../../fields/LabelWithHint';
import TextAreaField from '../../../../fields/TextAreaField';
import MultiColumnsGrid from '../../../../MultiColumnsGrid';
import WithLoadingContext from '../../../../withLoading/withLoadingContext';
import { FormikProps, ReportSummaryFormProps } from '..';
import ReportCashAdvance from './CashAdvance';
import ReportCostCenter from './CostCenter';
import DateSelector from './DateSelector';
import ReportExtendedItems from './ExtendedItem';
import ReportJob from './Job';
import ReportType from './ReportType';
import ReportVendor from './Vendor';

import './index.scss';

const ROOT = 'ts-expenses__form-report-summary__form';

type Props = FormikProps &
  ReportSummaryFormProps & {
    apActive: AccountingPeriod;
    className?: string;
    customHint: CustomHint;
    expPreRequest?: Report;
    expReport: Report;
    inactiveReportTypeList: Array<ExpenseReportType>;
    isExpense: boolean;
    isFinanceApproval: boolean;
    isHighlight?: boolean;
    isHighlightDiff?: boolean;
    // ui states
    mode: string;
    readOnly: boolean;
    reportStatus: string;
    reportTypeList: Array<ExpenseReportType>;
    showVendorFilter?: boolean;
    subroleId?: string;
    useJctRegistrationNumber?: boolean;
    isNotDefaultCostCenter: (costCenterCode: string, date: string) => void;
    onChangeEditingExpReport: (arg0: string, arg1: any, arg2?: boolean) => void;
    toggleVendorDetail: (arg0: boolean) => void;
  };

const partialUpdate = (reportKeys: Array<string>, propKeys?: Array<string>) =>
  shouldUpdate((props: Props, nextProps: Props) => {
    let isKeyChanged = false;
    if (
      props.mode !== nextProps.mode ||
      props.readOnly !== nextProps.readOnly ||
      props.expReport.expReportTypeId !== nextProps.expReport.expReportTypeId ||
      props.expReport.accountingDate !== nextProps.expReport.accountingDate ||
      props.expReport.accountingPeriodId !==
        nextProps.expReport.accountingPeriodId ||
      props.expReport.requestDate !== nextProps.expReport.requestDate ||
      props.expReport.scheduledDate !== nextProps.expReport.scheduledDate ||
      props.isHighlight !== nextProps.isHighlight ||
      !isEqual(props.expPreRequest, nextProps.expPreRequest) ||
      !isEqual(props.subroleId, nextProps.subroleId)
    ) {
      isKeyChanged = true;
    } else {
      for (const key of reportKeys) {
        if (
          (props.expReport &&
            props.expReport[key] !== nextProps.expReport[key]) ||
          !isEmpty(props.errors[key])
        ) {
          isKeyChanged = true;
          break;
        }
      }
      if (!isKeyChanged && propKeys)
        for (const key of propKeys) {
          if (props && props[key] !== nextProps[key]) {
            isKeyChanged = true;
            break;
          }
        }
    }
    return isKeyChanged || !shallowEqual(props.errors, nextProps.errors);
  });

// Components defined here are not re-rendered when other formik fields are changed
const eiKeys = Object.keys(initialEmptyEIs());
const WrappedReportExtendedItems = partialUpdate([...eiKeys])(
  ReportExtendedItems
);
const WrappedVendor = partialUpdate([
  'vendorId',
  'paymentDueDate',
  'vendorJctRegistrationNumber',
  'vendorIsJctQualifiedIssuer',
])(ReportVendor);
const WrappedJob = partialUpdate(['jobId'])(ReportJob);

const CostCenterWithLoading = (props: any) => (
  <WithLoadingContext.Consumer>
    {({ isLoading, loadingAreas }) => (
      <ReportCostCenter
        {...props}
        isLoading={isLoading}
        loadingAreas={loadingAreas}
        isLoaderOverride={false}
      />
    )}
  </WithLoadingContext.Consumer>
);
const WrappedCostCenter = partialUpdate([
  'costCenterCode',
  'costCenterName',
  'costCenterHistoryId',
])(CostCenterWithLoading);

const ReportTypeWithLoading = (props: any) => (
  <WithLoadingContext.Consumer>
    {({ isLoading, loadingAreas }) => (
      <ReportType
        {...props}
        isLoaderOverride={false}
        isLoading={isLoading}
        loadingAreas={loadingAreas}
      />
    )}
  </WithLoadingContext.Consumer>
);

const WrappedDateSelector = partialUpdate(
  [
    'accountingDate',
    'accountingPeriodId',
    'requestDate',
    'scheduledDate',
    'costCenterHistoryId',
    'isCostCenterChangedManually',
  ],
  ['apActive']
)(DateSelector);

class ReportSummaryForm extends React.Component<Props> {
  isMode(mode: string) {
    return this.props.mode === modes[mode];
  }

  getDiffValues = (): DifferenceValues => {
    let diffValues = {};
    const { expReport, expPreRequest, isHighlightDiff } = this.props;
    if (isHighlightDiff) {
      const diffMapping = {
        purpose: 'purpose',
        remarks: 'remarks',
        costCenterHistoryId: 'costCenterHistoryId',
        jobId: 'jobId',
      };
      diffValues = convertDifferenceValues(
        diffMapping,
        expReport,
        expPreRequest
      );
    }
    return diffValues;
  };

  renderSettlementArea = () => {
    const {
      isExpense,
      reportStatus,
      isFAExpenseTab,
      baseCurrencySymbol,
      expReport,
      customHint,
      baseCurrencyDecimal,
      isHighlightDiff,
    } = this.props;
    const isExpenseOrFAExpenseTab = isExpense || isFAExpenseTab;
    const isExpenseApprovedPreRequest =
      isExpense && reportStatus === status.APPROVED_PRE_REQUEST;
    // render for non-approved request expense/FA expense reports
    if (isExpenseApprovedPreRequest || !isExpenseOrFAExpenseTab) return null;

    const settlementAmount = generateSettlementAmount(
      baseCurrencyDecimal,
      baseCurrencySymbol,
      expReport.settAmount,
      expReport.settResult
    );

    return (
      <MultiColumnsGrid sizeList={[4]}>
        <div className="ts-text-field-container">
          <LabelWithHint
            text={msg().Exp_Clbl_SettlementAmount}
            hintMsg={customHint.reportHeaderCASettlementAmount || ''}
          />
          <TextField
            disabled
            className={classNames(`${ROOT}__settlement-amount`, {
              'highlight-bg': isHighlightDiff,
            })}
            value={settlementAmount}
          />
        </div>
      </MultiColumnsGrid>
    );
  };

  render() {
    const {
      alwaysDisplaySettlementAmount,
      errors,
      touched,
      readOnly,
      showVendorFilter,
      expReport,
      expPreRequest,
      reportTypeList,
      inactiveReportTypeList,
      isExpense,
      isExpenseRequest,
      isFAExpenseTab,
      isFinanceApproval,
      isHighlightDiff,
      baseCurrencyDecimal,
      baseCurrencySymbol,
      renderScheduledDate,
      customHint,
      handleChangeExpenseReportType,
      createNewExpReport,
    } = this.props;

    const isReadOnly =
      readOnly ||
      !(
        this.isMode('REPORT_EDIT') ||
        this.isMode('FINANCE_REPORT_EDITED') ||
        this.isMode('REPORT_SELECT')
      );

    const allReportTypes = [
      ...(reportTypeList || []),
      ...(inactiveReportTypeList || []),
    ];
    const currentReportType = allReportTypes.find(
      (reportType) => reportType && reportType.id === expReport.expReportTypeId
    );

    const useReportType = Boolean(
      (!!expReport.expReportTypeId && reportTypeList) ||
        (reportTypeList && !isReadOnly)
    );

    const {
      isVendorVisible,
      isVendorRequired,
      isCostCenterVisible,
      isCostCenterRequired,
      isJobVisible,
      isJobRequired,
    } = getDisplayOfVendorCCJob(currentReportType);

    const isFARequestTab = isFinanceApproval && !isFAExpenseTab;
    const lastColumnSize = renderScheduledDate || isFARequestTab ? 4 : 8;
    const firstRowSizeList = useReportType
      ? [lastColumnSize, 4, 4]
      : [lastColumnSize, 4];

    const vendorSizeList = isVendorVisible ? [8, 4] : [4, 4, 4];
    const diffValues = this.getDiffValues();

    const isUseCashAdvance = get(currentReportType, 'useCashAdvance', false);
    const isShowSettlementAmount =
      isUseCashAdvance || alwaysDisplaySettlementAmount;

    return (
      <div className={`${ROOT}`}>
        <MultiColumnsGrid sizeList={firstRowSizeList}>
          <WrappedDateSelector
            errors={errors}
            readOnly={isReadOnly}
            touched={touched}
            expReport={expReport}
            onChangeEditingExpReport={this.props.onChangeEditingExpReport}
            isExpense={isExpense}
            isFAExpenseTab={this.props.isFAExpenseTab}
            isFARequestTab={isFARequestTab}
            isFinanceApproval={this.props.isFinanceApproval}
            apActive={this.props.apActive}
            customHint={customHint}
          />

          {useReportType && (
            <ReportTypeWithLoading
              errors={errors}
              touched={touched}
              expReport={expReport}
              customHint={customHint}
              isFinanceApproval={isFinanceApproval}
              isReadOnly={isReadOnly}
              reportTypeList={reportTypeList}
              useReportType={useReportType}
              createNewExpReport={createNewExpReport}
              handleChangeExpenseReportType={handleChangeExpenseReportType}
              isExpense={isExpense}
              data-testid={`${ROOT}__reportType`}
            />
          )}
        </MultiColumnsGrid>

        {isUseCashAdvance && (
          <ReportCashAdvance
            baseCurrencyDecimal={baseCurrencyDecimal}
            baseCurrencySymbol={baseCurrencySymbol}
            customHint={customHint}
            errors={errors}
            expReport={expReport}
            isExpense={isExpense}
            isFAExpenseTab={isFAExpenseTab}
            isFinanceApproval={isFinanceApproval}
            isReadOnly={isReadOnly}
            onChangeEditingExpReport={this.props.onChangeEditingExpReport}
          />
        )}
        {isShowSettlementAmount && this.renderSettlementArea()}

        <MultiColumnsGrid sizeList={[4, 4, 4]}>
          <div className="ts-text-field-container">
            <LabelWithHint
              text={msg().Exp_Clbl_Purpose}
              hintMsg={(!isReadOnly && customHint.reportHeaderPurpose) || ''}
              isRequired={isExpenseRequest}
            />
            <TextAreaField
              resize="none"
              autosize
              minRows={1}
              maxRows={2}
              isRequired={isExpenseRequest}
              onChange={this.props.handleChangePurpose}
              value={expReport.purpose || ''}
              disabled={isReadOnly}
              data-testid={`${ROOT}__purpose`}
              className={classNames({
                'highlight-bg': isDifferent('purpose', diffValues),
              })}
            />
            {errors.purpose && touched.purpose && (
              <div className="input-feedback">{msg()[errors.purpose]}</div>
            )}
          </div>

          {isCostCenterVisible && (
            <WrappedCostCenter
              isLoaderOverride={false}
              errors={errors}
              expReport={expReport}
              hintMsg={customHint.reportHeaderCostCenter}
              isRequired={isCostCenterRequired}
              readOnly={isReadOnly}
              handleChangeCostCenter={this.props.handleChangeCostCenter}
              handleClickCostCenterBtn={this.props.handleClickCostCenterBtn}
              isNotDefaultCostCenter={this.props.isNotDefaultCostCenter}
              onChangeEditingExpReport={this.props.onChangeEditingExpReport}
              getRecentCostCenters={this.props.getRecentCostCenters}
              searchCostCenters={this.props.searchCostCenters}
              isFinanceApproval={this.props.isFinanceApproval}
              isHighlight={isDifferent('costCenterHistoryId', diffValues)}
              subroleId={this.props.subroleId}
            />
          )}

          {isJobVisible && (
            <WrappedJob
              errors={errors}
              expReport={expReport}
              hintMsg={customHint.reportHeaderJob}
              isRequired={isJobRequired}
              readOnly={isReadOnly}
              handleChangeJob={this.props.handleChangeJob}
              handleClickJobBtn={this.props.handleClickJobBtn}
              onChangeEditingExpReport={this.props.onChangeEditingExpReport}
              getRecentJobs={this.props.getRecentJobs}
              searchJobs={this.props.searchJobs}
              isFinanceApproval={this.props.isFinanceApproval}
              isHighlight={isDifferent('jobId', diffValues)}
              subroleId={this.props.subroleId}
            />
          )}
        </MultiColumnsGrid>

        <MultiColumnsGrid sizeList={vendorSizeList}>
          {isVendorVisible && (
            <WrappedVendor
              errors={errors}
              expPreRequest={expPreRequest}
              expReport={expReport}
              showVendorFilter={showVendorFilter}
              hintMsg={customHint.reportHeaderVendor}
              onChangeEditingExpReport={this.props.onChangeEditingExpReport}
              onClickVendorSearch={this.props.onClickVendorSearch}
              isRequired={isVendorRequired}
              isHighlightDiff={isHighlightDiff}
              readOnly={isReadOnly}
              toggleVendorDetail={this.props.toggleVendorDetail}
              getRecentVendors={this.props.getRecentVendors}
              searchVendors={this.props.searchVendors}
              isFinanceApproval={this.props.isFinanceApproval}
              useJctRegistrationNumber={this.props.useJctRegistrationNumber}
            />
          )}

          {/* REMARK */}
          <div className="ts-text-field-container">
            <LabelWithHint
              text={msg().Exp_Clbl_ReportRemarks}
              hintMsg={(!isReadOnly && customHint.reportHeaderRemarks) || ''}
            />
            <TextAreaField
              resize="none"
              autosize
              minRows={1}
              maxRows={2}
              isRequired={false}
              onChange={this.props.handleChangeRemarks}
              value={expReport.remarks || ''}
              disabled={isReadOnly}
              data-testid={`${ROOT}__remarks`}
              className={classNames({
                'highlight-bg': isDifferent('remarks', diffValues),
              })}
            />
          </div>
        </MultiColumnsGrid>

        {useReportType && (
          <WrappedReportExtendedItems
            expReport={expReport}
            expPreRequest={expPreRequest}
            isHighlightDiff={isHighlightDiff}
            onChangeEditingExpReport={this.props.onChangeEditingExpReport}
            onClickLookupEISearch={this.props.onClickLookupEISearch}
            readOnly={isReadOnly}
            errors={errors}
            touched={touched}
            key={expReport.expReportTypeId}
          />
        )}
      </div>
    );
  }
}

export default ReportSummaryForm;
