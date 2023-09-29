import { connect } from 'react-redux';

import { State } from '../../modules';

import AttMonthlyFixProcessListPane from '../../components/attendance/AttMonthlyFixProcessListPane';

type Props = AttMonthlyFixProcessListPane['props'];

const mapStateToProps = (state: State): Props => {
  return {
    isExpanded: state.ui.attMonthly.isExpanded,
  };
};

export default connect(mapStateToProps)(
  AttMonthlyFixProcessListPane
) as React.ComponentType<Record<string, any>>;
