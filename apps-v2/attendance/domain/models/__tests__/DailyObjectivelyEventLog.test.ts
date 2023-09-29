import * as Model from '../DailyObjectivelyEventLog';
import { EVENT_TYPE } from '../ObjectivelyEventLogRecord';

describe('isOverAllowingDeviationTime()', () => {
  it.each`
    inputTime | time    | deviatedTime | allowingDeviationTime | result
    ${null}   | ${null} | ${null}      | ${null}               | ${false}
    ${null}   | ${null} | ${0}         | ${null}               | ${false}
    ${null}   | ${0}    | ${null}      | ${null}               | ${false}
    ${null}   | ${0}    | ${0}         | ${null}               | ${false}
    ${0}      | ${null} | ${null}      | ${null}               | ${false}
    ${0}      | ${null} | ${0}         | ${null}               | ${false}
    ${0}      | ${0}    | ${null}      | ${null}               | ${false}
    ${0}      | ${0}    | ${0}         | ${null}               | ${false}
    ${null}   | ${null} | ${null}      | ${0}                  | ${false}
    ${null}   | ${null} | ${0}         | ${0}                  | ${false}
    ${null}   | ${0}    | ${null}      | ${0}                  | ${true}
    ${null}   | ${0}    | ${0}         | ${0}                  | ${true}
    ${0}      | ${null} | ${null}      | ${0}                  | ${true}
    ${0}      | ${null} | ${0}         | ${0}                  | ${true}
    ${0}      | ${0}    | ${null}      | ${0}                  | ${false}
    ${0}      | ${0}    | ${0}         | ${0}                  | ${false}
    ${480}    | ${490}  | ${10}        | ${0}                  | ${true}
    ${480}    | ${470}  | ${-10}       | ${0}                  | ${true}
    ${480}    | ${490}  | ${10}        | ${9}                  | ${true}
    ${480}    | ${470}  | ${-10}       | ${9}                  | ${true}
    ${480}    | ${490}  | ${10}        | ${10}                 | ${false}
    ${480}    | ${490}  | ${10}        | ${11}                 | ${false}
    ${480}    | ${470}  | ${-10}       | ${11}                 | ${false}
    ${480}    | ${470}  | ${0}         | ${0}                  | ${true}
  `(
    'return $result when [inputTime=$inputTime, time=$time, deviatedTime=$deviatedTime, allowingDeviationTime=$allowingDeviationTime].',
    ({ result, inputTime, time, deviatedTime, allowingDeviationTime }) => {
      expect(
        Model.isOverAllowingDeviationTime(
          inputTime,
          {
            id: '',
            time,
            eventType: EVENT_TYPE.ENTERING,
            eventLogUpdatedBy: '',
            deviatedTime,
            linked: '',
          },
          allowingDeviationTime
        )
      ).toBe(result);
    }
  );
});

describe('getAttentionType()', () => {
  it.each`
    inputTime | time    | deviatedTime | allowingDeviationTime | reason       | requireDeviationReason | result
    ${null}   | ${null} | ${null}      | ${null}               | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.NONE}
    ${null}   | ${null} | ${0}         | ${null}               | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.NONE}
    ${null}   | ${0}    | ${null}      | ${null}               | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.NONE}
    ${null}   | ${0}    | ${0}         | ${null}               | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.NONE}
    ${0}      | ${null} | ${null}      | ${null}               | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.NONE}
    ${0}      | ${null} | ${0}         | ${null}               | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.NONE}
    ${0}      | ${0}    | ${null}      | ${null}               | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.NONE}
    ${0}      | ${0}    | ${0}         | ${null}               | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.NONE}
    ${null}   | ${null} | ${null}      | ${0}                  | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.NONE}
    ${null}   | ${null} | ${0}         | ${0}                  | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.NONE}
    ${null}   | ${0}    | ${null}      | ${0}                  | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.WARNING}
    ${null}   | ${0}    | ${0}         | ${0}                  | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.WARNING}
    ${0}      | ${null} | ${null}      | ${0}                  | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.WARNING}
    ${0}      | ${null} | ${0}         | ${0}                  | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.WARNING}
    ${0}      | ${0}    | ${null}      | ${0}                  | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.NONE}
    ${0}      | ${0}    | ${0}         | ${0}                  | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.NONE}
    ${480}    | ${490}  | ${10}        | ${0}                  | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.WARNING}
    ${480}    | ${470}  | ${-10}       | ${0}                  | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.WARNING}
    ${480}    | ${490}  | ${10}        | ${9}                  | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.WARNING}
    ${480}    | ${470}  | ${-10}       | ${9}                  | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.WARNING}
    ${480}    | ${490}  | ${10}        | ${10}                 | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.NONE}
    ${480}    | ${490}  | ${10}        | ${11}                 | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.NONE}
    ${480}    | ${470}  | ${-10}       | ${11}                 | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.NONE}
    ${480}    | ${470}  | ${0}         | ${0}                  | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.WARNING}
    ${480}    | ${470}  | ${-10}       | ${0}                  | ${'reason'}  | ${false}               | ${Model.ATTENTION_TYPE.NONE}
    ${480}    | ${470}  | ${-10}       | ${0}                  | ${''}        | ${false}               | ${Model.ATTENTION_TYPE.WARNING}
    ${480}    | ${470}  | ${-10}       | ${0}                  | ${null}      | ${false}               | ${Model.ATTENTION_TYPE.WARNING}
    ${480}    | ${470}  | ${-10}       | ${0}                  | ${undefined} | ${false}               | ${Model.ATTENTION_TYPE.WARNING}
    ${null}   | ${null} | ${null}      | ${null}               | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.NONE}
    ${null}   | ${null} | ${0}         | ${null}               | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.NONE}
    ${null}   | ${0}    | ${null}      | ${null}               | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.NONE}
    ${null}   | ${0}    | ${0}         | ${null}               | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.NONE}
    ${0}      | ${null} | ${null}      | ${null}               | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.NONE}
    ${0}      | ${null} | ${0}         | ${null}               | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.NONE}
    ${0}      | ${0}    | ${null}      | ${null}               | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.NONE}
    ${0}      | ${0}    | ${0}         | ${null}               | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.NONE}
    ${null}   | ${null} | ${null}      | ${0}                  | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.NONE}
    ${null}   | ${null} | ${0}         | ${0}                  | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.NONE}
    ${null}   | ${0}    | ${null}      | ${0}                  | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.ERROR}
    ${null}   | ${0}    | ${0}         | ${0}                  | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.ERROR}
    ${0}      | ${null} | ${null}      | ${0}                  | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.ERROR}
    ${0}      | ${null} | ${0}         | ${0}                  | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.ERROR}
    ${0}      | ${0}    | ${null}      | ${0}                  | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.NONE}
    ${0}      | ${0}    | ${0}         | ${0}                  | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.NONE}
    ${480}    | ${490}  | ${10}        | ${0}                  | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.ERROR}
    ${480}    | ${470}  | ${-10}       | ${0}                  | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.ERROR}
    ${480}    | ${490}  | ${10}        | ${9}                  | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.ERROR}
    ${480}    | ${470}  | ${-10}       | ${9}                  | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.ERROR}
    ${480}    | ${490}  | ${10}        | ${10}                 | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.NONE}
    ${480}    | ${490}  | ${10}        | ${11}                 | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.NONE}
    ${480}    | ${470}  | ${-10}       | ${11}                 | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.NONE}
    ${480}    | ${470}  | ${0}         | ${0}                  | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.ERROR}
    ${480}    | ${470}  | ${-10}       | ${0}                  | ${'reason'}  | ${true}                | ${Model.ATTENTION_TYPE.NONE}
    ${480}    | ${470}  | ${-10}       | ${0}                  | ${''}        | ${true}                | ${Model.ATTENTION_TYPE.ERROR}
    ${480}    | ${470}  | ${-10}       | ${0}                  | ${null}      | ${true}                | ${Model.ATTENTION_TYPE.ERROR}
    ${480}    | ${470}  | ${-10}       | ${0}                  | ${undefined} | ${true}                | ${Model.ATTENTION_TYPE.ERROR}
  `(
    'return "$result" when [inputTime=$inputTime, time=$time, deviatedTime=$deviatedTime, allowingDeviationTime=$allowingDeviationTime, requireDeviationReason=$requireDeviationReason, reason=$reason].',
    ({
      result,
      inputTime,
      time,
      deviatedTime,
      allowingDeviationTime,
      requireDeviationReason,
      reason,
    }) => {
      expect(
        Model.getAttentionType({
          inputTime,
          record: {
            id: '',
            time,
            eventType: EVENT_TYPE.ENTERING,
            eventLogUpdatedBy: '',
            deviatedTime,
            linked: '',
          },
          allowingDeviationTime,
          requireDeviationReason,
          reason,
        })
      ).toBe(result);
    }
  );
});

describe('getAttentionTypeAtDaily', () => {
  describe.each(['entering', 'leaving'])('%s', (name) => {
    it('should check each log.', () => {
      for (let i = 0; i < 3; i++) {
        const logs = [null, null, null];
        logs[i] = {
          setting: {},
          entering: {
            time: 0,
            deviatedTime: 0,
          },
          leaving: {
            time: 0,
            deviatedTime: 0,
          },
          allowingDeviationTime: 5,
          requireDeviationReason: false,
        };
        logs[i][name] = {
          time: 6,
          deviatedTime: 5,
        };
        const resultEntering = Model.getAttentionTypeAtDaily({
          startTime: 0,
          endTime: 0,
          dailyObjectivelyEventLog: {
            logs,
          } as unknown as Model.DailyObjectivelyEventLog,
        });
        expect(resultEntering).toBe(Model.ATTENTION_TYPE.WARNING);
      }
    });
    it("should be 'none' if it don't over time.", () => {
      const dailyObjectivelyEventLog = {
        logs: [
          {
            setting: {},
            entering: {
              time: 0,
            },
            leaving: {
              time: 0,
            },
            allowingDeviationTime: null,
            requireDeviationReason: false,
          },
          null,
          null,
        ],
      } as unknown as Model.DailyObjectivelyEventLog;
      dailyObjectivelyEventLog.logs[0][name].time = 6;
      const result = Model.getAttentionTypeAtDaily({
        startTime: 0,
        endTime: 0,
        dailyObjectivelyEventLog,
      });
      expect(result).toBe(Model.ATTENTION_TYPE.NONE);
    });
    it("should return 'warning' if requireDeviationReason is false", () => {
      const dailyObjectivelyEventLog = {
        logs: [
          {
            setting: {},
            entering: {
              time: 0,
            },
            leaving: {
              time: 0,
            },
            allowingDeviationTime: null,
            requireDeviationReason: false,
          },
          {
            setting: {},
            entering: {
              time: 0,
            },
            leaving: {
              time: 0,
            },
            allowingDeviationTime: 5,
            requireDeviationReason: false,
          },
          {
            setting: {},
            entering: {
              time: 6,
            },
            leaving: {
              time: 0,
            },
            allowingDeviationTime: 5,
            requireDeviationReason: false,
          },
        ],
      } as unknown as Model.DailyObjectivelyEventLog;
      dailyObjectivelyEventLog.logs[0][name].time = 6;
      const result = Model.getAttentionTypeAtDaily({
        startTime: 0,
        endTime: 0,
        dailyObjectivelyEventLog,
      });
      expect(result).toBe(Model.ATTENTION_TYPE.WARNING);
    });
    it("should return 'error' if requireDeviationReason is true", () => {
      const dailyObjectivelyEventLog = {
        logs: [
          {
            setting: {},
            entering: {
              time: 0,
            },
            leaving: {
              time: 0,
            },
            allowingDeviationTime: null,
            requireDeviationReason: false,
          },
          {
            setting: {},
            entering: {
              time: 0,
            },
            leaving: {
              time: 0,
            },
            allowingDeviationTime: 5,
            requireDeviationReason: false,
          },
          {
            setting: {},
            entering: {
              time: 6,
            },
            leaving: {
              time: 0,
            },
            allowingDeviationTime: 5,
            requireDeviationReason: true,
          },
        ],
      } as unknown as Model.DailyObjectivelyEventLog;
      dailyObjectivelyEventLog.logs[0][name].time = 6;
      const result = Model.getAttentionTypeAtDaily({
        startTime: 0,
        endTime: 0,
        dailyObjectivelyEventLog,
      });
      expect(result).toBe(Model.ATTENTION_TYPE.ERROR);
    });
    it("should be 'none' if it has reason.", () => {
      const dailyObjectivelyEventLog = {
        logs: [
          {
            setting: {},
            entering: {
              time: 0,
            },
            leaving: {
              time: 0,
            },
            allowingDeviationTime: 5,
            requireDeviationReason: false,
          },
          null,
          null,
        ],
      } as unknown as Model.DailyObjectivelyEventLog;
      dailyObjectivelyEventLog.logs[0][name].time = 6;
      dailyObjectivelyEventLog[
        `deviated${name.slice(0, 1).toUpperCase() + name.slice(1)}TimeReason`
      ] = {
        value: null,
        text: 'reason',
      };
      const result = Model.getAttentionTypeAtDaily({
        startTime: 0,
        endTime: 0,
        dailyObjectivelyEventLog,
      });
      expect(result).toBe(Model.ATTENTION_TYPE.NONE);
    });
  });
  it("should return 'none' if DailyObjectivelyEventLog is null", () => {
    const result = Model.getAttentionTypeAtDaily({
      startTime: 0,
      endTime: 0,
      dailyObjectivelyEventLog: null,
    });
    expect(result).toBe(Model.ATTENTION_TYPE.NONE);
  });
});
