export const FIELD_TYPE = {
  DESCRIPTION: 'Description',
  TITLE: 'Title',
} as const;

export type FieldType = typeof FIELD_TYPE[keyof typeof FIELD_TYPE];

export const OPERATOR_TYPE = {
  CONTAINS: 'Contains',
  END_WITH: 'EndWith',
  EQUALS: 'Equals',
  START_WITH: 'StartWith',
} as const;

export type OperatorType = typeof OPERATOR_TYPE[keyof typeof OPERATOR_TYPE];

export const REFERENCE_SCOPE_TYPE = {
  DEPARTMENT: 'Department',
  INDIVIDUAL: 'Individual',
  OVERALL: 'Overall',
} as const;

export type ReferenceScopeType =
  typeof REFERENCE_SCOPE_TYPE[keyof typeof REFERENCE_SCOPE_TYPE];

export const OVER_LAPPING_TYPE = {
  NONE: 'None',
  TO_ALL: 'ToAll',
  TO_LONGEST: 'ToLongest',
  TO_SHORTEST: 'ToShortest',
} as const;

export type OverlappingEvent =
  typeof OVER_LAPPING_TYPE[keyof typeof OVER_LAPPING_TYPE];

export const EXCEED_ACT_WORK_HOURS_TYPE = {
  NONE: 'None',
  REDUCE_EVENLY: 'ReduceEvenly',
  REDUCE_LONGER: 'ReduceLonger',
  REDUCE_LATER: 'ReduceLater',
} as const;

export type ExceededActWorkHours =
  typeof EXCEED_ACT_WORK_HOURS_TYPE[keyof typeof EXCEED_ACT_WORK_HOURS_TYPE];

export type AutoHoursAllocationDictItem = {
  key: string;
  internalUniqKey: string;
  fieldType: FieldType;
  operatorType: OperatorType;
  valueText: string;
  job:
    | {
        id: string;
        code: string;
        name: string;
        hasJobType: boolean;
      }
    | null
    | undefined;
  workCategory:
    | {
        workCategoryId: null | undefined | string;
        workCategoryCode: null | undefined | string;
        workCategoryName: null | undefined | string;
      }
    | null
    | undefined;
  referenceScopeType: ReferenceScopeType;
  priority: number;
  isFromResult?: boolean;
};

export type SurplusTimeRegistrationSetting = {
  surplusTimeRegistrationJob:
    | {
        id: string;
        code: string;
        name: string;
        hasJobType: boolean;
      }
    | null
    | undefined;
  surplusTimeRegistrationWorkCategory:
    | {
        workCategoryId: null | undefined | string;
        workCategoryCode: null | undefined | string;
        workCategoryName: null | undefined | string;
      }
    | null
    | undefined;
};

export type BasicSetting = SurplusTimeRegistrationSetting & {
  allocateMethodForOverlappingEvent: OverlappingEvent;
  allocateMethodForExceedActWorkHour: ExceededActWorkHours;
};

type DictBaseWarning = {
  level: 'Warn';
  code: 'TIME_WARN_DICTBASE_NOT_FOUND';
  params: Record<string, never>;
};

type InvalidMasterWarning = {
  level: 'Warn';
  code:
    | 'TIME_WARN_INVALID_JOB'
    | 'TIME_WARN_LOCKED_JOB'
    | 'TIME_WARN_INVALID_WORK_CATEGORY';
  params: { code: string; name: string };
};

export type Alert = DictBaseWarning | InvalidMasterWarning;

export type AutoHoursAllocationDictSurplusTime = {
  jobId: string;
  jobCode: string;
  jobName: string;
  hasJobType: boolean;
  workCategoryId: string;
  workCategoryCode: string;
  workCategoryName: string;
  alerts: Alert[] | null;
};

export const getLargestPriority = (
  allocationDictList:
    | {
        [key: string]: AutoHoursAllocationDictItem;
      }
    | AutoHoursAllocationDictItem[]
): number => {
  const priorityList = Object.values(allocationDictList).map(
    (value) => value.priority
  );
  return Math.max(...priorityList, 0);
};

/*
 * Priority Operator
 */
/* ヘルパー：処理を軽量にするため、keyと優先順位の対応だけに関心を絞る */
type PrioritiesByKey = { [key: string]: number };
type KeysByPriority = { [key: number]: string };

/* ヘルパー： ({ [key]: priority }) => ({ [priority]: key }) */
const generateKeysByPriority = (
  prioritiesByKey: PrioritiesByKey
): KeysByPriority =>
  Object.keys(prioritiesByKey).reduce(
    (dict, key) => (dict[prioritiesByKey[key]] = key) && dict,
    {}
  );

/*
 * サブロジック：該当の優先順位以降に位置する要素の順位を-1する（前に寄せる）
 * ({A: 2, B: 3, C: 5}, 2) => {A: 1, B: 2, C: 5}
 */
const shiftPriorities = (
  priorities: PrioritiesByKey,
  startAt: number
): PrioritiesByKey => {
  const nextPrioritiesByKey: PrioritiesByKey = { ...priorities };
  const keysByPriority: KeysByPriority = generateKeysByPriority(priorities);

  // 再帰
  const proc = (targetPriority: number) => {
    // 終了条件
    if (keysByPriority[targetPriority] === undefined) {
      return;
    }

    // 操作：優先順位を-1する
    const targetKey = keysByPriority[targetPriority];
    nextPrioritiesByKey[targetKey] = targetPriority - 1;
    keysByPriority[targetPriority - 1] = targetKey;
    delete keysByPriority[targetPriority];

    // 再帰
    proc(targetPriority + 1);
  };
  proc(startAt);

  return nextPrioritiesByKey;
};

/*
 * サブロジック：該当の優先順位以降に位置する要素の順位を+1する（後ろに押し込む）
 *  ({A: 1, B: 2, C: 4}, 1) => {A: 2, B: 3, C: 4}
 */
const unshiftPriorities = (
  priorities: PrioritiesByKey,
  startAt: number
): PrioritiesByKey => {
  const nextPrioritiesByKey: PrioritiesByKey = { ...priorities };
  const keysByPriority: KeysByPriority = generateKeysByPriority(priorities);

  // 再帰
  const proc = (targetPriority: number) => {
    // 終了条件
    if (keysByPriority[targetPriority] === undefined) {
      return;
    }

    // 再帰
    proc(targetPriority + 1);

    // 操作：優先順位を+1する
    const targetKey = keysByPriority[targetPriority];
    nextPrioritiesByKey[targetKey] = targetPriority + 1;
    keysByPriority[targetPriority + 1] = targetKey;
    delete keysByPriority[targetPriority];
  };
  proc(startAt);

  return nextPrioritiesByKey;
};

// メインロジック：要素の削除
const removePriority = (
  priorities: PrioritiesByKey,
  targetKey: string
): PrioritiesByKey => {
  const targetPriority = priorities[targetKey];

  // 削除対象の要素を取り除く
  const { [targetKey]: _, ...restPrioritiesByKey } = priorities;

  // 削除対象の要素が取り除かれたリストに対して、対象の優先順位以降に位置する要素の順位を-1する
  return shiftPriorities(restPrioritiesByKey, targetPriority + 1);
};

// メインロジック：優先順位の変更
const updatePriority = (
  priorities: PrioritiesByKey,
  targetKey: string,
  nextPriority: number
): PrioritiesByKey => {
  // 一時的に、変更対象の要素を取り除く
  const restOfTheTargetTemporarilyRemoved = removePriority(
    priorities,
    targetKey
  );

  return {
    // 変更対象が取り除かれたリストについて、
    // 移動先の優先順位を空けるため、該当の優先順位以降に位置する要素の順位を+1する
    ...unshiftPriorities(restOfTheTargetTemporarilyRemoved, nextPriority),

    // 上記の処理結果と、変更対象をマージする
    [targetKey]: nextPriority,
  };
};

// DictItemのリストの操作：要素の削除
export const updatePrioritiesOnRemoveItem = (
  dictItems: { [key: string]: AutoHoursAllocationDictItem },
  targetKey: string
): { [key: string]: AutoHoursAllocationDictItem } => {
  // メインロジック：要素の削除を実行して、結果を{key: 優先順位}で得る
  const prevPrioritiesByKey: PrioritiesByKey = Object.entries(dictItems).reduce(
    (byKey, [key, dictItem]) => (byKey[key] = dictItem.priority) && byKey,
    {}
  );
  const nextPrioritiesByKey = removePriority(prevPrioritiesByKey, targetKey);

  // 更新が必要な（実行前と実行結果で優先順位が異なる）DictItemを抽出して、優先順位を変更する
  const diff: { [key: string]: AutoHoursAllocationDictItem } = {};
  Object.entries(nextPrioritiesByKey).forEach(([key, nextPriority]) => {
    if (nextPriority !== prevPrioritiesByKey[key]) {
      diff[key] = { ...dictItems[key], priority: nextPriority };
    }
  });

  // 実行前のDictItemのリストから対象要素を取り除いて、更新差分とマージする
  const { [targetKey]: _, ...restDictItems } = dictItems;
  return {
    ...restDictItems,
    ...diff,
  };
};

// DictItemのリストの操作：優先順位の変更
export const updatePrioritiesOnChangeItemPriority = (
  dictItems: { [key: string]: AutoHoursAllocationDictItem },
  targetKey: string,
  nextPriority: number
): { [key: string]: AutoHoursAllocationDictItem } => {
  // メインロジック：優先順位の変更を実行して、結果を{key: 優先順位}で得る
  const prevPrioritiesByKey: PrioritiesByKey = Object.entries(dictItems).reduce(
    (byKey, [key, dictItem]) => (byKey[key] = dictItem.priority) && byKey,
    {}
  );
  const nextPrioritiesByKey = updatePriority(
    prevPrioritiesByKey,
    targetKey,
    nextPriority
  );

  // 更新が必要な（実行前と実行結果で優先順位が異なる）DictItemを抽出して、優先順位を変更する
  const diff: { [key: string]: AutoHoursAllocationDictItem } = {};
  Object.entries(nextPrioritiesByKey).forEach(([key, nextPriority]) => {
    if (nextPriority !== prevPrioritiesByKey[key]) {
      diff[key] = { ...dictItems[key], priority: nextPriority };
    }
  });

  // 実行前のDictItemのリストと更新差分をマージする
  return {
    ...dictItems,
    ...diff,
  };
};
