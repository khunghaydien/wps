import { Reducer } from 'redux';

type DialogStatus = {
  isDialogOpen: boolean;
};

const initialState: DialogStatus = { isDialogOpen: false };

export default ((state = initialState) => {
  return state;
}) as Reducer<DialogStatus, any>;
