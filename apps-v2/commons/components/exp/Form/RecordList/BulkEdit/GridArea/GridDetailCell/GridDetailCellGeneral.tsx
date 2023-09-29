import React, { ChangeEvent } from 'react';

import get from 'lodash/get';

import TextAreaField from '@commons/components/fields/TextAreaField';
import msg from '@commons/languages';

import { Record } from '@apps/domain/models/exp/Record';

type Props = {
  className?: string;
  record: Record;
  onChangeRemarks: (e: ChangeEvent<HTMLInputElement>, remark: string) => void;
};
const GridDetailCellGeneral = (props: Props): React.ReactElement => {
  const { record, className, onChangeRemarks } = props;

  const value = get(record, 'items.0.remarks', '');

  return (
    <div className={`${className} ${className}__remarks`}>
      <TextAreaField
        autosize
        minRows={1}
        maxRows={2}
        onChange={onChangeRemarks}
        placeholder={msg().Exp_Clbl_ReportRemarks}
        resize="none"
        value={value}
      />
    </div>
  );
};

export default GridDetailCellGeneral;
