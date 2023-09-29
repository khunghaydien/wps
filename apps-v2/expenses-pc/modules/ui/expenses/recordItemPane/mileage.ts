import { Reducer } from 'redux';

export const ACTIONS = {
  SET_NEED_GENERATE_MAP_PREVIEW:
    'MODULES/EXPENSES/RECORD_ITEM_PANE/MILEAGE/SET_NEED_GENERATE_MAP_PREVIEW',
};

export const setNeedGenerateMapPreview = (
  needGenerateMapPreview?: boolean
) => ({
  type: ACTIONS.SET_NEED_GENERATE_MAP_PREVIEW,
  payload: needGenerateMapPreview,
});

type Props = {
  needGenerateMapPreview: boolean;
};
const initialState = {
  needGenerateMapPreview: true,
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_NEED_GENERATE_MAP_PREVIEW:
      return { ...state, needGenerateMapPreview: action.payload };
    default:
      return state;
  }
}) as Reducer<Props, any>;
