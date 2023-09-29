import STATUS from '@apps/domain/models/approval/request/Status';
import AttRecordModel from '@attendance/timesheet-pc/models/AttRecord';

import {
  // @ts-ignore
  __get__,
} from '../DailyRow';

describe('createFixDailyRequestClassName()', () => {
  const method = __get__('createFixDailyRequestClassName');
  it.each`
    today           | recordDate      | startTime | endTime | status                 | result
    ${'2022-02-23'} | ${'2022-02-22'} | ${null}   | ${null} | ${STATUS.Approved}     | ${'--warning'}
    ${'2022-02-23'} | ${'2022-02-22'} | ${null}   | ${null} | ${STATUS.Pending}      | ${'--warning'}
    ${'2022-02-23'} | ${'2022-02-22'} | ${null}   | ${null} | ${STATUS.Canceled}     | ${''}
    ${'2022-02-23'} | ${'2022-02-22'} | ${null}   | ${null} | ${STATUS.Rejected}     | ${''}
    ${'2022-02-23'} | ${'2022-02-22'} | ${null}   | ${null} | ${STATUS.Recalled}     | ${''}
    ${'2022-02-23'} | ${'2022-02-22'} | ${null}   | ${null} | ${STATUS.NotRequested} | ${''}
    ${'2022-02-23'} | ${'2022-02-22'} | ${0}      | ${0}    | ${STATUS.Approved}     | ${'--approved'}
    ${'2022-02-23'} | ${'2022-02-22'} | ${0}      | ${0}    | ${STATUS.Pending}      | ${'--pending'}
    ${'2022-02-23'} | ${'2022-02-22'} | ${0}      | ${0}    | ${STATUS.Canceled}     | ${'--warning'}
    ${'2022-02-23'} | ${'2022-02-22'} | ${0}      | ${0}    | ${STATUS.Rejected}     | ${'--warning'}
    ${'2022-02-23'} | ${'2022-02-22'} | ${0}      | ${0}    | ${STATUS.Recalled}     | ${'--warning'}
    ${'2022-02-23'} | ${'2022-02-22'} | ${0}      | ${0}    | ${STATUS.NotRequested} | ${'--not-requested'}
    ${'2022-02-22'} | ${'2022-02-22'} | ${0}      | ${0}    | ${STATUS.NotRequested} | ${'--not-requested'}
    ${'2022-02-22'} | ${'2022-02-22'} | ${null}   | ${0}    | ${STATUS.NotRequested} | ${''}
    ${'2022-02-22'} | ${'2022-02-22'} | ${0}      | ${null} | ${STATUS.NotRequested} | ${'--not-requested'}
  `(
    'return $result when [status=$status, startTime=$startTime, endTime=$endTime]',
    ({ today, recordDate, startTime, endTime, status, result }) => {
      const className = method(
        {
          startTime,
          endTime,
          recordDate,
          fixDailyRequest: {
            status,
          },
        } as AttRecordModel,
        today
      );
      if (result) {
        expect(className).toMatch(new RegExp(`.*${result}`));
      } else {
        expect(className).toBe(result);
      }
    }
  );
});
