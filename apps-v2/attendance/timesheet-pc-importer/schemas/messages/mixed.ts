import { MessageParams } from 'yup/lib/types';

import msg from '@commons/languages';
import TextUtil from '@commons/utils/TextUtil';

import * as DailyRecordViewModel from '@attendance/timesheet-pc-importer/viewModels/DailyRecordViewModel';

export const required = ({ path }: MessageParams) =>
  TextUtil.template(
    msg().Com_Err_NullValue,
    DailyRecordViewModel.getLabel(path)
  );
