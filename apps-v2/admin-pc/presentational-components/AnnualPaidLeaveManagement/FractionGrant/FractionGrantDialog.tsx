import React, { useEffect } from 'react';

import { format } from 'date-fns';
import isEmpty from 'lodash/isEmpty';

import styled from 'styled-components';

import Button from '@apps/commons/components/buttons/Button';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import HorizontalLayout from '@apps/commons/components/fields/layouts/HorizontalLayout';
import HorizontalLayoutBody from '@apps/commons/components/fields/layouts/HorizontalLayout/Body';
import HorizontalLayoutLabel from '@apps/commons/components/fields/layouts/HorizontalLayout/Label';
import TextField from '@apps/commons/components/fields/TextField';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import { DatePicker } from '@apps/core';

import { TempFractionGrantRecord } from '@apps/attendance/domain/models/admin/FractionGrant';

import './FractionGrantDialog.scss';

import RadioGroupField from '@apps/attendance/timesheet-pc/components/dialogs/fields/RadioGroupField';

const ROOT = 'admin-pc-annual-paid-leave-management-fraction-grant-dialog';

type Props = {
  isShowFractionDialog: boolean;
  tempEvent: TempFractionGrantRecord;
  detailEvent: TempFractionGrantRecord;
  onCancel: (flag: boolean) => void;
  onClickExecuteButton: () => void;
  onUpdateValue: (
    arg0: keyof TempFractionGrantRecord,
    arg1: TempFractionGrantRecord[keyof TempFractionGrantRecord]
  ) => void;
  setEvent: (detailEvent: TempFractionGrantRecord) => void;
};

const Dialog = styled(DialogFrame)`
  width: 480px;
`;

const DialogBody = styled.div`
  padding: 20px 10px;
`;

const DialogItemList = styled.ul`
  &textarea: max-width: 100%;
`;

const MessageSpan = styled.span`
  color: #f00;
  line-height: 1;
`;

const FractionGrantDialog: React.FC<Props> = ({
  isShowFractionDialog,
  tempEvent,
  detailEvent,
  onCancel,
  onClickExecuteButton,
  onUpdateValue,
  setEvent,
}) => {
  useEffect(() => {
    if (isShowFractionDialog) {
      setEvent(detailEvent);
    }
  }, [detailEvent, isShowFractionDialog, setEvent]);

  const $onSubmit = () => {
    if (
      !isEmpty(tempEvent.validDateFrom) &&
      !isEmpty(tempEvent.validDateTo) &&
      !isEmpty(tempEvent?.adjustmentType) &&
      tempEvent?.adjustmentType !== 'None'
    ) {
      onClickExecuteButton();
    }
  };

  const renderFooter = () => {
    return (
      <DialogFrame.Footer>
        <Button key="cancel" onClick={() => onCancel(false)}>
          {msg().Com_Btn_Cancel}
        </Button>
        <Button key="submit" type="primary" onClick={$onSubmit}>
          {msg().Com_Btn_Execute}
        </Button>
      </DialogFrame.Footer>
    );
  };

  if (!isShowFractionDialog) {
    return null;
  }
  return (
    <Dialog
      title={msg().Admin_Lbl_FractionGrant}
      footer={renderFooter()}
      hide={() => onCancel(false)}
    >
      <DialogBody>
        <DialogItemList>
          <HorizontalLayout>
            <HorizontalLayoutLabel cols={4} required>
              {msg().Admin_Lbl_LeaveGrantValidDateFrom}
            </HorizontalLayoutLabel>
            <HorizontalLayoutBody cols={6}>
              <DatePicker
                showsIcon
                value={DateUtil.formatYMD(tempEvent?.validDateFrom)}
                selected={
                  tempEvent?.validDateFrom
                    ? new Date(tempEvent?.validDateFrom)
                    : undefined
                }
                onChange={(date: Date | null) => {
                  const value = date ? format(date, 'YYYY-MM-DD') : '';
                  onUpdateValue('validDateFrom', value);
                }}
              />
              {isEmpty(tempEvent?.validDateFrom) ? (
                <div>
                  <MessageSpan>
                    {msg().Com_Msg_LeaveGrantValidDateFrom}
                  </MessageSpan>
                </div>
              ) : null}
            </HorizontalLayoutBody>
          </HorizontalLayout>
          <HorizontalLayout className={`${ROOT}__item-list`}>
            <HorizontalLayoutLabel cols={4} required>
              {msg().Admin_Lbl_LeaveGrantValidDateTo}
            </HorizontalLayoutLabel>
            <HorizontalLayoutBody cols={6}>
              <DatePicker
                showsIcon
                value={DateUtil.formatYMD(tempEvent?.validDateTo)}
                selected={
                  tempEvent?.validDateTo
                    ? new Date(tempEvent?.validDateTo)
                    : undefined
                }
                onChange={(date: Date | null) => {
                  const value = date ? format(date, 'YYYY-MM-DD') : '';
                  onUpdateValue('validDateTo', value);
                }}
              />
              {isEmpty(tempEvent?.validDateTo) ? (
                <div>
                  <MessageSpan>
                    {msg().Com_Msg_LeaveGrantValidDateTo}
                  </MessageSpan>
                </div>
              ) : null}
            </HorizontalLayoutBody>
          </HorizontalLayout>
          <HorizontalLayout className={`${ROOT}__item-list`}>
            <HorizontalLayoutLabel cols={4} required>
              {msg().Admin_Lbl_DaysGranted}
            </HorizontalLayoutLabel>
            <HorizontalLayoutBody cols={10}>
              <RadioGroupField
                options={[
                  {
                    label:
                      msg()
                        .Admin_Lbl_AttLeaveFractionAdjustmentTypeRoundUpToHalfDay,
                    value: 'RoundUpToHalfDay',
                  },
                  {
                    label:
                      msg()
                        .Admin_Lbl_AttLeaveFractionAdjustmentTypeRoundUpToOneDay,
                    value: 'RoundUpToOneDay',
                  },
                ]}
                value={tempEvent?.adjustmentType}
                onChange={(e) =>
                  onUpdateValue('adjustmentType', e.currentTarget.value)
                }
              />
              {isEmpty(tempEvent?.adjustmentType) ||
              tempEvent?.adjustmentType === 'None' ? (
                <div>
                  <MessageSpan>{msg().Com_Msg_DaysGranted}</MessageSpan>
                </div>
              ) : null}
            </HorizontalLayoutBody>
          </HorizontalLayout>
          <HorizontalLayout className={`${ROOT}__item-list`}>
            <HorizontalLayoutLabel cols={4}>
              {msg().Admin_Lbl_Comment}
            </HorizontalLayoutLabel>
            <HorizontalLayoutBody cols={6}>
              <TextField
                id="comment"
                type="text"
                value={tempEvent?.comment}
                onChange={(e) =>
                  onUpdateValue('comment', e.currentTarget.value)
                }
              />
            </HorizontalLayoutBody>
          </HorizontalLayout>
        </DialogItemList>
      </DialogBody>
    </Dialog>
  );
};

export default FractionGrantDialog;
