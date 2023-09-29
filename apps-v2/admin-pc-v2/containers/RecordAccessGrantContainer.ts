import { connect } from 'react-redux';

import RecordAccessGrant from '@admin-pc-v2/presentational-components/RecordAccessGrant';

const mapStateToProps = (state) => {
  const editRecord = state.editRecord;
  return { editRecord };
};

// @ts-ignore
export default connect(mapStateToProps)(RecordAccessGrant);
