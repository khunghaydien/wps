import { connect } from 'react-redux';

import App from '../components/App';

const mapStateToProps = (state) => ({
  objList: state.entities.objectList,
  isDetailRecordPage: state.ui.recordDetail.isDetailPage,
  isAccessible: state.ui.access,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App) as React.ComponentType<Record<string, any>>;
