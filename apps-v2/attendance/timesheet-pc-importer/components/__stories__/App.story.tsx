import * as React from 'react';

import Component from '../App';
import { Default as ContentContainer } from '../AppContent/__stories__/Container';
import { Default as HeaderContainer } from '../AppHeader/__stories__/Container';

const GlobalContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => <div>{children}</div>;

export default {
  title: 'attendance/timesheet-pc-importer/App',
};

export const Default = () => (
  <Component
    GlobalContainer={GlobalContainer}
    HeaderContainer={HeaderContainer}
    ContentContainer={ContentContainer}
    ProxyEmployeeSelectDialogContainer={() => null}
    NotificationContainer={() => null}
  />
);
