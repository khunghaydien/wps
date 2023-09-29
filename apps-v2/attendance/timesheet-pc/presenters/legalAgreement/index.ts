import { Store } from 'redux';

import fetchOvertime from './fetchOvertime';

export default (
  store: Store
): {
  fetchOvertime: ReturnType<typeof fetchOvertime>;
} => ({
  fetchOvertime: fetchOvertime(store),
});
