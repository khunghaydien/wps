import React from 'react';

import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

import ConfirmModal from '../components/ConfirmModal';

const Decorator = styled.div`
  position: relative;
  width: 407px;
  height: 304px;
`;

export default {
  title: 'attendance/timestamp-widget-pc',
  decorators: [(story: Function) => <Decorator>{story()}</Decorator>],
};

export const _ConfirmModal = () => (
  <ConfirmModal
    onClickSubmitButton={action('onClickSubmitButton')}
    onClickCancelButton={action('onClickCancelButton')}
    insufficientRestTime={45}
  />
);

_ConfirmModal.storyName = 'ConfirmModal';
