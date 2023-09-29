/* @flow */
import Api from '../../commons/api';
import UrlUtil from '../../commons/utils/UrlUtil';

type ToRemote = {|
  companyId: string,
  authCode: string,
  state: string,
|};

export const convertUrlQueryToParam = (): ToRemote | null => {
  const urlParams = UrlUtil.getUrlQuery();
  if (
    urlParams !== null &&
    urlParams.phase &&
    urlParams.phase === 'afterAuth' &&
    urlParams.tenant &&
    urlParams.state
  ) {
    const stateList = urlParams.state.split(',');
    if (stateList.length !== 4) {
      return null;
    }

    const companyId = stateList[3];

    return {
      companyId,
      authCode: urlParams.tenant,
      state: urlParams.state,
    };
  } else {
    return null;
  }
};

export const save = (param: ToRemote): Promise<void> => {
  return Api.invoke({
    path: '/company/private-setting/auth-code/save',
    param,
  });
};

export default { save };
