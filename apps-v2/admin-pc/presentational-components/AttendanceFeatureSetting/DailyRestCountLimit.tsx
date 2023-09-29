import * as React from 'react';

import styled from 'styled-components';

import SelectField from '../../../commons/components/fields/SelectField';
import msg from '../../../commons/languages';

import * as ConfigUtil from '../../utils/ConfigUtil';
import * as RecordUtil from '../../utils/RecordUtil';

import PlaceInTemplate from '../../components/PlaceInTemplate';

type $Props = Readonly<{
  config: ConfigUtil.Config;
  disabled: boolean;
  tmpEditRecord: RecordUtil.Record;
  onChangeDetailItem: (arg0: string, arg1: any) => void;
  sfObjFieldValues: any;
}>;

type DailyRestCountLimitProps = Readonly<
  $Props & {
    msgkey: string;
  }
>;

const S = {
  SelectField: styled(SelectField)`
    &.slds-select {
      width: 42%;
    }
  `,
};

const DailyRestCount = (props: DailyRestCountLimitProps) => {
  const { msgkey, disabled, tmpEditRecord, config } = props;

  const options = props.sfObjFieldValues.dailyRestCountLimit;
  return (
    <div>
      {/* @ts-ignore */}
      <PlaceInTemplate template={msg()[msgkey]}>
        <S.SelectField
          onChange={(e) =>
            props.onChangeDetailItem('dailyRestCountLimit', e.target.value)
          }
          options={options}
          value={tmpEditRecord[config.key]}
          disabled={disabled}
        />
      </PlaceInTemplate>
    </div>
  );
};

export const DailyRestCountLimit = (props: $Props) => {
  return (
    <div>
      <DailyRestCount {...props} msgkey="Admin_Msg_Counts" />
    </div>
  );
};
