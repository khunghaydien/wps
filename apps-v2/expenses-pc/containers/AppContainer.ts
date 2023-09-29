import { connect } from 'react-redux';

import { initialize } from '../action-dispatchers/app';

import App from '../components';

const mapDispatchToProps = {
  initialize,
};

export default connect(null, mapDispatchToProps)(App) as React.ComponentType<
  Record<string, any>
>;
