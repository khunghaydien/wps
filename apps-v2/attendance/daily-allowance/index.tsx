import * as React from 'react';
import { Provider } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import styled from 'styled-components';

import { CoreProvider } from '../../core';

import { Permission } from '../../domain/models/access-control/Permission';
import { User } from '../../domain/models/User';
import { CloseEvent as _CloseEvent, CloseEventHandler } from './models/events';

import AppActions from './action-dispatchers/App';
import { loadDailyAllowanceAllRecords } from './action-dispatchers/DailyAllowance';

import BlockScreen from './containers/BlockScreenContainer';
import App from './containers/DailyAllowanceDialogContainer';
import Notification from './containers/NotificationContainer';

import configureStore from './store/configureStore';

export type CloseEvent = _CloseEvent;

type Props = {
  'data-testid'?: string;
  margin?: string;
  userPermission: Permission;
  date?: string;
  isLocked: boolean;
  user?: User;
  dailyAllowanceList?: [];
  availableAllowanceCount: number;
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
    user,
    dailyAllowanceList,
    userPermission,
    ...props
  }: Props) => {
    React.useEffect(() => {
      const app = AppActions(configuredStore.dispatch);
      app.initialize(user, userPermission);
      if (user) {
        (configuredStore.dispatch as ThunkDispatch<any, any, any>)(
          loadDailyAllowanceAllRecords(props.date, dailyAllowanceList, user)
        );
      } else {
        (configuredStore.dispatch as ThunkDispatch<any, any, any>)(
          loadDailyAllowanceAllRecords(props.date, dailyAllowanceList)
        );
      }
      return () => {
        app.finalize();
      };
    }, [props.date, user, userPermission]);

    return (
      <Provider store={configuredStore as any}>
        <CoreProvider>
          <Container {...props} data-testid={testId}>
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

export default initialize(App, 'DailyAllowance');
