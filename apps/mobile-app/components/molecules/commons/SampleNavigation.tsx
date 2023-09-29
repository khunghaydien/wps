import * as React from 'react';

import NavLink from '../../atoms/NavLink';

import './SampleNavigation.scss';

const ROOT = 'mobile-app-sample-molecules-navigation';

const Navigation = (props: any) => (
  <div key="nav">
    <ul className={ROOT}>
      <NavLink to="/sample/attendance">Attendance</NavLink>
      <NavLink to="/sample/approval/blue">Approval</NavLink>
      <NavLink to="/sample/expense/green">Expense</NavLink>
    </ul>
    {props.children}
  </div>
);

export default Navigation;
