import React from 'react';

import isEmpty from 'lodash/isEmpty';
import shallowEqual from 'recompose/shallowEqual';
import shouldUpdate from 'recompose/shouldUpdate';

import { AccountingPeriod } from '../../../../../../domain/models/exp/AccountingPeriod';
import { CustomHint } from '../../../../../../domain/models/exp/CustomHint';
import { ExpenseReportType } from '../../../../../../domain/models/exp/expense-report-type/list';
import { initialEmptyEIs } from '../../../../../../domain/models/exp/ExtendedItem';
import {
  getDisplayOfVendorCCJob,
  Report,
} from '../../../../../../domain/models/exp/Report';

import { modes } from '../../../../../../requests-pc/modules/ui/expenses/mode';

import msg from '../../../../../languages';
import LabelWithHint from '../../../../fields/LabelWithHint';
import TextAreaField from '../../../../fields/TextAreaField';
import MultiColumnsGrid from '../../../../MultiColumnsGrid';
import WithLoadingContext from '../../../../withLoading/withLoadingContext';
import { FormikProps, ReportSummaryFormProps } from '..';
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
    customHint: CustomHint;
    expReport: Report;
    inactiveReportTypeList: Array<ExpenseReportType>;
    isExpense: boolean;
    isFinanceApproval: boolean;
    // ui states
    mode: string;
    readOnly: boolean;
    reportTypeList: Array<ExpenseReportType>;
    showVendorFilter?: boolean;
    useJctRegistrationNumber?: boolean;
    isNotDefaultCostCenter: (costCenterCode: string, date: string) => void;
    onChangeEditingExpReport: (arg0: string, arg1: any, arg2?: boolean) => void;
    toggleVendorDetail: (arg0: boolean) => void;
  };

const partialUpdate = (keys: Array<string>) =>
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
      props.expReport.scheduledDate !== nextProps.expReport.scheduledDate
    ) {
      isKeyChanged = true;
    } else {
      for (const key of keys) {
        if (
          (props.expReport &&
            props.expReport[key] !== nextProps.expReport[key]) ||
          !isEmpty(props.errors[key])
        ) {
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

const WrappedDateSelector = partialUpdate([
  'accountingDate',
  'accountingPeriodId',
  'requestDate',
  'scheduledDate',
  'costCenterHistoryId',
  'isCostCenterChangedManually',
])(DateSelector);

class ReportSummaryForm extends React.Component<Props> {
  isMode(mode: string) {
    return this.props.mode === modes[mode];
  }

  render() {
    const {
      errors,
      touched,
      readOnly,
      showVendorFilter,
      expReport,
      reportTypeList,
      inactiveReportTypeList,
      isExpense,
      isExpenseRequest,
      isFinanceApproval,
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
      (reportType) => reportType.id === expReport.expReportTypeId
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

    const lastColumnSize = renderScheduledDate ? 4 : 8;
    const firstRowSizeList = useReportType
      ? [lastColumnSize, 4, 4]
      : [lastColumnSize, 4];

    const vendorSizeList = isVendorVisible ? [8, 4] : [4, 4, 4];

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

        <MultiColumnsGrid sizeList={[4, 4, 4]}>
          <div className={`${ROOT}__purpose`}>
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
            />
          )}
        </MultiColumnsGrid>

        <MultiColumnsGrid sizeList={vendorSizeList}>
          {isVendorVisible && (
            <WrappedVendor
              errors={errors}
              expReport={expReport}
              showVendorFilter={showVendorFilter}
              hintMsg={customHint.reportHeaderVendor}
              onChangeEditingExpReport={this.props.onChangeEditingExpReport}
              onClickVendorSearch={this.props.onClickVendorSearch}
              isRequired={isVendorRequired}
              readOnly={isReadOnly}
              toggleVendorDetail={this.props.toggleVendorDetail}
              getRecentVendors={this.props.getRecentVendors}
              searchVendors={this.props.searchVendors}
              isFinanceApproval={this.props.isFinanceApproval}
              useJctRegistrationNumber={this.props.useJctRegistrationNumber}
            />
          )}

          {/* REMARK */}
          <div className={`${ROOT}__remarks`}>
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
            />
          </div>
        </MultiColumnsGrid>

        {useReportType && (
          <WrappedReportExtendedItems
            expReport={expReport}
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
