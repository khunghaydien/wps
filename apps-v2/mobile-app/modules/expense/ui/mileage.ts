import { Reducer } from 'redux';

import { MileageDestinationInfo } from '@apps/domain/models/exp/Mileage';

export enum Actions {
  SET_IS_GENERATED_PREVIEW = 'MODULES/PAGES/EXP/MILEAGE/SET_IS_GENERATED_PREVIEW',
  SET_DESTINATIONS = 'MODULES/PAGES/EXP/MILEAGE/SET_DESTINATIONS',
}

export const actions = {
  setIsGeneratedPreview: (generated?: boolean) => ({
    type: Actions.SET_IS_GENERATED_PREVIEW,
    payload: generated,
  }),
  setDestinations: (destinations: Array<MileageDestinationInfo>) => ({
    type: Actions.SET_DESTINATIONS,
    payload: destinations,
  }),
};

export type MileageFormState = {
  isGeneratedPreview?: boolean;
  destinations?: Array<MileageDestinationInfo>;
};

const initialState: MileageFormState = {
  isGeneratedPreview: false,
  destinations: [],
};

type Action =
  | { type: Actions.SET_IS_GENERATED_PREVIEW; payload: boolean }
  | { type: Actions.SET_DESTINATIONS; payload: Array<MileageDestinationInfo> };

export default ((state = initialState, action) => {
  switch (action.type) {
    case Actions.SET_IS_GENERATED_PREVIEW:
      return { ...state, isGeneratedPreview: action.payload };
    case Actions.SET_DESTINATIONS:
      return { ...state, destinations: action.payload };
    default:
      return state;
  }
}) as Reducer<MileageFormState, Action>;
