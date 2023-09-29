import { RouteConfig } from '../commons/router';

import { default as approvalRoutes } from './routes/approvalRoute';
import { default as attendanceRoutes } from './routes/attendanceRoutes';
import { default as expenseRoutes } from './routes/expenseRoute';
import { default as requestRoutes } from './routes/requestRoutes';
import { default as sampleRoutes } from './routes/sampleRoutes';
import { default as trackingRoutes } from './routes/trackingRoutes';

const routes: RouteConfig = [
  {
    path: '/',

    /*
     * 新しいサブルートをを追加する
     * children: [
     *   ...subroutes,
     *   ...sampleRoutes,
     *  ]
     *
     * Add new sub routes:
     * children: [
     *   ...subroutes,
     *   ...sampleRoutes,
     *  ]
     */
    children: [
      ...attendanceRoutes,
      ...expenseRoutes,
      ...approvalRoutes,
      ...requestRoutes,
      ...trackingRoutes,
      ...sampleRoutes,
    ],
  },
];

export default routes;
