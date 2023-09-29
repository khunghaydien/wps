import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions as calendarEventListEntityActions } from '../../modules/calendar/entities/calendarEventList';
import { selectors as calendarListSelectors } from '../../modules/calendar/entities/calendarList';
import { actions as calendarUIActions } from '../../modules/calendar/ui/calendar';

import ListPane, {
  Props,
} from '../../presentational-components/Calendar/ListPane';

const mapStateToProps = (state) => ({
  companyId: state.base.menuPane.ui.targetCompanyId,
  calendarList: calendarListSelectors.selectAttendanceCalendars(state),
  selectedCalendarId: state.calendar.ui.calendar.selectedId,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onSelectCalendar: (calendar) => (thunkDispatch) => {
        thunkDispatch(calendarUIActions.select(calendar));
        thunkDispatch(calendarEventListEntityActions.clear());
        thunkDispatch(calendarEventListEntityActions.fetch(calendar.id));
      },
      onClickCreateNewButton: (companyId) => (thunkDispatch) => {
        thunkDispatch(calendarUIActions.startEditingNew(companyId));
        thunkDispatch(calendarEventListEntityActions.clear());
      },
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onClickCreateNewButton: () => {
    dispatchProps.onClickCreateNewButton(stateProps.companyId);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ListPane) as React.ComponentType<Props> as React.ComponentType<
  Record<string, unknown>
>;
