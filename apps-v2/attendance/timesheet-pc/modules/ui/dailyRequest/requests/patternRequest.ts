import DateUtil from '../../../../../../commons/utils/DateUtil';

import * as PatternRequest from '@attendance/domain/models/AttDailyRequest/PatternRequest';
import * as AttPattern from '@attendance/domain/models/AttPattern';

export type State = {
  request: PatternRequest.PatternRequest | null;
  attPatternList: AttPattern.AttPattern[];
  selectedAttPattern: AttPattern.AttPattern | null;
  hasRange: boolean;
  workingTypeInfo: AttPattern.AttPattern | null;
  directInputInfo: AttPattern.AttPattern | null;
};

const initialState: State = {
  request: null,
  attPatternList: [],
  selectedAttPattern: null,
  hasRange: false,
  workingTypeInfo: null,
  directInputInfo: null,
};

type Keys = keyof PatternRequest.PatternRequest;

type Values =
  PatternRequest.PatternRequest[keyof PatternRequest.PatternRequest];

type Initialize = {
  type: 'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/PATTERN_REQUEST/INITIALIZE';
  payload: {
    request: PatternRequest.PatternRequest;
    attPatternList: AttPattern.AttPattern[] | null;
  };
};

type SetWorkingType = {
  type: 'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/PATTERN_REQUEST/SETWORKINGTYPE';
  payload: {
    workingTypeInfo: AttPattern.AttPattern | null;
  };
};

type SetDirectInput = {
  type: 'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/PATTERN_REQUEST/SETDIRECTINPUT';
  payload: {
    directInputInfo: AttPattern.AttPattern | null;
  };
};

type Update = {
  type: 'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/PATTERN_REQUEST/UPDATE';
  payload: {
    key: Keys;
    value: Values;
  };
};

type UpdateHasRange = {
  type: 'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/PATTERN_REQUEST/UPDATE_HAS_RANGE';
  payload: boolean;
};

type Action =
  | Initialize
  | Update
  | UpdateHasRange
  | SetWorkingType
  | SetDirectInput;

const INITIALIZE: Initialize['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/PATTERN_REQUEST/INITIALIZE';

const SETWORKINGTYPE: SetWorkingType['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/PATTERN_REQUEST/SETWORKINGTYPE';

const SETDIRECTINPUT: SetDirectInput['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/PATTERN_REQUEST/SETDIRECTINPUT';

const UPDATE: Update['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/PATTERN_REQUEST/UPDATE';

const UPDATE_HAS_RANGE: UpdateHasRange['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/PATTERN_REQUEST/UPDATE_HAS_RANGE';

export const actions = {
  initialize: (
    request: PatternRequest.PatternRequest,
    attPatternList: AttPattern.AttPattern[] | null = null
  ): Initialize => ({
    type: INITIALIZE,
    payload: {
      request,
      attPatternList,
    },
  }),

  setWorkingType: (workingTypeInfo: AttPattern.AttPattern): SetWorkingType => ({
    type: SETWORKINGTYPE,
    payload: {
      workingTypeInfo,
    },
  }),

  setDirectInput: (directInputInfo: AttPattern.AttPattern): SetDirectInput => ({
    type: SETDIRECTINPUT,
    payload: {
      directInputInfo,
    },
  }),

  update: (key: Keys, value: Values): Update => ({
    type: UPDATE,
    payload: { key, value },
  }),

  updateHasRange: (value: boolean): UpdateHasRange => ({
    type: UPDATE_HAS_RANGE,
    payload: value,
  }),
};

const getHasRange = (request: PatternRequest.PatternRequest): boolean =>
  !!request.endDate && request.startDate !== request.endDate;

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE: {
      const { workingTypeInfo, directInputInfo } = state;
      const { request, attPatternList: $attPatternList } = action.payload;

      const attPatternList = $attPatternList || [
        AttPattern.createFromPatternRequest(request),
      ];

      if (
        request.requestableDayType === 'Workday' &&
        request.id &&
        !request.patternCode
      ) {
        attPatternList.unshift(workingTypeInfo);
      }

      if (
        request.canDirectInputTimeRequest &&
        request.id &&
        !request.patternCode
      ) {
        attPatternList.unshift(directInputInfo);
      }
      const selectedAttPattern = AttPattern.getDefaultPatternCode(
        attPatternList,
        request.patternCode
      );
      return {
        ...state,
        request: PatternRequest.updateByAttPattern(request, selectedAttPattern),
        attPatternList,
        selectedAttPattern,
        hasRange: getHasRange(request),
      };
    }

    case SETWORKINGTYPE: {
      const { workingTypeInfo } = action.payload;
      return {
        ...state,
        workingTypeInfo,
      };
    }

    case SETDIRECTINPUT: {
      const { directInputInfo } = action.payload;
      return {
        ...state,
        directInputInfo,
      };
    }

    case UPDATE: {
      const { request, attPatternList } = state;
      const { key, value } = action.payload;
      if (request === null) {
        return state;
      } else if (key === 'patternCode') {
        const selectedAttPattern = AttPattern.getDefaultPatternCode(
          attPatternList,
          String(value)
        );
        return {
          ...state,
          request: PatternRequest.updateByAttPattern(
            request,
            selectedAttPattern
          ),
          selectedAttPattern,
        };
      } else {
        return {
          ...state,
          request: PatternRequest.update(request, key, value),
        };
      }
    }

    case UPDATE_HAS_RANGE: {
      const hasRange = action.payload;
      const { request } = state;
      if (request === null) {
        return state;
      } else {
        return {
          ...state,
          hasRange,
          request: PatternRequest.update(
            request,
            'endDate',
            hasRange
              ? DateUtil.addDays(request.startDate, 1)
              : request.startDate
          ),
        };
      }
    }

    default:
      return state;
  }
};
