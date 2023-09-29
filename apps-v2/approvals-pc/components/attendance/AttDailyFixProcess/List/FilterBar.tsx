import * as React from 'react';

import uniq from 'lodash/uniq';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import {
  QuickSearchableDropdown as $QuickSearchableDropdown,
  QuickSearchField,
} from '@apps/core';

import { State } from '@apps/approvals-pc/modules/ui/attFixDaily/records';

const Container = styled.div`
  display: flex;
  border-top: 1px solid #d8dde6;
  border-bottom: 1px solid #d8dde6;
  background-color: #f4f6f9;
  color: #53688c;
  padding: 10px;
  align-items: center;
  justify-content: flex-start;
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 14px;
  :first-child {
    padding-left: 0px;
  }
`;

const Label = styled.div`
  font-size: 12px;
`;

const Field = styled.div`
  padding-left: 4px;
`;

const QuickSearchableDropdown = styled($QuickSearchableDropdown)`
  min-width: 100px;
  width: 150px;
`;

const convertTerm =
  (term: string[]) =>
  (prev: string): string => {
    if (prev === term.join(' ')) {
      return prev;
    } else {
      return term.join(' ') + ' ';
    }
  };

const FilterBar: React.FC<{
  records: State['records'];
  searchQuery: State['searchQuery'];
  changeQuery: (searchQuery: State['searchQuery']) => void;
}> = ({ records, searchQuery, changeQuery: $changeQuery }) => {
  const [employee, setEmployee] = React.useState<string>(
    searchQuery.employee.join(' ')
  );
  const [department, setDepartment] = React.useState<string>(
    searchQuery.department.join(' ')
  );
  const [requestAndEvent, setRequestAndEvent] = React.useState<string>(
    searchQuery.requestAndEvent.join(' ')
  );
  const targetDates = React.useMemo(
    () => uniq(records.map(({ targetDate }) => targetDate)),
    [records]
  );
  const changeQuery = React.useCallback(
    (key: keyof State['searchQuery'], value: unknown) => {
      $changeQuery({
        ...searchQuery,
        [key]: value,
      });
    },
    [$changeQuery, searchQuery]
  );
  const onSelectTargetDate = React.useCallback(
    ({ value }) => {
      changeQuery('targetDate', value);
    },
    [changeQuery]
  );
  const onChangeEmployee = React.useCallback(
    (e, terms) => {
      setEmployee(e.currentTarget.value);
      changeQuery('employee', terms);
    },
    [changeQuery]
  );
  const onChangeDepartment = React.useCallback(
    (e, terms) => {
      setDepartment(e.currentTarget.value);
      changeQuery('department', terms);
    },
    [changeQuery]
  );
  const onChangeRequestAndEvent = React.useCallback(
    (e, terms) => {
      setRequestAndEvent(e.currentTarget.value);
      changeQuery('requestAndEvent', terms);
    },
    [changeQuery]
  );

  React.useEffect(() => {
    setEmployee(convertTerm(searchQuery.employee));
    setDepartment(convertTerm(searchQuery.department));
    setRequestAndEvent(convertTerm(searchQuery.requestAndEvent));
  }, [searchQuery]);

  return (
    <Container>
      <Cell>
        <Label>
          {msg().Com_Lbl_EmployeeName} / {msg().Com_Lbl_EmployeeCode}:
        </Label>
        <Field>
          <QuickSearchField
            value={employee}
            onChange={onChangeEmployee}
            debounce={false}
          />
        </Field>
      </Cell>
      <Cell>
        <Label>{msg().Appr_Lbl_DepartmentName}:</Label>
        <Field>
          <QuickSearchField
            value={department}
            onChange={onChangeDepartment}
            debounce={false}
          />
        </Field>
      </Cell>
      <Cell>
        <Label>{msg().Appr_Lbl_Period}:</Label>
        <Field>
          <QuickSearchableDropdown
            value={searchQuery.targetDate}
            onSelect={onSelectTargetDate}
            items={targetDates}
            hasEmptyOption={true}
            filterSelector={(v) => String(v)}
            optionSelector={(targetDate: string) => ({
              label: targetDate,
              value: targetDate,
            })}
          />
        </Field>
      </Cell>
      <Cell>
        <Label>{msg().Att_Lbl_RequestAndEvent}:</Label>
        <Field>
          <QuickSearchField
            value={requestAndEvent}
            onChange={onChangeRequestAndEvent}
            debounce={false}
          />
        </Field>
      </Cell>
    </Container>
  );
};

export default FilterBar;
