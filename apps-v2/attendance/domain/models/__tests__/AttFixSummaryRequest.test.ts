import {
  ACTIONS_FOR_FIX,
  detectPerformableActionForFix,
  getPermissionTestConditionsForActionForFix,
  STATUS,
} from '@attendance/domain/models/AttFixSummaryRequest';

describe('setPerformableActionForFix()', () => {
  test('ステータス[未申請]: 承認申請を実行可能', () => {
    expect(detectPerformableActionForFix(STATUS.NOT_REQUESTED)).toEqual(
      ACTIONS_FOR_FIX.Submit
    );
  });

  test('ステータス[申請取消]: 承認申請を実行可能', () => {
    expect(detectPerformableActionForFix(STATUS.RECALLED)).toEqual(
      ACTIONS_FOR_FIX.Submit
    );
  });

  test('ステータス[承認取消]: 承認申請を実行可能', () => {
    expect(detectPerformableActionForFix(STATUS.CANCELED)).toEqual(
      ACTIONS_FOR_FIX.Submit
    );
  });

  test('ステータス[却下]: 承認申請を実行可能', () => {
    expect(detectPerformableActionForFix(STATUS.REJECTED)).toEqual(
      ACTIONS_FOR_FIX.Submit
    );
  });

  test('ステータス[承認待ち]: 申請取消を実行可能', () => {
    expect(detectPerformableActionForFix(STATUS.PENDING)).toEqual(
      ACTIONS_FOR_FIX.CancelRequest
    );
  });

  test('ステータス[承認済み]: 承認取消を実行可能', () => {
    expect(detectPerformableActionForFix(STATUS.APPROVED)).toEqual(
      ACTIONS_FOR_FIX.CancelApproval
    );
  });

  test('ステータス[null](休職休業中): 承認申請などの操作は不可', () => {
    expect(detectPerformableActionForFix(null)).toEqual(ACTIONS_FOR_FIX.None);
  });
});

describe('getPermissionTestConditionsForActionForFix()', () => {
  test.each([
    [
      ACTIONS_FOR_FIX.None,
      {
        allowIfByEmployee: true,
      },
    ],
    [
      ACTIONS_FOR_FIX.Submit,
      {
        allowIfByEmployee: true,
        requireIfByDelegate: ['submitAttRequestByDelegate'],
      },
    ],
    [
      ACTIONS_FOR_FIX.CancelRequest,
      {
        allowIfByEmployee: true,
        requireIfByDelegate: ['cancelAttRequestByDelegate'],
      },
    ],
    [
      ACTIONS_FOR_FIX.CancelApproval,
      {
        requireIfByEmployee: ['cancelAttApprovalByEmployee'],
        requireIfByDelegate: ['cancelAttApprovalByDelegate'],
      },
    ],
    [null, undefined],
  ])('%s', (actionsForFix, expected) => {
    expect(getPermissionTestConditionsForActionForFix(actionsForFix)).toEqual(
      expected
    );
  });
});
