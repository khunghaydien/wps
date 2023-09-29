import * as FixDailyRequest from '../FixDailyRequest';

const { STATUS } = FixDailyRequest;

describe('getFixDailyRequestApprover', () => {
  it.each`
    status                  | daily      | fixDaily      | expected
    ${null}                 | ${null}    | ${null}       | ${''}
    ${null}                 | ${'daily'} | ${null}       | ${''}
    ${STATUS.APPROVED}      | ${'daily'} | ${'fixDaily'} | ${'fixDaily'}
    ${STATUS.PENDING}       | ${'daily'} | ${'fixDaily'} | ${'fixDaily'}
    ${STATUS.CANCELED}      | ${'daily'} | ${'fixDaily'} | ${'daily'}
    ${STATUS.RECALLED}      | ${'daily'} | ${'fixDaily'} | ${'daily'}
    ${STATUS.REJECTED}      | ${'daily'} | ${'fixDaily'} | ${'daily'}
    ${STATUS.NOT_REQUESTED} | ${'daily'} | ${'fixDaily'} | ${'daily'}
    ${STATUS.APPROVED}      | ${'daily'} | ${null}       | ${'daily'}
    ${STATUS.PENDING}       | ${'daily'} | ${null}       | ${'daily'}
    ${STATUS.CANCELED}      | ${'daily'} | ${null}       | ${'daily'}
    ${STATUS.RECALLED}      | ${'daily'} | ${null}       | ${'daily'}
    ${STATUS.REJECTED}      | ${'daily'} | ${null}       | ${'daily'}
    ${STATUS.NOT_REQUESTED} | ${'daily'} | ${null}       | ${'daily'}
    ${STATUS.APPROVED}      | ${null}    | ${'fixDaily'} | ${'fixDaily'}
    ${STATUS.PENDING}       | ${null}    | ${'fixDaily'} | ${'fixDaily'}
    ${STATUS.CANCELED}      | ${null}    | ${'fixDaily'} | ${''}
    ${STATUS.RECALLED}      | ${null}    | ${'fixDaily'} | ${''}
    ${STATUS.REJECTED}      | ${null}    | ${'fixDaily'} | ${''}
    ${STATUS.NOT_REQUESTED} | ${null}    | ${'fixDaily'} | ${''}
  `(
    'return "$expected" when [request.status=$status, dailyRecord.approver=$daily, request.approver=$fixDaily]',
    ({ status, daily, fixDaily, expected }) => {
      const currentDailyRecord = status
        ? {
            id: '1',
            approver01Name: daily,
            fixDailyRequest: fixDaily
              ? {
                  id: 'requestId',
                  status,
                  approver01Name: fixDaily,
                }
              : null,
          }
        : null;
      const dummyRecord = null;
      const records = [currentDailyRecord, dummyRecord].filter((r) => r);
      expect(FixDailyRequest.getFixDailyRequestApprover(records, '1')).toEqual(
        expected
      );
    }
  );
});
