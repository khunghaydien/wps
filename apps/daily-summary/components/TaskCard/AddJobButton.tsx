import React from 'react';

import msg from '../../../commons/languages';
import { Icons, LinkButton } from '../../../core';

type Props = Readonly<{
  'data-testid'?: string;
  className?: string;
  disabled?: boolean;
  onClick: (e: React.SyntheticEvent<HTMLElement>) => void;
}>;

const AddJobButton = (props: Props) => {
  return (
    <>
      {!props.disabled && (
        <LinkButton {...props} size="large" icon={Icons.Plus}>
          {msg().Trac_Lbl_AddJob}
        </LinkButton>
      )}
    </>
  );
};

export default AddJobButton;
