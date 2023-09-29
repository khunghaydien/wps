import * as React from 'react';
import { Provider } from 'react-redux';

import styled from 'styled-components';

import { Permission } from '../../domain/models/access-control/Permission';
import { User } from '../../domain/models/User';

import AppActions from './action-dispatchers/App';

import BlockScreen from './containers/BlockScreenContainer';
import Loading from './containers/LoadingContainer';
import Notification from './containers/NotificationContainer';
import App from './containers/TrackSummary';

import configureStore from './store/configureStore';

type TrackSummaryComponentType = React.ComponentType<
  | React.ComponentProps<typeof App.Transfer>
  | React.ComponentProps<typeof App.Approval>
  | React.ComponentProps<typeof App.Request>
  | React.ComponentProps<typeof App.RequestCompact>
>;

type Props = React.ComponentProps<TrackSummaryComponentType> & {
  margin?: string;
  userPermission?: Permission;
  user?: User;
};

const Container = styled.div<{ margin?: string }>`
  position: relative;
  margin: ${({ margin }): string => margin || '0'};
`;

const initialize = (
  Component: TrackSummaryComponentType,
  displayName: string,
  store
): React.ComponentType<Props> => {
  const Com = ({
    userPermission,
    user,
    onSelect,
    ...props
  }: React.ComponentProps<typeof Component> & {
    margin?: string;
    userPermission?: Permission;
    user?: User;
    onSelect?: React.ComponentProps<typeof App.Transfer>['onSelect'];
  }) => {
    React.useEffect(() => {
      const app = AppActions(store.dispatch);
      app.initialize(userPermission, user);
      return app.finalize;
    }, [userPermission, user]);

    return (
      <Provider store={store}>
        <Container {...props}>
          <Loading />
          <Notification />
          <BlockScreen />
          <Component {...props} defaultEmpId={user?.id} onSelect={onSelect} />
        </Container>
      </Provider>
    );
  };
  Com.displayName = displayName;

  return Com;
};

export default {
  Approval: initialize(
    App.Approval,
    'TrackSummary.Approval',
    configureStore({ name: 'TrackSummary.Approval' })
  ),
  Request: initialize(
    App.Request,
    'TrackSummary.Request',
    configureStore({ name: 'TrackSummary.Request' })
  ),
  RequestCompact: initialize(
    App.RequestCompact,
    'TrackSummary.RequestCompact',
    configureStore({ name: 'TrackSummary.RequestCompact' })
  ),
  Transfer: initialize(
    App.Transfer,
    'TrackSummary.Transfer',
    configureStore({ name: 'Transfer ' })
  ),
};
