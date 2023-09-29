import * as React from 'react';
import { Link } from 'react-router-dom';

import './NavBox.scss';

const ROOT = 'mobile-app-sample-atoms-nav-box';

const NavBox = (props: any) => (
  <Link to={props.to} className={ROOT}>
    {props.children}
  </Link>
);

export default NavBox;
