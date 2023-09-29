import React from 'react';

import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';

import { CustomHint } from '../../../../../../../domain/models/exp/CustomHint';
import {
  ExpenseReportType,
  reportTypeArea,
} from '../../../../../../../domain/models/exp/expense-report-type/list';
import { Report } from '../../../../../../../domain/models/exp/Report';

import { FormikProps } from '../..';
import msg from '../../../../../../languages';
import LabelWithHint from '../../../../../fields/LabelWithHint';
import SearchableDropdown from '../../../../../fields/SearchableDropdown';
import TextAreaField from '../../../../../fields/TextAreaField';
import Tooltip from '../../../../../Tooltip';
import withLoadingHOC from '../../../../../withLoading';

const ROOT = 'ts-expenses__form-report-summary__form__report-type-input';

type Props = FormikProps & {
  customHint: CustomHint;
  expReport: Report;
  isExpense: boolean;
  isFinanceApproval: boolean;
  isLoading?: boolean;
  isReadOnly: boolean;
  reportTypeList: Array<ExpenseReportType>;
  useReportType: boolean;
  createNewExpReport: (reportTypeList: Array<ExpenseReportType>) => void;
  handleChangeExpenseReportType: (value: Record<string, any>) => Promise<void>;
};
class ReportType extends React.Component<Props> {
  static displayName = reportTypeArea;
  componentDidUpdate(prevProps: Props) {
    const isNewReport = !this.props.expReport.reportId;
    const isReportTypeLoaded =
      this.props.reportTypeList.length !== 0 &&
      prevProps.reportTypeList.length === 0;
    if (isReportTypeLoaded && isNewReport) {
      this.props.createNewExpReport(this.props.reportTypeList);
    }
  }

  getReportTypeInfo = (isReadOnly: boolean) => {
    const isReportFromPreRequest =
      !!this.props.expReport.preRequestId && !isReadOnly;
    const isFinanceApproval = this.props.isFinanceApproval && !isReadOnly;
    if (isFinanceApproval) {
      return msg().Exp_Msg_ReportTypeInfoForFinanceApproval;
    } else if (isReportFromPreRequest) {
      return msg().Exp_Msg_ReportTypeInfoForExpense;
    }
    return '';
  };

  getReportTypeOptions: any = (
    availableReportTypes: Array<ExpenseReportType>,
    includeEmptyOption: boolean
  ) => {
    const reportTypeOptions = availableReportTypes.map((reportType) => ({
      label: reportType.name,
      value: reportType.id,
    }));
    if (includeEmptyOption) {
      reportTypeOptions.unshift({
        label: '',
        value: null,
      });
    }
    return reportTypeOptions;
  };

  render() {
    const {
      errors,
      isExpense,
      isFinanceApproval,
      isReadOnly,
      customHint,
      reportTypeList,
      touched,
      useReportType,
      handleChangeExpenseReportType,
    } = this.props;
    const expReport = cloneDeep(this.props.expReport);
    let availableReportTypes = [];
    let isRTInvalid = false;

    // If there is (reportTypeId and reportTypeList) OR (Editable & ReportTypeList) => For ReadOnly: if no expReportTypeID, then don't use Report Type
    const isDisabledReportType =
      isReadOnly || !!expReport.preRequestId || isFinanceApproval;

    const havePreRequest = Boolean(this.props.expReport.preRequest);

    if (useReportType) {
      availableReportTypes = reportTypeList.filter((reportType) => {
        return isReadOnly
          ? reportType.id === expReport.expReportTypeId
          : reportType.active;
      });

      // If Expense and Finance Approval Tab
      if ((isExpense || isFinanceApproval) && !havePreRequest) {
        availableReportTypes = availableReportTypes.filter((reportType) => {
          return !reportType.requestRequired;
        });
      }
      isRTInvalid =
        expReport.expReportTypeId &&
        availableReportTypes.length > 0 &&
        !find(reportTypeList, ['id', expReport.expReportTypeId]);
      if (isRTInvalid) {
        expReport.expReportTypeId = undefined;
      }
    }
    const reportType = isDisabledReportType ? (
      <TextAreaField
        resize="none"
        autosize
        minRows={1}
        maxRows={2}
        isRequired
        value={expReport.expReportTypeName || ''}
        disabled={isDisabledReportType}
        data-testid={ROOT}
      />
    ) : (
      <>
        <SearchableDropdown
          data-testid={`${ROOT}-selection`}
          // @ts-ignore
          className={`${ROOT}-selection`}
          onChange={handleChangeExpenseReportType}
          disabled={isDisabledReportType}
          value={expReport.expReportTypeId || ''}
          options={this.getReportTypeOptions(availableReportTypes, isRTInvalid)}
          isSearchable
          isLoading={this.props.isLoading}
          placeholder={msg().Com_Lbl_PressEnterToSearch}
        />
        {errors.expReportTypeId && touched.expReportTypeId && (
          <div className="input-feedback">{msg()[errors.expReportTypeId]}</div>
        )}
      </>
    );

    const reportTypeInfo = this.getReportTypeInfo(isReadOnly);

    return (
      <div className={`${ROOT} ts-text-field-container`}>
        <LabelWithHint
          text={msg().Exp_Clbl_ReportType}
          hintMsg={
            (!isDisabledReportType && customHint.reportHeaderReportType) || ''
          }
          isRequired
        />
        {(reportTypeInfo && (
          <Tooltip id={ROOT} align="top" content={reportTypeInfo}>
            <div>{reportType}</div>
          </Tooltip>
        )) ||
          reportType}
      </div>
    );
  }
}

export default withLoadingHOC(ReportType);
