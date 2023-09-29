import React, { useMemo } from 'react';

import { isEmpty } from 'lodash';

import styled from 'styled-components';

import SelectField from '../../../commons/components/fields/SelectField';
import msg from '@apps/commons/languages';

const Container = styled.div`
  display: flex;
  flex-wrap: nowrap;
  font-size: 13px;
  margin-bottom: 4px;
`;

const Left = styled.div`
  margin-left: 0px;
`;

const Right = styled.div`
  margin-right: 35px;
`;

const Row = styled.div`
  flex-basis: 100%;
  display: flex;
  height: auto;
  line-height: 30px;
`;

const Label = styled.div`
  width: 250px;
  padding-left: 5px;
  background-color: #f2f5f8;
  color: #53688c;
  margin-left: 5px;
`;

const Value = styled.div`
  width: 200px;
  background-color: #fff;
  margin-left: 5px;
`;

const RequireIcon = styled.span`
  color: #f00;
  line-height: 1;
`;
type Props = {
  childrenKeys: {
    [key: string]: string;
  };
  disabled: boolean;
  mode: string;
  tmpEditRecord: Record<string, any>;
  onChangeDetailItem: (arg0: string, arg1: any) => void;
};

// 端数の選択肢
const FRACTION_STATE = {
  NONE: 'None', // 調整しない
  ROUND_UP_TO_HALF_DAY: 'RoundUpToHalfDay', // 0.5日に切り上げる
  ROUND_UP_TO_ONE_DAY: 'RoundUpToOneDay', // 1日に切り上げる
};

const FractionSelect: React.FC<Props> = (props) => {
  const halfDayOrUnderKey = props.childrenKeys.halfDayOrUnder;
  const oneDayUnderKey = props.childrenKeys.oneDayUnder;
  const halfDayOrUnderOptions = useMemo(() => {
    const options = [
      {
        text: msg().Admin_Lbl_AttLeaveFractionAdjustmentTypeNone,
        value: FRACTION_STATE.NONE,
      },
      {
        text: msg().Admin_Lbl_AttLeaveFractionAdjustmentTypeRoundUpToHalfDay,
        value: FRACTION_STATE.ROUND_UP_TO_HALF_DAY,
      },
      {
        text: msg().Admin_Lbl_AttLeaveFractionAdjustmentTypeRoundUpToOneDay,
        value: FRACTION_STATE.ROUND_UP_TO_ONE_DAY,
      },
    ];

    if (
      isEmpty(props.tmpEditRecord[halfDayOrUnderKey]) &&
      props.mode === 'edit'
    ) {
      options.unshift({
        text: msg().Admin_Lbl_PleaseSelect,
        value: null,
      });
    }
    return options;
  }, [halfDayOrUnderKey, props.mode, props.tmpEditRecord]);

  const oneDayUnderOptions = useMemo(() => {
    const options = [
      {
        text: msg().Admin_Lbl_AttLeaveFractionAdjustmentTypeNone,
        value: FRACTION_STATE.NONE,
      },
      {
        text: msg().Admin_Lbl_AttLeaveFractionAdjustmentTypeRoundUpToOneDay,
        value: FRACTION_STATE.ROUND_UP_TO_ONE_DAY,
      },
    ];

    if (isEmpty(props.tmpEditRecord[oneDayUnderKey]) && props.mode === 'edit') {
      options.unshift({
        text: msg().Admin_Lbl_PleaseSelect,
        value: null,
      });
    }
    return options;
  }, [oneDayUnderKey, props.mode, props.tmpEditRecord]);
  return (
    <Container>
      <Left>
        <Label>{msg().Admin_Lbl_AdjustFractionsHalfDayOrUnder}</Label>
        <Row>
          <RequireIcon>*</RequireIcon>
          <Value>
            <SelectField
              onChange={(e) => {
                props.onChangeDetailItem(
                  halfDayOrUnderKey,
                  e.currentTarget.value
                );
              }}
              disabled={props.disabled}
              options={halfDayOrUnderOptions}
              value={props.tmpEditRecord[halfDayOrUnderKey] ?? null}
              required={true}
            />
          </Value>
        </Row>
      </Left>
      <Right>
        <Label>{msg().Admin_Lbl_AdjustFractionsOneDayUnder}</Label>
        <Row>
          <RequireIcon>*</RequireIcon>
          <Value>
            <SelectField
              onChange={(e) => {
                props.onChangeDetailItem(oneDayUnderKey, e.currentTarget.value);
              }}
              disabled={props.disabled}
              options={oneDayUnderOptions}
              value={props.tmpEditRecord[oneDayUnderKey] ?? null}
              required={true}
            />
          </Value>
        </Row>
      </Right>
    </Container>
  );
};
export default FractionSelect;
