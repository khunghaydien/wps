import React from 'react';

import msg from '../../../commons/languages';

import EmployeeList, {
  Props as EmployeeListProps,
} from '../../components/Common/EmployeeList';
import EmployeeSearchForm, {
  Props as EmployeeSearchFormProps,
} from '../../components/Common/EmployeeSearchForm';
import ListPaneFrame from '../../components/Common/ListPaneFrame';

export type Props = EmployeeSearchFormProps &
  EmployeeListProps & {
    isSearchExecuted: boolean;
  };

export default class ListPane extends React.Component<Props> {
  render() {
    return (
      // @ts-ignore
      <ListPaneFrame title={msg().Admin_Lbl_ShortTimeWorkPeriodStatus}>
        <EmployeeSearchForm
          isSearchExecuted={this.props.isSearchExecuted}
          targetDateQuery={this.props.targetDateQuery}
          employeeCodeQuery={this.props.employeeCodeQuery}
          employeeNameQuery={this.props.employeeNameQuery}
          departmentNameQuery={this.props.departmentNameQuery}
          workingTypeNameQuery={this.props.workingTypeNameQuery}
          onChangeTargetDateQuery={this.props.onChangeTargetDateQuery}
          onChangeEmployeeCodeQuery={this.props.onChangeEmployeeCodeQuery}
          onChangeEmployeeNameQuery={this.props.onChangeEmployeeNameQuery}
          onChangeDepartmentNameQuery={this.props.onChangeDepartmentNameQuery}
          onChangeWorkingTypeNameQuery={this.props.onChangeWorkingTypeNameQuery}
          onSubmitSearchForm={this.props.onSubmitSearchForm}
        />
        <EmployeeList
          employees={this.props.employees}
          limit={this.props.limit}
          isOverLimit={this.props.isOverLimit}
          isSearchExecuted={this.props.isSearchExecuted}
          selectedEmployeeId={this.props.selectedEmployeeId}
          onClickEmployee={this.props.onClickEmployee}
        />
      </ListPaneFrame>
    );
  }
}
