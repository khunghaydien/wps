import { RouteComponentProps } from 'react-router';

import { RouteConfig } from '../../commons/router';

import Layout from '../containers/organisms/expense/LayoutContainer';

import PageTransition from '../components/atoms/animations/PageTransition';

export const LOCATION_STATE = {
  CANCEL_EDIT: 'cancelEdit',
};

type Component = Promise<{ default: React.ComponentType<any> }>;

const ExpenseTypeContainer = (): Component =>
  import('../containers/pages/expense/ExpenseTypeContainer');
const CostCenterContainer = (): Component =>
  import('../containers/pages/expense/CostCenterContainer');
const JobContainer = (): Component =>
  import('../containers/pages/expense/JobContainer');
const VendorContainer = (): Component =>
  import('../containers/pages/expense/VendorContainer');
const CustomRequestContainer = (): Component =>
  import('../containers/pages/expense/CustomRequestContainer');
const CustomExtendedItemContainer = (): Component =>
  import('../containers/pages/expense/CustomExtendedItemContainer');
const FilterDetailContainer = (): Component =>
  import('../containers/pages/expense/FilterDetailContainer');
const VendorDetailContainer = (): Component =>
  import('../containers/pages/approval/expense/VendorDetailContainer');

// record pages
const RecordNewContainer = (): Component =>
  import('../containers/pages/expense/RecordNewContainer');
const RecordNewTranjitJorudanJP = (): Component =>
  import('../components/pages/expense/Record/New/TranjitJorudanJP');
const ReportListContainer = (): Component =>
  import('../containers/pages/expense/ReportListContainer');
const RecordListItemContainer = (): Component =>
  import('../containers/pages/expense/RecordListItemContainer');

// route pages
const RouteFormContainer = (): Component =>
  import('../containers/pages/expense/RouteFormContainer');
const RouteListContainer = (): Component =>
  import('../containers/pages/expense/RouteListContainer');
const RouteListItemContainer = (): Component =>
  import('../containers/pages/expense/RouteListItemContainer');

// report pages
const ReportDetailContainer = (): Component =>
  import('../containers/pages/expense/ReportDetailContainer');
const ReportRecallContainer = (): Component =>
  import('../containers/pages/expense/ReportRecallContainer');
const ReportSubmitContainer = (): Component =>
  import('../containers/pages/expense/ReportSubmitContainer');
const ReportEditContainer = (): Component =>
  import('../containers/pages/expense/ReportEditContainer');

const ReceiptUploadContainer = (): Component =>
  import('../containers/pages/expense/ReceiptUploadContainer');

const ReceiptLibraryContainer = (): Component =>
  import('../containers/pages/expense/ReceiptLibraryContainer');

const OCRDetailContainer = (): Component =>
  import('../containers/pages/expense/OCRDetailContainer');

const ICCardListContainer = (): Component =>
  import('../containers/pages/expense/ICCardListContainer');

const ICTransactionsContainer = (): Component =>
  import('../containers/pages/expense/ICTransactionsContainer');

const CCTransactionsContainer = (): Component =>
  import('../containers/pages/expense/CCTransactionsContainer');

const convertUndefined = (value: string) => {
  return value === 'undefined' ? undefined : value;
};

/*
 * [route]                [react component]
 * sample/approval/:color ExpensePage
 * sample/attendance      ExpensePageContainer
 * sample/expence/:color  SamplaPage
 */
const routes: RouteConfig = [
  {
    path: 'expense',
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
      /**
       * Custom Request
       */
      {
        path: 'custom-request/list/reportId=:reportId',
        component: CustomRequestContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          reportId: match.params.reportId,
        }),
      },
      {
        path: 'custom-request/advance-search/detail',
        component: FilterDetailContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({}),
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
      {
        path: 'report/record/new/general',
        component: RecordNewContainer,
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
        path: 'record/new/transitjorudanjp',
        component: RecordNewTranjitJorudanJP,
        dynamicImport: true,
        mapParamsToProps: () => ({}),
      },
      {
        path: 'record/list/item/:recordno',
        component: RecordListItemContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          recordNo: match.params.recordno,
        }),
      },
      {
        path: 'receipt/upload',
        component: ReceiptUploadContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({}),
      },
      {
        path: 'receipt-library/list/ocr',
        component: ReceiptLibraryContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({
          withOCR: true,
        }),
      },
      {
        path: 'receipt-library/ocr-confirm',
        component: OCRDetailContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({}),
      },
      {
        path: 'receipt-library/list/backType=:backType',
        component: ReceiptLibraryContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          backType: match.params.backType,
        }),
      },
      /**
       * IC Card
       */
      {
        path: 'ic-card/list/:reportId?/:recordId?',
        component: ICCardListContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          reportId: convertUndefined(match.params.reportId),
          recordId: convertUndefined(match.params.recordId),
        }),
      },
      {
        path: 'ic-card/transactions/:reportId?/:recordId?',
        component: ICTransactionsContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          reportId: convertUndefined(match.params.reportId),
          recordId: convertUndefined(match.params.recordId),
        }),
      },
      /**
       * Credit Card
       */
      {
        path: 'credit-card/transactions/:reportId?',
        component: CCTransactionsContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          reportId: match.params.reportId,
        }),
      },

      /**
       * Route
       */
      // Jorudan Record
      // Create/Edit Jorudan Route Flow //
      // route options form
      {
        path: 'route/new',
        component: RouteFormContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({}),
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
      }, // new jorudan record
      {
        path: 'report/route/list/item/:routeno',
        component: RouteListItemContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          type: 'add',
          routeNo: match.params.routeno,
        }),
      }, // search result list
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
        path: 'route/list',
        component: RouteListContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({}),
      },
      {
        path: 'report/route/list',
        component: RouteListContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({
          type: 'add',
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
        path: 'report/detail/:id/:requestId?',
        component: ReportDetailContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          reportId: match.params.id,
          paramRequestId: match.params.requestId,
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
        path: 'report/new',
        component: ReportEditContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({}),
      },
    ],
  },
];

export default routes;
