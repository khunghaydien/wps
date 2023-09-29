import { RouteConfig } from '../../commons/router';

type Component = Promise<{ default: React.ComponentType<any> }>;
type Props = {
  match: { params: any };
};

const TimesheetMonthlyPageContainer = (): Component =>
  import('../containers/pages/attendance/TimesheetMonthlyPageContainer');
const TimesheetDailyPageContainer = (): Component =>
  import('../containers/pages/attendance/TimesheetDailyPageContainer');

const TimeStampPageContainer = (): Component =>
  import('../containers/pages/attendance/TimeStampPageContainer');

const DailyRequestListPageContainer = (): Component =>
  import('../containers/pages/attendance/DailyRequestListPageContainer');

const OvertimeWorkRequestPageContainer = (): Component =>
  import(
    '../containers/pages/attendance/DailyRequestDetails/OvertimeWorkRequestPageContainer'
  );
const EarlyStartWorkRequestPageContainer = (): Component =>
  import(
    '../containers/pages/attendance/DailyRequestDetails/EarlyStartWorkRequestPageContainer'
  );
const LateArrivalRequestPageContainer = (): Component =>
  import(
    '../containers/pages/attendance/DailyRequestDetails/LateArrivalRequestPageContainer'
  );
const EarlyLeaveRequestPageContainer = (): Component =>
  import(
    '../containers/pages/attendance/DailyRequestDetails/EarlyLeaveRequestPageContainer'
  );
const LeaveRequestPageContainer = (): Component =>
  import(
    '../containers/pages/attendance/DailyRequestDetails/LeaveRequestPageContainer'
  );
const DirectRequestPageContainer = (): Component =>
  import(
    '../containers/pages/attendance/DailyRequestDetails/DirectRequestPageContainer'
  );
const AbsenceRequestPageContainer = (): Component =>
  import(
    '../containers/pages/attendance/DailyRequestDetails/AbsenceRequestPageContainer'
  );
const HolidayWorkRequestPageContainer = (): Component =>
  import(
    '../containers/pages/attendance/DailyRequestDetails/HolidayWorkRequestPageContainer'
  );
const PatternRequestPageContainer = (): Component =>
  import(
    '../containers/pages/attendance/DailyRequestDetails/PatternRequestPageContainer'
  );

/*
 * Routes for attendance application
 */
const routes: RouteConfig = [
  {
    path: 'attendance',
    // component: Navigation, // layout
    children: [
      {
        // Timestamp/勤怠打刻
        path: '/timestamp',
        component: TimeStampPageContainer,
        dynamicImport: true,
      },
      {
        // Timesheet monthly/勤務表 月
        path: '/timesheet-monthly/:targetDate',
        component: TimesheetMonthlyPageContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: Props) => ({
          targetDate: match.params.targetDate,
        }),
      },
      {
        // Timesheet monthly/勤務表 月
        path: '/timesheet-monthly',
        component: TimesheetMonthlyPageContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({
          targetDate: '',
        }),
      },
      {
        // Timesheet daily/勤務表 日
        path: '/timesheet-daily/:date',
        component: TimesheetDailyPageContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: Props) => ({
          targetDate: match.params.date,
        }),
      },
      {
        // Timesheet daily/勤務表 日
        path: '/timesheet-daily',
        component: TimesheetDailyPageContainer,
        dynamicImport: true,
        mapParamsToProps: () => ({
          targetDate: '',
        }),
      },
      /**
       * Daily Requests/各種勤怠申請
       */
      {
        // Leave/休暇
        path: '/daily-requests/:targetDate/leave',
        children: [
          {
            path: '/new',
            component: LeaveRequestPageContainer,
            dynamicImport: true,
            mapParamsToProps: ({ match }: Props) => ({
              targetDate: match.params.targetDate,
            }),
          },
          {
            path: '/:id',
            component: LeaveRequestPageContainer,
            dynamicImport: true,
            mapParamsToProps: ({ match }: Props) => ({
              id: match.params.id,
              targetDate: match.params.targetDate,
            }),
          },
        ],
      },
      {
        // Overtime Work/残業
        path: '/daily-requests/:targetDate/overtime-work',
        children: [
          {
            path: '/new',
            component: OvertimeWorkRequestPageContainer,
            dynamicImport: true,
            mapParamsToProps: ({ match }: Props) => ({
              targetDate: match.params.targetDate,
            }),
          },
          {
            path: '/:id',
            component: OvertimeWorkRequestPageContainer,
            dynamicImport: true,
            mapParamsToProps: ({ match }: Props) => ({
              id: match.params.id,
              targetDate: match.params.targetDate,
            }),
          },
        ],
      },
      {
        // Early Start Work/早朝勤務
        path: '/daily-requests/:targetDate/early-start-work',
        children: [
          {
            path: '/new',
            component: EarlyStartWorkRequestPageContainer,
            dynamicImport: true,
            mapParamsToProps: ({ match }: Props) => ({
              targetDate: match.params.targetDate,
            }),
          },
          {
            path: '/:id',
            component: EarlyStartWorkRequestPageContainer,
            dynamicImport: true,
            mapParamsToProps: ({ match }: Props) => ({
              id: match.params.id,
              targetDate: match.params.targetDate,
            }),
          },
        ],
      },
      {
        // Late Arrival/遅刻
        path: '/daily-requests/:targetDate/late-arrival',
        children: [
          {
            path: '/new',
            component: LateArrivalRequestPageContainer,
            dynamicImport: true,
            mapParamsToProps: ({ match }: Props) => ({
              targetDate: match.params.targetDate,
            }),
          },
          {
            path: '/:id',
            component: LateArrivalRequestPageContainer,
            dynamicImport: true,
            mapParamsToProps: ({ match }: Props) => ({
              id: match.params.id,
              targetDate: match.params.targetDate,
            }),
          },
        ],
      },
      {
        // Early Leave/早退
        path: '/daily-requests/:targetDate/early-leave',
        children: [
          {
            path: '/new',
            component: EarlyLeaveRequestPageContainer,
            dynamicImport: true,
            mapParamsToProps: ({ match }: Props) => ({
              targetDate: match.params.targetDate,
            }),
          },
          {
            path: '/:id',
            component: EarlyLeaveRequestPageContainer,
            dynamicImport: true,
            mapParamsToProps: ({ match }: Props) => ({
              id: match.params.id,
              targetDate: match.params.targetDate,
            }),
          },
        ],
      },
      {
        // Direct/直行直帰
        path: '/daily-requests/:targetDate/direct',
        children: [
          {
            path: '/new',
            component: DirectRequestPageContainer,
            dynamicImport: true,
            mapParamsToProps: ({ match }: Props) => ({
              targetDate: match.params.targetDate,
            }),
          },
          {
            path: '/:id',
            component: DirectRequestPageContainer,
            dynamicImport: true,
            mapParamsToProps: ({ match }: Props) => ({
              id: match.params.id,
              targetDate: match.params.targetDate,
            }),
          },
        ],
      },
      {
        // Absence/欠勤
        path: '/daily-requests/:targetDate/absence',
        children: [
          {
            path: '/new',
            component: AbsenceRequestPageContainer,
            dynamicImport: true,
            mapParamsToProps: ({ match }: Props) => ({
              targetDate: match.params.targetDate,
            }),
          },
          {
            path: '/:id',
            component: AbsenceRequestPageContainer,
            dynamicImport: true,
            mapParamsToProps: ({ match }: Props) => ({
              id: match.params.id,
              targetDate: match.params.targetDate,
            }),
          },
        ],
      },
      {
        // Holiday Work/休日出勤
        path: '/daily-requests/:targetDate/holiday-work',
        children: [
          {
            path: '/new',
            component: HolidayWorkRequestPageContainer,
            dynamicImport: true,
            mapParamsToProps: ({ match }: Props) => ({
              targetDate: match.params.targetDate,
            }),
          },
          {
            path: '/:id',
            component: HolidayWorkRequestPageContainer,
            dynamicImport: true,
            mapParamsToProps: ({ match }: Props) => ({
              id: match.params.id,
              targetDate: match.params.targetDate,
            }),
          },
        ],
      },
      {
        // Pattern/勤務時間変更申請
        path: '/daily-requests/:targetDate/pattern',
        children: [
          {
            path: '/new',
            component: PatternRequestPageContainer,
            dynamicImport: true,
            mapParamsToProps: ({ match }: Props) => ({
              targetDate: match.params.targetDate,
            }),
          },
          {
            path: '/:id',
            component: PatternRequestPageContainer,
            dynamicImport: true,
            mapParamsToProps: ({ match }: Props) => ({
              id: match.params.id,
              targetDate: match.params.targetDate,
            }),
          },
        ],
      },
      {
        // A list page of Daily Request/一覧
        path: '/daily-requests/:targetDate',
        component: DailyRequestListPageContainer,
        dynamicImport: true,
        mapParamsToProps: ({ match }: Props) => ({
          targetDate: match.params.targetDate,
        }),
      },
    ],
  },
];

export default routes;
