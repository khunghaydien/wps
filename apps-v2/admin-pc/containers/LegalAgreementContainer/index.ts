import { connect } from 'react-redux';

import { Props as OwnProps } from '../../components/Admin/ContentsSelector';
import LegalAgreement, {
  Props,
} from '../../presentational-components/LegalAgreement';

const mapStateToProps = (state) => ({
  editRecord: state.editRecord,
  isShowDetail: state.base.detailPane.ui.isShowDetail,
});

export default connect(mapStateToProps)(LegalAgreement) as React.ComponentType<
  Props & OwnProps
> as React.ComponentType<OwnProps>;
