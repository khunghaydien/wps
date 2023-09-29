import * as React from 'react';

import displayName from '../../../commons/concerns/displayName';

import IconButton from '../../../commons/components/buttons/IconButton';
import TextField from '../../../commons/components/fields/TextField';
import Form from '../../../commons/components/Form';
import btnSearch from '../../../commons/images/btnSearchVia.png';
import msg from '../../../commons/languages';
import { compose } from '../../../commons/utils/FnUtil';

const ROOT = 'admin-pc-employee-member-search-form';

export type Props = Readonly<{
  search: (
    arg0: Readonly<{
      employeeName?: string;
      employeeCode?: string;
      departmentName?: string;
      employeeTitle?: string;
    }>
  ) => void;
}>;

type InternalProps = Readonly<{
  employeeName?: string;
  employeeCode?: string;
  departmentName?: string;
  employeeTitle?: string;
  updateValue: (key: string) => (value: string) => void;
  search: () => void;
}>;

const shouldComponentUpdate =
  (condition: (props: any) => boolean) =>
  (WrappedComponent: React.ComponentType<any>) => {
    return class extends React.Component<Props> {
      shouldComponentUpdate() {
        return condition(this.props);
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    };
  };

const withSearchable = (WrappedComponent: React.ComponentType<any>) => {
  type State = {
    employeeName?: string;
    employeeCode?: string;
    departmentName?: string;
    employeeTitle?: string;
  };

  return class extends React.PureComponent<Props, State> {
    state = {
      employeeName: '',
      employeeCode: '',
      departmentName: '',
      employeeTitle: '',
    };

    updateValue = (key: string) => (value: string) =>
      this.setState({
        [key]: value,
      });

    search = () =>
      this.props.search({
        employeeName: this.state.employeeName,
        employeeCode: this.state.employeeCode,
        departmentName: this.state.departmentName,
        employeeTitle: this.state.employeeTitle,
      });

    render() {
      return (
        <WrappedComponent
          {...this.state}
          updateValue={this.updateValue}
          search={this.search}
        />
      );
    }
  };
};

type controlState = {
  onChange: Function;
  onKeyDown: Function;
  label: string;
  value?: string;
  autoFocus?: boolean;
};
const Control = ({
  onChange,
  onKeyDown,
  label,
  value,
  autoFocus = false,
}: controlState) => {
  return (
    <div className={`${ROOT}__control`}>
      <div className={`${ROOT}__label`}>{label}</div>
      <div className={`${ROOT}__input`}>
        <TextField
          onChange={(_e, test: string) => onChange(test)}
          onKeyDown={(e, text: string) => {
            if (e.key === 'Enter') {
              onKeyDown(text);
            }
          }}
          value={value}
          autoFocus={autoFocus}
          placeholder={msg().Admin_Lbl_Search}
        />
      </div>
    </div>
  );
};

class EmployeeMemberSearchHeader extends React.PureComponent<InternalProps> {
  render() {
    return (
      <Form className={ROOT} onSubmit={() => this.props.search()}>
        <Control
          onChange={this.props.updateValue('employeeCode')}
          onKeyDown={() => this.props.search()}
          value={this.props.employeeCode}
          label={msg().Com_Lbl_EmployeeCode}
          autoFocus
        />
        <Control
          onChange={this.props.updateValue('employeeName')}
          onKeyDown={() => this.props.search()}
          value={this.props.employeeName}
          label={msg().Com_Lbl_EmployeeName}
        />
        <Control
          onChange={this.props.updateValue('departmentName')}
          onKeyDown={() => this.props.search()}
          value={this.props.departmentName}
          label={msg().Com_Lbl_DepartmentName}
        />
        <Control
          onChange={this.props.updateValue('employeeTitle')}
          onKeyDown={() => this.props.search()}
          value={this.props.employeeTitle}
          label={msg().Com_Lbl_Title}
        />
        <IconButton
          src={btnSearch}
          className={`${ROOT}__search-button`}
          onClick={() => this.props.search()}
        />
      </Form>
    );
  }
}

export default compose(
  displayName('EmployeeMemberSearchFormView'),
  shouldComponentUpdate(() => false),
  withSearchable
)(EmployeeMemberSearchHeader) as React.ComponentType<Record<string, any>>;
