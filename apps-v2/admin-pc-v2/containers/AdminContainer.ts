import { connect } from 'react-redux';

import companySettings from '@admin-pc-v2/constants/Setting/companySettings';
import orgSettings from '@admin-pc-v2/constants/Setting/orgSettings';

import {
  mapDispatchToProps,
  mapStateToProps,
} from '@admin-pc/containers/AdminContainer';

import Admin from '@admin-pc-v2/components/Admin';

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  companySettings,
  orgSettings,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Admin);
