import { connect } from 'react-redux';

import {
  mapDispatchToProps,
  mapStateToProps,
} from '@admin-pc/containers/ContentsSelectorContainer';

import ContentsSelector from '@admin-pc-v2/components/Admin/ContentsSelector';

export default connect(mapStateToProps, mapDispatchToProps)(ContentsSelector);
