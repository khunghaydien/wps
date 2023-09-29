import { Dispatch } from 'redux';

import { catchApiError, withLoading } from '../../../../commons/actions/app';

import {
  searchSkillset,
  SkillsetSearchQuery,
} from '../../../../domain/models/psa/Skillset';

// Type
export type EmployeeSkillset = {
  id: string;
  skillCode: string;
  skillName: string;
  grades: Array<string>;
  rating: string;
  ratingType: string;
  categoryName: string;
  isSelected: boolean;
};

/**
 * foundSkillset - respose from call the search API
 * selectedSkillset - user selected skillset
 */
type State = {
  foundSkillset: EmployeeSkillset[];
  selectedSkillset: EmployeeSkillset[];
  isDialogOpen: boolean;
};

const ACTIONS = {
  SET_FOUND_SKILLSET: 'SET_FOUND_SKILLSET',
  SET_SELECTED_SKILLSET: 'SET_SELECTED_SKILLSET',
  CLEAN_FOUND_SKILLSET: 'CLEAN_FOUND_SKILLSET',
  CLEAN_SKILLSET: 'CLEAN_SKILLSET',
  CLEAN_SELECTION: 'CLEAN_SKILLSET_SELECTION',
  TOGGLE_SELECTION: 'TOGGLE_SELECTION_SKILLSET',
  TOGGLE_SELECTED: 'TOGGLE_SELECTED_SKILLSET',
  ADD_TO_SELECTED_SKILLSET: 'ADD_TO_SELECTED_SKILLSET',
  REMOVE_FROM_SELECTED_SKILLSET: 'REMOVE_FROM_SELECTED_SKILLSET',
  CLEAN_SELECTED_SKILLSET: 'CLEAN_SELECTED_SKILLSET',
  OPEN_SKILLSET_DIALOG: 'OPEN_SKILLSET_DIALOG',
  CLOSE_SKILLSET_DIALOG: 'CLOSE_SKILLSET_DIALOG',
};

export const actions = {
  setFoundSkillset: (foundSkillset: EmployeeSkillset[]) => ({
    type: ACTIONS.SET_FOUND_SKILLSET,
    payload: foundSkillset,
  }),
  cleanFoundSkillset: () => ({
    type: ACTIONS.CLEAN_FOUND_SKILLSET,
  }),
  toggleSelection: (target: EmployeeSkillset) => ({
    type: ACTIONS.TOGGLE_SELECTION,
    payload: target,
  }),
  cleanSelection: () => ({
    type: ACTIONS.CLEAN_SELECTION,
  }),
  toggleSelectedSkillset: (target: EmployeeSkillset) => ({
    type: ACTIONS.TOGGLE_SELECTED,
    payload: target,
  }),
  addToSelectedSkillset: (skillset: EmployeeSkillset[]) => ({
    type: ACTIONS.ADD_TO_SELECTED_SKILLSET,
    payload: skillset,
  }),
  setSelectedSkillset: (skillset: EmployeeSkillset[]) => ({
    type: ACTIONS.SET_SELECTED_SKILLSET,
    payload: skillset,
  }),
  removeFromSelectedSkillset: (skillset: EmployeeSkillset[]) => ({
    type: ACTIONS.REMOVE_FROM_SELECTED_SKILLSET,
    payload: skillset,
  }),
  cleanSelectedSkillset: () => ({
    type: ACTIONS.CLEAN_SELECTED_SKILLSET,
  }),
  openDialog: () => ({
    type: ACTIONS.OPEN_SKILLSET_DIALOG,
  }),
  closeDialog: () => ({
    type: ACTIONS.CLOSE_SKILLSET_DIALOG,
  }),
};

// Methods

/**
 * @param query, selectedSkillset
 * Can query skillset by using following 3 params.
 * 1. companyId
 * 2. name
 * 3. code
 *
 * selectedSkillset to filter out the selected skillset from the result list
 */
export const searchSkillsetList =
  (query: SkillsetSearchQuery, selectedSkillset: EmployeeSkillset[]) =>
  (dispatch: Dispatch<any>) => {
    return dispatch(
      withLoading(() =>
        searchSkillset({ ...query })
          .then((response) => {
            const skillsets = response;
            const filteredFoundSkillset = skillsets
              .filter(
                (skillset) =>
                  !skillset.deleted &&
                  !selectedSkillset.map((obj) => obj.id).includes(skillset.id)
              )
              .map((_) => {
                const grades = _.grades ? _.grades.split('\n') : [];
                const { ratingType } = _;
                let rating = '0';
                if (ratingType === 'Score') {
                  rating = '';
                }

                return {
                  id: _.id,
                  skillCode: _.code,
                  skillName: _.name,
                  ratingType: _.ratingType,
                  categoryName: _.categoryName,
                  rating,
                  grades,
                  isSelected: false,
                };
              });
            return filteredFoundSkillset;
          })
          .then((filtered) => {
            dispatch(actions.cleanFoundSkillset());
            dispatch(actions.setFoundSkillset(filtered));
          })
          .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      )
    );
  };

export const openSearchDialog = () => (dispatch: Dispatch<any>) => {
  dispatch(actions.cleanFoundSkillset());
  dispatch(actions.openDialog());
};

export const cancelSearch = () => (dispatch: Dispatch<any>) => {
  dispatch(actions.cleanSelection());
  dispatch(actions.cleanFoundSkillset());
  dispatch(actions.closeDialog());
};

export const addSelectedSkillset =
  (skillsets: EmployeeSkillset[]) => (dispatch: Dispatch<any>) => {
    const skillset = skillsets.filter((e) => e.isSelected);
    const selectedSkillset = skillset.map((e) => ({
      ...e,
      isSelected: false,
    }));
    dispatch(actions.addToSelectedSkillset(selectedSkillset));
    dispatch(actions.closeDialog());
  };

// Reducer
const initialState = {
  foundSkillset: [],
  selectedSkillset: [],
  isDialogOpen: false,
};

export default (state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.SET_FOUND_SKILLSET: {
      return {
        ...state,
        foundSkillset: action.payload,
      };
    }
    case ACTIONS.CLEAN_FOUND_SKILLSET: {
      return {
        ...state,
        foundSkillset: [],
      };
    }
    case ACTIONS.TOGGLE_SELECTION: {
      const payload = action.payload;
      const clone = [...state.foundSkillset];
      const index = state.foundSkillset.findIndex(
        (skillset) => skillset.id === payload.id
      );
      clone[index] = {
        ...payload,
        isSelected: !payload.isSelected,
      };
      return {
        ...state,
        foundSkillset: [...clone],
      };
    }
    case ACTIONS.CLEAN_SELECTION: {
      const clone = [...state.foundSkillset];
      clone.forEach((skillset) => ({ ...skillset, isSelected: false }));
      return {
        ...state,
        foundSkillset: [...clone],
      };
    }
    case ACTIONS.TOGGLE_SELECTED: {
      const payload = action.payload;
      const clone = [...state.selectedSkillset];
      const index = state.selectedSkillset.findIndex(
        (skillset) => skillset.id === payload.id
      );
      clone[index] = {
        ...payload,
        isSelected: !payload.isSelected,
      };
      return {
        ...state,
        selectedSkillset: [...clone],
      };
    }
    case ACTIONS.ADD_TO_SELECTED_SKILLSET: {
      const payload = action.payload;
      return {
        ...state,
        selectedSkillset: [...payload, ...state.selectedSkillset],
      };
    }
    case ACTIONS.SET_SELECTED_SKILLSET: {
      const { payload } = action;

      // if there are records, set the records, else set to empty
      return payload
        ? {
            ...state,
            selectedSkillset: [...payload],
          }
        : {
            ...state,
            selectedSkillset: [],
          };
    }
    case ACTIONS.REMOVE_FROM_SELECTED_SKILLSET: {
      const payload = action.payload;
      const remainSkillset = payload.filter((skillset) => !skillset.isSelected);
      return {
        ...state,
        selectedSkillset: [...remainSkillset],
      };
    }
    case ACTIONS.CLEAN_SELECTED_SKILLSET: {
      return {
        ...state,
        selectedSkillset: [],
      };
    }
    case ACTIONS.OPEN_SKILLSET_DIALOG: {
      return {
        ...state,
        isDialogOpen: true,
      };
    }
    case ACTIONS.CLOSE_SKILLSET_DIALOG: {
      return {
        ...state,
        isDialogOpen: false,
      };
    }
    default:
      return state;
  }
};
