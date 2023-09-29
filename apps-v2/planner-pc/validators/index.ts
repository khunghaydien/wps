import msg from '../../commons/languages';

import { CalendarEvent } from '../models/calendar-event/CalendarEvent';

/**
 * Event のバリデーション
 * @param eventData {Object} 予定オブジェクト
 * @return {Array<Object>} エラーのリスト
 */
// eslint-disable-next-line import/prefer-default-export
export function validateEvent(
  eventData: CalendarEvent
): readonly { message: string }[] {
  const errors = [];

  let start = eventData.start.clone();
  let end = eventData.end.clone();
  if (eventData.isAllDay) {
    // 終日予定の場合は時刻部分を 開始日 00:00 ~ 終了日 23:59:59.999 に変換してからチェック
    start = start.startOf('day');
    end = end.startOf('day').add(1, 'day').add(-1, 'ms');
  }
  if (end.diff(start) < 0) {
    errors.push({ message: msg().Cal_Msg_InvalidStartEndTime });
  }

  if (!eventData.isOrganizer) {
    errors.push({ message: msg().Cal_Msg_CannotEditInvitedEvent });
  }

  return errors;
}
