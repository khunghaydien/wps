import * as React from 'react';

import SelectField from '../../../commons/components/fields/SelectField';

import { Config } from '@apps/admin-pc/utils/ConfigUtil';

type Props = {
  config: Config;
  sfObjFieldValues: Record<string, any>;
  disabled: boolean;
  tmpEditRecord: Record<string, any>;
  onChangeDetailItem: (arg0: string, arg1: any) => void;
};

const ExtendItemCode: React.FC<Props> = (props) => {
  const { config, disabled, tmpEditRecord, onChangeDetailItem } = props;

  const { key } = config;

  const nameL0Key = React.useMemo(() => {
    return key.replace('Code', 'Name_L0');
  }, [key]);

  const nameL1Key = React.useMemo(() => {
    return key.replace('Code', 'Name_L1');
  }, [key]);

  const options = React.useMemo(() => {
    const values = key.substring(0, key.length - 6) + 'Values';

    return (props.sfObjFieldValues[values] || []).map(
      ({ code, label, name_L0, name_L1 }) => ({
        text: label,
        value: code,
        name_L0,
        name_L1,
      })
    );
  }, [key, props.sfObjFieldValues]);

  const onChange = React.useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.currentTarget.value;
      const option = options.find(
        (data) => data.value !== '' && data.value === value
      );

      onChangeDetailItem(key, value);
      onChangeDetailItem(nameL0Key, option.name_L0);
      onChangeDetailItem(nameL1Key, option.name_L1);
    },
    [key, nameL0Key, nameL1Key, onChangeDetailItem, options]
  );

  return (
    <SelectField
      value={tmpEditRecord[key]}
      options={options}
      onChange={onChange}
      disabled={disabled}
    />
  );
};

export default ExtendItemCode;
