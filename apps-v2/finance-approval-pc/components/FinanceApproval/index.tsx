import React, { Suspense } from 'react';

import { cloneDeep, find, isEqual, unset } from 'lodash';

import Button from '../../../commons/components/buttons/Button';
import { OptionList } from '../../../commons/components/fields/CustomDropdown';
import { AmountRangeOption } from '../../../commons/components/fields/DropdownAmountRange';
import { DateRangeOption } from '../../../commons/components/fields/DropdownDateRange';
import SelectField from '../../../commons/components/fields/SelectField';
import Overlap from '../../../commons/components/Overlap';
import { Props as PagerInfoProps } from '../../../commons/components/PagerInfo';
import Spinner from '../../../commons/components/Spinner';
import msg from '../../../commons/languages';
import { KEYS } from '@commons/modules/exp/ui/reportList/advSearch/detail';

import { SearchConditions } from '../../../domain/models/exp/FinanceApproval';

import { modes } from '../../../expenses-pc/modules/ui/expenses/mode';

// re-use expense components
import RequestListContainer from '../../containers/FinanceApproval/RequestListContainer';

import SubHeaderPager, { Props as subHeaderPageProps } from './SubHeaderPager';

import './index.scss';

const ReportListSearchContainer = React.lazy(
  () => import('@apps/commons/containers/exp/ReportListAdvSearchContainer')
);

const FormContainer = React.lazy(
  () => import('../../containers/FinanceApproval/FormContainer')
);
const ROOT = 'ts-finance-approval';

type State = {
  values: [];
};

type Props = {
  advSearchCondition: SearchConditions;
  amount: AmountRangeOption;
  costCenterOptions: OptionList;
  currencyDecimalPlaces: number;
  departmentOptions: OptionList;
  employeeOptions: OptionList;
  fetchedAdvSearchConditionList: Array<SearchConditions>;
  isRequestTab: boolean;
  mode: string;
  overlap: { record: boolean; report: boolean };
  reportTypeOptions: OptionList;
  // event handlers
  requestTotalNum: number;
  selectedCompanyId: string;
  selectedDetail: Array<string>;
  selectedRequestDate: DateRangeOption;
  selectedSearchConditionName: string;
  userSetting: { companyId: string };
  vendorOptions: OptionList;
  fetchFinanceApprovalIdList: (arg0: string) => void;
  labelObject: () => any;
  onClickAdvSearchButton: () => void;
  onClickCondititon: (arg0: React.ChangeEvent<HTMLSelectElement>) => void;
  onClickDeleteConditionButton: () => void;
  onClickInputValueRequestDate: () => void;
  onClickSaveConditionButton: () => void;
} & PagerInfoProps &
  subHeaderPageProps;

const approvedReportListLabel =
  msg().Exp_Lbl_SearchConditionApprovelreRuestList;
const approvedRequestListLabel =
  msg().Exp_Lbl_SearchConditionApprovedRequestList;

class FinanceApproval extends React.Component<Props, State> {
  component: any;

  isMode(mode: string) {
    return this.props.mode === modes[mode];
  }

  createOptions(
    fetchedCondition: Array<SearchConditions>
  ): Record<string, any>[] {
    const conditionName = this.props.isRequestTab
      ? approvedReportListLabel
      : approvedRequestListLabel;
    const conditionList = fetchedCondition
      .filter((condition) => condition.name !== conditionName)
      .map((c) => {
        return { value: c.name, text: c.name };
      });
    return conditionList;
  }

  render() {
    const { isRequestTab, selectedSearchConditionName } = this.props;
    const disabled = !this.isMode('REPORT_EDIT');

    const selectedSearchCondition = cloneDeep(
      find(this.props.fetchedAdvSearchConditionList, {
        name: selectedSearchConditionName,
      })
    );
    unset(selectedSearchCondition, ['name']);
    unset(selectedSearchCondition, 'companyIdList');

    // disable save button condition
    // 1. condition doesn't change
    const isDisabledSaveButton = isEqual(
      selectedSearchCondition,
      this.props.advSearchCondition
    );

    // disable delete button when current condition is the default one
    const isDefaultCondition = isRequestTab
      ? selectedSearchConditionName === approvedRequestListLabel
      : selectedSearchConditionName === approvedReportListLabel;
    const isDisabledDeleteButton = isDefaultCondition;

    return (
      <div className={`${ROOT}`}>
        <div className={`${ROOT}__backToList`}>
          <SubHeaderPager
            overlap={this.props.overlap}
            requestTotalNum={this.props.requestTotalNum}
            currentRequestIdx={this.props.currentRequestIdx}
            onClickBackButton={this.props.onClickBackButton}
            onClickNextToRequestButton={this.props.onClickNextToRequestButton}
            showPagination
          />
        </div>
        <div className={`${ROOT}-search-area`}>
          <div className={`${ROOT}-search-area__search-cond`}>
            <SelectField
              options={this.createOptions(
                this.props.fetchedAdvSearchConditionList
              )}
              onChange={this.props.onClickCondititon}
              value={selectedSearchConditionName}
            />
            <Button
              onClick={this.props.onClickSaveConditionButton}
              className={`${ROOT}-condition-save-button`}
              disabled={isDisabledSaveButton}
            >
              {msg().Exp_Btn_SaveSearchCondition}
            </Button>
            <Button
              onClick={this.props.onClickDeleteConditionButton}
              className={`${ROOT}-condition-delete-button`}
              disabled={isDisabledDeleteButton}
            >
              {msg().Exp_Btn_DeleteSearchCondition}
            </Button>
          </div>
          <Suspense fallback={<div>{msg().Com_Lbl_Loading}</div>}>
            <ReportListSearchContainer
              selectedCompanyId={this.props.selectedCompanyId}
              baseCurrencyDecimal={this.props.currencyDecimalPlaces}
              isRequest={isRequestTab}
              onClickInputValueSubmitDate={
                this.props.onClickInputValueRequestDate
              }
              onClickAdvSearchButton={this.props.onClickAdvSearchButton}
              baseConditions={[
                KEYS.financeStatusList,
                KEYS.employee,
                KEYS.department,
                KEYS.requestDateRange,
                KEYS.extraConditions,
              ]}
              extraConditions={[
                KEYS.title,
                KEYS.accountingDate,
                KEYS.reportNo,
                KEYS.amount,
                KEYS.reportType,
                KEYS.costCenter,
                KEYS.vendor,
              ]}
            />
          </Suspense>
        </div>
        <RequestListContainer />
        <Suspense fallback={<Spinner loading priority="low" />}>
          <Overlap isVisible={this.props.overlap.report}>
            <div className={`${ROOT}__tab-area`}>
              <FormContainer
                disabled={disabled}
                mode={this.props.mode}
                labelObject={this.props.labelObject}
              />
            </div>
          </Overlap>
        </Suspense>
      </div>
    );
  }
}

export default FinanceApproval;
