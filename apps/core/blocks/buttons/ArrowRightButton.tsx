import React from 'react';

import styled from 'styled-components';

import ArrowRight from '../../assets/icons-generic/arrow-right.svg';
import IconButton from '../../elements/IconButton';
import { Color } from '../../styles';

type Props = Omit<React.ComponentProps<typeof IconButton>, 'icon'>;

const Icon = styled(ArrowRight)`
  width: 12px;
  height: 14px;
`;

const CloseButton: React.FC<Props> = ({
  color = Color.accent,
  ...props
}: Props) => <IconButton icon={Icon} {...props} color={color} />;

export default CloseButton;
