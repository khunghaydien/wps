import { Store } from 'redux';

import fetch from './fetch';
import fetchTable from './fetchTable';

export default (
  store: Store
): {
  fetch: ReturnType<typeof fetch>;
  fetchTable: ReturnType<typeof fetchTable>;
} => ({
  fetch: fetch(store),
  fetchTable: fetchTable(store),
});
