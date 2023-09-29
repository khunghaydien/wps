import { useSelector } from 'react-redux';

import { State as CommonState } from '@apps/commons/reducers';

/**
 * ジョブ選択ダイアログのマウント時に注入された値と、
 * user-settingとして得られるuseJobSearchAndSelectの値から、
 * 「検索結果から選択」の使用の有無を決定する。
 *
 * * 注入された値がbooleanであれば、その値を優先する
 * * 注入された値が無い（undefinedである）場合は、user-settingの値を採用する
 */
const useDecideUseConditionalSearch = (
  injectedFlag: boolean | undefined
): boolean => {
  const stateFlag = useSelector(
    (state: { common: CommonState }) =>
      state.common?.userSetting?.useJobSearchAndSelect
  );
  return typeof injectedFlag === 'boolean' ? injectedFlag : stateFlag || false;
};

export default useDecideUseConditionalSearch;
