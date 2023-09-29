import * as React from 'react';

import styled from 'styled-components';

import $AttTimeRangeField from '@apps/commons/components/fields/AttTimeRangeField';
import msg from '@apps/commons/languages';

import { RestTimeReason } from '@attendance/domain/models/RestTimeReason';

import RestReason from './RestReason';
import * as helper from '@attendance/ui/helpers/dailyRecord';
import ImgBtnMinusField from '@attendance/timesheet-pc/images/btnMinusField.png';
import ImgBtnPlusField from '@attendance/timesheet-pc/images/btnPlusField.png';

// FIXME: https://github.com/microsoft/TypeScript/issues/37597
// @ts-ignore
const IconButton = styled.button.attrs(() => ({
  type: 'button',
}))`
  padding: 0;
  border: 0;
  margin: 0;
  background-color: transparent;
  cursor: pointer;
  :hover > img,
  :focus > img {
    filter: grayscale(50%);
  }
`;

const AddIconButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <IconButton onClick={onClick}>
    <img src={ImgBtnPlusField} alt={msg().Att_Btn_AddItem} />
  </IconButton>
);

const DeleteIconButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <IconButton onClick={onClick}>
    <img src={ImgBtnMinusField} alt={msg().Att_Btn_RemoveItem} />
  </IconButton>
);

const RestTimeItemContainer = styled.div`
  display: flex;
`;

const RestTimeItemIconCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  margin-right: 7px;
  :last-child: {
    margin-right: 0px;
  }
`;

const RestReasonCell = styled.div`
  width: 250px;
  margin-right: 15px;
`;

const AttTimeRangeField = styled($AttTimeRangeField)`
  margin-right: 15px;

  // FIXME: 下記がないと、ボタンとの間のスペースが意図しない長さになる
  .commons-fields-att-time-range-field__separation {
    padding: 5px;
  }
`;

const RestTime: React.FC<{
  record: {
    startTime: number | null;
    endTime: number | null;
    restReason: RestTimeReason | null;
  };
  restTimeReasons: RestTimeReason[];
  enabledRestReason: boolean;
  enableAdd: boolean;
  enableDelete: boolean;
  readOnly?: boolean;
  onUpdateStart: (value: number | null) => void;
  onUpdateEnd: (value: number | null) => void;
  onUpdateReason: (value: RestTimeReason | null) => void;
  onClickAdd: () => void;
  onClickDelete: () => void;
}> = ({
  record,
  restTimeReasons,
  enabledRestReason,
  enableAdd,
  enableDelete,
  readOnly,
  onUpdateStart,
  onUpdateEnd,
  onUpdateReason: $onUpdateReason,
  onClickAdd,
  onClickDelete,
}) => {
  const onUpdateReason = React.useCallback(
    (value: RestTimeReason | null) => {
      $onUpdateReason(value);
    },
    [$onUpdateReason]
  );
  return (
    <RestTimeItemContainer>
      <AttTimeRangeField
        startTime={helper.time.toHHmm(record.startTime)}
        endTime={helper.time.toHHmm(record.endTime)}
        onBlurAtStart={(value: string) =>
          onUpdateStart(helper.time.toNumberOrNull(value))
        }
        onBlurAtEnd={(value: string) =>
          onUpdateEnd(helper.time.toNumberOrNull(value))
        }
        disabled={readOnly}
      />
      {enabledRestReason && (
        <RestReasonCell>
          <RestReason
            value={record.restReason}
            restTimeReasons={restTimeReasons}
            onUpdateReason={onUpdateReason}
            readOnly={readOnly}
          />
        </RestReasonCell>
      )}
      <RestTimeItemIconCell>
        {enableAdd && !readOnly ? <AddIconButton onClick={onClickAdd} /> : null}
      </RestTimeItemIconCell>
      <RestTimeItemIconCell>
        {enableDelete && !readOnly ? (
          <DeleteIconButton onClick={onClickDelete} />
        ) : null}
      </RestTimeItemIconCell>
    </RestTimeItemContainer>
  );
};
RestTime.defaultProps = {
  readOnly: false,
};

export default RestTime;
