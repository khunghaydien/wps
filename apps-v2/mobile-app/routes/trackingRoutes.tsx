import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import isNil from 'lodash/isNil';
import queryString from 'query-string';

import { RouteConfig } from '../../commons/router';
import DateUtil from '../../commons/utils/DateUtil';

import Layout from '../containers/organisms/tracking/Layout';

import PageTransition from '../components/atoms/animations/PageTransition';

type Component = Promise<{ default: React.ComponentType<any> }>;

const DailyTaskPage = (): Component =>
  import('../containers/pages/tracking/DailyTaskPageContainer');
const DailyTaskJobPage = (): Component =>
  import('../containers/pages/tracking/DailyTaskJobPageContainer');
const JobSelectPage = (): Component =>
  import('../containers/pages/tracking/JobSelectPageContainer');

/*
 * Routes for attendance application
 */
const routes: RouteConfig = [
  {
    path: 'tracking',
    transition: PageTransition, // animation on page transition
    component: Layout,
    children: [
      {
        //  Tracking monthly/工数 月
        path: '/tracking-montly/:yearMonth',
        component: (() => (
          <div>/tracking-montly/:yearMonth</div>
        )) as React.ComponentType<any>, // eslint-disable-next-line no-undef
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          yearMonth: match.params.yearMonth,
        }),
      },
      {
        //  Tracking monthly/工数 月
        path: '/tracking-montly',
        component: (() => (
          <div>/tracking-montly</div>
        )) as React.ComponentType<any>, // eslint-disable-next-line no-undef
        mapParamsToProps: () => ({
          // yearMonth: TODO Today's monthly
        }),
      },
      {
        //  Tracking daily/工数/ジョブ追加
        path: '/tracking-daily/:date/task',
        component: DailyTaskJobPage,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          date: match.params.date,
        }),
      },
      {
        //  Tracking daily/工数/ジョブ選択
        path: '/tracking-daily/:date/jobs/:parentJobId?',
        component: JobSelectPage,
        dynamicImport: true,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          date: match.params.date,
          parentJobId: match.params.parentJobId,
        }),
      },
      {
        //  Tracking daily/工数 日
        path: '/tracking-daily/:date',
        component: DailyTaskPage,
        dynamicImport: true,
        mapParamsToProps: ({ match, location }: RouteComponentProps<any>) => ({
          date: match.params.date,
          willFetchData: isNil(queryString.parse(location.search).mode),
        }),
      },
      {
        //  Tracking daily/工数 日
        path: '/tracking-daily',
        component: DailyTaskPage,
        dynamicImport: true,
        mapParamsToProps: ({ location }) => ({
          date: DateUtil.getToday(),
          willFetchData: isNil(queryString.parse(location.search).mode),
        }),
      },
    ],
  },
];

export default routes;
