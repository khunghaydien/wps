import React from 'react';

import styled from 'styled-components';

import msg from '@commons/languages';
import DateUtil from '@commons/utils/DateUtil';
import TextUtil from '@commons/utils/TextUtil';
import Dialog from '@mobile/components/molecules/commons/Dialog';

import {
  isMileageRecord,
  RecordUpdateInfoList,
} from '@apps/domain/models/exp/Record';

type Props = {
  onClickHideDialogButton: () => void;
  updateInfo: RecordUpdateInfoList;
};

const InfoContent = styled.div`
  overflow-y: auto;
  max-height: 380px;
`;

const InfoDialog = (props: Props) => {
  const { onClickHideDialogButton, updateInfo } = props;
  const listRender = () => (
    <InfoContent>
      <ul>
        {updateInfo.map((item, idx) => {
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
    </InfoContent>
  );

  return (
    <Dialog
      title={msg().Com_Lbl_Information}
      content={listRender()}
      onClickCloseButton={onClickHideDialogButton}
      centerButtonLabel={msg().Com_Btn_Close}
      onClickCenterButton={onClickHideDialogButton}
    />
  );
};

export default InfoDialog;
