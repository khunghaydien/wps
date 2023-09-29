import * as React from 'react';

import styled from 'styled-components';

import msg from '../../../commons/languages';
import Button from '../../../core/elements/Button';
import { Font } from '../../../core/styles';

/**
 * モバイルの勤怠打刻は出勤退勤ボタンの両方が活性状態の場合、defaultActionをみてボタンのカラーを判定するが
 * ホーム画面の打刻ウィジェットではボタンのカラーを変更する必要がないため
 * 勤怠明細打刻情報取得のレスポンスパラメータであるdefaultActionはPropsに渡さない
 *
 * The timestamp for mobile uses the defaultAction to determine the color of the button when both the "In" and "Out" buttons are active.
 * However, it is not necessary to change the button color in the timestamp widget on the home screen.
 * So I don't pass “defaultAction” of timestamp information to Props.
 */
type Props = {
  onClickStartStampButton: () => void;
  onClickEndStampButton: () => void;
  isEnableStartStamp: boolean;
  isEnableEndStamp: boolean;
  isEnableRestartStamp: boolean;
};

const StartWorkStampButton = styled(Button)`
  padding: 0 17px;
  flex-basis: 50%;
  max-width: 177px;
  height: 64px;
  font-size: ${Font.size.XXL};
  margin-right: 16px;
`;

const EndWorkStampButton = styled(Button)`
  padding: 0 17px;
  flex-basis: 50%;
  max-width: 177px;
  height: 64px;
  font-size: ${Font.size.XXL};
`;

const StampButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  white-space: nowrap;
`;

const StampButtons = (props: Props) => (
  <StampButtonContainer>
    <StartWorkStampButton
      onClick={props.onClickStartStampButton}
      disabled={!props.isEnableStartStamp && !props.isEnableRestartStamp}
      color="primary"
    >
      {props.isEnableRestartStamp
        ? msg().Com_Btn_ClockRein
        : msg().Com_Btn_ClockIn}
    </StartWorkStampButton>
    <EndWorkStampButton
      onClick={props.onClickEndStampButton}
      disabled={!props.isEnableEndStamp}
      color="primary"
    >
      {msg().Com_Btn_ClockOut}
    </EndWorkStampButton>
  </StampButtonContainer>
);

export default StampButtons;
