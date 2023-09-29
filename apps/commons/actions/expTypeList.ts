import { loadingEnd, loadingStart } from './app';

export const FETCH_EXP_TYPE_LIST = 'FETCH_EXP_TYPE_LIST';

/**
 * 費目と費目グループを取得
 */
function fetchExpTypeAndGroupListSuccess(result) {
  return {
    type: FETCH_EXP_TYPE_LIST,
    payload: result,
  };
}

export function fetchExpTypeAndGroupList(
  parentItem = null,
  existingItemList = [],
  currencyType = null
) {
  return (dispatch, getState) => {
    dispatch(loadingStart());
    const state = getState();
    const parentId = parentItem ? parentItem.id : null;
    return state.env.api.common.expTypeList.fetchExpTypeAndGroupList(
      state,
      parentId,
      currencyType,
      (result) => {
        dispatch(loadingEnd());

        // existingItemList は空配列、または配列の配列となる
        const newItemList = [].concat(existingItemList);
        newItemList.push(result);

        dispatch(fetchExpTypeAndGroupListSuccess(newItemList));
      }
    );
  };
}
