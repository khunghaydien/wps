import React, { useEffect, useState } from 'react';

import { isEqual } from 'lodash';

import Button from '@apps/commons/components/buttons/Button';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';

// import DateField from '@apps/commons/components/fields/DateField';
import msg from '../../../../languages';
import { SubRoleOption } from '../subRoleOptionCreator';
import SubRoleTable from '../SubRoleTable/SubRoleTable';

import './SubRoleDialog.scss';

type Props = {
  rows: Array<SubRoleOption>;
  // selectedDate: string;
  selectedRoleId: string | undefined;
  // onChangeDate: (date: string) => void;
  onClickHideDialogButton: () => void;
  onSelectRole: (roleId: string, roleInfo: SubRoleOption) => void;
};

const ROOT = 'ts-sub-role__dialog';
const SubRoleDialog = (props: Props): React.ReactElement => {
  const {
    onClickHideDialogButton,
    rows,
    selectedRoleId,
    // selectedDate,
    // onChangeDate,
    onSelectRole,
  } = props;
  const [selectedId, setSelectedId] = useState(selectedRoleId);
  const [roleInfo, setRoleInfo] = useState();

  useEffect(() => {
    setSelectedId(selectedRoleId);
  }, [selectedRoleId]);

  const onClickSelectRole = () => {
    onSelectRole(selectedId, roleInfo);
  };

  const onClickRole = (roleId: string, roleInfo: any) => {
    setSelectedId(roleId);
    setRoleInfo(roleInfo);
  };

  return (
    <DialogFrame
      title={msg().Com_Lbl_EditRole}
      hide={onClickHideDialogButton}
      className={`${ROOT}-frame`}
      contentsClass={`${ROOT}-frame-contents`}
      // headerSub={
      //   <DateField
      //     placeholder="Specify Date"
      //     value={selectedDate}
      //     onChange={onChangeDate}
      //   />
      // }
      footer={
        <DialogFrame.Footer>
          <Button type="default" onClick={onClickHideDialogButton}>
            {msg().Com_Btn_Cancel}
          </Button>
          <Button
            type="primary"
            disabled={isEqual(selectedRoleId, selectedId)}
            onClick={onClickSelectRole}
          >
            {msg().Com_Btn_Select}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <div className={`${ROOT}-body`}>
        <SubRoleTable
          rows={rows}
          selectedId={selectedId}
          onSelectRole={onClickRole}
        />
      </div>
    </DialogFrame>
  );
};

export default SubRoleDialog;
