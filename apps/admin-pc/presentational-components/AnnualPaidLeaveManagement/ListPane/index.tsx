import React from 'react';

import ExpandableSection from '../../../../commons/components/ExpandableSection';
import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';

import EmployeeList, {
  Props as EmployeeListProps,
} from '../../../components/Common/EmployeeList';

import SearchForm, { Props as SearchFormProps } from './SearchForm';

import './index.scss';

const ROOT = 'admin-pc-annual-paid-leave-management-list-pane';

const PaneHeader = () => (
  <header className={`${ROOT}__header`}>
    <span className={`${ROOT}__header-title`}>
      {msg().Att_Lbl_AnnualPaidLeave}
    </span>
  </header>
);

const PaneContent = (props) => (
  <div className={`slds-grid slds-grid--vertical slds-grow ${ROOT}__content`}>
    {props.children}
  </div>
);

const SearchFormSummary = (props: {
  isSectionExpanded: boolean;
  employeeCodeQuery: string;
  employeeNameQuery: string;
  departmentNameQuery: string;
  workingTypeNameQuery: string;
  targetDateQuery: string;
}) => (
  <span>
    <span>{msg().Com_Lbl_EmployeeSearch}</span>
    {!props.isSectionExpanded ? (
      <span
        className={`slds-text-color--weak ${ROOT}__search-summary-conditions`}
      >
        {msg().Com_Lbl_SearchConditions}:{' '}
        {DateUtil.formatYMD(props.targetDateQuery)} {props.employeeCodeQuery}{' '}
        {props.employeeNameQuery} {props.departmentNameQuery}{' '}
        {props.workingTypeNameQuery}
      </span>
    ) : null}
  </span>
);

export type Props = SearchFormProps &
  EmployeeListProps & {
    isSearchExecuted: boolean;
  };

export default class ListPane extends React.Component<Props> {
  render() {
    return (
      <section className={`slds-grid slds-grid--vertical ${ROOT}`}>
        <PaneHeader />
        <PaneContent>
          <ExpandableSection
            expanded={!this.props.isSearchExecuted}
            summary={(expanded) => (
              <SearchFormSummary
                isSectionExpanded={expanded}
                employeeCodeQuery={this.props.employeeCodeQuery}
                employeeNameQuery={this.props.employeeNameQuery}
                departmentNameQuery={this.props.departmentNameQuery}
                workingTypeNameQuery={this.props.workingTypeNameQuery}
                targetDateQuery={this.props.targetDateQuery}
              />
            )}
          >
            <SearchForm
              employeeCodeQuery={this.props.employeeCodeQuery}
              employeeNameQuery={this.props.employeeNameQuery}
              departmentNameQuery={this.props.departmentNameQuery}
              workingTypeNameQuery={this.props.workingTypeNameQuery}
              targetDateQuery={this.props.targetDateQuery}
              onChangeEmployeeCodeQuery={this.props.onChangeEmployeeCodeQuery}
              onChangeEmployeeNameQuery={this.props.onChangeEmployeeNameQuery}
              onChangeDepartmentNameQuery={
                this.props.onChangeDepartmentNameQuery
              }
              onChangeWorkingTypeNameQuery={
                this.props.onChangeWorkingTypeNameQuery
              }
              onChangeTargetDateQuery={this.props.onChangeTargetDateQuery}
              onSubmitSearchForm={this.props.onSubmitSearchForm}
            />
          </ExpandableSection>
          <EmployeeList
            employees={this.props.employees}
            limit={this.props.limit}
            isOverLimit={this.props.isOverLimit}
            isSearchExecuted={this.props.isSearchExecuted}
            selectedEmployeeId={this.props.selectedEmployeeId}
            onClickEmployee={this.props.onClickEmployee}
          />
        </PaneContent>
      </section>
    );
  }
}
