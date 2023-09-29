import { connect } from 'react-redux';

import { State } from '../../modules';

import AttDailyProcessListPane from '../../components/attendance/AttDailyProcessListPane';

type Props = AttDailyProcessListPane['props'];

const mapStateToProps = (state: State): Props => {
  return {
    isExpanded: state.ui.att.isExpanded,
  };
};

export default connect(mapStateToProps)(
  AttDailyProcessListPane
) as React.ComponentType<Record<string, any>>;
