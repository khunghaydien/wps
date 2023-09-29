import { RouteComponentProps } from 'react-router';

import { RouteConfig } from '../../commons/router';
import Navigation from '../components/molecules/commons/SampleNavigation';

import SamplePageContainer from '../containers/pages/sample/SamplePageContainer';

import PageTransition from '../components/atoms/animations/PageTransition';
import SamplePage from '../components/pages/sample/SamplePage';

/*
 * [route]                [react component]
 * sample/approval/:color SamplePage
 * sample/attendance      SamplePageContainer
 * sample/expence/:color  SamplaPage
 */
const routes: RouteConfig = [
  {
    path: 'sample',
    transition: PageTransition, // animation on page transition
    component: Navigation, // layout
    children: [
      {
        path: 'approval/:color',
        component: SamplePage,

        /*
         * URLパラメーターをpropsへマップします。
         * Map URL parameter to Props.
         */
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          color: match.params.color,
          title: 'approval',
        }),
      },
      {
        path: 'attendance',
        component: SamplePageContainer,
        mapParamsToProps: () => ({
          color: 'red',
          title: 'attendance',
        }),
      },
      {
        path: 'expense/:color',
        component: SamplePage,
        mapParamsToProps: ({ match }: RouteComponentProps<any>) => ({
          color: match.params.color,
          title: 'expense',
        }),
      },
    ],
  },
];

export default routes;
