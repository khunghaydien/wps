import { connect } from 'react-redux';

import App from '../components/App';

const mapStateToProps = (state) => ({
  done: state.app.done,
  isSucceeded: state.app.isSucceeded || null,
  error: state.app.error || null,
});

export default connect(mapStateToProps)(App);
