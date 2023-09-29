import React from 'react';

import msg from '@apps/commons/languages';
import { Icons, LinkButton } from '@apps/core';

type Props = {
  onClick: () => void;
};

const AddRowButton: React.FC<Props> = (props) => {
  return (
    <LinkButton {...props} size="large" icon={Icons.Plus}>
      {msg().Time_Btn_AddItem}
    </LinkButton>
  );
};

export default AddRowButton;
