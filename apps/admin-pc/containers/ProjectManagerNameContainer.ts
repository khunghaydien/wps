import { connect } from 'react-redux';

import get from 'lodash/get';

import ProjectManagerName from '../components/ProjectManagerName';

const mapStateToProps = (state) => {
  const { owners } = state.editRecord;
  const pmName = get(owners, `0.employeeName`, '');

  return {
    pmName,
  };
};

export default connect(mapStateToProps)(ProjectManagerName);
