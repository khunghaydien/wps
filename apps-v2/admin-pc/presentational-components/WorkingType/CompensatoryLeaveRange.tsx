import React, { SyntheticEvent, useEffect } from 'react';

import { FunctionTypeList } from '../../constants/functionType';

import SelectField from '../../../commons/components/fields/SelectField';
import msg from '../../../commons/languages';

import { LEAVE_RANGE, LeaveRange } from '@attendance/domain/models/LeaveRange';

import * as ConfigUtil from '../../utils/ConfigUtil';
import * as RecordUtil from '../../utils/RecordUtil';

type Props = {
  configList: ConfigUtil.ConfigList;
  config: ConfigUtil.Config;
  disabled: boolean;
  tmpEditRecord: RecordUtil.Record;
  useFunction: FunctionTypeList;
  sfObjFieldValues: {
    [key: string]: any;
  };
  onChangeDetailItem: (key: string, value: any) => void;
  baseValueGetter: (key: string) => any;
  historyValueGetter: (key: string) => any;
};

const getEnableLeaveRange = (
  configList: ConfigUtil.ConfigList,
  functionTypeList: FunctionTypeList,
  baseValueGetter: (key: string) => any,
  historyValueGetter: (key: string) => any
): Array<LeaveRange> => {
  const getValue = (key: string) =>
    ConfigUtil.getEffectiveConfig(
      key,
      configList,
      functionTypeList,
      baseValueGetter,
      historyValueGetter
    )
      ? historyValueGetter(key)
      : undefined;

  const result = [LEAVE_RANGE.Day];

  if (getValue('useAMHalfDayLeave')) {
    result.push(LEAVE_RANGE.AM);
  }

  if (getValue('usePMHalfDayLeave')) {
    result.push(LEAVE_RANGE.PM);
  }

  if (getValue('useHalfDayLeave')) {
    result.push(LEAVE_RANGE.Half);
  }

  return result;
};

const createOptions = (
  leaveRange: LeaveRange[],
  fieldValue: {
    label: string;
    value: LeaveRange;
  }[]
): {
  text: string;
  value: LeaveRange;
}[] => {
  const msgMap = fieldValue.reduce((prev, { label, value }) => {
    prev[value] = msg()[label];
    return prev;
  }, {} as any);

  const options = leaveRange.map<{
    text: string;
    value: LeaveRange;
  }>((value) => ({
    text: msgMap[value],
    value,
  }));

  return options;
};

const CompensatoryLeaveRange = (props: Props) => {
  const {
    configList,
    config,
    disabled,
    tmpEditRecord,
    useFunction,
    baseValueGetter,
    historyValueGetter,
    sfObjFieldValues,
    onChangeDetailItem,
  } = props;

  const { key, isRequired, props: optionsKey } = config;

  const leaveRange = getEnableLeaveRange(
    configList,
    useFunction,
    baseValueGetter,
    historyValueGetter
  );

  const options = createOptions(leaveRange, sfObjFieldValues[optionsKey || '']);

  const tempValues = (tmpEditRecord[key] as LeaveRange[]) || [];
  const values = tempValues.filter((v) => leaveRange.includes(v));

  useEffect(() => {
    if (values.length !== tempValues.length) {
      onChangeDetailItem(key, values);
    }
  }, [values]);

  // Only unmount.
  useEffect(
    () => () => {
      onChangeDetailItem(key, []);
    },
    []
  );

  return (
    <SelectField
      value={values}
      options={options}
      onChange={(event: SyntheticEvent<HTMLSelectElement>) => {
        const { options }: any = event.currentTarget;
        const newValues = [...options]
          .filter((o) => o.selected)
          .map((o) => o.value);
        onChangeDetailItem(key, newValues);
      }}
      required={isRequired}
      disabled={disabled}
      multiple
      size={options.length}
    />
  );
};

export default CompensatoryLeaveRange;
