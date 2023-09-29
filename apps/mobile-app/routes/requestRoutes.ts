import { RouteComponentProps } from 'react-router';

import { RouteConfig } from '../../commons/router';

import Layout from '../containers/organisms/expense/LayoutContainer';

import PageTransition from '../components/atoms/animations/PageTransition';

export const LOCATION_STATE = {
  CANCEL_EDIT: 'cancelEdit',
};

type Component = Promise<{ default: React.ComponentType<any> }>;

const ReportSubmitContainer = (): Component =>
  import('../containers/pages/request/ReportSubmitContainer');
const ReportRecallContainer = (): Component =>
  import('../containers/pages/request/ReportRecallContainer');
const ReportListContainer = (): Component =>
  import('../containers/pages/request/ReportListContainer');
const ReportDetailContainer = (): Component =>
  import('../containers/pages/request/ReportDetailContainer');
const ReportEditContainer = (): Component =>
  import('../containers/pages/request/ReportEditContainer');
const RouteListItemContainer = (): Component =>
  import('../containers/pages/request/RouteListItemContainer');
const RecordNewContainer = (): Component =>
  import('../containers/pages/request/RecordNewContainer');
const ExpenseTypeContainer = (): Component =>
  import('../containers/pages/request/ExpenseTypeContainer');
const RouteFormContainer = (): Component =>
  import('../containers/pages/request/RouteFormContainer');
const RouteListContainer = (): Component =>
  import('../containers/pages/request/RouteListContainer');
const CustomExtendedItemContainer = (): Component =>
  import('../containers/pages/request/CustomExtendedItemContainer');
const CostCenterContainer = (): Component =>
  import('../containers/pages/request/CostCenterContainer');
const JobContainer = (): Component =>
  import('../containers/pages/request/JobContainer');
const ReceiptLibraryContainer = (): Component =>
  import('../containers/pages/request/ReceiptLibraryContainer');
const VendorContainer = (): Component =>
  import('../containers/pages/request/VendorContainer');
const VendorDetailContainer = (): Component =>
  import('../containers/pages/approval/expense/VendorDetailContainer');
/*
 * [route]                [react component]
 * sample/approval/:color ExpensePage
 * sample/attendance      ExpensePageContainer
 * sample/expence/:color  SamplaPage
 */
const routes: RouteConfig = [
  {
    path: 'request',
    transition: PageTransition, // animation on page transition
    component: Layout, // layout
    children: [
      /**
       * Expense Type
       */
      {
        path: 'expense-type/list/:recordType/:parentParentGroupId/:parentGroupId',
        component: ExpenseTypeContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          type: 'list',
          recordType: match.params.recordType,
          parentGroupId: match.params.parentGroupId,
          parentParentGroupId: match.params.parentParentGroupId,
        }),
      },
      {
        path: 'expense-type/list/:recordType/:parentGroupId',
        component: ExpenseTypeContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          type: 'list',
          recordType: match.params.recordType,
          parentGroupId: match.params.parentGroupId,
        }),
      },
      {
        path: 'expense-type/list/:recordType',
        component: ExpenseTypeContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          type: 'list',
          recordType: match.params.recordType,
        }),
      },
      {
        path: `expense-type/search/keyword=:keyword?/:level`,
        component: ExpenseTypeContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          type: 'search',
          keyword: match.params.keyword,
          level: match.params.level,
        }),
      },
      /**
       * Report
       */
      {
        path: 'report/recall',
        component: ReportRecallContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({}),
      },
      {
        path: 'report/submit',
        component: ReportSubmitContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({}),
      },
      {
        path: 'report/list',
        component: ReportListContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({}),
      },
      {
        path: 'report/new',
        component: ReportEditContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({}),
      },
      {
        path: 'report/detail/:id/:requestId?',
        component: ReportDetailContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          reportId: match.params.id,
          paramRequestId: match.params.requestId,
        }),
      },

      /**
       * Adding new Record to existing Report
       */
      {
        path: 'expense-type/list/:recordType',
        component: ExpenseTypeContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          type: 'list',
          recordType: match.params.recordType,
        }),
      },
      {
        path: `expense-type/search/keyword=:keyword?/:level`,
        component: ExpenseTypeContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          type: 'search',
          keyword: match.params.keyword,
          level: match.params.level,
        }),
      },
      {
        path: 'expense-type/list/:recordType/:parentGroupId',
        component: ExpenseTypeContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          type: 'list',
          recordType: match.params.recordType,
          parentGroupId: match.params.parentGroupId,
        }),
      },

      {
        path: 'record/jorudan-detail/:recordId/:reportId',
        component: RouteListItemContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          type: 'report',
          recordId: match.params.recordId,
          reportId: match.params.reportId,
        }),
      },
      {
        path: 'report/edit/:reportId',
        component: ReportEditContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          reportId: match.params.reportId,
        }),
      },
      {
        path: 'report/record/new/general',
        component: RecordNewContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({
          type: 'add',
        }),
      },
      {
        path: 'receipt-library/list/backType=:backType',
        component: ReceiptLibraryContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          backType: match.params.backType,
        }),
      },
      {
        path: 'report/route/new',
        component: RouteFormContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({
          type: 'add',
        }),
      },
      {
        path: 'report/route/edit/:recordId/:reportId',
        component: RouteFormContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          type: 'report',
          reportId: match.params.reportId,
          recordId: match.params.recordId,
        }),
      },
      {
        path: 'report/route/list/item/:routeno',
        component: RouteListItemContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          type: 'add',
          routeNo: match.params.routeno,
        }),
      },
      {
        path: 'report/route/list/edit/:recordId/:reportId',
        component: RouteListContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          type: 'report',
          reportId: match.params.reportId,
          recordId: match.params.recordId,
        }),
      },
      {
        path: 'report/route/list',
        component: RouteListContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({
          type: 'add',
        }),
      },
      {
        path: 'record/item/:itemIdx',
        component: RecordNewContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          itemIdx: Number(match.params.itemIdx || 0),
        }),
      },
      {
        path: 'record/detail/:reportId/:recordId',
        component: RecordNewContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          type: 'reportList',
          reportId: match.params.reportId,
          recordId: match.params.recordId,
        }),
      },
      /**
       * Custom Extended Item
       */
      {
        path: 'customExtendedItem/list/backType=:backType/reportId=:reportId/recordId=:recordId/itemIdx=:itemIdx/index=:index/customExtendedItemLookupId=:customExtendedItemLookupId/customExtendedItemId=:customExtendedItemId/customExtendedItemName=:customExtendedItemName',
        component: CustomExtendedItemContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          customExtendedItemId: match.params.customExtendedItemId,
          customExtendedItemName: match.params.customExtendedItemName,
          customExtendedItemLookupId: match.params.customExtendedItemLookupId,
          index: match.params.index,
          reportId: match.params.reportId,
          recordId: match.params.recordId,
          itemIdx: Number(match.params.itemIdx || 0),
          backType: match.params.backType,
        }),
      },
      /**
       * Cost center
       */
      {
        path: 'cost-center/list/backType=:backType/targetDate=:targetDate/reportId=:reportId/parentId=:parentId',
        component: CostCenterContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          type: 'list',
          targetDate: match.params.targetDate,
          reportId: match.params.reportId,
          parentId: match.params.parentId,
          backType: match.params.backType,
        }),
      },
      {
        path: 'cost-center/list/backType=:backType/targetDate=:targetDate/reportId=:reportId',
        component: CostCenterContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          type: 'list',
          targetDate: match.params.targetDate,
          reportId: match.params.reportId,
          parentId: match.params.parentId,
          backType: match.params.backType,
        }),
      },
      {
        path: `cost-center/search/backType=:backType/targetDate=:targetDate/reportId=:reportId/keyword=:keyword`,
        component: CostCenterContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          type: 'search',
          keyword: match.params.keyword,
          backType: match.params.backType,
          targetDate: match.params.targetDate,
          reportId: match.params.reportId,
        }),
      },
      /**
       * Job
       */
      {
        path: 'job/list/backType=:backType/targetDate=:targetDate/reportId=:reportId/parentId=:parentId',
        component: JobContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          type: 'list',
          targetDate: match.params.targetDate,
          reportId: match.params.reportId,
          parentId: match.params.parentId,
          backType: match.params.backType,
        }),
      },
      {
        path: 'job/list/backType=:backType/targetDate=:targetDate/reportId=:reportId',
        component: JobContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          type: 'list',
          targetDate: match.params.targetDate,
          reportId: match.params.reportId,
          parentId: match.params.parentId,
          backType: match.params.backType,
        }),
      },
      {
        path: `job/search/backType=:backType/targetDate=:targetDate/reportId=:reportId/keyword=:keyword`,
        component: JobContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          type: 'search',
          keyword: match.params.keyword,
          backType: match.params.backType,
          targetDate: match.params.targetDate,
          reportId: match.params.reportId,
        }),
      },
      /**
       * Vendor
       */
      {
        path: `vendor/search/reportId=:reportId`,
        component: VendorContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          reportId: match.params.reportId,
        }),
      },
      {
        path: 'vendor/detail/:id',
        component: VendorDetailContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          id: match.params.id,
        }),
      },
    ],
  },
];

export default routes;
