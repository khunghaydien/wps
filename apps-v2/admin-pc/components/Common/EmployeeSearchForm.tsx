import * as React from 'react';

import { format } from 'date-fns';

import Button from '../../../commons/components/buttons/Button';
import ExpandableSection from '../../../commons/components/ExpandableSection';
import CommonLabel from '../../../commons/components/fields/Label';
import TextField from '../../../commons/components/fields/TextField';
import msg from '../../../commons/languages';
import DateUtil from '../../../commons/utils/DateUtil';
import { DatePicker } from '../../../core';

import './EmployeeSearchForm.scss';

const ROOT = 'admin-pc-common-employee-search-form';

const Label = (props: React.LabelHTMLAttributes<CommonLabel>) => (
  // @ts-ignore
  <CommonLabel
    className={`${ROOT}__label`}
    labelCols={2}
    childCols={4}
    {...props}
  />
);

const TargetDateQuery = ({
  value: $value,
  onChange: $onChange,
}: {
  value: string;
  onChange: (arg0: string) => void;
}) => {
  const [value, selected] = React.useMemo(
    () => [DateUtil.formatYMD($value), $value ? new Date($value) : undefined],
    [$value]
  );
  const onChange = React.useCallback(
    (date: Date | null) => {
      const value = date ? format(date, 'YYYY-MM-DD') : '';
      $onChange(value);
    },
    [$onChange]
  );

  return (
    <DatePicker
      id="targetDateQuery"
      showsIcon
      value={value}
      selected={selected}
      onChange={onChange}
    />
  );
};

const QueryTextField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (arg0: string) => void;
}) => (
  // @ts-ignore
  <Label text={label}>
    <TextField
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </Label>
);

const SummaryOfSearchQuery = ({
  employeeCodeQuery,
  employeeNameQuery,
  departmentNameQuery,
  workingTypeNameQuery,
}: {
  employeeCodeQuery: string;
  employeeNameQuery: string;
  departmentNameQuery: string;
  workingTypeNameQuery: string;
}) => (
  <span className={`slds-text-color--weak ${ROOT}__search-summary-conditions`}>
    {msg().Com_Lbl_SearchConditions}:{` `}
    {[
      employeeCodeQuery,
      employeeNameQuery,
      departmentNameQuery,
      workingTypeNameQuery,
    ].join(' ')}
  </span>
);

export type Props = {
  isSearchExecuted: boolean;
  targetDateQuery: string;
  employeeCodeQuery: string;
  employeeNameQuery: string;
  departmentNameQuery: string;
  workingTypeNameQuery: string;
  onChangeTargetDateQuery: (arg0: string) => void;
  onChangeEmployeeCodeQuery: (arg0: string) => void;
  onChangeEmployeeNameQuery: (arg0: string) => void;
  onChangeDepartmentNameQuery: (arg0: string) => void;
  onChangeWorkingTypeNameQuery: (arg0: string) => void;
  onSubmitSearchForm: () => void;
};

const EmployeeSearchForm = ({
  isSearchExecuted,
  targetDateQuery,
  employeeCodeQuery,
  employeeNameQuery,
  departmentNameQuery,
  workingTypeNameQuery,
  onChangeTargetDateQuery,
  onChangeEmployeeCodeQuery,
  onChangeEmployeeNameQuery,
  onChangeDepartmentNameQuery,
  onChangeWorkingTypeNameQuery,
  onSubmitSearchForm: $onSubmitSearchForm,
}: Props) => {
  const onSubmitSearchForm = React.useCallback(
    (event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      $onSubmitSearchForm();
    },
    [$onSubmitSearchForm]
  );

  return (
    <ExpandableSection
      className={ROOT}
      expanded={!isSearchExecuted}
      summary={(isExpanded) => (
        <span>
          <span>{msg().Com_Lbl_EmployeeSearch}</span>
          {!isExpanded ? (
            <SummaryOfSearchQuery
              employeeCodeQuery={employeeCodeQuery}
              employeeNameQuery={employeeNameQuery}
              departmentNameQuery={departmentNameQuery}
              workingTypeNameQuery={workingTypeNameQuery}
            />
          ) : null}
        </span>
      )}
    >
      <form onSubmit={onSubmitSearchForm}>
        {/* @ts-ignore */}
        <Label text={msg().Admin_Lbl_TargetDate}>
          <TargetDateQuery
            value={targetDateQuery}
            onChange={onChangeTargetDateQuery}
          />
        </Label>
        <QueryTextField
          label={msg().Com_Lbl_EmployeeName}
          value={employeeNameQuery}
          onChange={onChangeEmployeeNameQuery}
        />
        <QueryTextField
          label={msg().Com_Lbl_EmployeeCode}
          value={employeeCodeQuery}
          onChange={onChangeEmployeeCodeQuery}
        />
        <QueryTextField
          label={msg().Com_Lbl_DepartmentName}
          value={departmentNameQuery}
          onChange={onChangeDepartmentNameQuery}
        />
        <QueryTextField
          label={msg().Admin_Lbl_WorkScheme}
          value={workingTypeNameQuery}
          onChange={onChangeWorkingTypeNameQuery}
        />
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
    </ExpandableSection>
  );
};

export default EmployeeSearchForm;
