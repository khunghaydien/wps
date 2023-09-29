import msg from '@apps/commons/languages';
import TextUtil from '@apps/commons/utils/TextUtil';
import TimeUtil from '@apps/commons/utils/TimeUtil';

import {
  AttDailyAttention,
  CODE,
} from '@attendance/domain/models/AttDailyAttention';

import { alert, remarks, tip } from '../attentionDailyMessages';
import { time } from '@attendance/__tests__/helpers';

describe('tip()', () => {
  it('should return null', () => {
    expect(tip([])).toBe(null);
  });
  it('should return first message', () => {
    const records = [
      {
        code: CODE.INEFFECTIVE_WORKING_TIME,
        value: {
          fromTime: time(7),
          toTime: time(9),
        },
      },
    ];
    expect(tip(records)).toBe(alert(records)[0]);
  });
  it('should return multiple message', () => {
    expect(
      tip([
        {
          code: CODE.INEFFECTIVE_WORKING_TIME,
          value: {
            fromTime: time(7),
            toTime: time(9),
          },
        },
        {
          code: CODE.INEFFECTIVE_WORKING_TIME,
          value: {
            fromTime: time(18),
            toTime: time(22),
          },
        },
      ])
    ).toBe(msg().Att_Msg_MultipulAttentionMessage);
  });
});

describe('alert()', () => {
  it('should do', () => {
    const result = alert([
      {
        code: CODE.INEFFECTIVE_WORKING_TIME,
        value: {
          fromTime: time(7),
          toTime: time(9),
        },
      },
      {
        code: CODE.INEFFECTIVE_WORKING_TIME,
        value: {
          fromTime: time(18),
          toTime: time(22),
        },
      },
      {
        code: CODE.INSUFFICIENT_REST_TIME,
        value: 10,
      },
      {
        code: CODE.OVER_ALLOWING_DEVIATION_TIME,
      },
      {
        code: CODE.OUT_INSUFFICIENT_MINIMUM_WORK_HOURS,
        value: 60,
      },
    ]);
    expect(result).toHaveLength(5);
    expect(result[0]).toEqual(
      TextUtil.template(
        msg().Att_Msg_NotIncludeWorkingTime,
        TimeUtil.toHHmm(time(7)),
        TimeUtil.toHHmm(time(9))
      )
    );
    expect(result[1]).toEqual(
      TextUtil.template(
        msg().Att_Msg_NotIncludeWorkingTime,
        TimeUtil.toHHmm(time(18)),
        TimeUtil.toHHmm(time(22))
      )
    );
    expect(result[2]).toEqual(
      TextUtil.template(msg().Att_Msg_InsufficientRestTime, 10)
    );
    expect(result[3]).toEqual(msg().Att_Msg_OverAllowingDeviationTime);
    expect(result[4]).toEqual(
      TextUtil.template(
        msg().Att_Msg_OutInsufficientMinimumWorkHours,
        TimeUtil.toHHmm(60)
      )
    );
  });
  it('should be null if array is not AttDailyAttention[]', () => {
    expect(
      alert([{ code: 'test' }] as unknown as AttDailyAttention[])
    ).toBeNull();
  });
  it('should be null if array is null', () => {
    expect(alert([])).toBeNull();
  });
});

describe('remarks()', () => {
  it('should do', () => {
    const result = remarks([
      {
        code: CODE.INEFFECTIVE_WORKING_TIME,
        value: {
          fromTime: time(7),
          toTime: time(9),
        },
      },
      {
        code: CODE.INEFFECTIVE_WORKING_TIME,
        value: {
          fromTime: time(18),
          toTime: time(22),
        },
      },
      {
        code: CODE.INSUFFICIENT_REST_TIME,
        value: 10,
      },
    ]);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual(
      TextUtil.template(
        msg().Att_Msg_SummaryCommentIneffectiveWorkingTime,
        TimeUtil.toHHmm(time(7)),
        TimeUtil.toHHmm(time(9))
      )
    );
    expect(result[1]).toEqual(
      TextUtil.template(
        msg().Att_Msg_SummaryCommentIneffectiveWorkingTime,
        TimeUtil.toHHmm(time(18)),
        TimeUtil.toHHmm(time(22))
      )
    );
    expect(result[2]).toEqual(
      TextUtil.template(msg().Att_Msg_SummaryCommentInsufficientRestTime, 10)
    );
  });
  it('should be null if array is not AttDailyAttention[]', () => {
    expect(
      remarks([{ code: 'test' }] as unknown as AttDailyAttention[])
    ).toBeNull();
  });
  it('should be null if array is null', () => {
    expect(remarks([])).toBeNull();
  });
});
