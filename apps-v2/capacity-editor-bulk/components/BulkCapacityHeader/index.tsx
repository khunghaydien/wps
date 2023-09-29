import React from 'react';

import Button from '@apps/commons/components/buttons/Button';
import ROOT from '@apps/commons/components/psa/ParentHeader';
import msg from '@apps/commons/languages';

import { rowItem } from '../BulkCapacityListItem';

import './index.scss';

type rows = Array<rowItem>;
type Props = {
  rows: rows;
  resetRows: () => void;
  handleSubmit: () => void;
};

const BulkCapacityHeader = (props: Props) => {
  return (
    <div className={ROOT}>
      <div className={`${ROOT}__first-row`}>
        <div className={`${ROOT}--left`}>
          <h1 className={`${ROOT}-title`}>
            {msg().Psa_Lbl_CapacityEditorBulkLabelHeader}
          </h1>
        </div>
        <div className={`${ROOT}__btn-area`}>
          <Button
            className={`${ROOT}__refresh-btn`}
            data-testid={`${ROOT}__refresh-btn`}
            onClick={props.resetRows}
            disabled={props.rows && props.rows.length === 0}
          >
            {msg().Com_Lbl_Reset}
          </Button>
          <Button
            type="primary"
            disabled={
              (props.rows && props.rows.length === 0) ||
              (props.rows &&
                props.rows.length > 0 &&
                props.rows.find((row) => row.employee.employeeId !== '') ===
                  undefined) ||
              (props.rows &&
                props.rows.length > 0 &&
                props.rows.find((row) => row.valueError.hasError === true) !==
                  undefined)
            }
            className={`${ROOT}__btn--new`}
            onClick={props.handleSubmit}
          >
            {msg().Com_Btn_Submit}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkCapacityHeader;
