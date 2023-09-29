import omit from 'lodash/omit';

import DateUtil from '../../commons/utils/DateUtil';

export function fromRemote<TEntity extends { validDateThrough: string }>(
  record: Record<string, any>
): TEntity {
  return 'validDateTo' in record
    ? (omit(
        {
          ...record,
          validDateThrough: DateUtil.addDays(record.validDateTo, -1),
        },
        'validDateTo'
      ) as TEntity)
    : (record as TEntity);
}

export const toRemote = <TEntity extends { validDateThrough: string }>(
  record: TEntity
): Record<string, any> =>
  'validDateThrough' in record
    ? omit(
        {
          ...record,
          validDateTo: DateUtil.addDays(record.validDateThrough, 1) || null,
        },
        'validDateThrough'
      )
    : record;
