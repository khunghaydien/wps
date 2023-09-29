import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions as calendarEventListEntityActions } from '../../modules/calendar/entities/calendarEventList';
import { actions as calendarEventUIActions } from '../../modules/calendar/ui/calendarEvent';

import EventDialog, {
  Props,
} from '../../presentational-components/Calendar/EventDialog';

const mapStateToProps = (state) => ({
  calendarId: state.calendar.ui.calendar.selectedId,
  event: state.calendar.ui.calendarEvent,
  sfObjFieldValues: state.sfObjFieldValues,
  getOrganizationSetting: state.getOrganizationSetting,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onChangeDetailItem: calendarEventUIActions.update,
      onCancel: calendarEventUIActions.unset,
      onSubmit: calendarEventUIActions.save,
      onSubmitSuccess: (calendarId) => (thunkDispatch) => {
        return thunkDispatch(calendarEventListEntityActions.fetch(calendarId));
      },
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onSubmit: () =>
    dispatchProps.onSubmit(stateProps.event, () =>
      dispatchProps.onSubmitSuccess(stateProps.calendarId)
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(EventDialog) as React.ComponentType<Props> as React.ComponentType<
  Record<string, unknown>
>;
