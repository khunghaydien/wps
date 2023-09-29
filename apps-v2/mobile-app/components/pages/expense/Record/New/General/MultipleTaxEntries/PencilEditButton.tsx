import React, { FC } from 'react';

import IconButton from '@commons/components/buttons/IconButton';
import DisabledPencilImg from '@commons/images/btnEditDisabled.svg';
import PenciImgl from '@commons/images/btnEditOn.svg';

interface IPencilEditButton {
  isEditable: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const PencilEditButton: FC<IPencilEditButton> = (props) => {
  const { isDisabled, isEditable, onClick } = props;
  const imgSrc = isEditable ? DisabledPencilImg : PenciImgl;
  const imgAlt = isEditable ? 'Editing Disabled' : 'Editing Enabled';

  return (
    <IconButton
      src={imgSrc}
      onClick={onClick}
      srcType="svg"
      alt={imgAlt}
      disabled={isDisabled}
    />
  );
};

export default PencilEditButton;
