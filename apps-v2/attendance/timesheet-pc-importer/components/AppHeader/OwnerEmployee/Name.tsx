import * as React from 'react';

import styled from 'styled-components';

import { EmployeeViewModel } from '@apps/attendance/timesheet-pc-importer/viewModels/EmployeeViewModel';

const Emphasis = styled.span`
  padding-left: 15px;
  font-size: 20px;
  font-weight: bold;
`;

const Name: React.FC<EmployeeViewModel> = ({ department, code, name }) => (
  <div>
    <span>{department.name} /</span>
    <Emphasis>{code}</Emphasis>
    <Emphasis>{name}</Emphasis>
  </div>
);

export default Name;
