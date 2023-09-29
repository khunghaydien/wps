import React from 'react';

import ExpandableSection from '../../../../commons/components/ExpandableSection';
import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';

import { fetchLeaveTypes } from '../../../modules/managed-leave-management/list-pane/entities/leave-types';

import { AppDispatch } from '../../../action-dispatchers/AppThunk';

import EmployeeList, {
  Props as EmployeeListProps,
} from '../../../components/Common/EmployeeList';

import LeaveTypeSelector, {
  Props as LeaveTypeSelectorProps,
} from './LeaveTypeSelector';
import SearchForm, { Props as SearchFormProps } from './SearchForm';

import './index.scss';

const ROOT = 'admin-pc-managed-leave-management-list-pane';

const PaneHeader = () => (
  <header className={`${ROOT}__header`}>
    <span className={`${ROOT}__header-title`}>
      {msg().Att_Lbl_ManagedLeave}
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

export type Props = LeaveTypeSelectorProps &
  SearchFormProps &
  EmployeeListProps & {
    dispatch: AppDispatch;
    targetCompanyId: string | null | undefined;
    selectedLeaveTypeId: string;
    isSearchExecuted: boolean;
  };

export default class ListPane extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    if (
      this.props.targetCompanyId !== null &&
      this.props.targetCompanyId !== undefined
    ) {
      this.props.dispatch(fetchLeaveTypes(this.props.targetCompanyId));
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.targetCompanyId !== null &&
      nextProps.targetCompanyId !== undefined &&
      nextProps.targetCompanyId !== this.props.targetCompanyId
    ) {
      this.props.dispatch(fetchLeaveTypes(nextProps.targetCompanyId));
    }
  }

  render() {
    return (
      <section className={`slds-grid slds-grid--vertical ${ROOT}`}>
        <PaneHeader />
        <PaneContent>
          <LeaveTypeSelector
            leaveTypes={this.props.leaveTypes}
            selectedLeaveTypeId={this.props.selectedLeaveTypeId}
            onChangeLeaveType={this.props.onChangeLeaveType}
          />
          {this.props.selectedLeaveTypeId !== ''
            ? [
                <ExpandableSection
                  key="ExpandableSection"
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
                    key="SearchForm"
                    employeeCodeQuery={this.props.employeeCodeQuery}
                    employeeNameQuery={this.props.employeeNameQuery}
                    departmentNameQuery={this.props.departmentNameQuery}
                    workingTypeNameQuery={this.props.workingTypeNameQuery}
                    targetDateQuery={this.props.targetDateQuery}
                    onChangeEmployeeCodeQuery={
                      this.props.onChangeEmployeeCodeQuery
                    }
                    onChangeEmployeeNameQuery={
                      this.props.onChangeEmployeeNameQuery
                    }
                    onChangeDepartmentNameQuery={
                      this.props.onChangeDepartmentNameQuery
                    }
                    onChangeWorkingTypeNameQuery={
                      this.props.onChangeWorkingTypeNameQuery
                    }
                    onChangeTargetDateQuery={this.props.onChangeTargetDateQuery}
                    onSubmitSearchForm={this.props.onSubmitSearchForm}
                  />
                </ExpandableSection>,
                <EmployeeList
                  key="EmployeeList"
                  employees={this.props.employees}
                  limit={this.props.limit}
                  isOverLimit={this.props.isOverLimit}
                  isSearchExecuted={this.props.isSearchExecuted}
                  selectedEmployeeId={this.props.selectedEmployeeId}
                  onClickEmployee={this.props.onClickEmployee}
                />,
              ]
            : null}
        </PaneContent>
      </section>
    );
  }
}
