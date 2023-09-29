import { connect } from 'react-redux';

import { Props as OwnProps } from '../../components/Admin/ContentsSelector';
import AnnualPaidLeaveManagement, {
  Props,
} from '../../presentational-components/AnnualPaidLeaveManagement';

const mapStateToProps = (state) => ({
  isDetailVisible:
    state.annualPaidLeaveManagement.listPane.ui.employeeList
      .selectedEmployeeId !== null,
});

export default connect(mapStateToProps)(
  AnnualPaidLeaveManagement
) as React.ComponentType<Props & OwnProps> as React.ComponentType<OwnProps>;
