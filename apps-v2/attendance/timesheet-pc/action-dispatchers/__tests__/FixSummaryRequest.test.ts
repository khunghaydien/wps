import DailyRequestConditions from '../../models/DailyRequestConditions';
import { STATUS as DAILY_REQUEST_STATUS } from '@attendance/domain/models/AttDailyRequest';

import Api, { ErrorResponse } from '../../../../../__tests__/mocks/ApiMock';
import DispatcherMock from '../../../../../__tests__/mocks/DispatcherMock';
// @ts-ignore
import { __get__ } from '../FixSummaryRequest';

describe('checkForUnapprovedRequestNotLeft(dailyRequestConditionsMap)', () => {
  const checkForUnapprovedRequestNotLeft = __get__(
    'checkForUnapprovedRequestNotLeft'
  );

  const dummyRequestMap = {
    [DAILY_REQUEST_STATUS.APPROVED]: { status: DAILY_REQUEST_STATUS.APPROVED },
    [DAILY_REQUEST_STATUS.APPROVAL_IN]: {
      status: DAILY_REQUEST_STATUS.APPROVAL_IN,
    },
    [DAILY_REQUEST_STATUS.REJECTED]: { status: DAILY_REQUEST_STATUS.REJECTED },
    [DAILY_REQUEST_STATUS.RECALLED]: { status: DAILY_REQUEST_STATUS.RECALLED },
    [DAILY_REQUEST_STATUS.CANCELED]: { status: DAILY_REQUEST_STATUS.CANCELED },
  };

  describe('承認待ちもしくは無効な申請がない場合', () => {
    const dispatchMock = new DispatcherMock();

    const dummyRequestConditionsMap = {
      '2018-01-01': DailyRequestConditions.createFromParams(
        // @ts-ignore
        { requestIds: [DAILY_REQUEST_STATUS.APPROVED] },
        dummyRequestMap,
        {},
        {}
      ),
      '2018-01-02': DailyRequestConditions.createFromParams(
        // @ts-ignore
        { requestIds: [DAILY_REQUEST_STATUS.APPROVED] },
        dummyRequestMap,
        {},
        {}
      ),
    };

    let result;

    beforeAll(() => {
      result = checkForUnapprovedRequestNotLeft(dummyRequestConditionsMap)(
        dispatchMock.dispatch
      );
    });

    test('true が返却される', () => {
      expect(result).toBe(true);
    });

    test('アクションは発行されない', () => {
      expect(dispatchMock.logged.length).toBe(0);
    });
  });

  describe('承認待ちの申請がある場合', () => {
    const dispatchMock = new DispatcherMock();

    const dummyRequestConditionsMap = {
      '2018-01-01': DailyRequestConditions.createFromParams(
        // @ts-ignore
        { requestIds: [DAILY_REQUEST_STATUS.APPROVAL_IN] },
        dummyRequestMap,
        {},
        {}
      ),
    };

    let result;

    beforeAll(() => {
      result = checkForUnapprovedRequestNotLeft(dummyRequestConditionsMap)(
        dispatchMock.dispatch
      );
    });

    test('false が返却される', () => {
      expect(result).toBe(false);
    });

    test('CATCH_BUSINESS_ERRORアクションが発行される', () => {
      expect(dispatchMock.logged[0].type).toBe('CATCH_BUSINESS_ERROR');
    });
  });

  describe('却下された申請がある場合', () => {
    const dispatchMock = new DispatcherMock();

    const dummyRequestConditionsMap = {
      '2018-01-01': DailyRequestConditions.createFromParams(
        // @ts-ignore
        { requestIds: [DAILY_REQUEST_STATUS.REJECTED] },
        dummyRequestMap,
        {},
        {}
      ),
    };

    let result;

    beforeAll(() => {
      result = checkForUnapprovedRequestNotLeft(dummyRequestConditionsMap)(
        dispatchMock.dispatch
      );
    });

    test('false が返却される', () => {
      expect(result).toBe(false);
    });

    test('CATCH_BUSINESS_ERRORアクションが発行される', () => {
      expect(dispatchMock.logged[0].type).toBe('CATCH_BUSINESS_ERROR');
    });
  });

  describe('申請取消された申請がある場合', () => {
    const dispatchMock = new DispatcherMock();

    const dummyRequestConditionsMap = {
      '2018-01-01': DailyRequestConditions.createFromParams(
        // @ts-ignore
        { requestIds: [DAILY_REQUEST_STATUS.RECALLED] },
        dummyRequestMap,
        {},
        {}
      ),
    };

    let result;

    beforeAll(() => {
      result = checkForUnapprovedRequestNotLeft(dummyRequestConditionsMap)(
        dispatchMock.dispatch
      );
    });

    test('false が返却される', () => {
      expect(result).toBe(false);
    });

    test('CATCH_BUSINESS_ERRORアクションが発行される', () => {
      expect(dispatchMock.logged[0].type).toBe('CATCH_BUSINESS_ERROR');
    });
  });

  describe('承認取消された申請がある場合', () => {
    const dispatchMock = new DispatcherMock();

    const dummyRequestConditionsMap = {
      '2018-01-01': DailyRequestConditions.createFromParams(
        // @ts-ignore
        { requestIds: [DAILY_REQUEST_STATUS.CANCELED] },
        dummyRequestMap,
        {},
        {}
      ),
    };

    let result;

    beforeAll(() => {
      result = checkForUnapprovedRequestNotLeft(dummyRequestConditionsMap)(
        dispatchMock.dispatch
      );
    });

    test('false が返却される', () => {
      expect(result).toBe(false);
    });

    test('CATCH_BUSINESS_ERRORアクションが発行される', () => {
      expect(dispatchMock.logged[0].type).toBe('CATCH_BUSINESS_ERROR');
    });
  });

  describe('承認待ちと無効な申請の両方がある場合', () => {
    const dispatchMock = new DispatcherMock();

    const dummyRequestConditionsMap = {
      '2018-01-01': DailyRequestConditions.createFromParams(
        // @ts-ignore
        { requestIds: [DAILY_REQUEST_STATUS.APPROVAL_IN] },
        dummyRequestMap,
        {},
        {}
      ),
      '2018-01-02': DailyRequestConditions.createFromParams(
        // @ts-ignore
        { requestIds: [DAILY_REQUEST_STATUS.CANCELED] },
        dummyRequestMap,
        {},
        {}
      ),
    };

    beforeAll(() => {
      checkForUnapprovedRequestNotLeft(dummyRequestConditionsMap)(
        dispatchMock.dispatch
      );
    });

    test('無効な申請のメッセージが優先される', () => {
      expect(dispatchMock.logged[0].payload.problem).toBe(
        'There are requests that were rejected or canceled during the period.'
      );
    });
  });
});

describe('checkConditionsWithConfirm(summaryId)', () => {
  const checkConditionsWithConfirm = __get__('checkConditionsWithConfirm');

  describe('API通信が成功し、確認事項がない場合', () => {
    const dispatchMock = new DispatcherMock();
    const callbackMock = jest.fn();
    const summaryId = 'no-confirm';

    beforeAll(() => {
      const confirm = () => () => Promise.resolve(true);
      Api.setDummyResponse('/att/request/fix-monthly/check', { summaryId }, {});
      return checkConditionsWithConfirm(
        summaryId,
        confirm
      )(dispatchMock.dispatch).then(callbackMock);
    });

    test('1. ローディング表示の開始', () => {
      expect(dispatchMock.logged[0].type).toBe('LOADING_START');
    });

    test('2. ローディング表示の終了', () => {
      expect(dispatchMock.logged[1].type).toBe('LOADING_END');
    });

    test('resolve時のコールバックには、第1引数としてtrueが渡される', () => {
      expect(callbackMock.mock.calls).toEqual([[true]]);
    });
  });

  describe('API通信が成功し、確認事項がある場合', () => {
    describe('→ 確認ダイアログで「OK」が押下される', () => {
      const dispatchMock = new DispatcherMock();
      const callbackMock = jest.fn();
      const summaryId = 'has-confirm';

      beforeAll(() => {
        const confirm = () => () => Promise.resolve(true);
        Api.setDummyResponse(
          '/att/request/fix-monthly/check',
          { summaryId },
          { confirmation: ['未入力日が 2 日あります。'] }
        );
        return checkConditionsWithConfirm(
          summaryId,
          confirm
        )(dispatchMock.dispatch).then(callbackMock);
      });

      test('1. ローディング表示の開始', () => {
        expect(dispatchMock.logged[0].type).toBe('LOADING_START');
      });

      test('2. ローディング表示の終了', () => {
        expect(dispatchMock.logged[1].type).toBe('LOADING_END');
      });

      test('resolve時のコールバックには、第1引数としてtrueが渡される', () => {
        expect(callbackMock.mock.calls).toEqual([[true]]);
      });
    });

    describe('→ 確認ダイアログで「キャンセル」が押下される', () => {
      const dispatchMock = new DispatcherMock();
      const callbackMock = jest.fn();
      const summaryId = 'has-confirm';

      beforeAll(() => {
        const confirm = () => () => Promise.resolve(false);
        Api.setDummyResponse(
          '/att/request/fix-monthly/check',
          { summaryId },
          { confirmation: ['未入力日が 2 日あります。'] }
        );
        return checkConditionsWithConfirm(
          summaryId,
          confirm
        )(dispatchMock.dispatch).then(callbackMock);
      });

      test('1. ローディング表示の開始', () => {
        expect(dispatchMock.logged[0].type).toBe('LOADING_START');
      });

      test('2. ローディング表示の終了', () => {
        expect(dispatchMock.logged[1].type).toBe('LOADING_END');
      });

      test('resolve時のコールバックには、第1引数としてfalseが渡される', () => {
        expect(callbackMock.mock.calls).toEqual([[false]]);
      });
    });
  });

  describe('API通信の結果、エラーが返却された場合', () => {
    const dispatchMock = new DispatcherMock();
    const callbackMock = jest.fn();
    const summaryId = 'error';

    beforeAll(() => {
      Api.setDummyResponse(
        '/att/request/fix-monthly/check',
        { summaryId },
        new ErrorResponse({ message: 'ダミーメッセージ' })
      );
      return checkConditionsWithConfirm(summaryId)(dispatchMock.dispatch).then(
        callbackMock
      );
    });

    test('1. ローディング表示の開始', () => {
      expect(dispatchMock.logged[0].type).toBe('LOADING_START');
    });

    test('2. エラーの通知', () => {
      expect(dispatchMock.logged[1].type).toBe('CATCH_API_ERROR');
    });

    test('3. ローディング表示の終了【エラー発生時もローディングが終了する】', () => {
      expect(dispatchMock.logged[2].type).toBe('LOADING_END');
    });

    test('resolve時のコールバックには、第1引数としてfalseが渡される', () => {
      expect(callbackMock.mock.calls).toEqual([[false]]);
    });
  });
});
