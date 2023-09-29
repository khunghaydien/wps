import * as React from 'react';

import displayName from '../../../../../commons/concerns/displayName';

import DateField from '../../../../../commons/components/fields/DateField';
import TextField from '../../../../../commons/components/fields/TextField';
import Form from '../../../../../commons/components/Form';
import msg from '../../../../../commons/languages';
import { compose } from '../../../../../commons/utils/FnUtil';
import { SearchButton } from '../../../../../core';

import './EmployeeSearchForm.scss';

const ROOT = 'admin-pc-employee-delegate-apporval-employee-search-form';

export type Props = Readonly<{
  targetDate?: string;
  search: (
    arg0: Readonly<{
      targetDate?: string;
      name?: string;
      code?: string;
      departmentName?: string;
      departmentCode?: string;
      title?: string;
    }>
  ) => void;
}>;

type InternalProps = Readonly<{
  targetDate?: string;
  name?: string;
  code?: string;
  departmentName?: string;
  departmentCode?: string;
  title?: string;
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
    targetDate?: string;
    name?: string;
    code?: string;
    departmentName?: string;
    departmentCode?: string;
    title?: string;
  };

  return class extends React.PureComponent<Props, State> {
    constructor(_props: Props) {
      // @ts-ignore
      super();

      this.state = {
        targetDate: _props.targetDate,
        name: '',
        code: '',
        departmentName: '',
        departmentCode: '',
      };

      this.updateValue = this.updateValue.bind(this);
      this.search = this.search.bind(this);
    }

    updateValue(key: string) {
      return (value: string) =>
        this.setState({
          [key]: value,
        });
    }

    search() {
      this.props.search({
        targetDate: this.state.targetDate,
        name: this.state.name,
        code: this.state.code,
        departmentName: this.state.departmentName,
        departmentCode: this.state.departmentCode,
        title: this.state.title,
      });
    }

    render() {
      return (
        <WrappedComponent
          {...(this.state as Record<string, any>)}
          updateValue={this.updateValue}
          search={this.search}
          targetDate={this.state.targetDate}
        />
      );
    }
  };
};

const Control = ({ onChange, label, value, autoFocus }) => {
  return (
    <div className={`${ROOT}__control`}>
      <div className={`${ROOT}__label`}>{label}</div>
      <div className={`${ROOT}__input`}>
        <TextField
          onChange={(_e, v: string) => onChange(v)}
          value={value}
          autoFocus={autoFocus}
          placeholder={msg().Com_Lbl_Search}
        />
      </div>
    </div>
  );
};

class Presentation extends React.PureComponent<InternalProps> {
  render() {
    return (
      <div className={ROOT}>
        <div className={`${ROOT}__history`}>
          <div className={`${ROOT}__history-label`}>
            {msg().Admin_Lbl_TargetDate}：
          </div>
          <div className={`${ROOT}__history-date_field`}>
            <DateField
              onChange={this.props.updateValue('targetDate')}
              value={this.props.targetDate}
            />
          </div>
        </div>
        <Form onSubmit={() => this.props.search()}>
          <div className={`${ROOT}__form`}>
            <Control
              onChange={this.props.updateValue('code')}
              value={this.props.code}
              label={msg().Com_Lbl_EmployeeCode}
              autoFocus={false}
            />
            <Control
              onChange={this.props.updateValue('name')}
              value={this.props.name}
              label={msg().Com_Lbl_EmployeeName}
              autoFocus
            />
            <Control
              onChange={this.props.updateValue('departmentCode')}
              value={this.props.departmentCode}
              label={msg().Com_Lbl_DepartmentCode}
              autoFocus={false}
            />
            <Control
              onChange={this.props.updateValue('departmentName')}
              value={this.props.departmentName}
              label={msg().Com_Lbl_DepartmentName}
              autoFocus={false}
            />
            <Control
              onChange={this.props.updateValue('title')}
              value={this.props.title}
              label={msg().Com_Lbl_Title}
              autoFocus={false}
            />
            <div className={`${ROOT}__search-button`}>
              <SearchButton />
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default compose(
  displayName('EmployeeSelectionSearchForm'),
  shouldComponentUpdate(() => false),
  withSearchable
)(Presentation) as React.ComponentType<Record<string, any>>;
