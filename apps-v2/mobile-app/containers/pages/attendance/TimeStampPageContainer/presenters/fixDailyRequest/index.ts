import { Store } from 'redux';

import cancelApproval from './cancelApproval';
import cancelSubmitted from './cancelSubmitted';
import submit from './submit';
import { bind } from '@apps/attendance/libraries/Collection';

export default (store: Store) =>
  bind(
    {
      submit,
      cancelSubmitted,
      cancelApproval,
    },
    store
  );
