import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import Api from '../../commons/api';
import DateUtil from '../../commons/utils/DateUtil';

export const convertFromRemoteFormat = (record) =>
  'validDateTo' in record
    ? {
        ...record,
        validDateTo: DateUtil.addDays(record.validDateTo, -1),
      }
    : record;

export const convertToRemoteFormat = (record) =>
  'validDateTo' in record
    ? {
        ...record,
        validDateTo: DateUtil.addDays(record.validDateTo, 1) || null,
      }
    : record;

const searchSuccess = (type, records) => ({
  type,
  payload: records,
});

const getSuccess = (type, record) => ({
  type,
  payload: record,
});

const createSuccess = (type) => ({
  type,
});

const deleteSuccess = (type) => ({
  type,
});

const updateSuccess = (type) => ({
  type,
});

const saveSuccess = (type) => ({
  type,
});

const searchError = (type) => ({
  type,
});

const getError = (type) => ({
  type,
});

const createError = (type) => ({
  type,
});

const deleteError = (type) => ({
  type,
});

const updateError = (type) => ({
  type,
});

const saveError = (type) => ({
  type,
});

export const search =
  (name, param = {}, successType, errorType) =>
  (dispatch) => {
    dispatch(loadingStart());
    const req = { path: `/${name}/search`, param };
    return Api.invoke(req)
      .then((result) => {
        dispatch(loadingEnd());
        const records = (result.records || []).map(convertFromRemoteFormat);
        dispatch(searchSuccess(successType, records));
        return records;
      })
      .catch((err) => {
        dispatch(loadingEnd());
        dispatch(searchError(errorType));
        dispatch(catchApiError(err, { isContinuable: true }));
        throw err; // 後続（component/MainContent）のthenをスキップさせる
      });
  };

export const get =
  (name, param = {}, successType, errorType) =>
  (dispatch) => {
    dispatch(loadingStart());
    const req = { path: `/${name}/get`, param };
    return Api.invoke(req)
      .then((result) => {
        dispatch(loadingEnd());
        const record = convertFromRemoteFormat(result);
        dispatch(getSuccess(successType, record));
      })
      .catch((err) => {
        dispatch(loadingEnd());
        dispatch(getError(errorType));
        dispatch(catchApiError(err, { isContinuable: true }));
        throw err; // 後続（component/MainContent）のthenをスキップさせる
      });
  };

export const create = (name, param, successType, errorType) => (dispatch) => {
  dispatch(loadingStart());
  const req = { path: `/${name}/create`, param: convertToRemoteFormat(param) };
  return Api.invoke(req)
    .then((res) => {
      dispatch(loadingEnd());
      dispatch(createSuccess(successType));
      return res;
    })
    .catch((err) => {
      dispatch(loadingEnd());
      dispatch(createError(errorType));
      dispatch(catchApiError(err, { isContinuable: true }));
      throw err; // 後続（component/MainContent）のthenをスキップさせる
    });
};

export const del = (name, param, successType, errorType) => (dispatch) => {
  dispatch(loadingStart());
  const req = { path: `/${name}/delete`, param };
  return Api.invoke(req)
    .then(() => {
      dispatch(loadingEnd());
      dispatch(deleteSuccess(successType));
    })
    .catch((err) => {
      dispatch(loadingEnd());
      dispatch(deleteError(errorType));
      dispatch(catchApiError(err, { isContinuable: true }));
      throw err; // 後続（component/MainContent）のthenをスキップさせる
    });
};

export const update = (name, param, successType, errorType) => (dispatch) => {
  const req = { path: `/${name}/update`, param: convertToRemoteFormat(param) };
  dispatch(loadingStart());
  return Api.invoke(req)
    .then(() => {
      dispatch(loadingEnd());
      dispatch(updateSuccess(successType));
    })
    .catch((err) => {
      dispatch(loadingEnd());
      dispatch(updateError(errorType));
      dispatch(catchApiError(err, { isContinuable: true }));
      throw err; // 後続（component/MainContent）のthenをスキップさせる
    });
};

/**
 * The purpose is to serve both create and update methods
 * @param name
 * @param param
 * @param successType
 * @param errorType
 */
export const save = (name, param, successType, errorType) => (dispatch) => {
  dispatch(loadingStart());
  const req = { path: `/${name}/save`, param };
  return Api.invoke(req)
    .then(() => {
      dispatch(saveSuccess(successType));
    })
    .catch((err) => {
      dispatch(saveError(errorType));
      dispatch(catchApiError(err, { isContinuable: true }));
      throw err;
    })
    .finally(() => dispatch(loadingEnd()));
};

/**
 * This method will search for minimum data to display, it is used to display large list without pagination
 * @param name
 * @param param
 * @param successType
 * @param errorType
 */
export const searchMinimal =
  (name, param = {}, successType, errorType) =>
  (dispatch) => {
    dispatch(loadingStart());
    const req = { path: `/${name}/list/get`, param };
    return Api.invoke(req)
      .then((result) => {
        dispatch(loadingEnd());
        const record = convertFromRemoteFormat(result);
        dispatch(getSuccess(successType, record));
        return record;
      })
      .catch((err) => {
        dispatch(loadingEnd());
        dispatch(getError(errorType));
        dispatch(catchApiError(err, { isContinuable: true }));
        throw err; // 後続（component/MainContent）のthenをスキップさせる
      });
  };

/**
 * This method will search for minimum data from an api domain
 * @param name
 * @param param
 * @param successType
 * @param errorType
 */
export const listMinimal =
  (name, param = {}, successType, errorType) =>
  (dispatch) => {
    dispatch(loadingStart());
    const req = { path: `/${name}/list/min`, param };
    return Api.invoke(req)
      .then((result) => {
        dispatch(loadingEnd());
        const records = (result.records || []).map(convertFromRemoteFormat);
        dispatch(searchSuccess(successType, records));
        return records;
      })
      .catch((err) => {
        dispatch(loadingEnd());
        dispatch(searchError(errorType));
        dispatch(catchApiError(err, { isContinuable: true }));
        throw err; // 後続（component/MainContent）のthenをスキップさせる
      });
  };

/**
 * This method will search for data list from an api domain
 * @param name
 * @param param
 * @param successType
 * @param errorType
 */
export const list =
  (name, param = {}, successType, errorType) =>
  (dispatch) => {
    dispatch(loadingStart());
    const req = { path: `/${name}/list`, param };
    return Api.invoke(req)
      .then((result) => {
        dispatch(loadingEnd());
        const records = (result.records || []).map(convertFromRemoteFormat);
        dispatch(searchSuccess(successType, records));
        return records;
      })
      .catch((err) => {
        dispatch(loadingEnd());
        dispatch(searchError(errorType));
        dispatch(catchApiError(err, { isContinuable: true }));
        throw err; // 後続（component/MainContent）のthenをスキップさせる
      });
  };
