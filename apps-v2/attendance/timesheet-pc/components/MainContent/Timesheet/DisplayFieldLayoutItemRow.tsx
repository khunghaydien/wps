import React from 'react';

import classNames from 'classnames';
import reduce from 'lodash/reduce';

import Button from '@apps/commons/components/buttons/Button';
import AttTime3DigitHourField from '@apps/commons/components/fields/AttTime3DigitHourField';
import DateField from '@apps/commons/components/fields/DateField';
import TextField, {
  Props as TextFieldProps,
} from '@apps/commons/components/fields/TextField';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import TimeUtil from '@apps/commons/utils/TimeUtil';
import { CheckBox, Dropdown } from '@apps/core';

import {
  DailyRecordDisplayFieldLayoutItem,
  LAYOUT_ITEM_TYPE,
  LAYOUT_ITEM_VIEW_TYPE,
  LayoutItemNumberValue,
  SYSTEM_ITEM_NAME,
} from '@apps/attendance/domain/models/DailyRecordDisplayFieldLayout';
import {
  ACTIONS_FOR_FIX,
  ActionsForFix,
} from '@attendance/domain/models/FixDailyRequest';
import AttRecordModel from '@attendance/timesheet-pc/models/AttRecord';
import DailyRequestConditionsModel from '@attendance/timesheet-pc/models/DailyRequestConditions';

import { DailyRecordDisplayFieldLayoutItemValueForUI } from '@apps/attendance/timesheet-pc/modules/ui/dailyRecordDisplayFieldLayout';

import ActionForAttendanceDailyRequestButton, {
  LOCATION,
} from '@attendance/timesheet-pc/components/particles/ActionForAttendanceDailyRequestButton';

import dailyRowCssClassName from './helpers/dailyRowCssClassName';
import modifierCssClassName from './helpers/modifierCssClassName';
import { TIMESHEET_VIEW_TYPE } from './TimesheetViewType';

import './DisplayFieldLayoutItemRow.scss';

const ROOT =
  'timesheet-pc-main-content-timesheet-display-field-layout-item-row';

export type ItemProps = {
  item: DailyRecordDisplayFieldLayoutItem;
  value: DailyRecordDisplayFieldLayoutItemValueForUI;
  showDailyFix: boolean;
  readOnly: boolean;
  allowedAction: boolean;
  performableActionForFix: ActionsForFix;
  useFixDailyRequest: boolean;
  onUpdateValue: (key: string, value: number | string | boolean) => void;
  onSaveFields: () => void;
  submitDailyFix: () => void;
};

const NumberField = (props: TextFieldProps) => {
  return <TextField type="number" {...props} />;
};

export const DisplayFieldLayoutItem: React.FC<ItemProps> = ({
  item,
  value: itemValue,
  showDailyFix,
  readOnly,
  allowedAction,
  performableActionForFix,
  useFixDailyRequest,
  onUpdateValue,
  onSaveFields,
  submitDailyFix,
}) => {
  const { id, type } = item;
  const { existing, value, field } = itemValue;
  const { editable } = field ?? {};
  const disabled =
    readOnly ||
    performableActionForFix === ACTIONS_FOR_FIX.CancelRequest ||
    performableActionForFix === ACTIONS_FOR_FIX.CancelApproval;

  const onUpdateNumberValue = React.useCallback(
    (key: string, value: string) => {
      let update = true;
      const numbers = value.split('.');
      if (numbers[0]?.length > 6 || numbers[1]?.length > 6) {
        update = false;
      }

      update && onUpdateValue(key, value);
    },
    [onUpdateValue]
  );

  if (editable) {
    switch (type) {
      case LAYOUT_ITEM_TYPE.DATE:
        return (
          <td className={`${ROOT}__date`}>
            {existing && (
              <DateField
                value={DateUtil.customFormat(value?.value as string)}
                disabled={disabled}
                onChange={(value) => onUpdateValue(id, value)}
              />
            )}
          </td>
        );
      case LAYOUT_ITEM_TYPE.NUMBER: {
        const { viewType } = item;
        if (viewType && viewType === LAYOUT_ITEM_VIEW_TYPE.ATT_TIME) {
          return (
            <td className={`${ROOT}__time`}>
              {existing && (
                <AttTime3DigitHourField
                  value={TimeUtil.toHHmm(value?.value as string)}
                  disabled={disabled}
                  onBlur={(value) =>
                    onUpdateValue(id, TimeUtil.parseMinutes(value))
                  }
                />
              )}
            </td>
          );
        }
        return (
          <td className={`${ROOT}__number`}>
            {existing && (
              <NumberField
                title={(value as LayoutItemNumberValue)?.textValue}
                value={(value as LayoutItemNumberValue)?.textValue || undefined}
                disabled={disabled}
                placeholder={''}
                onChange={(e) => onUpdateNumberValue(id, e.target.value)}
              />
            )}
          </td>
        );
      }
      case LAYOUT_ITEM_TYPE.STRING: {
        if (item.pickList) {
          const pickList = [{ label: ' ', value: null }, ...item.pickList];
          return (
            <td className={`${ROOT}__dropdown`}>
              {existing && (
                <Dropdown
                  listBoxClassName={`${ROOT}__dropdown-option`}
                  title={
                    pickList.filter((item) => item.value === value?.value)[0]
                      ?.label
                  }
                  value={value?.value}
                  options={pickList}
                  disabled={disabled}
                  onSelect={(e) => onUpdateValue(id, e.value)}
                />
              )}
            </td>
          );
        }
        return (
          <td className={`${ROOT}__text`}>
            {existing && (
              <TextField
                title={value?.value as string}
                value={(value?.value as number) || undefined}
                disabled={disabled}
                maxLength={255}
                onChange={(e) => onUpdateValue(id, e.target.value)}
              />
            )}
          </td>
        );
      }
    }
  } else {
    switch (type) {
      case LAYOUT_ITEM_TYPE.BOOLEAN:
        return (
          <td className={`${ROOT}__checkbox`}>
            {existing && (
              <CheckBox disabled checked={value?.value as boolean} />
            )}
          </td>
        );
      case LAYOUT_ITEM_TYPE.NUMBER: {
        if (item.viewType === LAYOUT_ITEM_VIEW_TYPE.ATT_TIME) {
          return (
            <td className={`${ROOT}__time`}>
              {existing &&
                value?.value &&
                TimeUtil.toHHmm(parseInt(value?.value as string))}
            </td>
          );
        }
        return (
          <td className={`${ROOT}__string`}>
            {existing && (
              <div title={(value as LayoutItemNumberValue)?.textValue}>
                {(value as LayoutItemNumberValue)?.textValue}
              </div>
            )}
          </td>
        );
      }
      case LAYOUT_ITEM_TYPE.DATE:
        return (
          <td className={`${ROOT}__date`}>
            {existing && DateUtil.formatYMD(value?.value as string)}
          </td>
        );
      case LAYOUT_ITEM_TYPE.ACTION: {
        if (item.objectItemName === SYSTEM_ITEM_NAME.DAILY_FIX_REQUEST_BUTTON) {
          if (showDailyFix) {
            return (
              <td className={`${ROOT}__button`}>
                {existing && useFixDailyRequest && (
                  <ActionForAttendanceDailyRequestButton
                    type={performableActionForFix}
                    location={LOCATION.DISPLAY_FIELD}
                    disabled={readOnly || !allowedAction}
                    onClick={() => submitDailyFix()}
                  />
                )}
              </td>
            );
          }
        } else if (item.objectItemName === SYSTEM_ITEM_NAME.SAVE_BUTTON) {
          return (
            <td className={`${ROOT}__button`}>
              {existing && (
                <Button
                  type="primary"
                  disabled={disabled}
                  onClick={() => onSaveFields()}
                >
                  {msg().Com_Btn_Save}
                </Button>
              )}
            </td>
          );
        }
        return <td className={`${ROOT}__button`} />;
      }
      default:
        return (
          <td className={`${ROOT}__string`}>
            {existing && (
              <div title={value?.value as string}>{value?.value}</div>
            )}
          </td>
        );
    }
  }
};

type Props = {
  row: DailyRecordDisplayFieldLayoutItem[];
  values: Record<string, DailyRecordDisplayFieldLayoutItemValueForUI>;
  isManHoursGraphOpened?: boolean;
  requestConditions: DailyRequestConditionsModel;
  attRecord: AttRecordModel;
};

/**
 * @deprecated
 * 実装には使われていない。
 * VRT用に残している。
 * いずれ削除予定。
 */
const DisplayFieldLayoutItemRow: React.FC<Props> = ({
  row,
  values,
  isManHoursGraphOpened,
  requestConditions,
  attRecord,
}) => {
  const {
    effectualAllDayLeaveType,
    isAvailableToOperateAttTime,
    isApprovedAbsence,
    isAllowWorkDuringLeaveOfAbsence,
  } = requestConditions || {};

  const dailyRowCssClassNameMap = dailyRowCssClassName({
    ROOT,
    record: attRecord,
    effectualAllDayLeaveType,
    isManHoursGraphOpened,
    isApprovedAbsence,
    isAllowWorkDuringLeaveOfAbsence,
  });

  const className = classNames(
    ROOT,
    modifierCssClassName(ROOT, TIMESHEET_VIEW_TYPE.TABLE, {
      useFixDailyRequest: false,
    }),
    reduce(
      dailyRowCssClassNameMap,
      (arr, value, key) => {
        if (value) {
          arr.push(
            modifierCssClassName(key, TIMESHEET_VIEW_TYPE.TABLE, {
              useFixDailyRequest: false,
            })
          );
        }
        return arr;
      },
      []
    )
  );

  if (!row) {
    return null;
  }

  return (
    <tr className={className}>
      {row?.map((item) => (
        <DisplayFieldLayoutItem
          key={item.id}
          showDailyFix={isAvailableToOperateAttTime}
          item={item}
          value={
            values && values[item.id]
              ? values[item.id]
              : {
                  existing: false,
                  value: null,
                  field: null,
                }
          }
          readOnly={false}
          allowedAction={false}
          performableActionForFix={'None'}
          useFixDailyRequest={false}
          onUpdateValue={() => {}}
          onSaveFields={() => {}}
          submitDailyFix={() => {}}
        />
      ))}
    </tr>
  );
};

export default DisplayFieldLayoutItemRow;
