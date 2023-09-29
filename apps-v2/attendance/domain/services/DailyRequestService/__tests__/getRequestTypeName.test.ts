import {
  CODE as REQUEST_TYPE_CODE,
  DailyRequestNameMap,
  NAME_CODE as REQUEST_TYPE_NAME_CODE,
} from '@attendance/domain/models/AttDailyRequestType';

import getRequestTypeName from '../getRequestTypeName';

const nameMap: DailyRequestNameMap = Object.values(
  REQUEST_TYPE_NAME_CODE
).reduce((obj, code) => {
  obj[code] = {
    code,
    name: `${code}'s name`,
  };
  return obj;
}, {});

it.each(Object.values(REQUEST_TYPE_CODE))('should execute', (code) => {
  expect(
    getRequestTypeName(code, {
      nameMap,
      dailyRecord: { isFlexWithoutCore: false },
    })
  ).toBe(nameMap[code].name);
});

describe('EarlyLeave', () => {
  it("should return EarlyLeave's name", () => {
    expect(
      getRequestTypeName(REQUEST_TYPE_CODE.EarlyLeave, {
        nameMap,
        dailyRecord: { isFlexWithoutCore: false },
      })
    ).toBe(nameMap[REQUEST_TYPE_NAME_CODE.EarlyLeave].name);
  });
  it("should return EarlyLeaveMinWorkHours's name", () => {
    expect(
      getRequestTypeName(REQUEST_TYPE_CODE.EarlyLeave, {
        nameMap,
        dailyRecord: { isFlexWithoutCore: true },
      })
    ).toBe(nameMap[REQUEST_TYPE_NAME_CODE.EarlyLeaveMinWorkHours].name);
  });
});
