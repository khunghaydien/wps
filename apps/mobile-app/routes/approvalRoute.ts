import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { RouteConfig } from '../../commons/router';

import LayoutContainer from '../containers/organisms/approval/LayoutContainer';

import PageTransition from '../components/atoms/animations/PageTransition';

type Component = Promise<{ default: React.ComponentType<any> }>;

const ApprovalListContainer = (): Component =>
  import('../containers/pages/approval/ListContainer');
const ExpApprovalListContainer = (): Component =>
  import('../containers/pages/approval/expense/ExpListContainer');
const ReportContainer = (): Component =>
  import('../containers/pages/approval/expense/ReportContainer');
const RecordContainer = (): Component =>
  import('../containers/pages/approval/expense/RecordContainer');
const VendorDetailContainer = (): Component =>
  import('../containers/pages/approval/expense/VendorDetailContainer');
const AttendanceDetailContainer = (): Component =>
  import('../containers/pages/approval/attendance/AttendanceDetailContainer');
const FilterDetailContainer = (): Component =>
  import('../containers/pages/approval/expense/FilterDetailContainer');

/*
 * [route]                [react component]
 * sample/approval/:color ExpensePage
 * sample/attendance      ExpensePageContainer
 * sample/expence/:color  SamplaPage
 */
const routes: RouteConfig = [
  {
    path: 'approval',
    transition: PageTransition, // animation on page transition
    component: LayoutContainer, // layout
    children: [
      {
        // type = attendance or expense or ...
        path: 'list/search-result/:type',
        component: ApprovalListContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({}),
      },
      {
        // kind narrow
        path: 'list/kind-select',
        component: ApprovalListContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({}),
      },
      {
        path: 'list/select/att-daily',
        component: ApprovalListContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({}),
      },
      {
        path: 'list/select/att-month',
        component: ApprovalListContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({}),
      },
      {
        path: 'list/select/time-request',
        component: ApprovalListContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({}),
      },
      {
        path: 'list/select/expense/:requestId/detail/:recordId',
        component: RecordContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          requestId: match.params.requestId,
          recordId: match.params.recordId,
        }),
      },
      {
        path: 'list/select/expense/:requestId',
        component: ReportContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          requestId: match.params.requestId,
        }),
      },
      {
        path: ':moduleType/list/select/:requestId/detail/:recordId',
        component: RecordContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          requestId: match.params.requestId,
          recordId: match.params.recordId,
          moduleType: match.params.moduleType,
        }),
      },
      {
        path: ':moduleType/list/select/:requestId',
        component: ReportContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          requestId: match.params.requestId,
          moduleType: match.params.moduleType,
        }),
      },
      {
        path: 'list/type/:requestType',
        component: ApprovalListContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          requestType: match.params.requestType,
        }),
      },
      {
        path: 'list/select/attendance/:requestId',
        component: AttendanceDetailContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          requestId: match.params.requestId,
        }),
      },
      {
        path: 'list',
        component: ApprovalListContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({}),
      },
      {
        path: 'vendor/detail/:id',
        component: VendorDetailContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          id: match.params.id,
        }),
      },
      {
        path: 'expenses/list',
        component: ExpApprovalListContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({}),
      },
      {
        path: 'requests/list',
        component: ExpApprovalListContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({}),
      },
      {
        path: 'expenses/advance-search/detail',
        component: FilterDetailContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({}),
      },
    ],
  },
];

export default routes;
