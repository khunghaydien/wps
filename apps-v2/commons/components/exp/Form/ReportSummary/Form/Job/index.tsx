import * as React from 'react';

import isNil from 'lodash/isNil';

import { Report } from '../../../../../../../domain/models/exp/Report';

import { Errors } from '../..';
import msg from '../../../../../../languages';
import LabelWithHint from '../../../../../fields/LabelWithHint';
import QuickSearch, { Option } from '../../../QuickSearch';

type Props = {
  errors: Errors;
  expReport: Report;
  hintMsg?: string;
  isFinanceApproval?: boolean;
  isHighlight?: boolean;
  isRequired: boolean;
  readOnly: boolean;
  subroleId?: string;
  getRecentJobs: () => Promise<Option[]>;
  handleChangeJob: () => void;
  handleClickJobBtn: () => void;
  onChangeEditingExpReport: (
    arg0: string,
    arg1: any,
    arg2: any,
    shouldValidate?: boolean
  ) => void;
  searchJobs: (keyword?: string) => Promise<Option[]>;
};

const ROOT = 'ts-expenses__form-report-summary__form__job';

export default class ReportJob extends React.Component<Props> {
  render() {
    const { isRequired, expReport, readOnly, errors, hintMsg, isHighlight } =
      this.props;

    const isNewReport = !isNil(expReport.scheduledDate)
      ? !expReport.scheduledDate
      : !expReport.accountingDate;

    const onSelectJob = (x: Option) => {
      if (!x.id) {
        this.props.handleChangeJob();
        return;
      }
      this.props.onChangeEditingExpReport(`report.jobId`, x.id, true);
      this.props.onChangeEditingExpReport(
        `report.jobName`,
        x.name,
        true,
        false
      );
      this.props.onChangeEditingExpReport(
        `report.jobCode`,
        x.code,
        true,
        false
      );
    };

    const displayValue = expReport.jobId
      ? `${expReport.jobCode} - ${expReport.jobName}`
      : '';

    return (
      <React.Fragment>
        <div
          className={`${ROOT}-input ts-text-field-container`}
          data-testid={ROOT}
        >
          <LabelWithHint
            text={msg().Exp_Lbl_Job}
            hintMsg={(!readOnly && hintMsg) || ''}
            isRequired={isRequired}
          />
          <QuickSearch
            ROOT={ROOT}
            isSkipRecentlyUsed={this.props.isFinanceApproval}
            disabled={readOnly || isNewReport}
            placeholder={msg().Com_Lbl_PressEnterToSearch}
            selectedId={expReport.jobId}
            targetDate={
              expReport.scheduledDate || expReport.accountingDate || ''
            }
            displayValue={displayValue}
            onSelect={onSelectJob}
            getRecentlyUsedItems={this.props.getRecentJobs}
            getSearchResult={this.props.searchJobs}
            openSearchDialog={this.props.handleClickJobBtn}
            isHighlight={isHighlight}
          />
        </div>

        {errors.jobId && (
          <div className="input-feedback">{msg()[errors.jobId]}</div>
        )}
      </React.Fragment>
    );
  }
}
