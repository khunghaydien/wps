import STATUS from '@apps/domain/models/approval/request/Status';
import {
  ACTIONS_FOR_FIX,
  detectPerformableActionForFix,
} from '@apps/domain/models/attendance/AttFixSummaryRequest';

describe('setPerformableActionForFix()', () => {
  test('ステータス[未申請]: 承認申請を実行可能', () => {
    expect(detectPerformableActionForFix(STATUS.NotRequested)).toEqual(
      ACTIONS_FOR_FIX.Submit
    );
  });

  test('ステータス[申請取消]: 承認申請を実行可能', () => {
    expect(detectPerformableActionForFix(STATUS.Recalled)).toEqual(
      ACTIONS_FOR_FIX.Submit
    );
  });

  test('ステータス[承認取消]: 承認申請を実行可能', () => {
    expect(detectPerformableActionForFix(STATUS.Canceled)).toEqual(
      ACTIONS_FOR_FIX.Submit
    );
  });

  test('ステータス[却下]: 承認申請を実行可能', () => {
    expect(detectPerformableActionForFix(STATUS.Rejected)).toEqual(
      ACTIONS_FOR_FIX.Submit
    );
  });

  test('ステータス[承認待ち]: 申請取消を実行可能', () => {
    expect(detectPerformableActionForFix(STATUS.Pending)).toEqual(
      ACTIONS_FOR_FIX.CancelRequest
    );
  });

  test('ステータス[承認済み]: 承認取消を実行可能', () => {
    expect(detectPerformableActionForFix(STATUS.Approved)).toEqual(
      ACTIONS_FOR_FIX.CancelApproval
    );
  });

  test('ステータス[null](休職休業中): 承認申請などの操作は不可', () => {
    expect(detectPerformableActionForFix(null)).toEqual(ACTIONS_FOR_FIX.None);
  });
});
