type DetailPermission = {
  id: string;
  name: string;
  isEnabled: boolean;
};

export type FeatureAccessDetail = {
  id: string;
  code: string;
  name: string;
  name_L0?: string;
  name_L1?: string;
  companyId: string;
  module: string;
  details: Array<DetailPermission>;
};

export type State = FeatureAccessDetail;

export const initialState: State = {
  id: '',
  code: '',
  name: '',
  name_L0: '',
  name_L1: '',
  companyId: '',
  module: '',
  details: [],
};

const ACTIONS = {
  SET_RECORD: 'ADMIN-PC-V2/MODULES/FEATURE_ACCESS/ENTITIES/RECORD/SET_RECORD',
};

type ActionType = {
  type: typeof ACTIONS.SET_RECORD;
  payload: FeatureAccessDetail;
};

export const action = {
  setRecord: (record: FeatureAccessDetail) => ({
    type: ACTIONS.SET_RECORD,
    payload: record,
  }),
};

// Reducer
export default (state: State = initialState, action: ActionType): State => {
  switch (action.type) {
    case ACTIONS.SET_RECORD: {
      return action.payload;
    }
    default:
      return state;
  }
};
