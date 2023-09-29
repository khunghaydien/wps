import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions as calendarEventListEntityActions } from '../../modules/calendar/entities/calendarEventList';
import { actions as calendarListEntityActions } from '../../modules/calendar/entities/calendarList';
import {
  actions as calendarUIActions,
  selectors as calendarUISelectors,
} from '../../modules/calendar/ui/calendar';
import { actions as calendarEventUIActions } from '../../modules/calendar/ui/calendarEvent';

import DetailPane, {
  Props,
} from '../../presentational-components/Calendar/DetailPane';

const mapStateToProps = (state) => ({
  companyId: state.base.menuPane.ui.targetCompanyId,
  calendar:
    state.calendar.ui.calendar.editing ||
    calendarUISelectors.selectSelectedCalendar(state),
  eventList: calendarUISelectors.getCalendarEventListWithAttribute(state),
  selectedEventIdList: state.calendar.ui.calendar.selectedCalendarEventIdList,
  mode: state.base.detailPane.ui.modeBase,
  sfObjFieldValues: state.sfObjFieldValues,
  getOrganizationSetting: state.getOrganizationSetting,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      onClickClosePane: calendarUIActions.deselect,
      onClickSaveButton: calendarUIActions.save,
      onClickEditDetailButton: calendarUIActions.startEditing,
      onClickCancelEditButton: calendarUIActions.cancelEditing,
      onClickUpdateButton: calendarUIActions.save,
      onClickDeleteButton: (companyId, calendarId) =>
        calendarListEntityActions.confirmAndDelete({ companyId, calendarId }),
      onUpdateDetailItemValue: calendarUIActions.update,
      onUpdateSuccess: (companyId) => (thunkDispatch) => {
        return thunkDispatch(calendarListEntityActions.fetch(companyId));
      },
      onClickCreateEventButton: calendarEventUIActions.create,
      onClickEditEventButton: calendarEventUIActions.select,
      onEventRowsSelected: calendarUIActions.selectEvents,
      onEventRowsDeselected: calendarUIActions.deselectEvents,
      onClickDeleteEventButton: calendarUIActions.deleteEvents,
      onDeleteEventSuccess: (calendarId) => (thunkDispatch) => {
        return thunkDispatch(calendarEventListEntityActions.fetch(calendarId));
      },
      deselectCalendar: calendarUIActions.deselect,
    },
    dispatch
  ),
});

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onClickDeleteButton: () => {
    dispatchProps
      .onClickDeleteButton(stateProps.companyId, stateProps.calendar.id)
      .then((yes) => {
        if (yes) {
          dispatchProps.deselectCalendar();
        }
      });
  },
  onClickEditDetailButton: () =>
    dispatchProps.onClickEditDetailButton(stateProps.calendar),
  onClickSaveButton: () =>
    dispatchProps.onClickSaveButton(stateProps.calendar, () => {
      dispatchProps.onUpdateSuccess(stateProps.companyId);
      dispatchProps.deselectCalendar();
    }),
  onClickUpdateButton: () =>
    dispatchProps.onClickUpdateButton(stateProps.calendar, () =>
      dispatchProps.onUpdateSuccess(stateProps.companyId)
    ),
  onClickCreateEventButton: () =>
    dispatchProps.onClickCreateEventButton(stateProps.calendar.id),
  onClickDeleteEventButton: () =>
    dispatchProps.onClickDeleteEventButton(stateProps.selectedEventIdList, () =>
      dispatchProps.onDeleteEventSuccess(stateProps.calendar.id)
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DetailPane) as React.ComponentType<Props> as React.ComponentType<
  Record<string, unknown>
>;
