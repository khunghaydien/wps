import * as React from 'react';
import { BrowserRouter, Redirect } from 'react-router-dom';

import renderRoutes from '../commons/router';
import LoadingPageContainer from './containers/organisms/commons/LoadingPageContainer';
import SystemAlert from './containers/organisms/commons/SystemAlertContainer';
import SystemConfirm from './containers/organisms/commons/SystemConfirmContainer';
import SystemError from './containers/organisms/commons/SystemErrorContainer';
import Toast from './containers/organisms/commons/ToastContainer';

import routes from './routes';

const Router = BrowserRouter as unknown as React.ComponentType<
  React.ComponentProps<typeof BrowserRouter> & {
    children: React.ReactNode;
  }
>;

type Props = {
  pathname?: string;
  search?: string;
};

const renderLoaders = () => (
  <React.Fragment>
    <LoadingPageContainer />
  </React.Fragment>
);

const renderSystemError = () => <SystemError />;

const renderSystemAlert = () => <SystemAlert />;

const renderSystemConfirm = () => <SystemConfirm />;

const renderToast = () => <Toast />;

export default ({ pathname, search }: Props) => {
  const app = renderRoutes(routes);
  return (
    <React.Fragment>
      {renderToast()}
      {renderSystemError()}
      {renderSystemAlert()}
      {renderSystemConfirm()}
      {renderLoaders()}
      <Router
        basename={
          process.env.NODE_ENV === 'production' ? '/apex' : '/mobile-app'
        }
      >
        <React.Fragment>
          {pathname ? (
            <Redirect
              to={{
                pathname,
                search,
              }}
            />
          ) : null}
          {app}
        </React.Fragment>
      </Router>
    </React.Fragment>
  );
};
