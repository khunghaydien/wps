import { connect } from 'react-redux';

import { actions as calendarActions } from '../../modules/calendar';
import { actions as calendarListEntityActions } from '../../modules/calendar/entities/calendarList';

import { Props as OwnProps } from '../../components/Admin/ContentsSelector';
import Calendar, { Props } from '../../presentational-components/Calendar';

const mapStateToProps = (state) => ({
  companyId: state.base.menuPane.ui.targetCompanyId,
  isDetailVisible: state.base.detailPane.ui.isShowDetail,
});

const mapDispatchToProps = (dispatch) => ({
  onInitialize: (stateProps) => {
    dispatch(calendarListEntityActions.clear());
    dispatch(calendarActions.getConstantsCalendar());
    dispatch(calendarListEntityActions.fetch(stateProps.companyId));
  },
});

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onInitialize: () => dispatchProps.onInitialize(stateProps),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Calendar) as React.ComponentType<
  Props & OwnProps
> as React.ComponentType<OwnProps>;
