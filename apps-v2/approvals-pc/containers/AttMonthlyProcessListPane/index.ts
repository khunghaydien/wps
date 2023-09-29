import { connect } from 'react-redux';

import { State } from '../../modules';

import AttMonthlyProcessListPane from '../../components/AttMonthlyProcessListPane';

type Props = AttMonthlyProcessListPane['props'];

const mapStateToProps = (state: State): Props => {
  return {
    isExpanded: state.ui.attMonthly.isExpanded,
  };
};

export default connect(mapStateToProps)(
  AttMonthlyProcessListPane
) as React.ComponentType<Record<string, any>>;
