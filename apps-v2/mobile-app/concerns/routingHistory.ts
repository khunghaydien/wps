// @ts-ignore
import { RouterHistory } from 'react-router-dom';

import get from 'lodash/get';

type PrevPages = Array<string>;

/*
 * iOS ONLY - Push history with prevPages stored in state, for the purpose of goBack later
 * Refer to EXP-5561
 */
export const pushHistoryWithPrePage = (
  history: RouterHistory,
  path: string,
  state?: Record<string, any>
) => {
  const currentPage = history.location.pathname;
  const prevPages: PrevPages = get(history, 'location.state.prevPages', []);
  const prevPageAfterPush = [...prevPages, currentPage];
  const newState = { ...(state || {}), prevPages: prevPageAfterPush };
  history.push(path, newState);
};

/*
 * iOS ONLY - When kill and reopen app, history length become 1 and cannot use history.goBack()
 * Refer to EXP-5561
 */
export const goBack = (history: RouterHistory) => {
  if (history.length <= 1) {
    const prevPages: PrevPages = get(history, 'location.state.prevPages', []);
    const lastIdx = prevPages.length - 1;
    const recentPage = prevPages[lastIdx];
    const newPrevPages: PrevPages = prevPages.slice(0, lastIdx);
    const newState = { ...history.location.state, prevPages: newPrevPages };
    history.replace(recentPage, newState);
  } else {
    history.goBack();
  }
};
