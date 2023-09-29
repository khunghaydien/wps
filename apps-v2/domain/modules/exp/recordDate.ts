export const SET_RECORD_DATE = 'MODULES/UI/EXP/RECORD_DATE/SET';
export const updateRecordDate = (date) => (dispatch) => {
  dispatch({
    type: SET_RECORD_DATE,
    payload: date,
  });
};
