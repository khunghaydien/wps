import { IDailyStampTimeRepository } from '@attendance/domain/models/DailyStampTime';

import fetch from './fetch';
import post from './post';

export default {
  post,
  fetch,
} as IDailyStampTimeRepository;
