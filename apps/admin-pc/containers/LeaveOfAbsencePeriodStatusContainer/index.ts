import { connect } from 'react-redux';

import { selectors as selectionUISelectors } from '../../modules/adminCommon/employeeSelection/ui/selection';

import { Props as OwnProps } from '../../components/Admin/ContentsSelector';
import LeaveOfAbsencePeriodStatus, {
  Props,
} from '../../presentational-components/LeaveOfAbsencePeriodStatus';

const mapStateToProps = (state) => ({
  isDetailVisible: selectionUISelectors.selectSelectedEmployee(state),
});

export default connect(mapStateToProps)(
  LeaveOfAbsencePeriodStatus
) as React.ComponentType<Props & OwnProps> as React.ComponentType<OwnProps>;
