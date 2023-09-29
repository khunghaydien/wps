import * as React from 'react';

import styled from 'styled-components';

import Plus from '../../assets/icons/plus.svg';
import IconButton from '../../elements/IconButton';
import { Color } from '../../styles';

type Props = Omit<React.ComponentProps<typeof IconButton>, 'icon'>;

const SmallIconButton = styled(IconButton)`
  padding: 0;
  height: 16px;
  width: 16px;

  & > svg {
    height: 8px;
    width: 8px;
  }

  :not(:hover),
  :not(:hover) > svg,
  :not(:focus),
  :not(:focus) > svg,
  :not(:active),
  :not(:active) > svg {
    fill: ${Color.accent};
    background: transparent;
  }

  :hover,
  :hover > svg {
    fill: #fff;
    background: ${Color.accent};
  }

  :active,
  :active > svg {
    fill: #fff;
    background: #1b59c9;
  }
`;

const AddButton: React.FC<Props> = (props: Props) => (
  <SmallIconButton icon={Plus} {...props} color={Color.accent} />
);

export default AddButton;
