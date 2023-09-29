import snapshotDiff from 'snapshot-diff';

import { CODE } from '../../../../../../domain/models/attendance/AttDailyRequestType';
import { Timesheet } from '../../../../../../domain/models/attendance/Timesheet';

import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../availableRequests';

describe('reducer()', () => {
  it('@@INIT', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff([], next)).toMatchSnapshot();
  });

  it(`${__get__('INITIALIZE')}`, () => {
    const map = {
      'request-1': [CODE.Absence, CODE.Direct, CODE.Leave],
      'request-2': [
        CODE.LateArrival,
        CODE.EarlyStartWork,
        CODE.OvertimeWork,
        CODE.EarlyLeave,
      ],
    };
    const timesheet = {
      requestTypes: {
        [CODE.Absence]: {
          code: CODE.Absence,
          name: 'Mock Absence',
        },
        [CODE.Direct]: {
          code: CODE.Direct,
          name: 'Mock Direct',
        },
        [CODE.Leave]: {
          code: CODE.Leave,
          name: 'Mock Leave',
        },
        [CODE.LateArrival]: {
          code: CODE.LateArrival,
          name: 'Mock Late Arrival',
        },
      },
    } as unknown as Timesheet;

    const next = reducer(
      undefined,
      actions.initialize('request-1', map, timesheet)
    );
    expect(snapshotDiff([], next)).toMatchSnapshot();
  });

  it(`${__get__('CLEAR')}`, () => {
    const next = reducer(undefined, actions.clear());
    expect(snapshotDiff([{ requestTypeName: 'test' }], next)).toMatchSnapshot();
  });
});
