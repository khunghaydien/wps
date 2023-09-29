import schemas from '@attendance/timesheet-pc-importer/schemas';

import { DAY_TYPE } from '@apps/attendance/domain/models/AttDailyRecord';

import { create } from './helpers/validate';

describe('勤務時間入力', () => {
  test('正常', () => {
    const testValue = {
      startTime: 900,
      endTime: 960,
    };
    expect(() => {
      schemas(null).validateSync(testValue);
    }).not.toThrow();
  });
});

describe('勤務時間入力 所定情報有', () => {
  const workDay = {
    startDate: null,
    endDate: null,
    workingType: null,
    records: new Map([
      ['recordDate', { startTime: 0, endTime: 0, dayType: DAY_TYPE.Workday }],
    ]),
  };
  const holiday = {
    startDate: null,
    endDate: null,
    workingType: null,
    records: null,
  };
  test.each`
    contractedWorkTime | startTime | appliedHolidayWorkRequest | expected
    ${workDay}         | ${null}   | ${false}                  | ${{ startTime: ['Attendance time has not been entered for the workday.'] }}
    ${workDay}         | ${null}   | ${true}                   | ${{ startTime: ['Attendance time has not been entered for the workday.'] }}
    ${workDay}         | ${0}      | ${false}                  | ${null}
    ${workDay}         | ${0}      | ${true}                   | ${null}
    ${holiday}         | ${null}   | ${false}                  | ${null}
    ${holiday}         | ${null}   | ${true}                   | ${null}
    ${holiday}         | ${0}      | ${false}                  | ${{ startTime: ['Unable to work on a rest day.'] }}
    ${holiday}         | ${0}      | ${true}                   | ${null}
  `(
    'contractedWorkTime=$contractedWorkTime, startTime=$startTime, appliedHolidayWorkRequest=$appliedHolidayWorkRequest',
    async ({ contractedWorkTime, expected, ...input }) => {
      const validate = create(schemas(contractedWorkTime).pick(['startTime']));
      expect(await validate({ ...input, recordDate: 'recordDate' })).toEqual(
        expected
      );
    }
  );
});

describe('勤務時間入力 異常', () => {
  it.each`
    startTime | endTime | expectedMsg
    ${900}    | ${null} | ${'End time is not set'}
    ${null}   | ${900}  | ${'Start time is not set'}
    ${900}    | ${800}  | ${'Start time must be earlier than End time.'}
  `(
    'startTime=$startTime , startTime=$endTime',
    ({ startTime, endTime, expectedMsg }) => {
      const testValue = {
        startTime,
        endTime,
      };

      expect(() => {
        schemas(null).validateSync(testValue);
      }).toThrow(expectedMsg);
    }
  );
});

describe('休憩時間 正常', () => {
  it.each`
    rest1StartTime | rest1EndTime | rest2StartTime | rest2EndTime
    ${null}        | ${null}      | ${null}        | ${null}
    ${900}         | ${910}       | ${null}        | ${null}
    ${null}        | ${null}      | ${900}         | ${910}
    ${900}         | ${910}       | ${910}         | ${920}
  `(
    'rest1StartTime=$rest1StartTime , rest1EndTime=$rest2EndTime, rest2StartTime=$rest2StartTime , rest2EndTime=$rest2EndTime',
    ({ rest1StartTime, rest1EndTime, rest2StartTime, rest2EndTime }) => {
      const testValue = {
        rest1StartTime,
        rest1EndTime,
        rest2StartTime,
        rest2EndTime,
      };

      expect(() => {
        schemas(null).validateSync(testValue);
      }).not.toThrow();
    }
  );
});

describe('休憩時間 異常', () => {
  it.each`
    rest1StartTime | rest1EndTime | rest2StartTime | rest2EndTime | expectedMsg
    ${1}           | ${null}      | ${null}        | ${null}      | ${'Rest 1 end time is not set'}
    ${null}        | ${1}         | ${null}        | ${null}      | ${'Rest 1 start time is not set'}
    ${null}        | ${null}      | ${1}           | ${null}      | ${'Rest 2 end time is not set'}
    ${null}        | ${null}      | ${null}        | ${1}         | ${'Rest 2 start time is not set'}
    ${2}           | ${1}         | ${null}        | ${null}      | ${'Rest 1 start time must be earlier than Rest 1 end time.'}
    ${null}        | ${null}      | ${2}           | ${1}         | ${'Rest 2 start time must be earlier than Rest 2 end time.'}
    ${10}          | ${20}        | ${15}          | ${25}        | ${'{$Att_Lbl_CustomRest} time is overlapping.'}
  `(
    'rest1StartTime=$rest1StartTime , rest1EndTime=$rest1EndTime, rest2StartTime=$rest2StartTime , rest2EndTime=$rest2EndTime',
    ({
      rest1StartTime,
      rest1EndTime,
      rest2StartTime,
      rest2EndTime,
      expectedMsg,
    }) => {
      const testValue = {
        rest1StartTime,
        rest1EndTime,
        rest2StartTime,
        rest2EndTime,
      };
      expect(() => {
        schemas(null).validateSync(testValue);
      }).toThrow(expectedMsg);
    }
  );
});

describe('休暇コード', () => {
  test('正常', () => {
    const testValue = {
      appliedLeaveRequest1: true,
      leaveRequest1Code: 'CODE_1',
    };
    expect(() => {
      schemas(null).validateSync(testValue);
    }).not.toThrow();
  });
  test('必須エラー', () => {
    const testValue = {
      appliedLeaveRequest1: true,
      leaveRequest1Code: undefined,
    };
    expect(() => {
      schemas(null).validateSync(testValue);
    }).toThrow('Leave 1 code is not set');
  });
});

describe('時間単位休', () => {
  test('正常', () => {
    const testValue = {
      appliedLeaveRequest1: true,
      leaveRequest1Code: 'CODE_1',
      leaveRequest1Range: 'Time',
      leaveRequest1StartTime: 900,
      leaveRequest1EndTime: 1000,
    };
    expect(() => {
      schemas(null).validateSync(testValue);
    }).not.toThrow();
  });
  test('開始時刻必須', () => {
    const testValue = {
      appliedLeaveRequest1: true,
      leaveRequest1Code: 'CODE_1',
      leaveRequest1Range: 'Time',
      leaveRequest1StartTime: undefined,
      leaveRequest1EndTime: 1000,
    };
    expect(() => {
      schemas(null).validateSync(testValue);
    }).toThrow('Leave 1 start time is not set');
  });
  test('終了時刻必須', () => {
    const testValue = {
      appliedLeaveRequest1: true,
      leaveRequest1Code: 'CODE_1',
      leaveRequest1Range: 'Time',
      leaveRequest1StartTime: 900,
      leaveRequest1EndTime: undefined,
    };
    expect(() => {
      schemas(null).validateSync(testValue);
    }).toThrow('Leave 1 end time is not set');
  });
  test('開始終了時刻が前後逆', () => {
    const testValue = {
      appliedLeaveRequest1: true,
      leaveRequest1Code: 'CODE_1',
      leaveRequest1Range: 'Time',
      leaveRequest1StartTime: 900,
      leaveRequest1EndTime: 800,
    };
    expect(() => {
      schemas(null).validateSync(testValue);
    }).toThrow('Leave 1 start time must be earlier than Leave 1 end time.');
  });
});

describe('残業申請', () => {
  test('正常', () => {
    const testValue = {
      appliedOvertimeWorkRequest: true,
      overtimeWorkRequestStartTime: 900,
      overtimeWorkRequestEndTime: 1000,
      overtimeWorkRequestRemark: 'TEST_REMARK',
    };
    expect(() => {
      schemas(null).validateSync(testValue);
    }).not.toThrow();
  });
  test('開始時刻必須', () => {
    const testValue = {
      appliedOvertimeWorkRequest: true,
      overtimeWorkRequestStartTime: undefined,
      overtimeWorkRequestEndTime: 1000,
      overtimeWorkRequestRemark: 'TEST_REMARK',
    };
    expect(() => {
      schemas(null).validateSync(testValue);
    }).toThrow('Overwork start time is not set');
  });
  test('終了時刻必須', () => {
    const testValue = {
      appliedOvertimeWorkRequest: true,
      overtimeWorkRequestStartTime: 900,
      overtimeWorkRequestEndTime: undefined,
      overtimeWorkRequestRemark: 'TEST_REMARK',
    };
    expect(() => {
      schemas(null).validateSync(testValue);
    }).toThrow('Overwork end time is not set');
  });
  test('開始終了時刻が前後逆', () => {
    const testValue = {
      appliedOvertimeWorkRequest: true,
      overtimeWorkRequestStartTime: 900,
      overtimeWorkRequestEndTime: 800,
      overtimeWorkRequestRemark: 'TEST_REMARK',
    };
    expect(() => {
      schemas(null).validateSync(testValue);
    }).toThrow('Overwork start time must be earlier than Overwork end time.');
  });
  test('備考必須', () => {
    const testValue = {
      appliedOvertimeWorkRequest: true,
      overtimeWorkRequestStartTime: 900,
      overtimeWorkRequestEndTime: 1000,
    };
    expect(() => {
      schemas(null).validateSync(testValue);
    }).toThrow('Overwork remark is not set');
  });
  test('備考255文字 制限', () => {
    const testValue = {
      appliedOvertimeWorkRequest: true,
      overtimeWorkRequestStartTime: 900,
      overtimeWorkRequestEndTime: 1000,
      overtimeWorkRequestRemark: 'T'.repeat(256),
    };
    expect(() => {
      schemas(null).validateSync(testValue);
    }).toThrow(
      'The number of characters of Overwork remark must be 255 or less.'
    );
  });
});

describe('早朝勤務申請', () => {
  test('正常', () => {
    const testValue = {
      appliedEarlyStartWorkRequest: true,
      earlyStartWorkRequestStartTime: 900,
      earlyStartWorkRequestEndTime: 1000,
      earlyStartWorkRequestRemark: 'TEST_REMARK',
    };
    expect(() => {
      schemas(null).validateSync(testValue);
    }).not.toThrow();
  });
  test('開始時刻必須', () => {
    const testValue = {
      appliedEarlyStartWorkRequest: true,
      earlyStartWorkRequestStartTime: undefined,
      earlyStartWorkRequestEndTime: 1000,
      earlyStartWorkRequestRemark: 'TEST_REMARK',
    };
    expect(() => {
      schemas(null).validateSync(testValue);
    }).toThrow('Early Start Work start time is not set');
  });
  test('終了時刻必須', () => {
    const testValue = {
      appliedEarlyStartWorkRequest: true,
      earlyStartWorkRequestStartTime: 900,
      earlyStartWorkRequestEndTime: undefined,
      earlyStartWorkRequestRemark: 'TEST_REMARK',
    };
    expect(() => {
      schemas(null).validateSync(testValue);
    }).toThrow('Early Start Work end time is not set');
  });
  test('開始終了時刻が前後逆', () => {
    const testValue = {
      appliedEarlyStartWorkRequest: true,
      earlyStartWorkRequestStartTime: 800,
      earlyStartWorkRequestEndTime: 600,
      earlyStartWorkRequestRemark: 'TEST_REMARK',
    };
    expect(() => {
      schemas(null).validateSync(testValue);
    }).toThrow(
      'Early Start Work start time must be earlier than Early Start Work end time.'
    );
  });
  test('備考必須', () => {
    const testValue = {
      appliedEarlyStartWorkRequest: true,
      earlyStartWorkRequestStartTime: 900,
      earlyStartWorkRequestEndTime: 1000,
    };
    expect(() => {
      schemas(null).validateSync(testValue);
    }).toThrow('Early Start Work remark is not set');
  });
  test('備考255文字 制限', () => {
    const testValue = {
      appliedEarlyStartWorkRequest: true,
      earlyStartWorkRequestStartTime: 900,
      earlyStartWorkRequestEndTime: 1000,
      earlyStartWorkRequestRemark: 'T'.repeat(256),
    };
    expect(() => {
      schemas(null).validateSync(testValue);
    }).toThrow(
      'The number of characters of Early Start Work remark must be 255 or less.'
    );
  });
});
