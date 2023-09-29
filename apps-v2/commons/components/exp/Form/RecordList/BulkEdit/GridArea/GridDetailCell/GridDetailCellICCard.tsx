import React, { ChangeEvent, ReactElement } from 'react';

import classNames from 'classnames';
import get from 'lodash/get';

import TextAreaField from '@commons/components/fields/TextAreaField';
import msg from '@commons/languages';

import { Record } from '@apps/domain/models/exp/Record';
import { getDetailDisplay } from '@apps/domain/models/exp/TransportICCard';

type Props = {
  className: string;
  record: Record;
  onChangeRemarks: (e: ChangeEvent<HTMLInputElement>, remark: string) => void;
};
const GridDetailCellICCard = ({
  className,
  record,
  onChangeRemarks,
}: Props): ReactElement => {
  const { transitIcRecordInfo } = record;
  const remarks = get(record, 'items.0.remarks', '');

  return (
    <>
      <div
        className={classNames(
          `${className}__autocomplete-container`,
          `${className}__autocomplete-container-lg`,
          `${className}__border-right`
        )}
      >
        <div className={`${className}__route-block-container`}>
          <div className={`${className}__route-block-container-text`}>
            {getDetailDisplay(transitIcRecordInfo)}
          </div>
        </div>
      </div>
      <div
        className={classNames(
          `${className}__autocomplete-container`,
          `${className}__remarks`
        )}
      >
        <TextAreaField
          autosize
          minRows={1}
          onChange={onChangeRemarks}
          placeholder={msg().Exp_Clbl_ReportRemarks}
          resize="none"
          value={remarks}
        />
      </div>
    </>
  );
};

export default GridDetailCellICCard;
