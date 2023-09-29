import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Route } from 'react-router-dom';

import onDevelopment from '../../commons/config/development';
import CoreProvider from '../../core/contexts';

import DailySummary from '../../daily-summary';
import OpenAutoHoursAllocateDictDialogButton from '../AutoHoursAllocateDictDialog/OpenAutoHoursAllocateDictDialogButton';
import { OpenAutoHoursAllocateResultDialogButton } from '../AutoHoursAllocateResultDialog';
import TrackSummary from '../TrackSummary';

import './index.scss';

const Router = BrowserRouter as React.ComponentType<
  React.ComponentProps<typeof BrowserRouter> & {
    children: React.ReactNode;
  }
>;

const ROOT = 'subapps-debug';

const TODAY_JP = new Date(new Date().setHours(new Date().getHours() + 9))
  .toISOString()
  .slice(0, 10);

const SubAppMenu = () => (
  <>
    {/*
      Add Link to sub app
      <Link className="menu__item" to="path to sub app">
        Sub App Name
      </Link>
    */}

    <section className={`${ROOT}__menu__section`}>
      <div className={`${ROOT}__menu__items`}>
        <Link className={`${ROOT}__menu__item`} to="/daily-summary">
          DailySummary
        </Link>
      </div>

      <div className={`${ROOT}__menu__items`}>
        <Link className={`${ROOT}__menu__item`} to="/track-summary/approval">
          TrackSummary.Approval
        </Link>
        <Link className={`${ROOT}__menu__item`} to="/track-summary/request">
          TrackSummary.Request
        </Link>
        <Link className={`${ROOT}__menu__item`} to="/track-summary/charge">
          TrackSummary.Transfer
        </Link>
      </div>

      <div className={`${ROOT}__menu__items`}>
        <OpenAutoHoursAllocateResultDialogButton
          targetDate={TODAY_JP}
          empId={undefined}
          timeOfAttendance={480}
          timeOfExternalTaskTime={480}
          userPermission={{} as any}
          onApply={(...args) => {
            console.log(args);
          }}
        />
      </div>

      <div className={`${ROOT}__menu__items`}>
        <OpenAutoHoursAllocateDictDialogButton
          targetDate={TODAY_JP}
          empId={undefined}
          userPermission={{} as any}
        />
      </div>
    </section>
  </>
);

const Index = () => (
  <CoreProvider>
    <Router basename="/subapps-debug">
      <div className={ROOT}>
        <section>
          <a className={`${ROOT}__menu__item`} href="/index.html">
            Top
          </a>
        </section>

        <h1 className="title">Sub Apps - Time Tracking</h1>
        <div className={`${ROOT}__section`}>
          <div className={`${ROOT}__menu`}>
            <Route path="/" component={SubAppMenu} />
          </div>
          <div className={`${ROOT}__content`}>
            {/*
              Write the following code to add your sub app to routes.
              <Rotue exact path="..." component={...} />
            */}

            <Route exact path="/daily-summary" component={DailySummary} />

            <Route
              exact
              path="/track-summary/approval"
              component={TrackSummary.Approval}
            />
            <Route
              exact
              path="/track-summary/request"
              component={TrackSummary.Request}
            />
            <Route
              exact
              path="/track-summary/charge"
              component={() => (
                <TrackSummary.Transfer onSelect={(task) => console.log(task)} />
              )}
            />
          </div>
        </div>
      </div>
    </Router>
  </CoreProvider>
);

function renderApp(Component): void {
  const container = document.getElementById('container');
  if (container) {
    onDevelopment(() => {
      ReactDOM.render(<Component />, container);
    });
  }
}

export const startApp = () => renderApp(Index);
