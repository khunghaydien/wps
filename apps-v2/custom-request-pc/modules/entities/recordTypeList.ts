import { getRecordTypeList } from '@apps/domain/models/customRequest';
import { RecordTypeListEntity } from '@apps/domain/models/customRequest/types';

import { AppDispatch } from '../AppThunk';

const DEFAULT_RECORD_TYPE_NAME = 'Default Record Type';

type State = RecordTypeListEntity;

const initialState: State = {
  records: [],
  objectName: '',
};

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/ENTITIES/RECORD_TYPE_LIST/GET_SUCCESS',
} as const;

const getSuccess = (payload: RecordTypeListEntity) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: payload,
});

export const actions = {
  get: () => (dispatch: AppDispatch) => {
    return getRecordTypeList()
      .then((res) => {
        const { records, objectName } = res;
        dispatch(getSuccess({ records, objectName }));
        return res;
      })
      .catch((err) => {
        throw err;
      });
  },
};

type Action = ReturnType<typeof getSuccess>;

export default (state = initialState, action: Action): State => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
      return {
        ...action.payload,
        records: action.payload.records
          .filter((e) => e.name !== DEFAULT_RECORD_TYPE_NAME)
          .sort(),
      };
    default:
      return state;
  }
};
