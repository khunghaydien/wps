import React from 'react';

import { IconButton, Icons } from '@apps/core';

import { useJobSelectDialog } from '@apps/time-tracking/time-tracking-charge-transfer-pc/hooks/useJobSelectDialog';

type Props = Readonly<{
  'data-testid'?: string;
  className?: string;
}>;

const EditJobButton: React.FC<Props> = (props: Props) => {
  const [JobSelectDialog, openDialog, isOpen] = useJobSelectDialog();

  return (
    <>
      <IconButton
        {...props}
        onClick={openDialog}
        icon={Icons.Edit}
        color="#666"
      />
      {isOpen && <JobSelectDialog />}
    </>
  );
};

export default EditJobButton;
