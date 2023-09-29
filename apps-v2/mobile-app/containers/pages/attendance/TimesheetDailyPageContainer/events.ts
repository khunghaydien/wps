import uuid from 'uuid';

import { create } from '@attendance/libraries/Event';

export default {
  fetched: create<void>(`FETCHED-${uuid()}`),
};
