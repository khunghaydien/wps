import * as React from 'react';

import styled from 'styled-components';

// FIXME: core コンポーネントに input type='number' がないので移行できない。
import Input from '@apps/commons/components/fields/TextField';
import msg from '@apps/commons/languages';
import { parseNumberOrNull } from '@apps/commons/utils/NumberUtil';

import { RestTimeReason } from '@attendance/domain/models/RestTimeReason';

import RestReason from './RestReason';

const OtherRestTimeContainer = styled.div`
  display: flex;
`;
const InputCell = styled.div`
  display: flex;
  width: 174px;
  margin-right: 15px;
`;

const OtherRestTimeInput = styled(Input)`
  // .slds-input で 100% に上書きされるので important を付与した
  width: 7em !important;
  // 他のコンポーネントと大きさをそろえるために無理やり高さを変えている
  line-height: 1.875em;
  min-height: calc(1.875rem + (1px * 2));
`;

const MinuteText = styled.div`
  height: 32px;
  width: 102px;
  line-height: 32px;
  padding-left: 5px;
`;

const RestReasonCell = styled.div`
  width: 250px;
`;

const OtherRestTime: React.FC<{
  readOnly: boolean;
  value: number | null;
  reason: RestTimeReason | null;
  restTimeReasons: RestTimeReason[];
  enabledRestReason: boolean;
  onChangeTime: (value: number | null) => void;
  onChangeReason: (value: RestTimeReason | null) => void;
}> = ({
  readOnly,
  value,
  reason,
  restTimeReasons,
  enabledRestReason,
  onChangeTime: $onChangeTime,
  onChangeReason: $onChangeReason,
}) => {
  const onChangeTime = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (/^[0-9]+$/.test(String(value))) {
        $onChangeTime(parseNumberOrNull(value));
      } else {
        $onChangeTime(null);
      }
    },
    [$onChangeTime]
  );
  const onChangeReason = React.useCallback(
    (value: RestTimeReason | null) => {
      $onChangeReason(value);
    },
    [$onChangeReason]
  );
  return (
    <OtherRestTimeContainer>
      <InputCell>
        <OtherRestTimeInput
          type="number"
          min={0}
          max={2880}
          step={1}
          value={value === null ? '' : value || 0}
          onChange={onChangeTime}
          disabled={readOnly}
        />{' '}
        <MinuteText>{msg().Com_Lbl_Mins}</MinuteText>
      </InputCell>
      {enabledRestReason && (
        <RestReasonCell>
          <RestReason
            value={reason}
            restTimeReasons={restTimeReasons}
            onUpdateReason={onChangeReason}
            readOnly={readOnly}
          />
        </RestReasonCell>
      )}
    </OtherRestTimeContainer>
  );
};

export default OtherRestTime;
