import { connect } from 'react-redux';

import { Props as OwnProps } from '../../components/Admin/ContentsSelector';
import ManagedLeaveManagement, {
  Props,
} from '../../presentational-components/ManagedLeaveManagement';

const mapStateToProps = (state) => ({
  isDetailVisible:
    state.managedLeaveManagement.listPane.ui.employeeList.selectedEmployeeId !==
    null,
});

export default connect(mapStateToProps)(
  ManagedLeaveManagement
) as React.ComponentType<Props & OwnProps> as React.ComponentType<OwnProps>;
