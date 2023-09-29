import { getUserSetting } from '../../commons/actions/userSetting';

import { getObjectList } from '../models/ObjectList';

import { AppDispatch } from '../modules/AppThunk';
import { setObjList } from '../modules/entities/objectList';

export const initialize = () => (dispatch: AppDispatch) => {
  return Promise.all([getObjectList(), dispatch(getUserSetting())]).then(
    ([{ records }]) => {
      dispatch(setObjList(records));
    }
  );
};

export default initialize;
