import * as React from 'react';

import Component from '@attendance/timesheet-pc-importer/components/AppHeader';

import OwnerEmployeeContainer from './OwnerEmployeeContainer';

const HeaderContainer = () => (
  <Component
    {...{
      OwnerEmployeeContainer,
    }}
  />
);

export default HeaderContainer;
