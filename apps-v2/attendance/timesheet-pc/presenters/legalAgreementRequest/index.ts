import { Store } from 'redux';

import cancelApproval from './cancelApproval';
import cancelRequest from './cancelRequest';
import fetchList from './fetchList';
import reapply from './reapply';
import remove from './remove';
import submit from './submit';

export default (
  store: Store
): {
  fetchList: ReturnType<typeof fetchList>;
  submit: ReturnType<typeof submit>;
  cancelRequest: ReturnType<typeof cancelRequest>;
  cancelApproval: ReturnType<typeof cancelApproval>;
  remove: ReturnType<typeof remove>;
  reapply: ReturnType<typeof reapply>;
} => ({
  fetchList: fetchList(store),
  submit: submit(store),
  cancelRequest: cancelRequest(store),
  cancelApproval: cancelApproval(store),
  remove: remove(store),
  reapply: reapply(store),
});
