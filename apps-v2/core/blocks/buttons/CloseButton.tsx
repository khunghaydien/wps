import React from 'react';

import Close from '../../assets/icons/close.svg';
import IconButton from '../../elements/IconButton';

type Props = Omit<React.ComponentProps<typeof IconButton>, 'icon'>;

const CloseButton: React.FC<Props> = (props: Props) => (
  <IconButton icon={Close} {...props} color="#999" />
);

export default CloseButton;
