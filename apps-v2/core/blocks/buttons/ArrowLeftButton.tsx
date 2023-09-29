import * as React from 'react';

import ArrowLeft from '../../assets/icons/arrow-left.svg';
import IconButton from '../../elements/IconButton';

type Props = Omit<React.ComponentProps<typeof IconButton>, 'icon'>;

const CloseButton: React.FC<Props> = (props: Props) => (
  <IconButton icon={ArrowLeft} {...props} />
);

export default CloseButton;
