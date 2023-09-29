import * as React from 'react';

import { Report } from '../../../../../../../domain/models/exp/Report';

import { costCenterArea } from '../../../../../../../domain/modules/exp/cost-center/defaultCostCenter';

import { Errors } from '../..';
import msg from '../../../../../../languages';
import LabelWithHint from '../../../../../fields/LabelWithHint';
import withLoadingHOC from '../../../../../withLoading';
import QuickSearch, { Option } from '../../../QuickSearch';

type Props = {
  errors: Errors;
  expReport: Report;
  hintMsg?: string;
  isFinanceApproval?: boolean;
  isLoading?: boolean;
  isRequired: boolean;
  readOnly: boolean;
  getRecentCostCenters: () => Promise<Option[]>;
  handleChangeCostCenter: () => void;
  handleClickCostCenterBtn: () => void;
  isNotDefaultCostCenter: (costCenterCode: string, date: string) => void;
  onChangeEditingExpReport: (
    arg0: string,
    arg1: any,
    arg2?: any,
    shouldValidate?: boolean
  ) => void;
  searchCostCenters: (keyword?: string) => Promise<Option[]>;
};

const ROOT = 'ts-expenses__form-report-summary__form__cost-center';
class ReportCostCenter extends React.Component<Props> {
  static displayName = costCenterArea;
  render() {
    const { isRequired, readOnly, expReport, errors, hintMsg, isLoading } =
      this.props;
    const isNewReport =
      expReport.scheduledDate !== undefined
        ? !expReport.scheduledDate
        : !expReport.accountingDate;
    const onSelectCostCenter = async (x: Option) => {
      if (!x.id) {
        this.props.handleChangeCostCenter();
        return;
      }
      this.props.onChangeEditingExpReport(
        `report.costCenterHistoryId`,
        x.id,
        true,
        false
      );
      this.props.onChangeEditingExpReport(
        `report.costCenterName`,
        x.name,
        true
      );
      this.props.onChangeEditingExpReport(
        `report.costCenterCode`,
        x.code,
        true,
        false
      );
      const isNotDefaultCostCenter = await this.props.isNotDefaultCostCenter(
        x.code,
        expReport.scheduledDate || expReport.accountingDate
      );
      this.props.onChangeEditingExpReport(
        `report.isCostCenterChangedManually`,
        isNotDefaultCostCenter,
        null,
        false
      );
    };
    const displayValue = expReport.costCenterHistoryId
      ? `${expReport.costCenterCode} - ${expReport.costCenterName}`
      : '';

    const placeHolder = msg().Com_Lbl_PressEnterToSearch;

    return (
      <React.Fragment>
        <div
          className={`${ROOT}-input ts-text-field-container`}
          data-testid={ROOT}
        >
          <LabelWithHint
            text={msg().Exp_Clbl_CostCenterHeader}
            hintMsg={(!readOnly && hintMsg) || ''}
            isRequired={isRequired}
          />
          <QuickSearch
            isSkipRecentlyUsed={this.props.isFinanceApproval}
            ROOT={ROOT}
            disabled={readOnly || isNewReport}
            placeholder={placeHolder}
            showLoadingIndicator={isLoading}
            selectedId={expReport.costCenterHistoryId}
            targetDate={
              expReport.scheduledDate || expReport.accountingDate || ''
            }
            displayValue={displayValue}
            onSelect={onSelectCostCenter}
            getRecentlyUsedItems={this.props.getRecentCostCenters}
            getSearchResult={this.props.searchCostCenters}
            openSearchDialog={this.props.handleClickCostCenterBtn}
          />
        </div>
        {errors.costCenterName && (
          <div className="input-feedback">{msg()[errors.costCenterName]}</div>
        )}
      </React.Fragment>
    );
  }
}

export default withLoadingHOC(ReportCostCenter);
