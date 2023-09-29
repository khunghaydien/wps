import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { RouteConfig } from '../../commons/router';

import LayoutContainer from '../containers/organisms/approval/LayoutContainer';

import PageTransition from '../components/atoms/animations/PageTransition';

type Component = Promise<{ default: React.ComponentType<any> }>;

const ApprovalListContainer = (): Component =>
  import('../containers/pages/approval/ListPageContainer');
const ExpApprovalListContainer = (): Component =>
  import('../containers/pages/approval/expense/ExpListContainer');
const ExpChildItemContainer = (): Component =>
  import('../containers/pages/approval/expense/ExpChildItemContainer');
const ReportContainer = (): Component =>
  import('../containers/pages/approval/expense/ReportContainer');
const RecordContainer = (): Component =>
  import('../containers/pages/approval/expense/RecordContainer');
const VendorDetailContainer = (): Component =>
  import('../containers/pages/approval/expense/VendorDetailContainer');
const AttDailyRequestDetailContainer = (): Component =>
  import('../containers/pages/approval/attendance/DailyRequestDetailContainer');
const AttAttendanceRequestContainer = (): Component =>
  import(
    '../containers/pages/approval/attendance/AttendanceRequestDetailContainer'
  );
const AttAttendanceRequestDailyContainer = (): Component =>
  import(
    '../containers/pages/approval/attendance/AttendanceRequestDetailDailyContainer'
  );
const FilterDetailContainer = (): Component =>
  import('../containers/pages/approval/expense/FilterDetailContainer');
const CustomRequestListContainer = (): Component =>
  import('../containers/pages/approval/customRequest/ListContainer');
const CustomReportDetailContainer = (): Component =>
  import('../containers/pages/approval/customRequest/DetailContainer');

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
        path: 'custom-request/list/select/:requestId/:recordTypeId',
        component: CustomReportDetailContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          requestId: match.params.requestId,
          recordTypeId: match.params.recordTypeId,
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
        path: 'list/back',
        component: ApprovalListContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({
          back: true,
        }),
      },
      {
        path: 'list/select/attendance_daily/:requestId',
        component: AttDailyRequestDetailContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          requestId: match.params.requestId,
        }),
      },
      {
        path: 'list/select/attendance_fix/:requestId/:targetDate',
        component: AttAttendanceRequestDailyContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          requestId: match.params.requestId,
          targetDate: match.params.targetDate,
        }),
      },
      {
        path: 'list/select/attendance_fix/:requestId',
        component: AttAttendanceRequestContainer,
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
        path: 'expenses/record/item/:itemIdx',
        component: ExpChildItemContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          itemIdx: match.params.itemIdx,
        }),
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
      {
        path: 'custom-request/list',
        component: CustomRequestListContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({}),
      },
    ],
  },
];

export default routes;
