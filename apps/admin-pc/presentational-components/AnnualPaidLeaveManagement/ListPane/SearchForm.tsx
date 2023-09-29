import React from 'react';

import { format } from 'date-fns';

import Button from '../../../../commons/components/buttons/Button';
import Label from '../../../../commons/components/fields/Label';
import TextField from '../../../../commons/components/fields/TextField';
import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';
import { DatePicker } from '../../../../core';

import './SearchForm.scss';

const ROOT = 'admin-pc-annual-paid-leave-management-search-form';

export type Props = {
  employeeCodeQuery: string;
  employeeNameQuery: string;
  departmentNameQuery: string;
  workingTypeNameQuery: string;
  targetDateQuery: string;
  onChangeEmployeeCodeQuery: (arg0: string) => void;
  onChangeEmployeeNameQuery: (arg0: string) => void;
  onChangeDepartmentNameQuery: (arg0: string) => void;
  onChangeWorkingTypeNameQuery: (arg0: string) => void;
  onChangeTargetDateQuery: (arg0: string) => void;
  onSubmitSearchForm: () => void;
};

export default class SearchForm extends React.Component<Props> {
  constructor() {
    // @ts-ignore
    super();
    this.onChangeEmployeeCodeQuery = this.onChangeEmployeeCodeQuery.bind(this);
    this.onChangeEmployeeNameQuery = this.onChangeEmployeeNameQuery.bind(this);
    this.onChangeDepartmentNameQuery =
      this.onChangeDepartmentNameQuery.bind(this);
    this.onChangeWorkingTypeNameQuery =
      this.onChangeWorkingTypeNameQuery.bind(this);
    this.onChangeTargetDateQuery = this.onChangeTargetDateQuery.bind(this);
    this.onSubmitSearchForm = this.onSubmitSearchForm.bind(this);
  }

  onChangeEmployeeCodeQuery(event: React.ChangeEvent<HTMLInputElement>) {
    this.props.onChangeEmployeeCodeQuery(event.target.value);
  }

  onChangeEmployeeNameQuery(event: React.ChangeEvent<HTMLInputElement>) {
    this.props.onChangeEmployeeNameQuery(event.target.value);
  }

  onChangeDepartmentNameQuery(event: React.ChangeEvent<HTMLInputElement>) {
    this.props.onChangeDepartmentNameQuery(event.target.value);
  }

  onChangeWorkingTypeNameQuery(event: React.ChangeEvent<HTMLInputElement>) {
    this.props.onChangeWorkingTypeNameQuery(event.target.value);
  }

  onChangeTargetDateQuery(value: Date | null) {
    this.props.onChangeTargetDateQuery(
      value ? format(value, 'YYYY-MM-DD') : ''
    );
  }

  onSubmitSearchForm(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    this.props.onSubmitSearchForm();
  }

  render() {
    return (
      <form onSubmit={this.onSubmitSearchForm} className={ROOT}>
        <Label
          labelCols={2}
          childCols={4}
          text={msg().Admin_Lbl_TargetDate}
          className={`${ROOT}__label`}
        >
          <DatePicker
            id="targetDateQuery"
            showsIcon
            value={DateUtil.formatYMD(this.props.targetDateQuery)}
            selected={
              this.props.targetDateQuery
                ? new Date(this.props.targetDateQuery)
                : undefined
            }
            onChange={(value: Date | null) =>
              this.onChangeTargetDateQuery(value)
            }
          />
        </Label>
        <Label
          labelCols={2}
          childCols={4}
          text={msg().Com_Lbl_EmployeeName}
          className={`${ROOT}__label`}
        >
          <TextField
            id="employeeNameQuery"
            type="search"
            value={this.props.employeeNameQuery}
            onChange={this.onChangeEmployeeNameQuery}
          />
        </Label>
        <Label
          labelCols={2}
          childCols={4}
          text={msg().Com_Lbl_EmployeeCode}
          className={`${ROOT}__label`}
        >
          <TextField
            id="employeeCodeQuery"
            type="search"
            value={this.props.employeeCodeQuery}
            onChange={this.onChangeEmployeeCodeQuery}
          />
        </Label>
        <Label
          labelCols={2}
          childCols={4}
          text={msg().Com_Lbl_DepartmentName}
          className={`${ROOT}__label`}
        >
          <TextField
            id="departmentNameQuery"
            type="search"
            value={this.props.departmentNameQuery}
            onChange={this.onChangeDepartmentNameQuery}
          />
        </Label>
        <Label
          labelCols={2}
          childCols={4}
          text={msg().Admin_Lbl_WorkScheme}
          className={`${ROOT}__label`}
        >
          <TextField
            id="workingTypeNameQuery"
            type="search"
            value={this.props.workingTypeNameQuery}
            onChange={this.onChangeWorkingTypeNameQuery}
          />
        </Label>
        <div className="slds-grid">
          <div className="slds-size--2-of-12 slds-grow-none slds-shrink-none" />
          <div
            className={`slds-size--4-of-12 slds-grow-none slds-shrink-none ${ROOT}__button-container`}
          >
            <Button type="default" submit className={`${ROOT}__button`}>
              {msg().Com_Btn_Search}
            </Button>
          </div>
        </div>
      </form>
    );
  }
}
