import * as PatternRequest from '../../../../../../domain/models/attendance/AttDailyRequest/PatternRequest';
import * as AttPattern from '../../../../../../domain/models/attendance/AttPattern';

export type State = {
  request: PatternRequest.PatternRequest | null;
  attPatternList: AttPattern.AttPattern[];
  selectedAttPattern: AttPattern.AttPattern | null;
};

const initialState: State = {
  request: null,
  attPatternList: [],
  selectedAttPattern: null,
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

type Action = Initialize | Update;

const INITIALIZE: Initialize['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/PATTERN_REQUEST/INITIALIZE';

const UPDATE: Update['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/PATTERN_REQUEST/UPDATE';

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
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE: {
      const { request, attPatternList: $attPatternList } = action.payload;
      const attPatternList = $attPatternList || [
        AttPattern.createFromPatternRequest(request),
      ];
      const selectedAttPattern = AttPattern.getDefaultPatternCode(
        attPatternList,
        request.patternCode
      );

      return {
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

    default:
      return state;
  }
};
