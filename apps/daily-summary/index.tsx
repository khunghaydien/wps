import * as React from 'react';
import { Provider } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import styled from 'styled-components';

import { CoreProvider } from '../core';

import { Permission } from '../domain/models/access-control/Permission';
import { User } from '../domain/models/User';

import AppActions from './action-dispatchers/App';
import { openDailySummary } from './action-dispatchers/DailySummary';

import BlockScreen from './containers/BlockScreenContainer';
import App from './containers/DailySummaryDialogContainer';
import Notification from './containers/NotificationContainer';

import { CloseEvent as _CloseEvent, CloseEventHandler } from './events';
import configureStore from './store/configureStore';

export type CloseEvent = _CloseEvent;

type Props = {
  'data-testid'?: string;
  margin?: string;
  userPermission: Permission;
  date?: string;
  user?: User;
  onClose?: CloseEventHandler;
};

const Container = styled.div<{ margin?: string }>`
  margin: ${({ margin }) => margin || '0'};
`;

const configuredStore = configureStore();

const initialize = (
  Component: React.ComponentType<any>,
  displayName: string
) => {
  const Com = ({
    'data-testid': testId,
    date = '2018-12-16',
    user,
    userPermission,
    ...props
  }: Props) => {
    React.useEffect(() => {
      const app = AppActions(configuredStore.dispatch);
      app.initialize(user, userPermission);
      if (user) {
        const targetEmployeeId = user.isDelegated ? user.id : undefined;
        (configuredStore.dispatch as ThunkDispatch<any, any, any>)(
          openDailySummary(date, targetEmployeeId)
        );
      } else {
        (configuredStore.dispatch as ThunkDispatch<any, any, any>)(
          openDailySummary(date)
        );
      }
      return () => {
        app.finalize();
      };
    }, [date, user, userPermission]);

    return (
      <Provider store={configuredStore as any}>
        <CoreProvider>
          <Container key="Dialog" {...props} data-testid={testId}>
            <Component {...props} />
          </Container>
          <BlockScreen />
          <Notification />
        </CoreProvider>
      </Provider>
    );
  };
  Com.displayName = displayName;

  return Com;
};

export default initialize(App, 'DailySummary');
