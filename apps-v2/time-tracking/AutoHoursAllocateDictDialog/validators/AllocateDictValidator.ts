import msg from '@commons/languages';
import TextUtil from '@commons/utils/TextUtil';

import { AutoHoursAllocationDictItem as DictItem } from '@apps/domain/models/time-tracking/AutoHoursAllocationDict';

import ValidError from './ValidationError';

type ItemValidation = (arg0: DictItem) => true | ValidError;
type ConfiguredItemValidator = (arg0: DictItem) => [boolean, ValidError[]];
type ConfiguredTotalValidator = (arg0: DictItem[]) => [boolean, ValidError[]];

const extractErrors = (results: (true | ValidError)[]): ValidError[] =>
  results.filter(
    (result): result is ValidError => result instanceof ValidError
  );

/**
 * The DictItem label is formatted as "Priority 999"
 */
const dictItemlabel = (dictItem: DictItem): string =>
  `${msg().Time_Lbl_Priority} ${dictItem.priority}`;

/*
 * Item Validation
 */

const validateTextValueIsNotNull: ItemValidation = (dictItem) =>
  dictItem.valueText.trim() !== '' ||
  new ValidError(
    TextUtil.template(msg().Com_Err_NullValue, msg().Time_Lbl_RelevantText),
    'ValueTextIsNull',
    { label: dictItemlabel(dictItem), field: 'valueText', record: dictItem.key }
  );

const validateJobIsNotNull: ItemValidation = (dictItem) =>
  (dictItem.job !== null && dictItem.job !== undefined) ||
  new ValidError(
    TextUtil.template(msg().Com_Err_NullValue, msg().Trac_Lbl_Job),
    'JobIsNull',
    { label: dictItemlabel(dictItem), field: 'job', record: dictItem.key }
  );

/*
 * Configured Validator
 */

export const validateDictItem: ConfiguredItemValidator = (
  dictItem: DictItem
): [boolean, ValidError[]] => {
  const results = [
    validateTextValueIsNotNull(dictItem),
    validateJobIsNotNull(dictItem),
  ];

  const errors = extractErrors(results);
  return [errors.length === 0, errors];
};

export const validateDictToSave: ConfiguredTotalValidator = (dictItems) => {
  if (dictItems.length === 0) {
    return [true, []];
  }

  // Validate each items
  const itemResults = dictItems.flatMap((dictItem) => {
    const [, errors] = validateDictItem(dictItem);
    return errors;
  });

  // Evaluate
  const results = [...itemResults];
  const errors = extractErrors(results);
  return [errors.length === 0, errors];
};
