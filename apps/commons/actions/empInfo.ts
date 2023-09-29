import moment from 'moment';

import LangUtil from '../utils/LangUtil';

export const FETCH_EMP_INFO_START = 'FETCH_EMP_INFO_START';
export const FETCH_EMP_INFO_SUCCESS = 'FETCH_EMP_INFO_SUCCESS';

/**
 * 社員の基本情報を取得
 */
function fetchEmpInfoStart() {
  return {
    type: FETCH_EMP_INFO_START,
  };
}

function fetchEmpInfoSuccess(empInfo) {
  return {
    type: FETCH_EMP_INFO_SUCCESS,
    record: empInfo,
  };
}

export function fetchEmpInfo() {
  return (dispatch, getState) => {
    dispatch(fetchEmpInfoStart());
    const state = getState();
    return state.env.api.common.empInfo.fetchEmpInfo(state, (result) => {
      // TODO: moment の初期化処理が増えたら別のところに移す
      const lang = LangUtil.convertSfLang(result.language);
      document.documentElement.lang = lang;
      moment.locale(lang);

      // TODO: timezone を返すようになったらこのように設定するはず
      // ref. http://momentjs.com/timezone/docs/#/using-timezones/default-timezone/
      // moment.tz.setDefault(result.timezone);

      dispatch(fetchEmpInfoSuccess(result));
    });
  };
}
