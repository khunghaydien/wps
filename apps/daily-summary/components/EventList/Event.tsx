import * as React from 'react';

import styled from 'styled-components';

import { Text as CommonText } from '../../../core';

import { Style } from '../../styles';

type Props = Readonly<{
  children: string;
}>;

const Block = styled.span`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  height: 18px;
  ${Style.event};
`;

const Text = styled(CommonText)`
  color: #fff;
`;

const Event = ({ children, ...props }: Props) => (
  <>
    <Block {...props}>
      <Text size="small">{children}</Text>
    </Block>
  </>
);

export default Event;
