import { connect } from 'react-redux';

import { selectors as selectionUISelectors } from '../../modules/adminCommon/employeeSelection/ui/selection';

import { Props as OwnProps } from '../../components/Admin/ContentsSelector';
import ShortTimeWorkPeriodStatus, {
  Props,
} from '../../presentational-components/ShortTimeWorkPeriodStatus';

const mapStateToProps = (state) => ({
  isDetailVisible: selectionUISelectors.selectSelectedEmployee(state),
});

export default connect(mapStateToProps)(
  ShortTimeWorkPeriodStatus
) as React.ComponentType<Props & OwnProps> as React.ComponentType<OwnProps>;
