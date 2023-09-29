import React, { FC, MouseEvent } from 'react';

import Button from '@commons/components/buttons/Button';
import ButtonGroups from '@commons/components/buttons/ButtonGroups';
import msg from '@commons/languages';

import { Approver, APPROVER_MODULES } from '@admin-pc-v2/models/approverGroup';

import DataGrid from '@admin-pc/components/DataGrid';

type Props = {
  approvers: Approver[];
  approverModules: string[];
  selected: string;
  onTabClick: (e: MouseEvent<HTMLButtonElement>) => void;
};

const ROOT = 'approver-group-grid';

const ApproverGroupGrid: FC<Props> = ({
  approvers,
  approverModules,
  selected,
  onTabClick,
}) => {
  return (
    <>
      {approverModules.length > 0 && (
        <ButtonGroups className={`${ROOT}__btn-group`}>
          {approverModules.map((queueIdKey) => (
            <Button
              className={
                selected === queueIdKey ? `${ROOT}__tab-selected` : null
              }
              key={queueIdKey}
              onClick={onTabClick}
              value={queueIdKey}
            >
              {msg()[APPROVER_MODULES[queueIdKey]]}
            </Button>
          ))}
        </ButtonGroups>
      )}
      <DataGrid
        columns={[
          {
            key: 'username',
            name: msg().Admin_Lbl_UserName,
            filterable: true,
          },
        ]}
        rows={approvers}
      />
    </>
  );
};

export default ApproverGroupGrid;
