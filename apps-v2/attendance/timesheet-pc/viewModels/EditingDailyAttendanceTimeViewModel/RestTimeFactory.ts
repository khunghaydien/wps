import nanoid from 'nanoid';

import * as DomainRestTime from '@attendance/domain/models/RestTime';

import { RestTime } from './Models';
import $createRestTimeFactory from '@attendance/domain/factories/RestTimesFactory';

export const RestTimeFactory: DomainRestTime.IRestTimeFactory<RestTime> = {
  create: (arg0?: Partial<RestTime>) => ({
    ...DomainRestTime.create(arg0),
    id: arg0?.id ?? nanoid(),
  }),
};

export const createRestTimesFactory =
  $createRestTimeFactory<RestTime>(RestTimeFactory);
