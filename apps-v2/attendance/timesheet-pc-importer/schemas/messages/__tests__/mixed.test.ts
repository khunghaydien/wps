import msg from '@commons/languages';
import TextUtil from '@commons/utils/TextUtil';

import * as mixed from '../mixed';
import * as DailyRecordViewModel from '@attendance/timesheet-pc-importer/viewModels/DailyRecordViewModel';

const path = 'earlyLeaveRequestReasonText';

describe('required', () => {
  it('should return number', () => {
    expect(
      mixed.required({
        path,
      } as unknown as Parameters<typeof mixed.required>[0])
    ).toEqual(
      TextUtil.template(
        msg().Com_Err_NullValue,
        DailyRecordViewModel.getLabel(path)
      )
    );
  });
});
