import isEditable from '../isEditable';

describe('isEditableByParam', () => {
  it.each`
    startTime | endTime | lockedDailyRecord | lockedTimesheet | requiredInput | expected
    ${null}   | ${null} | ${false}          | ${false}        | ${false}      | ${false}
    ${null}   | ${null} | ${false}          | ${false}        | ${true}       | ${true}
    ${null}   | ${null} | ${false}          | ${true}         | ${false}      | ${false}
    ${null}   | ${null} | ${false}          | ${true}         | ${true}       | ${false}
    ${null}   | ${null} | ${true}           | ${false}        | ${false}      | ${false}
    ${null}   | ${null} | ${true}           | ${false}        | ${true}       | ${false}
    ${null}   | ${null} | ${true}           | ${true}         | ${false}      | ${false}
    ${null}   | ${null} | ${true}           | ${true}         | ${true}       | ${false}
    ${0}      | ${null} | ${false}          | ${false}        | ${false}      | ${true}
    ${0}      | ${null} | ${false}          | ${false}        | ${true}       | ${true}
    ${0}      | ${null} | ${false}          | ${true}         | ${false}      | ${false}
    ${0}      | ${null} | ${false}          | ${true}         | ${true}       | ${false}
    ${0}      | ${null} | ${true}           | ${false}        | ${false}      | ${false}
    ${0}      | ${null} | ${true}           | ${false}        | ${true}       | ${false}
    ${0}      | ${null} | ${true}           | ${true}         | ${false}      | ${false}
    ${0}      | ${null} | ${true}           | ${true}         | ${true}       | ${false}
    ${null}   | ${0}    | ${false}          | ${false}        | ${false}      | ${true}
    ${null}   | ${0}    | ${false}          | ${false}        | ${true}       | ${true}
    ${null}   | ${0}    | ${false}          | ${true}         | ${false}      | ${false}
    ${null}   | ${0}    | ${false}          | ${true}         | ${true}       | ${false}
    ${null}   | ${0}    | ${true}           | ${false}        | ${false}      | ${false}
    ${null}   | ${0}    | ${true}           | ${false}        | ${true}       | ${false}
    ${null}   | ${0}    | ${true}           | ${true}         | ${false}      | ${false}
    ${null}   | ${0}    | ${true}           | ${true}         | ${true}       | ${false}
  `(
    'should be $expected if [startTime=$startTime, endTime=$endTime, lockedDailyRecord=$lockedDailyRecord, lockedTimesheet=$lockedTimesheet, requiredInput=$requiredInput]',
    ({ expected, ...param }) => {
      expect(isEditable(param)).toBe(expected);
    }
  );
});
