import React from 'react';

import msg from '@apps/commons/languages';
import { Icons, LinkButton } from '@apps/core';

import { useJobSelectDialog } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useJobSelectDialog';

type Props = Readonly<{
  'data-testid'?: string;
  className?: string;
}>;

const AddJobButton: React.FC<Props> = (props: Props) => {
  const [JobSelectDialog, openDialog, isOpen] = useJobSelectDialog();

  return (
    <>
      <LinkButton
        {...props}
        size="large"
        icon={Icons.Plus}
        onClick={openDialog}
      >
        {msg().Trac_Lbl_SelectTransferJob}
      </LinkButton>
      {isOpen && <JobSelectDialog />}
    </>
  );
};

export default AddJobButton;
