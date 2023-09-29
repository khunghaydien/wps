import { parse } from 'date-fns';
import moment from 'moment';

import { getUserSetting } from '../../commons/actions/userSetting';
import { setUserPermission } from '../../commons/modules/accessControl/permission';
import { fetch as fetchPersonalSetting } from '../../commons/modules/personalSetting';

import { Permission } from '../../domain/models/access-control/Permission';
import { CalendarEvent } from '../models/calendar-event/CalendarEvent';

import { actions as events } from '../modules/entities/events';
import { actions as eventEditPopup } from '../modules/ui/eventEditPopup';

import {
  clearWorkCategoryList,
  fetchWorkCategoryListFromSavedEvent,
  selectEventEditPopup,
} from '../actions/eventEditPopup';
import { selectDay } from '../actions/events';

import { AppDispatch } from './AppThunk';
import Calendar from './Calendar';
import Request from './Request';

interface App {
  initialize: (arg: {
    userPermission: Permission;
    targetDate?: string;
  }) => Promise<void>;
  openEventEditPopup: (
    event: CalendarEvent,
    layout: {
      top: number;
      left: number;
    }
  ) => Promise<void>;
  closeEventEditPopup: (id: string) => void;
}

type Params = {
  userPermission: Permission;
  targetDate: string;
};

export default (dispatch: AppDispatch): App => {
  return {
    /**
     * Application initializes its first view.
     */
    initialize: async ({
      userPermission,
      targetDate = moment().toISOString(),
    }: Params): Promise<void> => {
      if (userPermission) {
        dispatch(setUserPermission(userPermission));
      }

      const request = Request(dispatch);
      request.fetchAlert({ targetDate });

      const [userSetting] = await Promise.all([
        dispatch(getUserSetting()),
        dispatch(fetchPersonalSetting()),
      ]);

      const defaultUserSetting = { useWorkTime: false };
      // @ts-ignore
      const calendar = Calendar(userSetting || defaultUserSetting, dispatch);
      dispatch(selectDay(moment(targetDate, ['YYYY-MM-DD'])));
      await calendar.loadData(parse(targetDate));
    },

    openEventEditPopup: async (
      event: CalendarEvent,
      layout: {
        top: number;
        left: number;
      }
    ): Promise<void> => {
      dispatch(selectEventEditPopup(event));
      dispatch(eventEditPopup.open(layout));

      if (event.id) {
        dispatch(events.update(event.id, 'isEditing', true));
      }

      if (event.job.id) {
        await dispatch(fetchWorkCategoryListFromSavedEvent(event));
      }
    },
    closeEventEditPopup: (id: string): void => {
      dispatch(eventEditPopup.close());
      dispatch(events.update(id, 'isEditing', false));
      dispatch(clearWorkCategoryList());
    },
  };
};
