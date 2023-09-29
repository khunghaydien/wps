import React from 'react';

import isEmpty from 'lodash/isEmpty';

import {
  isMileageRecord,
  RecordUpdateInfo,
} from '../../../../../../domain/models/exp/Record';

import DateUtil from '../../../../../utils/DateUtil';
import TextUtil from '../../../../../utils/TextUtil';

import msg from '../../../../../languages';
import Button from '../../../../buttons/Button';
import DialogFrame from '../../../../dialogs/DialogFrame';

import './index.scss';

const ROOT = 'ts-expenses-modal-record-update';

export type RecordUpdated = {
  updateInfo: RecordUpdateInfo[];
};

export type Props = {
  updateInfo: RecordUpdateInfo[];
  onClickHideDialogButton: () => void;
};

const RecordUpdatedDialog = (props: Props) => {
  const { onClickHideDialogButton, updateInfo } = props;

  const listRender = () => {
    return (
      <ul className={`${ROOT}__list`}>
        {!isEmpty(updateInfo) &&
          updateInfo.map((item, idx) => {
            const localedDate = DateUtil.dateFormat(item.recordDate);
            const isMileage = isMileageRecord(item.recordType);

            let rate;
            if (isMileage)
              rate = msg().Exp_Msg_CloneRecordsRecalcutionMileageRate;
            else if (item.isForeignCurrency)
              rate = msg().Exp_Msg_CloneRecordsRecalcutionExchangeRate;
            else rate = msg().Exp_Msg_CloneRecordsRecalcutionTaxRate;

            const message = TextUtil.template(
              msg().Exp_Msg_CloneRecordsRecalcution,
              rate
            );
            return (
              <li
                key={idx}
              >{`${localedDate} - ${item.expenseTypeName} : ${message}`}</li>
            );
          })}
      </ul>
    );
  };

  return (
    <DialogFrame
      title={msg().Com_Lbl_Information}
      hide={onClickHideDialogButton}
      className={`${ROOT}__dialog-frame`}
      footer={
        <DialogFrame.Footer>
          <Button type="default" onClick={onClickHideDialogButton}>
            {msg().Com_Btn_Close}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <div className={`${ROOT}__inner`}>
        <div className={`${ROOT}__field`}>{listRender()}</div>
      </div>
    </DialogFrame>
  );
};

export default RecordUpdatedDialog;
