import * as React from 'react';

import styled, { css, FlattenSimpleInterpolation } from 'styled-components';

import msg from '../../../commons/languages';
import { Text } from '../../../core';

import { EventViewModel } from '../../modules/entities/events';

import { Style } from '../../styles';

type Props = Readonly<
  {
    id: string;
    assistive: boolean;
    onClick: () => void;
  } & EventViewModel
>;

const defaultStyle = css`
  z-index: 2;
  opacity: 1;
  width: 100%;
`;

const assistiveStyle = css`
  z-index: 0;
  background: #fff;
  opacity: 0.01;
  width: 100%;

  hover: {
    cursor: auto;
  }
`;

const Button = styled.div<{ assistive: boolean }>`
  position: relative;
  height: 18px;
  font-size: 18px;
  ${Style.event};
  ${({ assistive }): FlattenSimpleInterpolation =>
    assistive ? assistiveStyle : defaultStyle};
`;

const EventText = styled(Text)`
  color: #fff;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
`;

const AssistiveText = styled(Text)`
  clip: rect(1px, 1px, 1px, 1px);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const Event: React.FC<Props> = ({ id, title, assistive, ...props }: Props) => {
  return (
    <Button
      {...props}
      assistive={assistive}
      tabIndex={0}
      role="button"
      aria-labelledby={id}
    >
      <EventText size="small" aria-hidden>
        {title || msg().Cal_Lbl_NoTitle}
      </EventText>
      <AssistiveText id={id}>{title || msg().Cal_Lbl_NoTitle}</AssistiveText>
    </Button>
  );
};

export default Event;
