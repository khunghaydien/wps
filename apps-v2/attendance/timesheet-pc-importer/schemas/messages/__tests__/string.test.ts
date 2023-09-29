import msg from '@commons/languages';
import TextUtil from '@commons/utils/TextUtil';

import * as string from '../string';
import * as DailyRecordViewModel from '@attendance/timesheet-pc-importer/viewModels/DailyRecordViewModel';

const path = 'earlyLeaveRequestReasonText';

describe('max', () => {
  it('should return string', () => {
    expect(
      string.max({
        max: 5,
        path,
      } as unknown as Parameters<typeof string.max>[0])
    ).toEqual(
      TextUtil.template(
        msg().Com_Err_MaxLengthOver,
        DailyRecordViewModel.getLabel(path),
        5
      )
    );
  });
});
