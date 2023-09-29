import * as React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { action } from '@storybook/addon-actions';

import EmployeeGrid from '../../components/AttRequestStatus/EmployeeGrid';

const mockStore = configureStore();

const mockInitialState = {
  common: {
    accessControl: {
      permission: {
        viewAttTimeSheetByDelegate: true,
      },
    },
    proxyEmployeeInfo: {
      isProxyMode: false,
    },
  },
};

export default {
  title: 'team-pc',

  decorators: [
    (story: Function) => (
      <Provider store={mockStore(mockInitialState)}>{story()}</Provider>
    ),
  ],
};

export const EmployeeGridHasLink = () => (
  <EmployeeGrid
    onUpdateFilterTerm={action('change filter')}
    records={[
      {
        photoUrl: '',
        employeeId: 'EMPLOYEE_ID',
        employeeName: 'EMPLOYEE NAME',
        employeeCode: 'EMPLOYEE CODE',
        workingTypeName: 'WORKING TYPE NAME',
        startDate: '2018/11/01',
        endDate: '2018/11/31',
        approverName: 'APPROVER NAME',
        status: 'Pending',
      },
      {
        photoUrl: '',
        employeeId: 'EMPLOYEE_ID',
        employeeName: 'EMPLOYEE NAME',
        employeeCode: 'EMPLOYEE CODE',
        workingTypeName: 'WORKING TYPE NAME',
        startDate: '2018/11/01',
        endDate: '2018/11/31',
        approverName: 'APPROVER NAME',
        status: 'NotRequested',
      },
      {
        photoUrl: '',
        employeeId: 'EMPLOYEE_ID',
        employeeName: 'EMPLOYEE NAME',
        employeeCode: 'EMPLOYEE CODE',
        workingTypeName: 'WORKING TYPE NAME',
        startDate: '2018/11/01',
        endDate: '2018/11/31',
        approverName: 'APPROVER NAME',
        status: 'Removed',
      },
      {
        photoUrl: '',
        employeeId: 'EMPLOYEE_ID',
        employeeName: 'EMPLOYEE NAME',
        employeeCode: 'EMPLOYEE CODE',
        workingTypeName: 'WORKING TYPE NAME',
        startDate: '2018/11/01',
        endDate: '2018/11/31',
        approverName: 'APPROVER NAME',
        status: 'Rejected',
      },
      {
        photoUrl: '',
        employeeId: 'EMPLOYEE_ID',
        employeeName: 'EMPLOYEE NAME',
        employeeCode: 'EMPLOYEE CODE',
        workingTypeName: 'WORKING TYPE NAME',
        startDate: '2018/11/01',
        endDate: '2018/11/31',
        approverName: 'APPROVER NAME',
        status: 'Approved',
      },
      {
        photoUrl: '',
        employeeId: 'EMPLOYEE_ID',
        employeeName: 'EMPLOYEE NAME',
        employeeCode: 'EMPLOYEE CODE',
        workingTypeName: 'WORKING TYPE NAME',
        startDate: '2018/11/01',
        endDate: '2018/11/31',
        approverName: 'APPROVER NAME',
        status: 'Canceled',
      },
    ]}
    onClickOpenTimesheetWindowButton={action(
      'onClickOpenTimesheetWindowButton'
    )}
    workingTypeNameOptions={['WORKING TYPE NAME']}
    closingDateOptions={['2018/11/31']}
    filterTerms={{
      employeeName: '',
      employeeCode: '',
      workingTypeName: '',
      endDate: '',
      status: '',
      approverName: '',
    }}
  />
);

EmployeeGridHasLink.storyName = 'EmployeeGrid - Has link';

EmployeeGridHasLink.parameters = {
  info: { propTables: [EmployeeGrid], inline: true, source: true },
};
