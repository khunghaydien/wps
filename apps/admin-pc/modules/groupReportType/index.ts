import { Reducer } from 'redux';

type State = {
  options: Array<{ value: string; label: string }>;
  selected: Array<string>;
};
const initialState = { options: [], selected: [] };

const ACTION = {
  INITIALISE_OPTIONS: 'GROUP_REPORT_TYPE/INITIALISE_OPTIONS',
  SET_OPTIONS: 'GROUP_REPORT_TYPE/SET_OPTIONS',
};

export const initialiseOptions = (
  selectedIds: Array<string>,
  reportType: Array<string>
) => ({
  type: ACTION.INITIALISE_OPTIONS,
  payload: { selectedIds, reportType },
});

export const setOptions = (selectedIds: Array<string>) => ({
  type: ACTION.SET_OPTIONS,
  payload: selectedIds,
});

const orderbyCode = (
  optionA: {
    [key: string]: string;
  },
  optionB: {
    [key: string]: string;
  }
) => {
  const labelA = optionA.label.toUpperCase();
  const labelB = optionB.label.toUpperCase();

  let comparison = 0;
  if (labelA > labelB) {
    comparison = 1;
  } else if (labelA < labelB) {
    comparison = -1;
  }
  return comparison;
};

export const convertToOptionFormat = (data: Array<any>): Array<any> => {
  return data
    .map(({ id, code, name }) => ({
      value: id,
      label: `${code} - ${name}`,
    }))
    .sort(orderbyCode);
};

// keep selected options' order and handle the case selected items be deleted
export const getSelected = (
  ids: Array<string>,
  items: Array<any>
): Array<string> => ids.filter((id) => items.find((item) => item.id === id));

export default ((state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTION.INITIALISE_OPTIONS:
      return {
        ...state,
        options: convertToOptionFormat(action.payload.reportType),
        selected: getSelected(
          action.payload.selectedIds,
          action.payload.reportType
        ),
      };
    case ACTION.SET_OPTIONS:
      return {
        ...state,
        selected: action.payload,
      };
    default:
      return state;
  }
}) as Reducer<State, any>;
