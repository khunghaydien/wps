import schema from '../schema';

import msg from '@commons/languages';
import TextUtil from '@commons/utils/TextUtil';

import * as DailyRecordViewModel from '@attendance/timesheet-pc-importer/viewModels/DailyRecordViewModel';

export default (startTimeKey: string, endTimeKey: string) =>
  schema
    .number()
    .nullable()
    .when(
      startTimeKey,
      (startTimeToCheck: number | undefined, schema): schema.NumberSchema => {
        // 開始時刻が設定されている場合
        if ((startTimeToCheck ?? null) !== null) {
          return schema
            .required()
            .min(
              startTimeToCheck,
              TextUtil.template(
                msg().Com_Err_InvalidValueEarlier,
                DailyRecordViewModel.getLabel(startTimeKey),
                DailyRecordViewModel.getLabel(endTimeKey)
              )
            );
        }
        // されていない場合で終了時刻のみ設定されている場合
        return schema.test({
          name: 'needStartTime',
          message: () =>
            TextUtil.template(
              msg().Com_Err_NullValue,
              DailyRecordViewModel.getLabel(startTimeKey)
            ),
          test: (val) => !((val ?? null) > 0),
        });
      }
    );
