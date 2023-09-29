import * as React from 'react';

import AttTimeField from '../../../commons/components/fields/AttTimeField';
import msg from '../../../commons/languages';
import { parseIntOrStringNull } from '../../../commons/utils/NumberUtil';
import TimeUtil from '../../../commons/utils/TimeUtil';

import * as ConfigUtil from '../../utils/ConfigUtil';
import * as RecordUtil from '../../utils/RecordUtil';

import PlaceInTemplate from '../../components/PlaceInTemplate';

import CheckboxField from './Fields/CheckboxField';

const ROOT = 'admin-pc-working-type-compensatory-leave-threshold';

type $Props = Readonly<{
  config: ConfigUtil.Config;
  disabled: boolean;
  tmpEditRecord: RecordUtil.Record;
  onChangeDetailItem: (arg0: string, arg1: any) => void;
  historyValueGetter: (arg0: string) => any;
}>;

type CompensatoryLeaveThresholdProps = Readonly<
  $Props & {
    msgkey: string;
  }
>;

const CompensatoryLeaveThreshold = (props: CompensatoryLeaveThresholdProps) => {
  const { msgkey, config, disabled, tmpEditRecord, onChangeDetailItem } = props;
  const { key } = config;
  return (
    <div className={`${ROOT}__item-value`}>
      {/* @ts-ignore */}
      <PlaceInTemplate template={msg()[msgkey]}>
        <AttTimeField
          key={key}
          disabled={disabled}
          onBlur={(value: string | null) => {
            onChangeDetailItem(key, String(TimeUtil.toMinutes(value)));
          }}
          value={TimeUtil.toHHmm(parseIntOrStringNull(tmpEditRecord[key]))}
          required
        />
      </PlaceInTemplate>
    </div>
  );
};

export const CompensatoryLeaveThresholdAllDay = (props: $Props) => {
  return (
    <div className={`${ROOT}__body`}>
      <CompensatoryLeaveThreshold
        {...props}
        msgkey="Admin_Msg_IfWorkingForXThenToAddCompensatoryLeaveThresholdAllDay"
      />
    </div>
  );
};

export const CompensatoryLeaveThresholdHalfDay = (
  props: Readonly<
    $Props & {
      checkboxKey: string;
    }
  >
) => {
  const { checkboxKey, ...$props } = props;
  const { disabled, tmpEditRecord, onChangeDetailItem } = $props;
  return (
    <CheckboxField
      value={!!tmpEditRecord[checkboxKey]}
      label={msg().Admin_Lbl_Use}
      disabled={disabled}
      onChange={(res: boolean) => onChangeDetailItem(checkboxKey, res)}
      render={({ value: checkboxValue }: { readonly value: boolean }) =>
        checkboxValue && (
          <CompensatoryLeaveThreshold
            key="content"
            {...$props}
            msgkey="Admin_Msg_IfWorkingForXThenToAddCompensatoryLeaveThresholdHalfDay"
          />
        )
      }
    />
  );
};
