const apiConnector =
  (path, param = {}) =>
  (dispatch, getState) => {
    const req = { path, param };
    const state = getState();
    return state.env.api.adminCommon.apiConnector(state, req).then((result) => {
      return result;
    });
  };

export default apiConnector;
