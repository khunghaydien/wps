import moment from 'moment';

export type BaseEvent = {
  id?: string;
  title: string;
  start: moment.Moment;
  end: moment.Moment;
  isAllDay: boolean;
  isOrganizer: boolean;
  isOuting: boolean;
  location?: string;
  remarks?: string;
  createdServiceBy: string;
  externalEventId?: string;
  job: {
    id: string;
    code: string;
    name: string;
  };
  workCategoryId: string;
  workCategoryName: string;
  layout: {
    startMinutesOfDay: number;
    endMinutesOfDay: number;
    containsAllDay: boolean;
  };
  left?: number;
  width?: number;
};

// set left and width for each event in the associated group
// 破壊的メソッド
const calculatePositionAndWidth = (
  columns: BaseEvent[][],
  width: number
): void => {
  const n = columns.length;

  for (let i = 0; i < n; i++) {
    const col = columns[i];
    for (let j = 0; j < col.length; j++) {
      const eventBox = col[j];
      eventBox.left = i * (width / n);
      eventBox.width = width / n;
    }
  }
};

const collidesWith = (a: BaseEvent, b: BaseEvent): boolean => {
  return (
    a.layout.endMinutesOfDay > b.layout.startMinutesOfDay &&
    a.layout.startMinutesOfDay < b.layout.endMinutesOfDay
  );
};

/**
 * イベントのレイアウト情報を算出して付与する
 * @param {array} events - 予定
 * @param {number} columnWidth - 表示するカラムの幅
 */
export const addPositionAndWidth = (
  events: BaseEvent[],
  columnWidth: number
): BaseEvent[] => {
  if (!events) {
    return [];
  }

  let columns = [];
  let lastEventEnding = null;

  const eventLength = events.length;
  for (let i = 0; i < eventLength; i++) {
    if (!events[i].layout.containsAllDay) {
      // NOTE: 終日枠に表示させる予定は無視する
      if (
        lastEventEnding !== null &&
        events[i].layout.startMinutesOfDay >= lastEventEnding
      ) {
        calculatePositionAndWidth(columns, columnWidth);
        columns = [];
        lastEventEnding = null;
      }

      let placed = false;
      for (let j = 0; j < columns.length; j++) {
        const col = columns[j];
        if (!collidesWith(col[col.length - 1], events[i])) {
          col.push(events[i]);
          placed = true;
          break;
        }
      }
      if (!placed) {
        columns.push([events[i]]);
      }
      if (
        lastEventEnding === null ||
        events[i].layout.endMinutesOfDay > lastEventEnding
      ) {
        lastEventEnding = events[i].layout.endMinutesOfDay;
      }
    }
  }
  if (columns.length > 0) {
    calculatePositionAndWidth(columns, columnWidth);
  }
  return events;
};

export default { addPositionAndWidth };
