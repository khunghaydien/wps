import {
  AttDailyRequest,
  createFromDefaultValue,
  getAvailableRequestTypesAt,
} from '@attendance/domain/models/AttDailyRequest';
import {
  Code,
  DisplayOrder,
} from '@attendance/domain/models/AttDailyRequestType';
import { Timesheet } from '@attendance/domain/models/Timesheet';

// State

export type State = AttDailyRequest[];

const initialState: State = [];

// Actions

type Initialize = {
  type: 'MOBILE-APP/MODULES/ATTENDANCE/DAILYREQUEST/ENTITIES/AVAILABLEREQUESTS/INITIALIZE';
  payload: {
    timesheet: Timesheet;
    availableDailyRequestCodesMap: { [id: string]: Code[] };
    id: string;
  };
};

type Clear = {
  type: 'MOBILE-APP/MODULES/ATTENDANCE/DAILYREQUEST/ENTITIES/AVAILABLEREQUESTS/CLEAR';
};

type Action = Initialize | Clear;

const INITIALIZE: Initialize['type'] =
  'MOBILE-APP/MODULES/ATTENDANCE/DAILYREQUEST/ENTITIES/AVAILABLEREQUESTS/INITIALIZE';

const CLEAR: Clear['type'] =
  'MOBILE-APP/MODULES/ATTENDANCE/DAILYREQUEST/ENTITIES/AVAILABLEREQUESTS/CLEAR';

export const actions = {
  initialize: <TTimesheet extends Timesheet>(
    id: string,
    availableDailyRequestCodesMap: { [id: string]: Code[] },
    timesheet: TTimesheet
  ) => ({
    type: INITIALIZE,
    payload: {
      id,
      availableDailyRequestCodesMap,
      timesheet,
    },
  }),
  clear: (): Clear => ({
    type: CLEAR,
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE: {
      const { id, availableDailyRequestCodesMap, timesheet } = action.payload;
      const availableRequestTypes = getAvailableRequestTypesAt(
        availableDailyRequestCodesMap[id],
        timesheet
      );
      const dailyRecord = Object.values(
        action.payload.timesheet.recordsByRecordDate || {}
      ).find((record) => record.id === id);
      const nameMap = action.payload.timesheet.requestTypes;
      return DisplayOrder.filter(
        (requestTypeCode) => availableRequestTypes[requestTypeCode]
      ).map((requestTypeCode) =>
        createFromDefaultValue(availableRequestTypes[requestTypeCode].code, {
          nameMap,
          dailyRecord,
        })
      );
    }

    case CLEAR: {
      return [];
    }

    default:
      return state;
  }
};
