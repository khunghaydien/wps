import { loadingEnd, loadingStart } from './app';

export const FETCH_COST_CENTER_LIST = 'FETCH_COST_CENTER_LIST';

/**
 * コストセンターを取得
 */
function fetchCostCenterListSuccess(result) {
  return {
    type: FETCH_COST_CENTER_LIST,
    payload: result,
  };
}

export function fetchCostCenterListByParent(
  parentItem = null,
  existingItemList = []
) {
  return (dispatch, getState) => {
    dispatch(loadingStart());
    const state = getState();
    const parentId = parentItem ? parentItem.id : null;
    return state.env.api.common.costCenterList.fetchCostCenterListByParent(
      state,
      parentId,
      (result) => {
        dispatch(loadingEnd());

        // existingItemList は空配列、または配列の配列となる
        const newItemList = [].concat(existingItemList);
        const resultItemList = [].concat(result);

        // NOTE: 2階層目以降、一番上は親自身を選択するための項目になる
        if (parentItem) {
          const selectableParentItem = Object.assign({}, parentItem);
          selectableParentItem.hasChildren = false;
          resultItemList.unshift(selectableParentItem);
        }

        newItemList.push(resultItemList);

        dispatch(fetchCostCenterListSuccess(newItemList));
      }
    );
  };
}
