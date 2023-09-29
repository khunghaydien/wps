import * as React from 'react';
import { Link } from 'react-router-dom';

import './NavLink.scss';

const ROOT = 'mobile-app-sample-atoms-nav-link';

const NavLink = (props: any) => (
  <li className={ROOT}>
    {/* eslint-disable jsx-a11y/anchor-has-content */}
    <Link {...props} style={{ color: 'inherit' }} />
    {/* eslint-enable jsx-a11y/anchor-has-content */}
  </li>
);

export default NavLink;
