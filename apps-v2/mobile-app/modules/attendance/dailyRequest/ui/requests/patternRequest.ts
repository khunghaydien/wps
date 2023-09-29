import * as PatternRequest from '@attendance/domain/models/AttDailyRequest/PatternRequest';
import * as AttPattern from '@attendance/domain/models/AttPattern';

export type State = {
  request: PatternRequest.PatternRequest | null;
  attPatternList: AttPattern.AttPattern[];
  selectedAttPattern: AttPattern.AttPattern | null;
  workingTypeInfo: AttPattern.AttPattern | null;
  directInputInfo: AttPattern.AttPattern | null;
};

const initialState: State = {
  request: null,
  attPatternList: [],
  selectedAttPattern: null,
  workingTypeInfo: null,
  directInputInfo: null,
};

type Keys = keyof PatternRequest.PatternRequest;

type Values =
  PatternRequest.PatternRequest[keyof PatternRequest.PatternRequest];

type Initialize = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/PATTERN_REQUEST/INITIALIZE';
  payload: {
    request: PatternRequest.PatternRequest;
    attPatternList: AttPattern.AttPattern[] | null;
  };
};

type Update = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/PATTERN_REQUEST/UPDATE';
  payload: {
    key: Keys;
    value: Values;
  };
};

type SetWorkingType = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/PATTERN_REQUEST/SETWORKINGTYPE';
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

type Action = Initialize | Update | SetWorkingType | SetDirectInput;

const INITIALIZE: Initialize['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/PATTERN_REQUEST/INITIALIZE';

const UPDATE: Update['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/PATTERN_REQUEST/UPDATE';

const SETWORKINGTYPE: SetWorkingType['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/PATTERN_REQUEST/SETWORKINGTYPE';

const SETDIRECTINPUT: SetDirectInput['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/PATTERN_REQUEST/SETDIRECTINPUT';

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

  update: (key: Keys, value: Values): Update => ({
    type: UPDATE,
    payload: { key, value },
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
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE: {
      const { workingTypeInfo, directInputInfo } = state;
      const { request, attPatternList: $attPatternList } = action.payload;
      let attPatternList = $attPatternList || [
        AttPattern.createFromPatternRequest(request),
      ];
      if (
        request.requestDayType === 'Workday' &&
        request.id &&
        !request.patternCode &&
        !request.isDirectInputTimeRequest
      ) {
        attPatternList.unshift(workingTypeInfo);
        attPatternList = attPatternList.filter((item) => {
          return item.code && item.name;
        });
      }
      if (
        request.canDirectInputTimeRequest &&
        request.id &&
        !request.patternCode
      ) {
        attPatternList.unshift(directInputInfo);
        attPatternList = attPatternList.filter((item) => {
          return item.code && item.name;
        });
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

    default:
      return state;
  }
};
