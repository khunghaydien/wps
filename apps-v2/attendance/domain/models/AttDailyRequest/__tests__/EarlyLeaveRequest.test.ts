import { compose } from '@commons/utils/FnUtil';

import { AttDailyRecord } from '../../AttDailyRecord';
import { EarlyLeaveReason } from '../../EarlyLeaveReason';
import * as EarlyLeaveRequest from '../EarlyLeaveRequest';

describe('compose(defaultEndTimeByEarlyLeaveReason, defaultEndTimeByDailyRecord)', () => {
  const getEndTime =
    (dailyRecord: AttDailyRecord, earlyLeaveReason: EarlyLeaveReason) =>
    (request: EarlyLeaveRequest.EarlyLeaveRequest) =>
      compose(
        EarlyLeaveRequest.defaultEndTimeByEarlyLeaveReason(earlyLeaveReason),
        EarlyLeaveRequest.defaultEndTimeByDailyRecord(dailyRecord)
      )(request).endTime;

  it.each`
    isFlexWithoutCore | useEarlyLeaveReason | selectedReason                             | personalReason | useManagePersonalReason | expected
    ${false}          | ${false}            | ${null}                                    | ${false}       | ${false}                | ${'request'}
    ${false}          | ${false}            | ${null}                                    | ${false}       | ${true}                 | ${'request'}
    ${false}          | ${false}            | ${null}                                    | ${true}        | ${false}                | ${'request'}
    ${false}          | ${false}            | ${null}                                    | ${true}        | ${true}                 | ${'request'}
    ${false}          | ${true}             | ${null}                                    | ${false}       | ${false}                | ${'request'}
    ${false}          | ${true}             | ${null}                                    | ${false}       | ${true}                 | ${'request'}
    ${false}          | ${true}             | ${null}                                    | ${true}        | ${false}                | ${'request'}
    ${false}          | ${true}             | ${null}                                    | ${true}        | ${true}                 | ${'request'}
    ${false}          | ${true}             | ${{ earlyLeaveEndTime: 'selectedReason' }} | ${true}        | ${true}                 | ${'request'}
    ${false}          | ${true}             | ${{ earlyLeaveEndTime: null }}             | ${true}        | ${true}                 | ${'request'}
    ${true}           | ${false}            | ${null}                                    | ${false}       | ${false}                | ${'personal'}
    ${true}           | ${false}            | ${null}                                    | ${false}       | ${true}                 | ${'objective'}
    ${true}           | ${false}            | ${null}                                    | ${true}        | ${false}                | ${'personal'}
    ${true}           | ${false}            | ${null}                                    | ${true}        | ${true}                 | ${'personal'}
    ${true}           | ${true}             | ${null}                                    | ${false}       | ${false}                | ${'personal'}
    ${true}           | ${true}             | ${null}                                    | ${false}       | ${true}                 | ${'objective'}
    ${true}           | ${true}             | ${null}                                    | ${true}        | ${false}                | ${'personal'}
    ${true}           | ${true}             | ${null}                                    | ${true}        | ${true}                 | ${'personal'}
    ${true}           | ${true}             | ${{ earlyLeaveEndTime: 'selectedReason' }} | ${true}        | ${true}                 | ${'selectedReason'}
  `(
    'should return $expected when [$isFlexWithoutCore, $useEarlyLeaveReason, $selectedReason, $personalReason, $useManagePersonalReason ]',
    ({
      isFlexWithoutCore,
      useEarlyLeaveReason,
      selectedReason,
      personalReason,
      useManagePersonalReason,
      expected,
    }) => {
      expect(
        getEndTime(
          {
            startTime: 'startTime',
            endTime: 'endTime',
            earlyLeaveEndTime: 'request',
            personalReasonEarlyLeaveEndTime: 'personal' as unknown as number,
            objectiveReasonEarlyLeaveEndTime: 'objective' as unknown as number,
            isFlexWithoutCore,
            useEarlyLeaveReason,
          } as unknown as AttDailyRecord,
          selectedReason
        )({
          isFlexWithoutCore,
          useEarlyLeaveReason,
          useManagePersonalReason,
          personalReason,
          endTime: 'request' as unknown as number,
        } as unknown as EarlyLeaveRequest.EarlyLeaveRequest)
      ).toEqual(expected);
    }
  );
});

describe('getEndTimeByDailyRecord', () => {
  it.each`
    isFlexWithoutCore | startTime      | endTime      | personalReason | useManagePersonalReason | expected
    ${false}          | ${null}        | ${null}      | ${false}       | ${false}                | ${'request'}
    ${false}          | ${null}        | ${null}      | ${false}       | ${true}                 | ${'request'}
    ${false}          | ${null}        | ${null}      | ${true}        | ${false}                | ${'request'}
    ${false}          | ${null}        | ${null}      | ${true}        | ${true}                 | ${'request'}
    ${false}          | ${null}        | ${'endTime'} | ${false}       | ${false}                | ${'request'}
    ${false}          | ${null}        | ${'endTime'} | ${false}       | ${true}                 | ${'request'}
    ${false}          | ${null}        | ${'endTime'} | ${true}        | ${false}                | ${'request'}
    ${false}          | ${null}        | ${'endTime'} | ${true}        | ${true}                 | ${'request'}
    ${false}          | ${'startTime'} | ${null}      | ${false}       | ${false}                | ${'request'}
    ${false}          | ${'startTime'} | ${null}      | ${false}       | ${true}                 | ${'request'}
    ${false}          | ${'startTime'} | ${null}      | ${true}        | ${false}                | ${'request'}
    ${false}          | ${'startTime'} | ${null}      | ${true}        | ${true}                 | ${'request'}
    ${false}          | ${'startTime'} | ${'endTime'} | ${false}       | ${false}                | ${'request'}
    ${false}          | ${'startTime'} | ${'endTime'} | ${false}       | ${true}                 | ${'request'}
    ${false}          | ${'startTime'} | ${'endTime'} | ${true}        | ${false}                | ${'request'}
    ${false}          | ${'startTime'} | ${'endTime'} | ${true}        | ${true}                 | ${'request'}
    ${true}           | ${null}        | ${null}      | ${false}       | ${false}                | ${'request'}
    ${true}           | ${null}        | ${null}      | ${false}       | ${true}                 | ${'request'}
    ${true}           | ${null}        | ${null}      | ${true}        | ${false}                | ${'request'}
    ${true}           | ${null}        | ${null}      | ${true}        | ${true}                 | ${'request'}
    ${true}           | ${null}        | ${'endTime'} | ${false}       | ${false}                | ${'request'}
    ${true}           | ${null}        | ${'endTime'} | ${false}       | ${true}                 | ${'request'}
    ${true}           | ${null}        | ${'endTime'} | ${true}        | ${false}                | ${'request'}
    ${true}           | ${null}        | ${'endTime'} | ${true}        | ${true}                 | ${'request'}
    ${true}           | ${'startTime'} | ${null}      | ${false}       | ${false}                | ${'request'}
    ${true}           | ${'startTime'} | ${null}      | ${false}       | ${true}                 | ${'request'}
    ${true}           | ${'startTime'} | ${null}      | ${true}        | ${false}                | ${'request'}
    ${true}           | ${'startTime'} | ${null}      | ${true}        | ${true}                 | ${'request'}
    ${true}           | ${'startTime'} | ${'endTime'} | ${false}       | ${false}                | ${'personal'}
    ${true}           | ${'startTime'} | ${'endTime'} | ${false}       | ${true}                 | ${'objective'}
    ${true}           | ${'startTime'} | ${'endTime'} | ${true}        | ${false}                | ${'personal'}
    ${true}           | ${'startTime'} | ${'endTime'} | ${true}        | ${true}                 | ${'personal'}
  `(
    'should return $expected when [$isFlexWithoutCore, $startTime, $endTime, $personalReason, $useManagePersonalReason ]',
    ({
      isFlexWithoutCore,
      startTime,
      endTime,
      personalReason,
      useManagePersonalReason,
      expected,
    }) => {
      expect(
        EarlyLeaveRequest.getEndTimeByDailyRecord(
          {
            useManagePersonalReason,
            personalReason,
            endTime: 'request' as unknown as number,
            isFlexWithoutCore,
          } as unknown as EarlyLeaveRequest.EarlyLeaveRequest,
          {
            startTime,
            endTime,
            earlyLeaveEndTime: 'request',
            personalReasonEarlyLeaveEndTime: 'personal' as unknown as number,
            objectiveReasonEarlyLeaveEndTime: 'objective' as unknown as number,
            isFlexWithoutCore,
          } as unknown as AttDailyRecord
        )
      ).toEqual(expected);
    }
  );
});
