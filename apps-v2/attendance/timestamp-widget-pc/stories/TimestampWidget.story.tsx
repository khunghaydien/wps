import React from 'react';

import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

import TimestampWidget from '../components/TimestampWidget';

import { withProvider } from '../../../../.storybook/decorator/Provider';
import configureStore from '../store/configureStore';

const Decorator = styled.div`
  width: 100%;
  height: 304px;
  padding: 13px 17px;
`;

const store = configureStore();

export default {
  title: 'attendance/timestamp-widget-pc/TimeStampWidget',
  decorators: [
    withProvider(store),
    (story: Function) => <Decorator>{story()}</Decorator>,
  ],
};

export const InEnable = () => (
  <TimestampWidget
    onClickStartStampButton={action('onClickStartStampButton')}
    onClickEndStampButton={action('onClickEndStampButton')}
    isEnableStartStamp
    isEnableEndStamp={false}
    isEnableRestartStamp={false}
    comment="今日も元気にお仕事します！"
    onChange={action('onChange')}
    onClickSubmitButton={action('onClickSubmitButton')}
    onClickCancelButton={action('onClickCancelButton')}
    insufficientRestTime={45}
    isShowModal={false}
  />
);

export const OutEnable = () => (
  <TimestampWidget
    onClickStartStampButton={action('onClickStartStampButton')}
    onClickEndStampButton={action('onClickEndStampButton')}
    isEnableStartStamp={false}
    isEnableEndStamp
    isEnableRestartStamp={false}
    comment="疲れたので、お家に帰って寝ます"
    onChange={action('onChange')}
    onClickSubmitButton={action('onClickSubmitButton')}
    onClickCancelButton={action('onClickCancelButton')}
    insufficientRestTime={45}
    isShowModal={false}
  />
);

export const ReInEnable = () => (
  <TimestampWidget
    onClickStartStampButton={action('onClickStartStampButton')}
    onClickEndStampButton={action('onClickEndStampButton')}
    isEnableStartStamp={false}
    isEnableEndStamp={false}
    isEnableRestartStamp
    comment='寝ようと思ったんですけど、"""""止むに止まれぬ事情"""""があるので、家で作業します。'
    onChange={action('onChange')}
    onClickSubmitButton={action('onClickSubmitButton')}
    onClickCancelButton={action('onClickCancelButton')}
    insufficientRestTime={45}
    isShowModal={false}
  />
);

ReInEnable.storyName = 'Re-in Enable';

export const InAndOutEnable = () => (
  <TimestampWidget
    onClickStartStampButton={action('onClickStartStampButton')}
    onClickEndStampButton={action('onClickEndStampButton')}
    isEnableStartStamp
    isEnableEndStamp
    isEnableRestartStamp={false}
    comment="今日は天気がいいですね"
    onChange={action('onChange')}
    onClickSubmitButton={action('onClickSubmitButton')}
    onClickCancelButton={action('onClickCancelButton')}
    insufficientRestTime={45}
    isShowModal={false}
  />
);

InAndOutEnable.storyName = 'In and Out Enable';

export const ModalOnTimeStampWidget = () => (
  <TimestampWidget
    onClickStartStampButton={action('onClickStartStampButton')}
    onClickEndStampButton={action('onClickEndStampButton')}
    isEnableStartStamp
    isEnableEndStamp={false}
    isEnableRestartStamp={false}
    comment="休憩しなかったんですけど、コレって異端？"
    onChange={action('onChange')}
    onClickSubmitButton={action('onClickSubmitButton')}
    onClickCancelButton={action('onClickCancelButton')}
    insufficientRestTime={45}
    isShowModal
  />
);

ModalOnTimeStampWidget.storyName = 'Modal on TimeStampWidget';
