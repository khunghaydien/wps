import schema from '../schema';

import msg from '@commons/languages';
import TextUtil from '@commons/utils/TextUtil';

export default (name: string | (() => string)) =>
  schema.mixed().when(['startTime', 'endTime'], (startTime, endTime) =>
    schema.mixed().test(
      'needStartEndTime',
      () =>
        TextUtil.template(
          msg().Att_Err_NeedStartEndTime,
          typeof name === 'function' ? name() : name
        ),
      () => (startTime ?? null) !== null && (endTime ?? null) !== null
    )
  );
