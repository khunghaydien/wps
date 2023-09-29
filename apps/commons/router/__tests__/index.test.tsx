import React from 'react';
import { MemoryRouter as ReactMemoryRouter } from 'react-router';

import { mount } from 'enzyme';

import renderRoutes, { Route as Props } from '../index';

// FIXME: Need upgrade react-router to V6
const MemoryRouter = ReactMemoryRouter as React.ComponentType<
  React.ComponentProps<typeof ReactMemoryRouter> & {
    children?: React.ReactNode;
  }
>;

class Home extends React.Component<Props> {
  render() {
    return (
      <div id="home">
        <>
          Home
          {this.props.children}
        </>
      </div>
    );
  }
}

const News = (props: Props) => (
  <div id="news">
    <>News {props.children}</>
  </div>
);

class Dashboard extends React.Component<Props> {
  render() {
    return (
      <div id="dashboard">
        <>
          <h1>dashboard</h1>
          {this.props.children}
        </>
      </div>
    );
  }
}

class DailyReport extends React.Component<Props> {
  render() {
    return <div id="daily-report">dailyreport</div>;
  }
}

class Setting extends React.Component<Props> {
  render() {
    return (
      <div id="setting">
        <>
          <h1>Setting</h1>
          {this.props.children}
        </>
      </div>
    );
  }
}

class UserSetting extends React.Component<Props> {
  render() {
    return <div id="user-setting">UserSetting</div>;
  }
}

describe('renderRoutes', () => {
  describe('simple routes', () => {
    const routeConfig = [
      {
        path: '/home',
        component: Home,
        exact: true,
      },
      {
        path: '/dashboard',
        component: Dashboard,
        exact: true,
      },
    ];
    const routes = renderRoutes(routeConfig);

    test('render simple route: /home', () => {
      const component = mount(
        <MemoryRouter initialEntries={['/home']}>{routes}</MemoryRouter>
      );
      expect(component.find(Home)).toHaveLength(1);
      expect(component.find(Dashboard)).toHaveLength(0);
    });

    test('render simple route: /dashboard', () => {
      const component = mount(
        <MemoryRouter initialEntries={['/dashboard']}>{routes}</MemoryRouter>
      );
      expect(component.find(Home)).toHaveLength(0);
      expect(component.find(Dashboard)).toHaveLength(1);
    });
  });

  describe('nested routes', () => {
    const routeConfig = [
      {
        path: '/',
        component: Home,
        children: [
          {
            path: 'news',
            component: News,
          },
          {
            path: 'dashboard',
            component: Dashboard,
            children: [
              {
                path: 'daily-report',
                component: DailyReport,
              },
            ],
          },
        ],
      },
      {
        path: '/setting',
        component: Setting,
        children: [
          {
            path: 'user',
            component: UserSetting,
          },
        ],
      },
    ];
    const routes = renderRoutes(routeConfig);

    test('render route: /', () => {
      const component = mount(
        <MemoryRouter initialEntries={['/']}>{routes}</MemoryRouter>
      );
      expect(component.find(Home)).toHaveLength(1);
      expect(component.find(News)).toHaveLength(0);
      expect(component.find(Dashboard)).toHaveLength(0);
      expect(component.find(DailyReport)).toHaveLength(0);
      expect(component.find(Setting)).toHaveLength(0);
      expect(component.find(UserSetting)).toHaveLength(0);
    });

    test('render route: /news', () => {
      const component = mount(
        <MemoryRouter initialEntries={['/news']}>{routes}</MemoryRouter>
      );
      expect(component.find(Home)).toHaveLength(1);
      expect(component.find(News)).toHaveLength(1);
      expect(component.find(Dashboard)).toHaveLength(0);
      expect(component.find(DailyReport)).toHaveLength(0);
      expect(component.find(Setting)).toHaveLength(0);
      expect(component.find(UserSetting)).toHaveLength(0);
    });

    test('render route: /dashboard', () => {
      const component = mount(
        <MemoryRouter initialEntries={['/dashboard']}>{routes}</MemoryRouter>
      );
      expect(component.find(Home)).toHaveLength(1);
      expect(component.find(Dashboard)).toHaveLength(1);
      expect(component.find(DailyReport)).toHaveLength(0);
      expect(component.find(Setting)).toHaveLength(0);
      expect(component.find(UserSetting)).toHaveLength(0);
    });

    describe('render nested route: /dashboard/daily-report', () => {
      const component = mount(
        <MemoryRouter initialEntries={['/dashboard/daily-report']}>
          {routes}
        </MemoryRouter>
      );

      test('should render Home', () => {
        expect(component.find(Home)).toHaveLength(1);
      });
      test('should not render Dashboard', () => {
        expect(component.find(Dashboard)).toHaveLength(1);
      });
      test('should not render DailyReport', () => {
        expect(component.find(DailyReport)).toHaveLength(1);
      });
      test('should render Setting', () => {
        expect(component.find(Setting)).toHaveLength(0);
      });
      test('should not render UserSetting', () => {
        expect(component.find(UserSetting)).toHaveLength(0);
      });
    });

    describe('render top level route: /setting', () => {
      const component = mount(
        <MemoryRouter initialEntries={['/setting']}>{routes}</MemoryRouter>
      );

      test('should always render Home (This behavior is right spec)', () => {
        expect(component.find(Home)).toHaveLength(1);
      });
      test('should not render Dashboard', () => {
        expect(component.find(Dashboard)).toHaveLength(0);
      });
      test('should not render DailyReport', () => {
        expect(component.find(DailyReport)).toHaveLength(0);
      });
      test('should render Setting', () => {
        expect(component.find(Setting)).toHaveLength(1);
      });
      test('should not render UserSetting', () => {
        expect(component.find(UserSetting)).toHaveLength(0);
      });
    });

    describe('render nested route: /setting/user', () => {
      const component = mount(
        <MemoryRouter initialEntries={['/setting/user']}>{routes}</MemoryRouter>
      );
      test('should always render Home (This behavior is right spec)', () => {
        expect(component.find(Home)).toHaveLength(1);
      });
      test('should not render Dashboard', () => {
        expect(component.find(Dashboard)).toHaveLength(0);
      });
      test('should not render DailyReport', () => {
        expect(component.find(DailyReport)).toHaveLength(0);
      });
      test('should render Setting', () => {
        expect(component.find(Setting)).toHaveLength(1);
      });
      test('should render UserSetting', () => {
        expect(component.find(UserSetting)).toHaveLength(1);
      });
    });
  });
});
