import { connect } from 'react-redux';

import ProxyIndicator from '../components/ProxyIndicator';

const mapStateToProps = (state) => ({
  employeePhotoUrl: state.common.proxyEmployeeInfo.employeePhotoUrl,
  employeeName: state.common.proxyEmployeeInfo.employeeName,
  standalone: state.common.standaloneMode.enabled,
});

export default connect(mapStateToProps)(ProxyIndicator);
